import SiteLink from './SiteLink';
import { useEffect, useRef, useState } from 'react';
import { Menu, X, Phone, Sun } from 'lucide-react';
import { Button, Logo } from './UI';
import { navigation } from '../data/content';
export default function Navbar() {
  const [open, setOpen] = useState(false); const toggle = useRef(null);
  useEffect(() => {
    const close = event => { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); } };
    const resize = () => { if (window.innerWidth > 1100) setOpen(false); };
    window.addEventListener('keydown', close); window.addEventListener('resize', resize);
    return () => { window.removeEventListener('keydown', close); window.removeEventListener('resize', resize); };
  }, []);
  return <><div className="utility-bar"><div className="wrap"><span><Sun size={13} />Smarter energy. A brighter tomorrow.</span><SiteLink href="tel:+2348132393485"><Phone size={12} />0813 239 3485<span className="utility-divider">|</span><span className="utility-country">Powering homes & businesses in Nigeria</span></SiteLink></div></div><header className="site-header"><div className="wrap nav-row"><SiteLink href="#home" className="brand" aria-label="247TECHPRO home" onClick={() => setOpen(false)}><Logo /></SiteLink><nav id="main-navigation" aria-label="Main navigation" className={open ? 'nav-links is-open' : 'nav-links'}>{navigation.map(([name, id]) => <SiteLink key={id} href={`#${id}`} onClick={() => setOpen(false)}>{name}</SiteLink>)}<Button className="mobile-nav-cta" onClick={() => setOpen(false)}>Get a Solar Consultation</Button></nav><Button className="nav-cta">Get a Solar Consultation</Button><button className="menu-toggle" ref={toggle} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div></header></>;
}
