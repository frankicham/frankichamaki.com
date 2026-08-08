const RESEND_ENDPOINT = 'https://api.resend.com/emails';

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const clean = (value, max) => String(value || '').trim().slice(0, max);
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL || 'frankichamaki@gmail.com';

  if (!apiKey || !fromEmail) {
    console.error('Contact form configuration missing', {
      hasApiKey: Boolean(apiKey),
      hasFromEmail: Boolean(fromEmail),
      hasToEmail: Boolean(toEmail)
    });
    return res.status(500).json({
      ok: false,
      error: 'The contact form is not configured yet. Please try again shortly.'
    });
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }

  const firstName = clean(body.firstName, 80);
  const lastName = clean(body.lastName, 80);
  const title = clean(body.title, 120);
  const email = clean(body.email, 160).toLowerCase();
  const question = clean(body.question, 5000);

  if (!firstName || !lastName || !title || !email || !question || !validEmail(email)) {
    return res.status(400).json({ ok: false, error: 'Please complete all fields with a valid email address.' });
  }

  const fullName = `${firstName} ${lastName}`;
  const subject = `frankichamaki.com enquiry — ${fullName} (${title})`;
  const text = [
    'New enquiry from frankichamaki.com',
    '',
    `Name: ${fullName}`,
    `Title: ${title}`,
    `Email: ${email}`,
    '',
    'Question:',
    question
  ].join('\n');

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.55;color:#111;max-width:680px">
      <h2 style="margin:0 0 18px">New frankichamaki.com enquiry</h2>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:20px">
        <tr><td style="padding:4px 16px 4px 0;font-weight:700">Name</td><td>${escapeHtml(fullName)}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;font-weight:700">Title</td><td>${escapeHtml(title)}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;font-weight:700">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
      </table>
      <div style="font-weight:700;margin-bottom:6px">Question</div>
      <div style="white-space:pre-wrap">${escapeHtml(question)}</div>
    </div>`;

  try {
    const resendResponse = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'frankichamaki.com-contact/5.1'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject,
        html,
        text,
        tags: [
          { name: 'source', value: 'frankichamaki-site' },
          { name: 'type', value: 'contact-enquiry' }
        ]
      })
    });

    const payload = await resendResponse.json().catch(() => ({}));

    if (!resendResponse.ok || !payload.id) {
      console.error('Resend rejected contact email', {
        status: resendResponse.status,
        payload
      });

      if (resendResponse.status === 403) {
        return res.status(502).json({
          ok: false,
          error: 'The email service rejected this test sender. Please try again shortly.'
        });
      }

      return res.status(502).json({
        ok: false,
        error: 'Your message could not be sent right now. Please try again shortly.'
      });
    }

    return res.status(200).json({ ok: true, id: payload.id });
  } catch (error) {
    console.error('Contact form error', error);
    return res.status(502).json({
      ok: false,
      error: 'Your message could not be sent right now. Please try again shortly.'
    });
  }
};
