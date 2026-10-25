import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUpRight, Sun, Wallet, Zap } from 'lucide-react';
import { Button, TextLink } from '../components/UI';
import SiteLink from '../components/SiteLink';
import poster from '../assets/solar-home.jpg';
import './HeroVideo.css';

export default function HeroVideo() {
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return <>
    <section className="cinema-hero brand-hero solar-hero" id="home" aria-label="Solar and inverter solutions for homes and businesses">
      <div className="cinema-backdrop" aria-hidden="true">
        <img src={poster} alt="" width="1536" height="1024" fetchPriority="high" />
      </div>
      <div className="wrap cinema-inner">
        <div className="cinema-copy">
          <span className="eyebrow"><i />RELIABLE SOLAR INVERTER SOLUTIONS FOR HOMES &amp; BUSINESSES</span>
          <h1>Power Today.<br/><span>Secure Tomorrow.</span><br/>Live Limitless.</h1>
          <p>Take control of your power needs with reliable solar and inverter solutions, expert installation and support built around your home or business.</p>
          <div className="hero-actions"><Button href="/request-solution?service=solar-inverter">Get My Solar Recommendation</Button><Button href="#payment-plans" variant="outline-light" className="hero-pay-cta"><Wallet size={17}/>Pay Small Small</Button></div>
          <a className="hero-expert" href="tel:+2348132393485">Talk to a solar expert <span>&#8599;</span></a>
          <div className="solar-hero-payment"><Zap size={16}/><span>Flexible payment options</span><strong>Up to 18 months</strong><a href="#payment-plans" aria-label="See Pay Small Small payment options"><ArrowUpRight size={15}/></a></div>
        </div>
        <div className="cinema-bottom">
          <SiteLink href="/services/solar-inverter" className="cinema-discover"><span className="discover-circle"><ArrowDown size={18} /></span><span>POWER THAT FITS YOUR NEEDS<strong>Explore our inverter solutions</strong></span></SiteLink>
          <div className="cinema-video-controls"><span><Sun size={15} />Solar powered living</span></div>
        </div>
      </div>
    </section>
  </>;
}
