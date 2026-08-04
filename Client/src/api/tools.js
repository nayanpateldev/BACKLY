import apiService from "./apiservice";

const api = {
  // URL Shortner
  createShortUrl: (data) => apiService.post("/tools/urlShortner", data),
  getUrls: () => apiService.get("/tools/urlShortner"),
  getUrlById: (id) => apiService.get(`/tools/urlShortner/${id}`),

  // QR Code Generator
  generateUrlQr: (data) => apiService.post("/tools/qr/url", data),
  generateUpiQr: (data) => apiService.post("/tools/qr/upi", data),

  // AuthKit

  // Password Generator
  generatePassword: (data) =>
    apiService.post("/tools/authKit/password/generate", data),
  passwordStrength: (data) =>
    apiService.post("/tools/authKit/password/strength", data),

  // Hash Generator
  generateBasicHash: (data) =>
    apiService.post("/tools/authKit/hash/basic/generate", data),
  verifyBasicHash: (data) =>
    apiService.post("/tools/authKit/hash/basic/verify", data),
  generateSaltHash: (data) =>
    apiService.post("/tools/authKit/hash/salt/generate", data),
  verifySaltHash: (data) =>
    apiService.post("/tools/authKit/hash/salt/verify", data),
  generateSaltPepperHash: (data) =>
    apiService.post("/tools/authKit/hash/salt-pepper/generate", data),
  verifySaltPepperHash: (data) =>
    apiService.post("/tools/authKit/hash/salt-pepper/verify", data),

  // JWT
  encodeJwt: (data) => apiService.post("/tools/authKit/jwt/encode", data),
  decodeJwt: (data) => apiService.post("/tools/authKit/jwt/decode", data),
  verifyJwt: (data) => apiService.post("/tools/authKit/jwt/verify", data),
  generateJwtSecret: (data) => apiService.post("/tools/authKit/jwt/secret", data),
};

export default api;
