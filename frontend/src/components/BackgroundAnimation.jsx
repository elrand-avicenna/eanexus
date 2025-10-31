import React, { useEffect, useRef } from 'react';
import './BackgroundAnimation.css';

const BackgroundAnimation = ({ fingerprintMask = [] }) => {
  const canvasRef = useRef(null);
  const confettiRef = useRef([]);
  const animationFrameRef = useRef(null);
  const xposRef = useRef(0.5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = 1;

    const NUM_CONFETTI = 350;
    const COLORS = [
      [0, 121, 241],
      [255, 221, 51],
      [255, 153, 51],
      [220, 20, 60],
      [60, 179, 113],
      [186, 85, 211]
    ];
    const PI_2 = 2 * Math.PI;

    const range = (a, b) => (b - a) * Math.random() + a;

    class Confetti {
      constructor() {
        this.pickColor();
        this.r = range(0.4, 1.1);
        this.r2 = 2 * this.r;
        this.replace();
      }

      pickColor() {
        this.style = COLORS[Math.floor(range(0, COLORS.length))];
        this.rgb = `rgba(${this.style[0]},${this.style[1]},${this.style[2]}`;
      }

      replace() {
        this.opacity = 0;
        this.dop = 0.03 * range(1, 4);
        this.x = range(-this.r2, w - this.r2);
        this.y = range(-20, h - this.r2);
        this.xmax = w - this.r;
        this.ymax = h - this.r;
        this.vx = range(0, 2) + 8 * xposRef.current - 5;
        this.vy = 0.7 * this.r + range(-1, 1);
        this.pickColor();
      }

      draw() {
        this.x += this.vx;
        this.y += this.vy;
        this.opacity += this.dop;

        if (this.opacity > 1) {
          this.opacity = 1;
          this.dop *= -1;
        }
        if (this.opacity < 0 || this.y > this.ymax) {
          this.replace();
        }

        if (Math.random() < 0.002) this.pickColor();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, PI_2, false);
        ctx.fillStyle = `${this.rgb},${this.opacity})`;
        ctx.fill();
      }
    }

    const resizeCanvasToDisplaySize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;

      const displayWidth = Math.max(1, Math.round(rect.width * dpr));
      const displayHeight = Math.max(1, Math.round(rect.height * dpr));

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      w = rect.width;
      h = rect.height;
    };

    const getEraseRects = () => {
      const els = document.querySelectorAll('.erase');
      if (!els.length) return [];
      const canvasRect = canvas.getBoundingClientRect();
      const out = [];
      els.forEach(el => {
        const r = el.getBoundingClientRect();
        out.push({
          x: r.left - canvasRect.left,
          y: r.top - canvasRect.top,
          w: r.width,
          h: r.height
        });
      });
      return out;
    };

    const pathRect = (x, y, w_, h_, clockwise = true) => {
      if (clockwise) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + w_, y);
        ctx.lineTo(x + w_, y + h_);
        ctx.lineTo(x, y + h_);
        ctx.closePath();
      } else {
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + h_);
        ctx.lineTo(x + w_, y + h_);
        ctx.lineTo(x + w_, y);
        ctx.closePath();
      }
    };

    const pathCircle = (cx, cy, r, clockwise = false) => {
      ctx.moveTo(cx + r, cy);
      ctx.arc(cx, cy, r, 0, Math.PI, !clockwise);
      ctx.arc(cx, cy, r, Math.PI, Math.PI * 2, !clockwise);
      ctx.closePath();
    };

    const animate = () => {
      resizeCanvasToDisplaySize();
      ctx.clearRect(0, 0, w, h);

      const eraseRects = getEraseRects();
      const fpCircles = fingerprintMask || [];

      ctx.save();
      ctx.beginPath();
      pathRect(0, 0, w, h, true);
      eraseRects.forEach(z => pathRect(z.x, z.y, z.w, z.h, false));
      fpCircles.forEach(c => pathCircle(c.cx, c.cy, c.r, false));
      ctx.clip();

      confettiRef.current.forEach(c => c.draw());
      ctx.restore();

      if (eraseRects.length || fpCircles.length) {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        eraseRects.forEach(z => ctx.fillRect(z.x, z.y, z.w, z.h));
        fpCircles.forEach(c => {
          ctx.beginPath();
          ctx.arc(c.cx, c.cy, c.r, 0, PI_2);
          ctx.fill();
        });
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      xposRef.current = w ? Math.max(0, Math.min(1, x / w)) : 0.5;
    };

    resizeCanvasToDisplaySize();
    confettiRef.current = Array.from({ length: NUM_CONFETTI }, () => new Confetti());
    
    window.addEventListener('resize', resizeCanvasToDisplaySize);
    document.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvasToDisplaySize);
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [fingerprintMask]);

  return <canvas ref={canvasRef} id="world" className="background-canvas" />;
};

export default BackgroundAnimation;
