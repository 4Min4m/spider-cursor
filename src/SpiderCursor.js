import React, { useEffect, useRef } from 'react';
import './SpiderCursor.css';

class SpiderLeg {
  constructor(x, y, length, segments, angle) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.segmentCount = segments;
    this.rand = Math.random();
    this.segments = this.createSegments();
  }

  createSegments() {
    const segments = [];
    const segmentLength = this.length / this.segmentCount;

    // First segment
    segments.push({
      x: this.x,
      y: this.y,
      angle: 0
    });

    // Subsequent segments
    for (let i = 1; i < this.segmentCount; i++) {
      segments.push({
        x: segments[i-1].x + segmentLength * Math.cos(0),
        y: segments[i-1].y + segmentLength * Math.sin(0),
        angle: 0
      });
    }

    return segments;
  }

  move(mouseX, mouseY) {
    const angle = Math.atan2(mouseY - this.y, mouseX - this.x);
    const distance = Math.sqrt(
      Math.pow(mouseX - this.x, 2) + 
      Math.pow(mouseY - this.y, 2)
    );

    // Update segments
    this.segments[this.segmentCount - 1].x = mouseX;
    this.segments[this.segmentCount - 1].y = mouseY;

    for (let i = this.segmentCount - 2; i >= 0; i--) {
      const dx = this.segments[i+1].x - this.segments[i].x;
      const dy = this.segments[i+1].y - this.segments[i].y;
      this.segments[i].angle = Math.atan2(dy, dx);
      
      const segmentLength = this.length / this.segmentCount;
      this.segments[i].x = this.segments[i+1].x - segmentLength * Math.cos(this.segments[i].angle);
      this.segments[i].y = this.segments[i+1].y - segmentLength * Math.sin(this.segments[i].angle);
    }
  }

  draw(ctx, mouseX, mouseY) {
    ctx.beginPath();
    ctx.moveTo(this.segments[0].x, this.segments[0].y);

    for (let i = 1; i < this.segmentCount; i++) {
      ctx.lineTo(this.segments[i].x, this.segments[i].y);
    }

    ctx.strokeStyle = `hsl(${60 * this.rand + 180}, 100%, ${60 * this.rand + 25}%)`;
    ctx.lineWidth = 2 * this.rand;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }
}

function SpiderCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Resize canvas
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Create spider legs
    const legCount = 500;
    const legs = Array.from({ length: legCount }, () => 
      new SpiderLeg(
        Math.random() * canvas.width, 
        Math.random() * canvas.height, 
        Math.random() * 250 + 50, 
        30, 
        Math.random() * 2 * Math.PI
      )
    );

    // Mouse tracking
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    canvas.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background
      ctx.fillStyle = 'rgba(30, 30, 30, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw cursor point
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 5, 0, Math.PI * 2);
      ctx.fillStyle = 'hsl(210, 100%, 80%)';
      ctx.fill();

      // Move and draw legs
      legs.forEach(leg => {
        leg.move(mouseX, mouseY);
        leg.draw(ctx, mouseX, mouseY);
      });

      requestAnimationFrame(animate);
    }

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="spider-cursor-canvas" />;
}

export default SpiderCursor;