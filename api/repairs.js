import nodemailer from 'nodemailer';
import { randomUUID } from 'node:crypto';

const recipient = 'info@247techpro.com.ng';
const requiredQuestions = ['Request type', 'Computer brand', 'Computer model', 'Issue', 'Preferred date', 'Preferred time'];
const isText = (value, max) => typeof value === 'string' && value.trim().length > 0 && value.length <= max;

export function createRepairHandler({ env = process.env, createTransport = nodemailer.createTransport, logError = console.error } = {}) {
  const attempts = new Map();
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ success: false, message: 'Use POST to submit a repair request.' });
    }
    const origin = req.headers.origin;
    const host = req.headers.host;
    if (origin && (() => { try { return new URL(origin).host !== host; } catch { return true; } })()) {
      return res.status(403).json({ success: false, message: 'Submit your request from our website.' });
    }
    if (!req.headers['content-type']?.includes('application/json')) return res.status(415).json({ success: false, message: 'Send JSON.' });
    let data;
    try {
      const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      if (!raw || Buffer.byteLength(raw) > 16000) return res.status(413).json({ success: false, message: 'The request is too large.' });
      data = JSON.parse(raw);
    } catch { return res.status(400).json({ success: false, message: 'Invalid request.' }); }
    if (!data || !isText(data.name, 150) || !isText(data.email, 150) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || /[\r\n]/.test(data.email)
      || !isText(data.phone, 22) || !/^\+?[\d\s()-]{7,22}$/.test(data.phone) || !isText(data.location, 500)
      || data.consent !== true || data.serviceId !== 'computer-sales-repairs' || !Array.isArray(data.requirements)
      || data.requirements.length > 12 || data.requirements.some(item => !item || !isText(item.question, 100) || !isText(item.answer, 500))
      || (data.message !== undefined && (typeof data.message !== 'string' || data.message.length > 3000))) {
      return res.status(400).json({ success: false, message: 'Please check your contact details and repair requirements.' });
    }
    const answers = Object.fromEntries(data.requirements.map(item => [item.question, item.answer]));
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Lagos', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    const date = answers['Preferred date'];
    if (requiredQuestions.some(question => !answers[question]) || answers['Request type'] !== 'Repair'
      || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date || date < today
      || !/^([01]\d|2[0-3]):[0-5]\d$/.test(answers['Preferred time'])) {
      return res.status(400).json({ success: false, message: 'Please select your computer, issue and a valid preferred appointment.' });
    }
    const now = Date.now();
    for (const [key, value] of attempts) if (value.expires <= now) attempts.delete(key);
    const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
    const limit = attempts.get(ip) || { count: 0, expires: now + 600000 };
    if (limit.count >= 5 || attempts.size >= 10000) return res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' });
    limit.count++; attempts.set(ip, limit);
    const smtpHost = env.SMTP_HOST?.trim();
    const smtpUser = env.SMTP_USER?.trim();
    const port = Number(env.SMTP_PORT?.trim() || 465);
    if (!smtpHost || !smtpUser || !env.SMTP_PASS || ![465, 587].includes(port)) {
      logError('repair_delivery_failed', { code: 'SMTP_CONFIG_MISSING', missing: ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'].filter(key => !env[key]?.trim()), invalidPort: ![465, 587].includes(port) });
      return res.status(503).json({ success: false, errorCode: 'SMTP_CONFIG_MISSING', message: 'Online repair booking is temporarily unavailable. Please try again later or call +234 810 956 9770.' });
    }
    const reference = `REP-${randomUUID().slice(0, 8).toUpperCase()}`;
    const transport = createTransport({ host: smtpHost, port, secure: port === 465, requireTLS: port === 587,
      auth: { user: smtpUser, pass: env.SMTP_PASS }, connectionTimeout: 5000, greetingTimeout: 5000, socketTimeout: 10000 });
    try {
      const result = await transport.sendMail({
        from: { name: '247TECHPRO Repairs', address: smtpUser }, to: recipient,
        replyTo: data.email.trim(), subject: `Computer repair request ${reference}`,
        text: [`COMPUTER REPAIR REQUEST — ${reference}`, '', `Name: ${data.name.trim()}`, `Email: ${data.email.trim()}`, `Phone: ${data.phone.trim()}`,
          `Repair address: ${data.location.trim()}`, '', ...data.requirements.map(item => `${item.question}: ${item.answer}`), '', `Additional notes: ${data.message || 'None'}`,
          '', 'Customer consent: confirmed', 'Preferred appointment and cost require team confirmation.'].join('\n'),
        disableFileAccess: true, disableUrlAccess: true,
      });
      if (!result.accepted?.some(address => String(address).toLowerCase() === recipient)) throw new Error('Recipient not accepted');
      return res.status(200).json({ success: true, reference });
    } catch (error) {
      const categories = { EAUTH: 'SMTP_AUTH_FAILED', EDNS: 'SMTP_DNS_FAILED', ETIMEDOUT: 'SMTP_TIMEOUT', ETLS: 'SMTP_TLS_FAILED', ESOCKET: 'SMTP_CONNECTION_FAILED', ECONNECTION: 'SMTP_CONNECTION_FAILED', EENVELOPE: 'SMTP_RECIPIENT_REJECTED' };
      const errorCode = categories[error.code] || 'SMTP_DELIVERY_FAILED';
      // Log only fixed categories and numeric SMTP status, never credentials, message bodies or raw SMTP responses.
      logError('repair_delivery_failed', { code: errorCode, reference, ...(Number.isInteger(error.responseCode) ? { smtpStatus: error.responseCode } : {}) });
      return res.status(502).json({ success: false, errorCode, message: 'Your request could not be sent. Your details are still here; please try again or call +234 810 956 9770.' });
    } finally { transport.close(); }
  };
}

export default createRepairHandler();
