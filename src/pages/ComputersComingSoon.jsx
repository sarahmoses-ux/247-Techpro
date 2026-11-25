import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Laptop, ShoppingBag } from 'lucide-react';

export default function ComputersComingSoon() {
  const location = useLocation();
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(5);
  const fromSite = location.state?.fromComputerShop === true;

  useEffect(() => {
    const start = Date.now();
    const countdown = setInterval(() => setSeconds(Math.max(0, 5 - Math.floor((Date.now() - start) / 1000))), 250);
    const timeout = setTimeout(() => {
      if (fromSite) navigate(-1);
      else navigate('/services/computer-sales-repairs', { replace: true });
    }, 5000);
    return () => { clearInterval(countdown); clearTimeout(timeout); };
  }, [fromSite, navigate]);

  const goBack = () => fromSite ? navigate(-1) : navigate('/services/computer-sales-repairs', { replace: true });
  return <section className="section computer-shop-coming"><div className="wrap">
    <div className="computer-shop-card">
      <span className="computer-shop-icon"><Laptop size={44} strokeWidth={1.5} aria-hidden="true"/></span>
      <span className="eyebrow"><ShoppingBag size={17} aria-hidden="true"/>247TECHPRO SHOP · COMPUTERS</span>
      <h1>Something good is<br/><span>coming soon.</span></h1>
      <p>Our computer shop is getting ready. Soon you’ll be able to explore laptops, desktops and accessories right here.</p>
      <p className="computer-shop-countdown" role="timer" aria-label="Seconds until returning">Returning {fromSite ? 'to your previous page' : 'to Computer Sales & Repairs'} in <strong>{seconds}s</strong></p>
      <div className="computer-shop-progress" aria-hidden="true"><span/></div>
      <button type="button" className="button primary" onClick={goBack}>Go Back Now</button>
    </div>
  </div></section>;
}
