export const leadEndpoint = import.meta.env.VITE_LEAD_ENDPOINT?.trim();
export function validateContact(data) {
  const errors = {};
  if (!data.name.trim() || data.name.trim().length < 2) errors.name = 'Please enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = 'Please enter a valid email address.';
  if (!/^\+?[\d\s()-]{7,22}$/.test(data.phone.trim()) || data.phone.replace(/\D/g, '').length < 7) errors.phone = 'Please enter a valid phone number.';
  return errors;
}
export function formatLead(data, type) {
  const labels = { service: 'Service requested', company: 'Company', contactMethod: 'Preferred contact method', name: 'Full name', email: 'Email', phone: 'Phone', location: 'Location / city', property: 'Property type', situation: 'Current power situation', backup: 'Preferred backup duration', lookingFor: 'Looking for', budget: 'Budget', payment: 'Payment preference', message: 'Message', subject: 'Subject' };
  const lines = [type === 'solution' ? 'TECHNOLOGY SOLUTION REQUEST' : type === 'consultation' ? 'SOLAR CONSULTATION REQUEST' : 'GENERAL ENQUIRY', ''];
  Object.entries(labels).forEach(([key, label]) => { if (data[key]) lines.push(`${label}: ${data[key]}`); });
  if (data.appliances) lines.push('', 'Appliances:', ...(Object.entries(data.appliances).map(([name, quantity]) => `- ${name}: ${quantity}`)), ...(Object.keys(data.appliances).length ? [] : ['Please help me assess my appliances.']));
  if (data.requirements) lines.push('', 'Service requirements:', ...data.requirements.map(({question, answer}) => `${question}: ${answer}`));
  return lines.join('\n');
}
export function emailHref(data, type) { return `mailto:247techpro@gmail.com?subject=${encodeURIComponent(type === 'solution' ? `Solution request: ${data.service}` : type === 'consultation' ? 'Solar consultation request' : data.subject || 'Website enquiry')}&body=${encodeURIComponent(formatLead(data, type))}`; }
export function downloadLead(data, type) {
  const url = URL.createObjectURL(new Blob([formatLead(data, type)], { type: 'text/plain;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = `247techpro-${type}.txt`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function submitLead(data, type) {
  if (!leadEndpoint) return { status: 'handoff' };
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(leadEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, ...data, submittedAt: new Date().toISOString() }), signal: controller.signal });
    if (!response.ok) throw new Error('We couldn’t send your request. Please try again, or contact us by phone or email.');
    const result = await response.json();
    if (result.success !== true) throw new Error('Delivery was not confirmed. Please try again or contact our team directly.');
    return { status: 'success' };
  } catch (error) { throw new Error(error.name === 'AbortError' ? 'The request timed out. Please try again or contact us directly.' : error.message || 'Unable to send. Please try again.'); }
  finally { clearTimeout(timeout); }
}
