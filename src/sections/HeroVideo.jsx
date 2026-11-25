import { useEffect, useState } from 'react';
import { ArrowDown, Pause, Play, ShieldCheck, Sun, Wallet, Zap } from 'lucide-react';
import SiteLink from '../components/SiteLink';
import poster from '../assets/solar-home.jpg';
import solarHome from '../assets/solar-backup.jpg';
import solarBusiness from '../assets/solar-business.jpg';
import './HeroVideo.css';

const heroPictures = [
  { src: solarHome, label: 'Home solar', alt: 'Rooftop solar panels on a home at sunset' },
  { src: solarBusiness, label: 'Business solar', alt: 'Solar panels covering a business rooftop' },
  { src: poster, label: 'Backup power', alt: 'A home with an inverter and battery backup system' },
];

export default function HeroVideo() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (paused || reduced) return;
    const timer = setInterval(() => setActive(index => (index + 1) % heroPictures.length), 6500);
    return () => clearInterval(timer);
  }, [paused, reduced]);
  return <>
    <section className="cinema-hero brand-hero solar-hero" id="home" aria-label="Solar and inverter solutions for homes and businesses">
      <div className="cinema-backdrop" aria-hidden="true">
        {heroPictures.map((picture, index) => <img key={picture.label} className={`hero-picture ${active === index ? 'is-active' : ''}`} src={picture.src} alt="" width="1536" height="1024" fetchPriority={index === 0 ? 'high' : 'auto'} />)}
      </div>
      <div className="wrap cinema-inner">
        <div className="cinema-copy">
          <span className="eyebrow"><i />RELIABLE SOLAR INVERTER SOLUTIONS FOR HOMES &amp; BUSINESSES</span>
          <h1>Power Today.<br/><span>Secure Tomorrow.</span><br/>Live Limitless.</h1>
          <p>Clean energy. Smart choice. Brighter future. Take control of your power with reliable solar and inverter solutions designed for performance, durability and peace of mind.</p>
          <div className="solar-hero-payment"><Wallet size={24} aria-hidden="true"/><div><span>PAY SMALL SMALL</span><strong>Spread payments over up to <em>48 months</em></strong><p>Solar inverters, phones &amp; accessories, laptops &amp; computers, and more.</p></div></div>
          <div className="hero-actions"><SiteLink href="/services/solar-inverter#payment-plans" className="button primary hero-pay-cta"><Wallet size={19} aria-hidden="true"/>Pay Small Small</SiteLink><SiteLink href="/request-solution?service=solar-inverter" className="button outline-light">Get My Solar Recommendation</SiteLink></div>
          <small className="hero-payment-terms">Payment plans are subject to availability, eligibility and approval.</small>
          <div className="cinema-trust"><span><Zap size={17} aria-hidden="true"/>Reliable backup power</span><span><Sun size={17} aria-hidden="true"/>Clean, renewable energy</span><span><ShieldCheck size={17} aria-hidden="true"/>Expert installation &amp; after-sales support</span></div>
          <a className="hero-expert" href="tel:+2348109569770">Talk to a solar expert: +234 810 956 9770</a>
        </div>
        <div className="cinema-bottom">
          <SiteLink href="/services/solar-inverter" className="cinema-discover"><span className="discover-circle"><ArrowDown size={18} /></span><span>POWER THAT FITS YOUR NEEDS<strong>Explore our inverter solutions</strong></span></SiteLink>
          <div className="hero-gallery" role="group" aria-label="Hero solar pictures">
            <div className="hero-gallery-tabs">{heroPictures.map((picture, index) => <button key={picture.label} type="button" aria-label={`Show ${picture.label.toLowerCase()}: ${picture.alt}`} aria-pressed={active === index} onClick={() => { setActive(index); setPaused(true); }}><span className="hero-gallery-dot" aria-hidden="true"/>{picture.label}</button>)}</div>
            {!reduced && <button className="hero-gallery-play" type="button" aria-label={paused ? 'Play hero slideshow' : 'Pause hero slideshow'} onClick={() => setPaused(value => !value)}>{paused ? <Play size={16}/> : <Pause size={16}/>}</button>}
          </div>
        </div>
      </div>
    </section>
  </>;
}
