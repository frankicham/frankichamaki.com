module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ measurementId: null });
  }

  const measurementId = String(process.env.GA_MEASUREMENT_ID || '').trim();
  const valid = /^G-[A-Z0-9]+$/i.test(measurementId) && measurementId !== 'G-XXXXXXXXXX';
  return res.status(200).json({ measurementId: valid ? measurementId : null });
};
