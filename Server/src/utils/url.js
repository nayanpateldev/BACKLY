export const generateShortUrl = (shortCode) => {
  console.log("shortCode:", shortCode);

  return `${process.env.BASE_URL}/${shortCode}`;
};

export const formatExpiry = (expiresAt) => {
  return expiresAt
    ? new Date(expiresAt).toISOString()
    : "Never";
};

export const formatUrl = (url) => {
  return {
    id: url.id,
    originalUrl: url.original_url,
    shortCode: url.short_code,
    shortUrl: generateShortUrl(url.short_code),
    customAlias: url.custom_alias,
    clicks: url.clicks,
    isActive: url.is_active,
    expiresAt: formatExpiry(url.expires_at),
    createdAt: url.created_at,
  };
};