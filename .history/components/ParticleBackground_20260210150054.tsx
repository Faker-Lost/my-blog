'use client';

import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 60; // 粒子数量
    const connectionDistance = 150; // 连线距离
    const mouseDistance = 200; // 鼠标互动距离

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 鼠标位置
    const mouse = { x: -1000, y: -1000 };

    // 监听鼠标移动
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    // 监听窗口大小变化
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    // 粒子类
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5; // 速度
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // 边界反弹
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // 鼠标互动（避让或吸引）
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseDistance) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouseDistance - distance) / mouseDistance;

          // 稍微被鼠标吸引
          const attractionStrength = 0.05;
          this.vx += forceDirectionX * force * attractionStrength;
          this.vy += forceDirectionY * force * attractionStrength;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // 获取当前主题颜色 (通过检测 html 类名或 CSS 变量)
        // 简单起见，我们读取 CSS 变量颜色，或者硬编码适应色
        const isDark = document.documentElement.classList.contains('dark');
        ctx.fillStyle = isDark ? 'rgba(34, 211, 238, 0.5)' : 'rgba(2, 132, 199, 0.5)'; // Cyan vs Sky
        ctx.fill();
      }
    }

    // 初始化粒子
    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    // 动画循环
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');
      const lineColor = isDark ? '34, 211, 238' : '2, 132, 199';

      particles.forEach((particle, index) => {
        particle.update();
        particle.draw();

        // 绘制连线
        for (let j = index + 1; j < particles.length; j++) {
          const dx = particle.x - particles[j].x;
          const dy = particle.y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            const opacity = 1 - distance / connectionDistance;
            ctx.strokeStyle = `rgba(${lineColor}, ${opacity * 0.2})`; // 线条更淡
            ctx.lineWidth = 1;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        // 与鼠标连线
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouseDistance) {
          ctx.beginPath();
          const opacity = 1 - distance / mouseDistance;
          ctx.strokeStyle = `rgba(${lineColor}, ${opacity * 0.3})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // 启动
    canvas.width = width;
    canvas.height = height;
    initParticles();
    animate();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-60"
    />
  );
}
