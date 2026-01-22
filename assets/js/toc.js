/**
 * Table of Contents
 * Auto-generates TOC from headings with scrollspy
 */

(function() {
  'use strict';

  const tocContent = document.getElementById('toc-content');
  const tocWrapper = document.getElementById('toc-wrapper');
  const tocToggle = document.getElementById('toc-toggle');

  if (!tocContent) return;

  // ============================================
  // Generate TOC
  // ============================================
  function generateTOC() {
    const article = document.querySelector('.article-content, .prose');
    if (!article) return;

    const headings = article.querySelectorAll('h2, h3, h4');
    if (headings.length === 0) {
      if (tocWrapper) tocWrapper.style.display = 'none';
      return;
    }

    const tocList = document.createElement('ul');
    tocList.className = 'toc__list';

    headings.forEach((heading, index) => {
      // Ensure heading has an ID
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }

      const listItem = document.createElement('li');
      listItem.className = `toc__item toc__item--${heading.tagName.toLowerCase()}`;

      const link = document.createElement('a');
      link.className = 'toc__link';
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent.replace(/^#\s*/, '');

      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(heading.id);
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          history.pushState(null, '', `#${heading.id}`);

          // Close mobile TOC
          if (tocWrapper && window.innerWidth < 1024) {
            tocWrapper.classList.remove('is-open');
            if (tocToggle) {
              tocToggle.setAttribute('aria-expanded', 'false');
            }
          }
        }
      });

      listItem.appendChild(link);
      tocList.appendChild(listItem);
    });

    tocContent.appendChild(tocList);

    // Initialize scrollspy
    initScrollspy(headings);
  }

  // ============================================
  // Scrollspy
  // ============================================
  function initScrollspy(headings) {
    if (!headings.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -80% 0px',
      threshold: 0
    };

    let currentActive = null;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const tocLink = tocContent.querySelector(`a[href="#${id}"]`);

        if (entry.isIntersecting) {
          // Remove active from previous
          if (currentActive && currentActive !== tocLink) {
            currentActive.classList.remove('is-active');
            currentActive.closest('.toc__item')?.classList.remove('is-active');
          }

          // Add active to current
          if (tocLink) {
            tocLink.classList.add('is-active');
            tocLink.closest('.toc__item')?.classList.add('is-active');
            currentActive = tocLink;
          }
        }
      });
    }, observerOptions);

    headings.forEach((heading) => {
      observer.observe(heading);
    });

    // Fallback: Set first item as active if none is visible
    setTimeout(() => {
      if (!currentActive) {
        const firstLink = tocContent.querySelector('.toc__link');
        if (firstLink) {
          firstLink.classList.add('is-active');
          firstLink.closest('.toc__item')?.classList.add('is-active');
          currentActive = firstLink;
        }
      }
    }, 100);
  }

  // ============================================
  // Mobile TOC Toggle
  // ============================================
  if (tocToggle && tocWrapper) {
    tocToggle.addEventListener('click', () => {
      const isExpanded = tocToggle.getAttribute('aria-expanded') === 'true';
      tocToggle.setAttribute('aria-expanded', !isExpanded);
      tocWrapper.classList.toggle('is-open', !isExpanded);
    });

    // Close on outside click (mobile)
    document.addEventListener('click', (e) => {
      if (window.innerWidth < 1024 &&
          tocWrapper.classList.contains('is-open') &&
          !tocWrapper.contains(e.target)) {
        tocWrapper.classList.remove('is-open');
        tocToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ============================================
  // Initialize
  // ============================================
  document.addEventListener('DOMContentLoaded', generateTOC);

})();
