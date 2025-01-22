import React, { useRef, useEffect } from 'react';
import { gsap, Circ } from 'gsap';

interface Point {
  x: number;
  y: number;
  originX: number;
  originY: number;
  active?: number;
  circle?: Circle;
  closest?: Point[];
}

class Circle {
  pos: Point;
  radius: number;
  color: string;
  active?: number;

  constructor(pos: Point, rad: number, color: string) {
    this.pos = pos;
    this.radius = rad;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.active) return;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = `rgba(156,217,249,${this.active})`;
    ctx.fill();
  }
}

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let width: number;
    let height: number;
    let canvas: HTMLCanvasElement | null = null;
    let ctx: CanvasRenderingContext2D | null = null;
    let points: Point[] = [];
    let target: Point = { x: 0, y: 0, originX: 0, originY: 0 }; // Inicializando `target` com todas as propriedades necessárias.
    let animateHeader = true;

    function initHeader() {
      width = window.innerWidth;
      height = window.innerHeight;
      target = { x: width / 2, y: height / 2, originX: width / 2, originY: height / 2 }; // Atualizando `target` com todas as propriedades.

      const largeHeader = document.getElementById('large-header') as HTMLElement;
      largeHeader.style.height = `${height}px`;

      canvas = canvasRef.current;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');
      }

      points = [];
      for (let x = 0; x < width; x += width / 20) {
        for (let y = 0; y < height; y += height / 20) {
          const px = x + Math.random() * width / 20;
          const py = y + Math.random() * height / 20;
          const p: Point = { x: px, originX: px, y: py, originY: py };
          points.push(p);
        }
      }

      for (let i = 0; i < points.length; i++) {
        const closest: Point[] = [];
        const p1 = points[i];
        for (let j = 0; j < points.length; j++) {
          const p2 = points[j];
          if (p1 !== p2) {
            let placed = false;
            for (let k = 0; k < 5; k++) {
              if (!placed) {
                if (!closest[k]) {
                  closest[k] = p2;
                  placed = true;
                }
              }
            }

            for (let k = 0; k < 5; k++) {
              if (!placed) {
                if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                  closest[k] = p2;
                  placed = true;
                }
              }
            }
          }
        }
        p1.closest = closest;
      }

      for (let i = 0; i < points.length; i++) {
        const c = new Circle(points[i], 2 + Math.random() * 2, 'rgba(255,255,255,0.3)');
        points[i].circle = c;
      }
    }

    function addListeners() {
      if (!('ontouchstart' in window)) {
        window.addEventListener('mousemove', mouseMove);
      }
      window.addEventListener('scroll', scrollCheck);
      window.addEventListener('resize', resize);
    }

    function mouseMove(e: MouseEvent) {
      let posx = 0;
      let posy = 0;
      if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
      } else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }
      target.x = posx;
      target.y = posy;
    }

    function scrollCheck() {
      animateHeader = document.body.scrollTop <= height;
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const largeHeader = document.getElementById('large-header') as HTMLElement;
      largeHeader.style.height = `${height}px`;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
    }

    function initAnimation() {
      animate();
      for (let i = 0; i < points.length; i++) {
        shiftPoint(points[i]);
      }
    }

    function animate() {
      if (animateHeader && ctx) {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          if (Math.abs(getDistance(target, p)) < 4000) {
            p.active = 0.3;
            p.circle!.active = 0.6;
          } else if (Math.abs(getDistance(target, p)) < 20000) {
            p.active = 0.1;
            p.circle!.active = 0.3;
          } else if (Math.abs(getDistance(target, p)) < 40000) {
            p.active = 0.02;
            p.circle!.active = 0.1;
          } else {
            p.active = 0;
            p.circle!.active = 0;
          }

          drawLines(p);
          p.circle!.draw(ctx!);
        }
      }
      requestAnimationFrame(animate);
    }

    function shiftPoint(p: Point) {
      gsap.to(p, {
        duration: 1 + 1 * Math.random(),
        x: p.originX - 50 + Math.random() * 100,
        y: p.originY - 50 + Math.random() * 100,
        ease: Circ.easeInOut,
        onComplete: function () {
          shiftPoint(p);
        }
      });
    }

    function drawLines(p: Point) {
      if (!p.active || !ctx) return;
      for (let i = 0; i < p.closest!.length; i++) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.closest![i].x, p.closest![i].y);
        ctx.strokeStyle = `rgba(156,217,249,${p.active})`;
        ctx.stroke();
      }
    }

    function getDistance(p1: Point, p2: Point) {
      return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }

    initHeader();
    initAnimation();
    addListeners();

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('scroll', scrollCheck);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div id="large-header" className="large-header" style={{ height: '10px' }}>
      <canvas ref={canvasRef} id="demo-canvas" width="100%" height="100%"></canvas>
    
    </div>
  );
};

export default AnimatedBackground;
