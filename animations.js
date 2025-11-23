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
      threshold: 0.18,
      rootMargin: '0px 0px -5% 0px',
    }
  );

  let delayStep = 0;

  markForReveal.forEach((el) => {
    el.dataset.reveal = 'true';

    if (prefersReduced) {
      el.classList.add('is-visible');
      return;
    }

    el.classList.add('reveal-on-scroll');
    const delay = (delayStep % 6) * 80;
    el.style.setProperty('--reveal-delay', `${delay}ms`);
    delayStep += 1;
    observer.observe(el);
  });
})();
