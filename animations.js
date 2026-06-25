(function () {
  const prefersReduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pageName = (window.location.pathname.split('/').pop() || '').toLowerCase();
  const structuredPages = new Set([
    'text-agents.html',
    'telegram-platform.html',
    'telegram-store.html',
  ]);
  const isStructuredPage = structuredPages.has(pageName);

  const baseSelectors = [
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
    '.tg-hero__text',
    '.tg-hero__visual',
    '.tg-section__text',
    '.tg-visual-card',
    '.tg-feature-card',
    '.tg-metric-card',
    '.tg-bot-list li',
    '.tg-cta__wrap',
    '.detail-card',
    '.highlight-list li',
  ];

  const structuredSelectors = [
    '.nav-container',

    '.product-hero-text > *',
    '.product-hero-media img',
    '.detail-section .section-title',
    '.detail-grid > *',
    '.highlight-layout > div > *',
    '.highlight-list > *',
    '.detail-cta-card > *',

    '.platform-hero-text > *',
    '.platform-hero-media-frame',
    '.platform-hero-highlight > :not(.platform-hero-list)',
    '.platform-hero-list > li',
    '.platform-section-head > *',
    '.platform-clients-rail > *',
    '.platform-service-text > :not(.platform-service-list)',
    '.platform-service-list > li',
    '.platform-service-panel',
    '.panel-stat',
    '.upgrade-card > *',
    '.platform-why-grid > *',
    '.platform-need-grid > *',
    '.platform-industries-grid > *',
    '.platform-consult-card > *',
    '.platform-copy > *',
    '.tg-bot-list > li',
    '.faq-header > *',
    '.faq-item',

    '.detail-hero-content > *',
    '.detail-hero-media',
    '.what-text > *',
    '.what-media',
    '.section-why .section-title',
    '.why-visual',
    '.why-list > *',
    '.cases .section-title',
    '.case-brand',
    '.case-heading',
    '.case-lead',
    '.case-list > *',
    '.case-right',
    '.steps .section-title',
    '.steps-subtitle',
    '.steps-grid > *',
    '.audience .section-title',
    '.audience-grid > *',
    '.cta-dark .container > *',

    '.contact-intro',
    '.contact-form',
  ];

  const isHome = document.body.classList.contains('home');
  let hasStarted = false;

  const sortByDocumentOrder = (items) =>
    [...items].sort((a, b) => {
      if (a === b) return 0;
      return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_PRECEDING ? 1 : -1;
    });

  const closestSection = (el) => el.closest('section, header, footer, main') || document.body;

  const revealKind = (el) => {
    if (el.matches('.nav-container')) return 'nav';
    if (el.matches('h1, h2, .section-title, .what-title, .workflow-title')) return 'heading';
    if (el.matches('.platform-hero-eyebrow, .platform-eyebrow, .hero-tag, .workflow-eyebrow')) return 'eyebrow';
    if (el.matches('.platform-hero-media-frame, .detail-hero-media, .product-hero-media img, .what-media, .why-visual, .case-right')) return 'media';
    if (el.matches('.btn, .detail-actions, .platform-hero-actions, .upgrade-actions, .platform-consult-actions, .platform-cta, .cta-actions')) return 'action';
    if (el.matches('li, .panel-stat')) return 'list';
    if (el.matches('article, .detail-card, .why-card, .step-card, .aud-card, .platform-client-card, .platform-why-card, .platform-need-card, .platform-industry-card, .faq-item')) return 'card';
    if (el.matches('.platform-hero-highlight, .platform-service-panel, .upgrade-card, .platform-consult-card, .detail-cta-card')) return 'panel';
    return 'copy';
  };

  const presetForKind = (kind, localIndex) => {
    const fromLeft = localIndex % 2 === 0 ? '-16px' : '16px';

    const presets = {
      nav: { x: '0px', y: '-14px', scale: 1, blur: '0px', rotate: '0deg', duration: 0.52 },
      eyebrow: { x: '0px', y: '12px', scale: 1, blur: '0px', rotate: '0deg', duration: 0.54 },
      heading: { x: '0px', y: '24px', scale: 0.99, blur: '0px', rotate: '0deg', duration: 0.76 },
      copy: { x: '0px', y: '18px', scale: 0.995, blur: '3px', rotate: '0deg', duration: 0.64 },
      action: { x: '0px', y: '16px', scale: 0.99, blur: '0px', rotate: '0deg', duration: 0.58 },
      list: { x: fromLeft, y: '12px', scale: 0.995, blur: '2px', rotate: '0deg', duration: 0.58 },
      card: { x: '0px', y: '26px', scale: 0.982, blur: '4px', rotate: '0deg', duration: 0.7 },
      panel: { x: '0px', y: '28px', scale: 0.975, blur: '5px', rotate: '0deg', duration: 0.78 },
      media: { x: localIndex % 2 === 0 ? '30px' : '-30px', y: '18px', scale: 0.97, blur: '3px', rotate: '0deg', duration: 0.86 },
    };

    return presets[kind] || presets.copy;
  };

  const prepareStructuredReveal = (elements) => {
    const sectionState = new WeakMap();

    elements.forEach((el) => {
      const section = closestSection(el);
      const state = sectionState.get(section) || {
        total: 0,
        byKind: Object.create(null),
      };
      const kind = revealKind(el);
      const kindIndex = state.byKind[kind] || 0;
      const preset = presetForKind(kind, kindIndex);
      const isHero = section.matches('.product-hero, .platform-hero, .detail-hero');
      const sectionPace = isHero ? 68 : 78;
      const compactCap = kind === 'card' || kind === 'list' ? 7 : 5;
      const delay = Math.min(state.total, compactCap) * sectionPace;

      el.dataset.reveal = 'true';
      el.dataset.revealKind = kind;
      el.style.setProperty('--reveal-x', preset.x);
      el.style.setProperty('--reveal-y', preset.y);
      el.style.setProperty('--reveal-scale', preset.scale);
      el.style.setProperty('--reveal-rotate', preset.rotate);
      el.style.setProperty('--reveal-blur', preset.blur);
      el.style.setProperty('--reveal-delay', `${delay}ms`);
      el.style.setProperty('--reveal-duration', `${preset.duration}s`);
      el.style.setProperty('--reveal-easing', 'cubic-bezier(0.2, 0.8, 0.2, 1)');

      state.total += 1;
      state.byKind[kind] = kindIndex + 1;
      sectionState.set(section, state);
    });
  };

  const makeLegacyRevealVisible = (selected) => {
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      if (selected.has(el)) return;
      el.classList.add('reveal-on-scroll', 'is-visible');
    });
  };

  const initReveal = () => {
    if (hasStarted) return;
    hasStarted = true;

    const markForReveal = new Set();
    const selectors = isStructuredPage ? structuredSelectors : baseSelectors;

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => markForReveal.add(el));
    });

    if (!isStructuredPage) {
      document.querySelectorAll('[data-reveal]').forEach((el) => markForReveal.add(el));
    }

    if (!markForReveal.size) return;

    const elements = sortByDocumentOrder(markForReveal).filter((el) => !el.closest('[data-no-reveal]'));
    const selected = new Set(elements);

    if (isStructuredPage) {
      makeLegacyRevealVisible(selected);
      prepareStructuredReveal(elements);
    }

    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => {
        el.classList.add('reveal-on-scroll', 'is-visible');
      });
      return;
    }

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
        threshold: isStructuredPage ? 0.12 : 0.16,
        rootMargin: isStructuredPage ? '0px 0px -8% 0px' : '0px 0px -12% 0px',
      }
    );

    window.setTimeout(() => {
      elements.forEach((el) => {
        if (!el.classList.contains('is-visible')) {
          el.classList.add('is-visible');
        }
      });
    }, isHome ? 2600 : 3400);

    const motionPresets = isHome
      ? [{ x: '0px', y: '12px', scale: 1, blur: '0px', rotate: '0deg' }]
      : [
        { x: '0px', y: '18px', scale: 0.985, blur: '8px', rotate: '-0.2deg' },
        { x: '-10px', y: '16px', scale: 0.99, blur: '6px', rotate: '0deg' },
        { x: '12px', y: '14px', scale: 0.982, blur: '7px', rotate: '0.18deg' },
        { x: '0px', y: '20px', scale: 0.978, blur: '7px', rotate: '0deg' },
      ];
    const delayStepMax = isHome ? 4 : 6;
    const delayMultiplier = isHome ? 45 : 90;
    const baseDuration = isHome ? 0.45 : 0.72;
    const durationStep = isHome ? 0.05 : 0.08;

    let delayStep = 0;

    elements.forEach((el) => {
      el.dataset.reveal = 'true';

      if (prefersReduced) {
        el.classList.add('reveal-on-scroll', 'is-visible');
        return;
      }

      if (!isStructuredPage) {
        const preset = motionPresets[delayStep % motionPresets.length];
        const customX = el.dataset.revealX;
        const customY = el.dataset.revealY;
        const customScale = el.dataset.revealScale;
        const customBlur = el.dataset.revealBlur;
        const customRotate = el.dataset.revealRotate;
        const customDelay = el.dataset.revealDelay;
        const customDuration = el.dataset.revealDuration;

        const delay =
          customDelay !== undefined
            ? Number(customDelay)
            : (delayStep % delayStepMax) * delayMultiplier;
        const duration =
          customDuration !== undefined
            ? Number(customDuration)
            : baseDuration + (delayStep % 4) * durationStep;

        el.style.setProperty('--reveal-x', customX ?? preset.x);
        el.style.setProperty('--reveal-y', customY ?? preset.y);
        el.style.setProperty('--reveal-scale', customScale ?? preset.scale);
        el.style.setProperty('--reveal-rotate', customRotate ?? preset.rotate);
        el.style.setProperty('--reveal-blur', customBlur ?? preset.blur);
        el.style.setProperty('--reveal-delay', `${delay}ms`);
        el.style.setProperty('--reveal-duration', `${duration}s`);
        el.style.setProperty('--reveal-easing', 'cubic-bezier(0.22, 1, 0.36, 1)');
      }

      el.classList.add('reveal-on-scroll');
      delayStep += 1;
      observer.observe(el);
    });
  };

  initReveal();
})();
