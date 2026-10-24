import SiteLink from './SiteLink';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import logo from '../assets/logo-web.png';
import footerLogo from '../assets/logo-footer.png';
export function Logo({ transparent = false }) { return <img className={transparent ? "logo logo-transparent" : "logo"} src={transparent ? footerLogo : logo} alt="247TECHPRO — RC 7256802 — Your Success, Our Code" width="100" height="100" />; }
export function Button({ href = '/request-solution', children, variant = 'primary', className = '', onClick, ...props }) { return <SiteLink href={href} className={`button ${variant} ${className}`} onClick={onClick} {...props}>{children}<ArrowUpRight size={17} aria-hidden="true" /></SiteLink>; }
export function TextLink({ children, href = '/request-solution', onClick }) { return <SiteLink className="text-link" href={href} onClick={onClick}>{children}<ArrowRight size={17} aria-hidden="true" /></SiteLink>; }
export function SectionHeader({ eyebrow, title, children, centered = false }) { return <div className={`section-heading ${centered ? 'centered' : ''}`}><span className="eyebrow"><i />{eyebrow}</span><h2>{title}</h2>{children && <p>{children}</p>}</div>; }
export function Field({ label, name, error, children, ...props }) { return <div className="field"><label htmlFor={name}>{label}</label>{children || <input id={name} name={name} aria-invalid={!!error} aria-describedby={error ? `${name}-error` : undefined} {...props} />}{error && <span className="field-error" id={`${name}-error`}>{error}</span>}</div>; }
