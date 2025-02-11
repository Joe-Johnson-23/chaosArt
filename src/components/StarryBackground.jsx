import React, { useEffect, useRef } from 'react';

function StarryBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Force the canvas to be black initially
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        // Set canvas size in pixels (not CSS pixels)
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const stars = [];
        const numStars = 100;
        const connectionDistance = 150;

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                color: Math.random() > 0.5 ? 
                    `rgba(135, 206, 235, ${Math.random() * 0.5 + 0.5})` : 
                    `rgba(255, 182, 193, ${Math.random() * 0.5 + 0.5})`
            });
        }

        function animate() {
            // Use a more opaque background for the trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            stars.forEach(star => {
                star.x += star.vx;
                star.y += star.vy;

                if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
                if (star.y < 0 || star.y > canvas.height) star.vy *= -1;

                // Make stars more visible
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
                ctx.fillStyle = star.color;
                ctx.fill();

                // Increase glow effect
                const gradient = ctx.createRadialGradient(
                    star.x, star.y, 0,
                    star.x, star.y, star.radius * 12
                );
                gradient.addColorStop(0, star.color);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius * 12, 0, Math.PI * 2);
                ctx.fill();
            });

            // Make connections more visible
            stars.forEach((star, i) => {
                stars.slice(i + 1).forEach(otherStar => {
                    const dx = star.x - otherStar.x;
                    const dy = star.y - otherStar.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(star.x, star.y);
                        ctx.lineTo(otherStar.x, otherStar.y);
                        // Brighter connections
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 - distance/connectionDistance * 0.5})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animate);
        }

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 0,
            pointerEvents: 'none'
        }}>
            <canvas 
                ref={canvasRef} 
                style={{
                    display: 'block',
                    width: '100%',
                    height: '100%'
                }}
            />
        </div>
    );
}

export default StarryBackground; 