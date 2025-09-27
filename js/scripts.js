// Sparkle overlay for hero section
(function() {
  function initHeroSparkles() {
    const canvas = document.getElementById('hero-sparkles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const sparkleCount = Math.max(60, Math.floor((width * height) / 25000));
    const sparkles = new Array(sparkleCount).fill(0).map(() => createSparkle());
    let animationFrameId;

    function createSparkle() {
      const size = Math.random() * 1.8 + 0.6;
      const speed = Math.random() * 0.4 + 0.1;
      const twinkleSpeed = Math.random() * 0.02 + 0.005;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size,
        baseAlpha: Math.random() * 0.3 + 0.3,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed,
        hue: 195 + Math.random() * 40 // blue-cyan range
      };
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < sparkles.length; i++) {
        const s = sparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.twinkle += s.twinkleSpeed;

        // wrap around
        if (s.x < -5) s.x = width + 5; else if (s.x > width + 5) s.x = -5;
        if (s.y < -5) s.y = height + 5; else if (s.y > height + 5) s.y = -5;

        const alpha = s.baseAlpha + Math.sin(s.twinkle) * 0.25;

        // glow
        const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 6);
        gradient.addColorStop(0, `hsla(${s.hue}, 100%, 70%, ${alpha * 0.9})`);
        gradient.addColorStop(1, `hsla(${s.hue}, 100%, 50%, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 6, 0, Math.PI * 2);
        ctx.fill();

        // core
        ctx.fillStyle = `hsla(${s.hue}, 100%, 85%, ${Math.min(1, alpha + 0.2)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      animationFrameId = requestAnimationFrame(draw);
    }

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(canvas.offsetWidth * ratio);
      canvas.height = Math.floor(canvas.offsetHeight * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
    }

    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(canvas);

    resize();
    draw();

    // pause when tab hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        draw();
      }
    });

    // cleanup on unload
    window.addEventListener('beforeunload', () => cancelAnimationFrame(animationFrameId));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroSparkles);
  } else {
    initHeroSparkles();
  }
})();


