import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone, ArrowRight } from 'lucide-react';
import { Logo, Button } from './UI';
import SiteLink from './SiteLink';
import ServiceIcon from './ServiceIcon';
import { categories, services } from '../data/services';
export default function TechNavbar() {
  const [open,setOpen] = useState(false); const [servicesOpen,setServicesOpen] = useState(false);
  const toggle = useRef(null); const serviceToggle = useRef(null); const header = useRef(null); const { pathname } = useLocation();
  useEffect(() => { setOpen(false); setServicesOpen(false); }, [pathname]);
  useEffect(() => {
    const key = e => { if(e.key==='Escape'){ if(servicesOpen){setServicesOpen(false);serviceToggle.current?.focus();}else{setOpen(false);toggle.current?.focus();} } };
    const outside = e => { if(!header.current?.contains(e.target)){setServicesOpen(false);setOpen(false);} };
    document.addEventListener('keydown',key); document.addEventListener('pointerdown',outside);
    return () => { document.removeEventListener('keydown',key);document.removeEventListener('pointerdown',outside); };
  },[servicesOpen]);
  return <><div className="utility-bar"><div className="wrap"><span>Your Success, Our Code.</span><a href="tel:+2348132393485"><Phone size={12}/>0813 239 3485<span className="utility-divider">|</span><span className="utility-country">Technology solutions for businesses & individuals</span></a></div></div><header ref={header} className="site-header tech-header" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setServicesOpen(false);}}><div className="wrap nav-row"><SiteLink href="/" className="brand" aria-label="247TECHPRO home"><Logo/></SiteLink><nav className={`nav-links ${open?'is-open':''}`} id="main-navigation" aria-label="Main navigation"><SiteLink href="/">Home</SiteLink><SiteLink href="/about">About</SiteLink><button ref={serviceToggle} className={`services-toggle ${pathname.startsWith('/services')?'active':''}`} aria-expanded={servicesOpen} aria-controls="services-mega-menu" onClick={()=>setServicesOpen(!servicesOpen)}>Services<ChevronDown size={14}/></button><SiteLink href="/solutions">Solutions</SiteLink><SiteLink href="/why-us">Why Us</SiteLink><SiteLink href="/contact">Contact</SiteLink><Button href="/request-solution" className="mobile-nav-cta">Request a Solution</Button></nav><Button href="/request-solution" className="nav-cta">Request a Solution</Button><button ref={toggle} className="menu-toggle" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="main-navigation" onClick={()=>{setOpen(!open);setServicesOpen(false);}}>{open?<X/>:<Menu/>}</button></div>{servicesOpen&&<div className="mega-menu" id="services-mega-menu"><div className="wrap mega-grid">{categories.map(category=><div key={category.id}><h2>{category.name}</h2>{services.filter(s=>s.category===category.id).map(service=><SiteLink key={service.id} href={`/services/${service.id}`} onClick={()=>{setServicesOpen(false);setOpen(false);}}><ServiceIcon name={service.icon} size={18}/><span>{service.name}</span></SiteLink>)}</div>)}</div><div className="wrap mega-bottom"><span>One technology partner. Practical solutions.</span><SiteLink href="/services" onClick={()=>{setServicesOpen(false);setOpen(false);}}>View all services<ArrowRight size={15}/></SiteLink></div></div>}</header></>;
}
