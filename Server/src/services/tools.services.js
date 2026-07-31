import { nanoid } from "nanoid";
import validator from "validator";
import { supabase } from "../config/supabase.js";
import { formatUrl } from "../utils/url.js";
import commonPasswords from "../utils/commonPasswords.js";
import jwt from "jsonwebtoken";
import QRCode from "qrcode";
import crypto from "crypto";

const toolServices = {
  // URL Shortner
  createShortUrl: async (urlData) => {
    const { userId, originalUrl, customAlias } = urlData;

    if (!validator.isURL(originalUrl)) {
      throw new Error("Invalid URL");
    }

    if (customAlias) {
      const alias = customAlias.trim();

      if (!/^[a-zA-Z0-9_-]{3,50}$/.test(alias)) {
        throw new Error(
          "Custom alias must be 3-50 characters and can only contain letters, numbers, '-' and '_'.",
        );
      }
    }

    const shortCode = customAlias?.trim() || nanoid(7);

    const { data: existing } = await supabase
      .from("urls")
      .select("id")
      .or(`short_code.eq.${shortCode},custom_alias.eq.${shortCode}`)
      .maybeSingle();

    if (existing) {
      throw new Error("Short code already exists");
    }

    const { data, error } = await supabase
      .from("urls")
      .insert({
        user_id: userId,
        original_url: originalUrl,
        short_code: shortCode,
        custom_alias: customAlias || null,
      })
      .select()
      .single();

    if (error) throw error;

    return formatUrl(data);
  },
  // Redirects the Short URL
  redirectUrl: async (req, res) => {
    const { shortCode } = req.params;

    const { data, error } = await supabase
      .from("urls")
      .select("*")
      .eq("short_code", shortCode)
      .single();

    if (error || !data) {
      throw new Error("Short URL not found");
    }

    // Increment click count
    await supabase
      .from("urls")
      .update({
        clicks: data.clicks + 1,
      })
      .eq("id", data.id);

    return formatUrl(data);
  },
  // Gets all URLs
  getUrls: async (req) => {
    const { data, error } = await supabase
      .from("urls")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map(formatUrl);
  },
  //` Gets a single URL by ID
  getUrlById: async (req) => {
    const { data, error } = await supabase
      .from("urls")
      .select(
        `
      id,
      original_url,
      short_code,
      custom_alias,
      clicks,
      is_active,
      expires_at,
      created_at
    `,
      )
      .eq("id", req.params.id)
      .eq("user_id", req.user.id)
      .single();

    if (error) {
      throw new Error("URL not found");
    }

    return formatUrl(data);
  },
  // Generates a QR Code for a given URL
  generateUrlQr: async (req) => {
    const { url } = req.body;

    const qr = await QRCode.toDataURL(url);

    return {
      qr,
    };
  },
  // Generates a QR Code for a given UPI ID
  generateUpiQr: async (req) => {
    const { upiId, name, amount, note } = req.body;

    let upiUrl = `upi://pay?pa=${encodeURIComponent(
      upiId,
    )}&pn=${encodeURIComponent(name)}&cu=INR`;

    if (amount) {
      upiUrl += `&am=${amount}`;
    }

    if (note) {
      upiUrl += `&tn=${encodeURIComponent(note)}`;
    }

    const qr = await QRCode.toDataURL(upiUrl);

    return {
      qr,
    };
  },
  // Password Generator
  generatePassword: async (req) => {
    const { length, uppercase, lowercase, numbers, symbols } = req.body;

    const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_-+=<>?";

    let charset = "";
    let password = [];

    if (uppercase) {
      charset += upperChars;
      password.push(upperChars[crypto.randomInt(upperChars.length)]);
    }

    if (lowercase) {
      charset += lowerChars;
      password.push(lowerChars[crypto.randomInt(lowerChars.length)]);
    }

    if (numbers) {
      charset += numberChars;
      password.push(numberChars[crypto.randomInt(numberChars.length)]);
    }

    if (symbols) {
      charset += symbolChars;
      password.push(symbolChars[crypto.randomInt(symbolChars.length)]);
    }

    while (password.length < length) {
      password.push(charset[crypto.randomInt(charset.length)]);
    }

    // Fisher-Yates Shuffle
    for (let i = password.length - 1; i > 0; i--) {
      const j = crypto.randomInt(i + 1);
      [password[i], password[j]] = [password[j], password[i]];
    }

    return {
      password: password.join(""),
      length,
    };
  },
  // Password Strength Checker
  passwordStrength: async (req) => {
    const { password } = req.body;

    const checks = {
      length8: password.length >= 8,
      length12: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]/.test(password),

      repeatedCharacters: /(.)\1{2,}/.test(password),

      sequentialCharacters:
        /(0123|1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|defg|efgh|fghi|ghij|hijk|ijkl|jklm|klmn|lmno|mnop|nopq|opqr|pqrs|qrst|rstu|stuv|tuvw|uvwx|vwxy|wxyz|qwerty|asdf)/i.test(
          password,
        ),

      commonPassword: commonPasswords.includes(password.toLowerCase()),
    };

    let rawScore = 0;

    // Positive points
    if (checks.length8) rawScore += 1;
    if (checks.length12) rawScore += 1;
    if (checks.uppercase) rawScore += 1;
    if (checks.lowercase) rawScore += 1;
    if (checks.numbers) rawScore += 1;
    if (checks.symbols) rawScore += 1;

    // Negative points
    if (checks.commonPassword) rawScore -= 3;
    if (checks.repeatedCharacters) rawScore -= 1;
    if (checks.sequentialCharacters) rawScore -= 1;

    // Clamp score between 0 and 6
    rawScore = Math.max(0, Math.min(rawScore, 6));

    // Convert to 0–5 scale
    const score = Math.round((rawScore / 6) * 5);

    const maxScore = 5;
    const percentage = Math.round((score / maxScore) * 100);

    let strength = "";

    if (score <= 1) {
      strength = "Very Weak";
    } else if (score === 2) {
      strength = "Weak";
    } else if (score === 3) {
      strength = "Medium";
    } else if (score === 4) {
      strength = "Strong";
    } else {
      strength = "Very Strong";
    }

    const feedback = [];

    if (!checks.length8) feedback.push("Use at least 8 characters.");

    if (!checks.length12)
      feedback.push("Use at least 12 characters for better security.");

    if (!checks.uppercase) feedback.push("Add uppercase letters.");

    if (!checks.lowercase) feedback.push("Add lowercase letters.");

    if (!checks.numbers) feedback.push("Add numbers.");

    if (!checks.symbols) feedback.push("Add symbols.");

    if (checks.commonPassword) feedback.push("Avoid common passwords.");

    if (checks.repeatedCharacters) feedback.push("Avoid repeated characters.");

    if (checks.sequentialCharacters)
      feedback.push("Avoid sequential characters.");

    return {
      score,
      maxScore,
      percentage,
      strength,
      checks,
      feedback,
    };
  },
  // JWT Secret Generator
  generateJwtSecret: async (req) => {
    const allowedBits = [128, 192, 256, 384, 512];

    const bits = allowedBits.includes(req.body.bits) ? req.body.bits : 256;

    const bytes = bits / 8;

    const secret = crypto.randomBytes(bytes).toString("hex");

    return {
      bits,
      bytes,
      secret,
    };
  },
  // Jwt Decoder
  decodeJwt: async (req) => {
    const { token } = req.body;

    const decoded = jwt.decode(token, {
      complete: true,
      json: true,
    });

    if (!decoded) {
      throw new Error("Invalid JWT token.");
    }

    const algorithm = decoded.header.alg;

    let algorithmType = "Unknown";

    if (algorithm.startsWith("HS")) {
      algorithmType = "HMAC";
    } else if (algorithm.startsWith("RS")) {
      algorithmType = "RSA";
    } else if (algorithm.startsWith("ES")) {
      algorithmType = "ECDSA";
    } else if (algorithm.startsWith("PS")) {
      algorithmType = "RSA-PSS";
    } else if (algorithm === "none") {
      algorithmType = "Unsigned";
    }

    return {
      algorithm,
      algorithmType,
      header: decoded.header,
      payload: decoded.payload,
    };
  },
  // Jwt Encoder
  encodeJwt: async (req) => {
    const {
      payload,
      algorithm = "HS256",
      secret,
      privateKey,
      expiresIn,
      issuer,
      audience,
      subject,
    } = req.body;

    const hmacAlgorithms = ["HS256", "HS384", "HS512"];
    const rsaAlgorithms = ["RS256", "RS384", "RS512"];
    const ecAlgorithms = ["ES256", "ES384", "ES512"];
    const pssAlgorithms = ["PS256", "PS384", "PS512"];

    let signingKey;

    // Select signing key
    if (hmacAlgorithms.includes(algorithm)) {
      if (!secret) {
        throw new Error("Secret is required for HMAC algorithms.");
      }

      signingKey = secret;
    } else if (
      rsaAlgorithms.includes(algorithm) ||
      ecAlgorithms.includes(algorithm) ||
      pssAlgorithms.includes(algorithm)
    ) {
      if (!privateKey) {
        throw new Error("Private key is required for this algorithm.");
      }

      signingKey = privateKey;
    } else {
      throw new Error("Unsupported JWT algorithm.");
    }

    // JWT Sign Options
    const signOptions = {
      algorithm,
    };

    if (expiresIn) signOptions.expiresIn = expiresIn;
    if (issuer) signOptions.issuer = issuer;
    if (audience) signOptions.audience = audience;
    if (subject) signOptions.subject = subject;

    // Generate Token
    const token = jwt.sign(payload, signingKey, signOptions);

    return {
      algorithm,
      expiresIn: expiresIn || null,
      token,
    };
  },
  pasteBin: async () => {},
  fileShare: async () => {},
};

export default toolServices;
