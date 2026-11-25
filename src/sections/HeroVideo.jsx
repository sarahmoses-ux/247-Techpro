import { ArrowDown, ShieldCheck, Sun, Wallet, Zap } from 'lucide-react';
import SiteLink from '../components/SiteLink';
import poster from '../assets/solar-home.jpg';
import './HeroVideo.css';

export default function HeroVideo() {
  return <>
    <section className="cinema-hero brand-hero solar-hero" id="home" aria-label="Solar and inverter solutions for homes and businesses">
      <div className="cinema-backdrop" aria-hidden="true">
        <img src={poster} alt="" width="1536" height="1024" fetchPriority="high" />
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
          <a className="hero-expert" href="tel:+2348132393485">Talk to a solar expert: 0813 239 3485</a>
        </div>
        <div className="cinema-bottom">
          <SiteLink href="/services/solar-inverter" className="cinema-discover"><span className="discover-circle"><ArrowDown size={18} /></span><span>POWER THAT FITS YOUR NEEDS<strong>Explore our inverter solutions</strong></span></SiteLink>
          <div className="cinema-video-controls"><span><Sun size={15} />Solar powered living</span></div>
        </div>
      </div>
    </section>
  </>;
}
