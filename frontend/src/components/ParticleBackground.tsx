import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  originalX: number;
  originalY: number;
  size: number;
  opacity: number;
  baseOpacity: number;
  glowIntensity: number;
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationIdRef = useRef<number | null>(null);
  const lastMouseTimeRef = useRef(0);

  // Initialize particles
  const initializeParticles = (canvas: HTMLCanvasElement) => {
    const particleCount = Math.min(
      window.innerWidth > 1024 ? 60 : window.innerWidth > 768 ? 45 : 30,
      80
    );

    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;

      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        originalX: x,
        originalY: y,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.2,
        baseOpacity: Math.random() * 0.3 + 0.2,
        glowIntensity: Math.random() * 0.5 + 0.5,
      });
    }

    particlesRef.current = particles;
  };

  // Draw particles with glow
  const drawParticles = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach((particle) => {
      // Draw glow
      const gradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.size * 3
      );

      gradient.addColorStop(0, `rgba(100, 200, 255, ${particle.opacity * particle.glowIntensity})`);
      gradient.addColorStop(0.5, `rgba(100, 200, 255, ${particle.opacity * particle.glowIntensity * 0.5})`);
      gradient.addColorStop(1, 'rgba(100, 200, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(
        particle.x - particle.size * 3,
        particle.y - particle.size * 3,
        particle.size * 6,
        particle.size * 6
      );

      // Draw core particle
      ctx.fillStyle = `rgba(100, 200, 255, ${particle.opacity})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  // Update particle positions
  const updateParticles = (canvas: HTMLCanvasElement) => {
    const mouseX = mouseRef.current.x;
    const mouseY = mouseRef.current.y;
    const interactionRadius = 150;
    const returnSpeed = 0.02;
    const maxVelocity = 2;

    particlesRef.current.forEach((particle) => {
      // Calculate distance from mouse
      const dx = particle.x - mouseX;
      const dy = particle.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Cursor interaction (repel)
      if (distance < interactionRadius) {
        const angle = Math.atan2(dy, dx);
        const force = (1 - distance / interactionRadius) * 0.3;

        particle.vx += Math.cos(angle) * force;
        particle.vy += Math.sin(angle) * force;

        // Increase glow on interaction
        particle.glowIntensity = Math.min(particle.glowIntensity + 0.05, 1.5);
      } else {
        // Return to original position slowly
        const returnDx = particle.originalX - particle.x;
        const returnDy = particle.originalY - particle.y;

        particle.vx += returnDx * returnSpeed;
        particle.vy += returnDy * returnSpeed;

        // Decrease glow back to normal
        particle.glowIntensity = Math.max(particle.glowIntensity - 0.02, 0.5);
      }

      // Limit velocity
      const speed = Math.sqrt(particle.vx ** 2 + particle.vy ** 2);
      if (speed > maxVelocity) {
        particle.vx = (particle.vx / speed) * maxVelocity;
        particle.vy = (particle.vy / speed) * maxVelocity;
      }

      // Apply damping
      particle.vx *= 0.98;
      particle.vy *= 0.98;

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Boundary wrapping
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      // Subtle idle floating motion
      const time = Date.now() * 0.0005;
      particle.x += Math.sin(time + particle.originalX) * 0.1;
      particle.y += Math.cos(time + particle.originalY) * 0.1;
    });
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    updateParticles(canvas);
    drawParticles(ctx, canvas);

    animationIdRef.current = requestAnimationFrame(animate);
  };

  // Handle mouse move with throttling
  const handleMouseMove = (e: MouseEvent) => {
    const now = Date.now();

    // Throttle to ~60fps
    if (now - lastMouseTimeRef.current < 16) return;
    lastMouseTimeRef.current = now;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Handle window resize
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    initializeParticles(canvas);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize particles
    initializeParticles(canvas);

    // Start animation
    animate();

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        background: '#000000',
      }}
    />
  );
};

export default ParticleBackground;
