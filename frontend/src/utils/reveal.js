import { useEffect } from 'react';

/**
 * Anima un contador numérico con suavizado cúbico
 * @param {HTMLElement} el - Elemento con data-count y data-suffix opcional
 * @param {number} [duration=1200] - Duración en milisegundos
 */
export const animateCounter = (el, duration = 1200) => {
  if (!el || el.dataset.animated === 'true') return;
  
  const target = parseFloat(el.dataset.count) || 0;
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const isInteger = Number.isInteger(target);
  const start = performance.now();
  
  el.dataset.animated = 'true';

  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    // Easing cúbico fluido: 1 - (1 - p)^3
    const eased = 1 - Math.pow(1 - p, 3);
    const current = isInteger ? Math.floor(target * eased) : (target * eased).toFixed(1);
    el.textContent = `${prefix}${current}${suffix}`;
    
    if (p < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = `${prefix}${target}${suffix}`;
    }
  };

  requestAnimationFrame(tick);
};

/**
 * Hook de React para inicializar Reveal on Scroll y Contadores Automáticos
 * Respeta 'prefers-reduced-motion'
 */
export const useScrollReveal = (deps = []) => {
  useEffect(() => {
    // Si el usuario prefiere movimiento reducido, mostrar todo directamente
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        el.classList.add('is-visible');
        const counterEl = el.querySelector('[data-count]') || (el.hasAttribute('data-count') ? el : null);
        if (counterEl) {
          const target = counterEl.dataset.count;
          const suffix = counterEl.dataset.suffix || '';
          const prefix = counterEl.dataset.prefix || '';
          counterEl.textContent = `${prefix}${target}${suffix}`;
        }
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            
            // Si el elemento o sus hijos tienen contadores numéricos, animarlos
            const counters = entry.target.querySelectorAll('[data-count]');
            counters.forEach((c) => animateCounter(c));
            if (entry.target.hasAttribute('data-count')) {
              animateCounter(entry.target);
            }

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll('[data-reveal]');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, deps);
};
