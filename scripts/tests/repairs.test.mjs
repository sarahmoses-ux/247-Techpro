import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRepairHandler } from '../../api/repairs.js';

const env = { SMTP_HOST: 'smtp.example.test', SMTP_USER: 'info@247techpro.com.ng', SMTP_PASS: 'test-only', SMTP_PORT: '465' };
const valid = () => ({ name: 'Test Customer', email: 'customer@example.test', phone: '+2348100000000', location: 'Test address', consent: true,
  serviceId: 'computer-sales-repairs', requirements: [['Request type', 'Repair'], ['Computer brand', 'HP'], ['Computer model', 'EliteBook'],
    ['Issue', 'Battery / Charging'], ['Preferred date', '2099-12-01'], ['Preferred time', '10:30']].map(([question, answer]) => ({ question, answer })) });
async function invoke(handler, body = valid(), extra = {}) {
  const response = { headers: {}, setHeader(key, value) { this.headers[key] = value; }, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
  await handler({ method: 'POST', headers: { host: '247techpro.com.ng', origin: 'https://247techpro.com.ng', 'content-type': 'application/json' }, body, ...extra }, response);
  return response;
}
test('delivers to the fixed mailbox, returns reference only after acceptance and closes transport', async () => {
  let mail, closed = false;
  const handler = createRepairHandler({ env, createTransport: options => {
    assert.equal(options.secure, true);
    return { sendMail: async message => { mail = message; return { accepted: ['info@247techpro.com.ng'] }; }, close: () => { closed = true; } };
  } });
  const response = await invoke(handler);
  assert.equal(response.code, 200); assert.match(response.body.reference, /^REP-/); assert.equal(mail.to, 'info@247techpro.com.ng');
  assert.equal(mail.replyTo, 'customer@example.test'); assert.match(mail.text, /Battery \/ Charging/); assert.equal(closed, true);
});
test('rejects invalid fields, missing consent, malformed dates and cross-origin posts before sending', async () => {
  const handler = createRepairHandler({ env, createTransport: () => { throw new Error('Must not send'); } });
  for (const change of [{ consent: false }, { email: 'bad\r\n@example.test' }, { requirements: [] }, { location: '' }]) assert.equal((await invoke(handler, { ...valid(), ...change })).code, 400);
  const badDate = valid(); badDate.requirements.find(item => item.question === 'Preferred date').answer = '2099-02-30';
  assert.equal((await invoke(handler, badDate)).code, 400);
  assert.equal((await invoke(handler, valid(), { headers: { host: '247techpro.com.ng', origin: 'https://other.test' } })).code, 403);
  assert.equal((await invoke(handler, {}, { method: 'GET' })).code, 405);
});
test('missing credentials and mail rejection never return success or a reference', async () => {
  assert.equal((await invoke(createRepairHandler({ env: {} }))).code, 503);
  for (const sendMail of [async () => { throw new Error('private credential error'); }, async () => ({ accepted: [] })]) {
    const response = await invoke(createRepairHandler({ env, createTransport: () => ({ sendMail, close() {} }) }));
    assert.equal(response.code, 502); assert.equal(response.body.success, false); assert.equal(response.body.reference, undefined);
    assert(!JSON.stringify(response.body).includes('private credential'));
  }
});
test('limits repeated submissions', async () => {
  const handler = createRepairHandler({ env: {} });
  for (let i = 0; i < 5; i++) assert.equal((await invoke(handler)).code, 503);
  assert.equal((await invoke(handler)).code, 429);
});
