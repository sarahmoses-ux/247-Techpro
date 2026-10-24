import { useEffect, useRef, useState } from 'react';
import { ArrowDown, Check, MessageCircle, Pause, Play, Sun } from 'lucide-react';
import { Button, TextLink } from '../components/UI';
import SiteLink from '../components/SiteLink';
import poster from '../assets/technology-studio.jpg';
import './HeroVideo.css';

export default function HeroVideo() {
  const section = useRef(null);
  const video = useRef(null);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [saveData] = useState(() => Boolean(navigator.connection?.saveData));
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [inView, setInView] = useState(true);
  const [visible, setVisible] = useState(!document.hidden);
  const enabled = !reduced && !saveData && !failed;
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setReduced(media.matches); setReady(false); };
    const visibility = () => setVisible(!document.hidden);
    media.addEventListener('change', update);
    document.addEventListener('visibilitychange', visibility);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .15 });
    observer.observe(section.current);
    return () => { observer.disconnect(); media.removeEventListener('change', update); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  useEffect(() => {
    const element = video.current;
    if (!element || !enabled) return;
    if (paused || !inView || !visible) element.pause();
    else element.play().catch(() => { setPlaying(false); });
  }, [paused, inView, visible, enabled]);
  function togglePlayback() {
    if (playing) { setPaused(true); video.current?.pause(); }
    else { setPaused(false); video.current?.play().catch(() => setPlaying(false)); }
  }
  return <>
    <section className="cinema-hero brand-hero" id="home" ref={section} aria-label="Technology solutions for businesses and individuals">
      <div className="cinema-backdrop" aria-hidden="true">
        <img src={poster} alt="" width="1536" height="1024" fetchPriority="high" />
        {enabled && <video ref={video} className={ready ? 'is-ready' : ''} src="/video/technology-living.mp4" poster={poster} autoPlay muted loop playsInline preload="metadata" tabIndex={-1} disablePictureInPicture onPlaying={() => { setReady(true); setPlaying(true); }} onPause={() => setPlaying(false)} onError={() => { setFailed(true); setPlaying(false); }} />}
      </div>
      <div className="wrap cinema-inner">
        <div className="cinema-copy">
          <span className="eyebrow"><i />SOFTWARE &bull; IT &bull; ENERGY &bull; SECURITY &bull; SMART TECHNOLOGY</span>
          <h1>Technology That Powers<br/><span>Your Business,</span><br/>Home &amp; Future.</h1>
          <p>From software and enterprise systems to reliable power, security and smart technology, 247TECHPRO delivers practical technology solutions built around your needs.</p>
          <div className="hero-actions"><Button href="/request-solution">Request a Solution</Button><Button href="/services" variant="outline-light">Explore Our Services</Button></div>
          <a className="hero-expert" href="tel:+2348132393485">Talk to an Expert <span>&#8599;</span></a>
        </div>
        <div className="cinema-bottom">
          <SiteLink href="/solutions" className="cinema-discover"><span className="discover-circle"><ArrowDown size={18} /></span><span>ONE BRAND. CONNECTED POSSIBILITIES.<strong>Discover your next solution</strong></span></SiteLink>
          <div className="cinema-video-controls"><span><Sun size={15} />Technology, illustrated</span>{enabled && <button type="button" onClick={togglePlayback} aria-label={playing ? 'Pause background video' : 'Play background video'}>{playing ? <Pause size={15} /> : <Play size={15} />}<span>{playing ? 'Pause' : 'Play'}</span></button>}</div>
        </div>
      </div>
    </section>
  </>;
}
