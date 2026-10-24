import { useEffect } from 'react';

// Content stays visible without JavaScript or animation support.
export default function useEntranceMotion(pageKey) {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;
    const animations = new Set();
    let observer;
    const revealFocused = event => {
      for (const animation of animations) {
        if (animation.effect?.target.contains(event.target)) animation.finish();
      }
    };
    function setup() {
      observer?.disconnect();
      for (const animation of animations) animation.cancel();
      animations.clear();
      if (preference.matches) return;
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target;
          observer.unobserve(element);
          if (element.dataset.motionSeen) continue;
          element.dataset.motionSeen = 'true';
          const siblings = [...element.parentElement.children];
          const stagger = element.matches('.benefit, .solution-card, .product-card, .process-step, .reasons-grid > div');
          const animation = element.animate([
            { opacity: 0, translate: '0 22px' },
            { opacity: 1, translate: '0 0' },
          ], { duration: 650, delay: stagger ? Math.min(siblings.indexOf(element), 3) * 75 : 0, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        }
      }, { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });
      document.querySelectorAll('.technology-service-card, .category-grid > article, .why-tech-grid > article, .tech-process > article, .section-heading, .home-solutions > a, .benefit, .solution-card, .process-step, .payment-copy, .payment-visual, .use-case-grid > article, .product-card, .about-visual, .reasons-grid > div, .consultation-panel, .faq-list, .final-cta .wrap, .contact-form-card').forEach(element => observer.observe(element));
    }
    setup();
    preference.addEventListener('change', setup);
    document.addEventListener('focusin', revealFocused);
    return () => {
      observer?.disconnect();
      preference.removeEventListener('change', setup);
      document.removeEventListener('focusin', revealFocused);
      for (const animation of animations) animation.cancel();
    };
  }, [pageKey]);
}
