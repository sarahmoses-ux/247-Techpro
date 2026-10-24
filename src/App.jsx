import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/TechNavbar';
import Footer from './components/TechFooter';
import Hero from './sections/HeroVideo';
import RequestSolution from './sections/RequestSolution';
import Contact from './sections/Contact';
import { ValueStrip, ServiceGrid, Categories, HelpSelector, WhyChoose, FeatureSections, WorkProcess, TechFAQ, BrandCTA } from './sections/TechnologyContent';
import ServicePage from './pages/ServicePage';
import PageHeader from './pages/PageHeader';
import { Button } from './components/UI';
import { setMetadata } from './utils/seo';
import useEntranceMotion from './hooks/useEntranceMotion';
import './motion.css';
import './pages/pages.css';
export default function App(){return <BrowserRouter><Website/></BrowserRouter>}
function Website(){
  const location = useLocation();
  useEntranceMotion(location.pathname);

  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const scroll = () => setShowTop(window.scrollY > 900);
    window.addEventListener('scroll', scroll, { passive: true });
    return () => window.removeEventListener('scroll', scroll);
  }, []);
  useEffect(() => {
    setMetadata(location.pathname);
    const frame = requestAnimationFrame(() => {
      const target = location.hash ? document.getElementById(location.hash.slice(1)) : null;
      if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
      document.getElementById('main')?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);
  return <><a className="skip-link" href="#main">Skip to content</a><Navbar/><main id="main" tabIndex={-1}><Routes>
<Route path="/" element={<><Hero/><ValueStrip/><ServiceGrid/><Categories/><HelpSelector/><WhyChoose/><FeatureSections/><WorkProcess/><RequestSolution/><TechFAQ/><Contact/></>}/>
<Route path="/about" element={<><PageHeader eyebrow="ABOUT 247TECHPRO" title="One technology partner. Built around you.">247TECHPRO is a multi-service technology solutions company serving businesses, organizations and individuals. We connect software, IT infrastructure, energy, security and smart technology with practical implementation and support.</PageHeader><WhyChoose/><Categories/><WorkProcess/><BrandCTA/></>}/>
<Route path="/services" element={<><PageHeader eyebrow="OUR SERVICES" title="Practical technology. Real possibilities.">Explore eight services, connected by one approach: understanding your needs and helping you implement the right solution.</PageHeader><ServiceGrid/><BrandCTA/></>}/>
<Route path="/services/:serviceId" element={<ServicePage/>}/>
<Route path="/solutions" element={<><PageHeader eyebrow="SOLUTIONS" title="Connect the pieces that matter to you.">From digital products to dependable infrastructure, power and connected properties, find the right starting point.</PageHeader><Categories expanded/><HelpSelector/><BrandCTA/></>}/>
<Route path="/why-us" element={<><PageHeader eyebrow="WHY US" title="Your needs lead. Technology follows.">One partner to help you plan, build, configure and maintain the solutions that fit your world.</PageHeader><WhyChoose/><WorkProcess/><BrandCTA/></>}/>
<Route path="/how-it-works" element={<><PageHeader eyebrow="HOW WE WORK" title="A clear path from challenge to solution."/><WorkProcess/><BrandCTA/></>}/>
<Route path="/faq" element={<><PageHeader eyebrow="FAQ" title="Get clarity before you begin."/><TechFAQ/><BrandCTA/></>}/>
<Route path="/contact" element={<><PageHeader eyebrow="CONTACT" title="Let’s start with what you need.">Speak with our team about your business, home or next technology project.</PageHeader><Contact/></>}/>
<Route path="/request-solution" element={<RequestSolution standalone/>}/>
<Route path="/consultation" element={<Navigate replace to="/request-solution?service=solar-inverter"/>}/>
<Route path="/payment-plans" element={<Navigate replace to="/services/solar-inverter#payment-plans"/>}/>
<Route path="*" element={<><PageHeader eyebrow="PAGE NOT FOUND" title="We couldn’t find that page."/><div className="section wrap"><Button href="/">Back to Home</Button></div></>}/>
</Routes></main><Footer/>{showTop&&<button className="back-top" aria-label="Back to top" onClick={()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}><ArrowUp size={20}/></button>}</>;
}
