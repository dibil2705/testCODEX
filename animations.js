(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const selectors = [
    'section',
    '.section',
    '.service-card',
    '.industry-card',
    '.mission-card',
    '.benefit-card',
    '.team-card',
    '.contact-form',
    '.contact-intro',
    '.final-inner',
    '.platform-hero-highlight',
    '.platform-hero-list li',
    '.platform-hero-media-frame',
    '.platform-feature-card',
    '.platform-stat-card',
    '.platform-step',
    '.platform-cta-card',
    '.what-grid > *',
    '.store-hero',
    '.store-feature-card',
    '.store-benefit-card',
    '.store-step-card',
    '.store-case-card',
    '.agent-hero-card',
    '.agent-feature-card',
    '.agent-step-card',
    '.agent-benefit-card',
    '.agent-cta-card',
    '.faq-item',
  ];

  const markForReveal = new Set();

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => markForReveal.add(el));
  });

  document.querySelectorAll('[data-reveal]').forEach((el) => markForReveal.add(el));

  if (!markForReveal.size) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: '0px 0px -12% 0px',
    }
  );

  const motionPresets = [
    { x: '0px', y: '18px', scale: 0.985, blur: '8px', rotate: '-0.2deg' },
    { x: '-10px', y: '16px', scale: 0.99, blur: '6px', rotate: '0deg' },
    { x: '12px', y: '14px', scale: 0.982, blur: '7px', rotate: '0.18deg' },
    { x: '0px', y: '20px', scale: 0.978, blur: '7px', rotate: '0deg' },
  ];

  let delayStep = 0;

  markForReveal.forEach((el) => {
    el.dataset.reveal = 'true';

    if (prefersReduced) {
      el.classList.add('is-visible');
      return;
    }

    const preset = motionPresets[delayStep % motionPresets.length];
    const delay = (delayStep % 6) * 90;
    const duration = 0.72 + (delayStep % 4) * 0.08;

    el.classList.add('reveal-on-scroll');
    el.style.setProperty('--reveal-x', preset.x);
    el.style.setProperty('--reveal-y', preset.y);
    el.style.setProperty('--reveal-scale', preset.scale);
    el.style.setProperty('--reveal-rotate', preset.rotate);
    el.style.setProperty('--reveal-blur', preset.blur);
    el.style.setProperty('--reveal-delay', `${delay}ms`);
    el.style.setProperty('--reveal-duration', `${duration}s`);
    el.style.setProperty('--reveal-easing', 'cubic-bezier(0.22, 1, 0.36, 1)');

    delayStep += 1;
    observer.observe(el);
  });
})();
