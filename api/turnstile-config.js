module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const siteKey = String(process.env.TURNSTILE_SITE_KEY || '').trim();
  return res.status(200).json({ siteKey: siteKey || null });
};
