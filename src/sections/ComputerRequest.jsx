import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Download, LoaderCircle, Mail } from 'lucide-react';
import { Field } from '../components/UI';
import { downloadLead, emailHref, leadEndpoint, submitLead, validateContact } from '../utils/leads';

const devices = [
  { name: 'HP', image: 'laptop', models: ['EliteBook', 'ProBook', 'Pavilion', 'Envy', 'Spectre', 'OMEN', 'Victus', 'HP Desktop', 'HP All-in-One'] },
  { name: 'Dell', image: 'laptop', models: ['Latitude', 'Inspiron', 'XPS', 'Vostro', 'Precision', 'Alienware', 'OptiPlex'] },
  { name: 'Lenovo', image: 'laptop', models: ['ThinkPad', 'IdeaPad', 'Yoga', 'Legion', 'ThinkBook', 'ThinkCentre'] },
  { name: 'Apple', image: 'macbook', models: ['MacBook Air', 'MacBook Pro', 'iMac', 'Mac mini', 'Mac Studio', 'Mac Pro'] },
  { name: 'Acer', image: 'laptop', models: ['Aspire', 'Swift', 'Spin', 'Nitro', 'Predator', 'Veriton'] },
  { name: 'ASUS', image: 'laptop', models: ['VivoBook', 'ZenBook', 'ExpertBook', 'ROG', 'TUF', 'ASUS Desktop'] },
  { name: 'Other Computers', image: 'desktop', models: ['Laptop', 'Desktop', 'Workstation', 'All-in-One', 'Custom-built PC'] },
];
const issues = ['Broken Screen', 'Battery / Charging', 'Water Damaged', "Won’t Turn On", 'Keyboard / Touchpad', 'Slow Performance', 'Overheating', 'Software / Windows', 'Storage / Memory Upgrade', 'Other'];
const uses = ['Work / Business', 'School / Study', 'Gaming', 'Design / Video Editing', 'Everyday Use', 'I Need Advice'];
const empty = { firstName: '', lastName: '', email: '', phone: '', date: '', time: '', address: '', notes: '', modelNumber: '', quantity: '1', budget: '', consent: false };
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Lagos', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

export default function ComputerRequest({ request = 'Repair', onBack }) {
  const [mode, setMode] = useState(request === 'Purchase' ? 'Purchase' : 'Repair');
  const [screen, setScreen] = useState('device');
  const [device, setDevice] = useState(null);
  const [model, setModel] = useState('');
  const [issue, setIssue] = useState('');
  const [details, setDetails] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [failure, setFailure] = useState('');
  const [payload, setPayload] = useState(null);
  const heading = useRef(null);
  const form = useRef(null);
  useEffect(() => { setMode(request === 'Purchase' ? 'Purchase' : 'Repair'); setScreen('device'); setDevice(null); setModel(''); setIssue(''); }, [request]);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, [screen, status]);
  const go = next => { setErrors({}); setScreen(next); requestAnimationFrame(() => heading.current?.scrollIntoView({ block: 'start', behavior: 'instant' })); };
  const changeMode = next => { setMode(next); setDevice(null); setModel(''); setIssue(''); go('device'); };
  const update = e => { const { name, value, type, checked } = e.target; setDetails(d => ({ ...d, [name]: type === 'checkbox' ? checked : value })); setErrors(old => ({ ...old, [name]: undefined })); };
  const field = (name, label, type = 'text', extra = {}) => <Field key={name} name={`computer-${name}`} label={label} error={errors[name]}><input id={`computer-${name}`} name={name} type={type} value={details[name]} onChange={update} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `computer-${name}-error` : undefined} maxLength={150} {...extra}/></Field>;
  async function send(e) {
    e.preventDefault();
    const next = validateContact({ name: `${details.firstName} ${details.lastName}`.trim(), email: details.email, phone: details.phone });
    delete next.name;
    for (const key of ['firstName', 'lastName', 'address']) if (!details[key].trim()) next[key] = 'Please complete this field.';
    if (!details.date || details.date < today()) next.date = 'Choose today or a future date.';
    if (!details.time) next.time = 'Please choose a time.';
    if (!details.consent) next.consent = 'Please confirm the details and allow us to contact you.';
    if (mode === 'Purchase' && (!Number.isInteger(Number(details.quantity)) || Number(details.quantity) < 1 || Number(details.quantity) > 100000)) next.quantity = 'Enter a whole number between 1 and 100,000.';
    setErrors(next);
    if (Object.keys(next).length) { requestAnimationFrame(() => form.current?.querySelector('[aria-invalid="true"]')?.focus()); return; }
    const requirements = [
      ['Request type', mode], ['Computer brand', device.name], ['Computer model', model],
      ['Exact model / model number', details.modelNumber || 'Not specified'],
      [mode === 'Repair' ? 'Issue' : 'Intended use', issue], ['Preferred date', details.date], ['Preferred time', details.time],
      ...(mode === 'Purchase' ? [['Number of computers', details.quantity], ['Budget', details.budget || 'Not specified']] : []),
    ].map(([question, answer]) => ({ question, answer }));
    const lead = { name: `${details.firstName.trim()} ${details.lastName.trim()}`, email: details.email, phone: details.phone, location: details.address, contactMethod: 'Phone call', message: details.notes, consent: details.consent, service: 'Computer Sales & Repairs', serviceId: 'computer-sales-repairs', requirements };
    setPayload(lead); setFailure(''); setStatus('loading');
    try { setStatus((await submitLead(lead, 'solution')).status); } catch (error) { setFailure(error.message); setStatus('idle'); }
  }
  const title = screen === 'device' ? 'Choose Your Computer' : screen === 'model' ? 'Choose Your Computer Model' : screen === 'issue' ? (mode === 'Repair' ? 'What’s the Issue with Your Computer?' : 'What Will You Use Your Computer For?') : (mode === 'Repair' ? 'Schedule Your Computer Repair' : 'Request Your Computer');
  return <section className="section computer-request" id="request-solution"><div className="wrap">
    {['handoff', 'success'].includes(status) ? <div className="computer-booking lead-status" role="status"><span className="status-icon">{status === 'success' ? <Check size={30}/> : <Mail size={30}/>}</span><h1 ref={heading} tabIndex={-1}>{status === 'success' ? 'Your request has been sent.' : 'Your request is ready to email.'}</h1><p>{status === 'success' ? 'Our team will contact you to confirm the appointment and cost.' : 'Your request has not been sent yet. Open your email app to send it. Our team will confirm availability, cost and arrangements.'}</p>{status === 'handoff' && <><a className="button primary" href={emailHref(payload, 'solution')}>Open Email to Send<Mail size={16}/></a><button className="download-link" onClick={() => downloadLead(payload, 'solution')}><Download size={16}/>Download a copy</button></>}<button className="text-button" onClick={() => setStatus('idle')}>Back to edit my request</button></div> : <>
      <div className="computer-request-top"><button type="button" className="text-button" onClick={() => screen === 'device' ? onBack() : go(screen === 'model' ? 'device' : screen === 'issue' ? 'model' : 'issue')}><ArrowLeft size={16}/>Back</button><div className="computer-mode" aria-label="Computer service"><button type="button" aria-pressed={mode === 'Repair'} onClick={() => changeMode('Repair')}>Repair</button><button type="button" aria-pressed={mode === 'Purchase'} onClick={() => changeMode('Purchase')}>Buy a Computer</button></div></div>
      <h1 ref={heading} tabIndex={-1}>{title}</h1>
      {screen !== 'device' && <p className="computer-selection">{device.name}{model && ` / ${model}`}{screen === 'schedule' && ` / ${issue}`}</p>}
      {screen === 'device' && <><div className="computer-device-grid">{devices.map(d => <button className="computer-device" type="button" key={d.name} onClick={() => { setDevice(d); setModel(''); setIssue(''); go('model'); }}><img src={`/computers/${d.image}.jpg`} alt="" width="640" height="427"/><span>{d.name === 'Other Computers' ? d.name : `${d.name} Computers`}</span><ArrowRight size={17}/></button>)}</div><p className="computer-photo-note">Computer images illustrate device categories.</p></>}
      {screen === 'model' && <div className="computer-tile-grid">{[...device.models, 'Other / Not Sure'].map(m => <button className="computer-tile" type="button" key={m} onClick={() => { setModel(m); setIssue(''); go('issue'); }}><strong>{m}</strong><span>{device.name} Computers</span></button>)}</div>}
      {screen === 'issue' && <div className="computer-tile-grid">{(mode === 'Repair' ? issues : uses).map(i => <button className="computer-tile" type="button" key={i} onClick={() => { setIssue(i); go('schedule'); }}><strong>{i}</strong></button>)}</div>}
      {screen === 'schedule' && <div className="computer-booking"><div className="computer-summary"><div><span>Computer</span><strong>{device.name} {model}</strong></div><div><span>{mode === 'Repair' ? 'Issue' : 'Intended use'}</span><strong>{issue}</strong></div><div><span>Estimated cost</span><strong>{mode === 'Repair' ? 'Confirmed after assessment' : 'Quote on request'}</strong></div><img src={`/computers/${device.image}.jpg`} alt="Selected computer category" width="120" height="90"/></div>
        <form ref={form} onSubmit={send} noValidate><div className="form-grid">
          {field('firstName', 'First name', 'text', { autoComplete: 'given-name' })}{field('lastName', 'Last name', 'text', { autoComplete: 'family-name' })}
          {field('email', 'Email address', 'email', { autoComplete: 'email' })}{field('phone', 'Contact number', 'tel', { autoComplete: 'tel' })}
          {field('date', 'Pick a date', 'date', { min: today() })}{field('time', 'Pick a time', 'time')}
          {field('modelNumber', 'Exact model / model number (optional)')}
          {mode === 'Purchase' && <>{field('quantity', 'Number of computers', 'number', { min: 1, max: 100000, step: 1 })}{field('budget', 'Budget (optional)')}</>}
        </div><Field name="computer-address" label={mode === 'Repair' ? 'Where do you want your computer fixed?' : 'Delivery / contact address'} error={errors.address}><textarea id="computer-address" name="address" rows={3} placeholder="Home or work address" value={details.address} onChange={update} maxLength={500} aria-invalid={!!errors.address} aria-describedby={errors.address ? 'computer-address-error' : undefined}/></Field>
        <Field name="computer-notes" label={mode === 'Repair' ? 'More about the issue (optional)' : 'Additional requirements (optional)'}><textarea id="computer-notes" name="notes" rows={3} value={details.notes} onChange={update} maxLength={3000}/></Field>
        <p className="computer-arrangements">Your preferred date, time and {mode === 'Repair' ? 'repair location' : 'delivery arrangements'} will be confirmed by our team.</p><label className="consent"><input name="consent" type="checkbox" checked={details.consent} onChange={update} aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'computer-consent-error' : undefined}/><span>I have reviewed these details and agree to be contacted about this request.</span></label>{errors.consent && <span className="field-error" id="computer-consent-error">{errors.consent}</span>}
        {!leadEndpoint && <p className="form-tip">We’ll prepare your request as an email for you to send.</p>}{failure && <p className="form-error" role="alert">{failure}</p>}<button className="button primary" type="submit" disabled={status === 'loading'}>{status === 'loading' ? <><LoaderCircle className="spin" size={16}/>Sending…</> : mode === 'Repair' ? 'Confirm Repair Request' : 'Request Computer Quote'}<ArrowRight size={16}/></button>
        </form></div>}
    </>}
  </div></section>;
}
