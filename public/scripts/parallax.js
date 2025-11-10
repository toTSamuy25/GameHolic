    const colors = [
      '#6cf1ff', '#a45cff', '#ff5c8a',
      '#5cff8a', '#ffd75c', '#ff9c5c',
      '#5c9cff', '#9cff5c'
    ];

    const parallax = document.getElementById('parallax');
    const numBlocks = 24;

    // Создание фигур: внешний .block (параллакс), внутренняя .shape (анимация)
    for (let i = 0; i < numBlocks; i++) {
      const block = document.createElement('div');
      const shape = document.createElement('div');

      block.className = Math.random() > 0.5 ? 'block circle' : 'block';
      shape.className = 'shape';

      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 48 + Math.floor(Math.random() * 56); // 48–104px
      const depth = (Math.random() * 0.65 + 0.2).toFixed(2); // 0.2–0.85
      const duration = (7 + Math.random() * 6).toFixed(2) + 's';

      block.style.top = (Math.random() * 90 + 5) + '%';
      block.style.left = (Math.random() * 90 + 5) + '%';
      block.style.setProperty('--size', size + 'px');
      shape.style.setProperty('--color', color);
      shape.style.setProperty('--anim-duration', duration);
      block.dataset.depth = depth;

      block.appendChild(shape);
      parallax.appendChild(block);
    }

    const blocks = Array.from(document.querySelectorAll('.block'));

    // Параллакс от скролла
    let lastY = window.scrollY || window.pageYOffset || 0;
    let ticking = false;

    function applyParallax(y) {
      for (const el of blocks) {
        const depth = parseFloat(el.dataset.depth);
        const translateY = -(y * depth);
        el.style.transform = `translate3d(0, ${translateY}px, 0)`;
      }
    }

    function onScroll() {
      lastY = window.scrollY || window.pageYOffset || 0;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          applyParallax(lastY);
          ticking = false;
        });
      }
    }

    // Инициализация: сразу применяем параллакс и даём «пинок» для анимации
    applyParallax(lastY);
    window.addEventListener('scroll', onScroll, { passive: true });

    // Если хочешь проверить, что анимации идут: небольшой автоскролл (можно удалить)
    // setTimeout(() => {
    //   window.scrollTo({ top: lastY + 1, behavior: 'auto' });
    //   window.scrollTo({ top: lastY, behavior: 'auto' });
    // }, 0);