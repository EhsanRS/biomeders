/**
 * Main JavaScript
 * Theme toggle, copy code buttons, mobile menu
 */

(function() {
  'use strict';

  // ============================================
  // Theme Toggle
  // ============================================
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  function getPreferredTheme() {
    const stored = localStorage.getItem('theme-preference');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme-preference', theme);

    // Add transition class for smooth theme change
    html.classList.add('theme-transition');
    setTimeout(() => {
      html.classList.remove('theme-transition');
    }, 300);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme-preference')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ============================================
  // Mobile Menu
  // ============================================
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.hidden = isExpanded;

      if (!isExpanded) {
        mobileMenuToggle.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      } else {
        mobileMenuToggle.classList.remove('is-active');
        document.body.style.overflow = '';
      }
    });

    // Close menu on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.hidden) {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.hidden = true;
        mobileMenuToggle.classList.remove('is-active');
        document.body.style.overflow = '';
      }
    });

    // Close menu on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && !mobileMenu.hidden) {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.hidden = true;
        mobileMenuToggle.classList.remove('is-active');
        document.body.style.overflow = '';
      }
    });
  }

  // ============================================
  // Copy Code Buttons
  // ============================================
  function createSVGElement(pathData, viewBox) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('viewBox', viewBox || '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');

    pathData.forEach(function(d) {
      if (d.type === 'rect') {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        Object.keys(d.attrs).forEach(function(key) {
          rect.setAttribute(key, d.attrs[key]);
        });
        svg.appendChild(rect);
      } else if (d.type === 'path') {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d.d);
        svg.appendChild(path);
      } else if (d.type === 'polyline') {
        const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polyline.setAttribute('points', d.points);
        svg.appendChild(polyline);
      }
    });

    return svg;
  }

  function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('.highlight');

    codeBlocks.forEach((block) => {
      // Skip if button already exists
      if (block.querySelector('.code-copy-btn')) return;

      const button = document.createElement('button');
      button.className = 'code-copy-btn';
      button.type = 'button';
      button.setAttribute('aria-label', 'Copy code to clipboard');

      // Create copy icon
      const copyIcon = createSVGElement([
        { type: 'rect', attrs: { x: '9', y: '9', width: '13', height: '13', rx: '2', ry: '2' } },
        { type: 'path', d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' }
      ]);
      copyIcon.classList.add('icon-copy');

      // Create check icon
      const checkIcon = createSVGElement([
        { type: 'polyline', points: '20 6 9 17 4 12' }
      ]);
      checkIcon.classList.add('icon-check');

      button.appendChild(copyIcon);
      button.appendChild(checkIcon);

      button.addEventListener('click', async () => {
        const code = block.querySelector('code');
        if (!code) return;

        const text = code.textContent || '';

        try {
          await navigator.clipboard.writeText(text);
          button.classList.add('is-copied');
          button.setAttribute('aria-label', 'Copied!');

          setTimeout(() => {
            button.classList.remove('is-copied');
            button.setAttribute('aria-label', 'Copy code to clipboard');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy code:', err);
        }
      });

      block.style.position = 'relative';
      block.appendChild(button);
    });
  }

  // ============================================
  // External Links
  // ============================================
  function handleExternalLinks() {
    const links = document.querySelectorAll('a[href^="http"]');
    const currentHost = window.location.host;

    links.forEach((link) => {
      const url = new URL(link.href);
      if (url.host !== currentHost) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  function handleAnchorLinks() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Update URL without scrolling
          history.pushState(null, '', targetId);
        }
      });
    });
  }

  // ============================================
  // Initialize
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    addCopyButtons();
    handleExternalLinks();
    handleAnchorLinks();
  });

})();
