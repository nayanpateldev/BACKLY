import { nanoid } from "nanoid";
import validator from "validator";
import { supabase } from "../config/supabase.js";
import { formatUrl } from "../utils/url.js";
import QRCode from "qrcode";

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
  pasteBin: async () => {},
  fileShare: async () => {},
  authKit: async () => {},
};

export default toolServices;
