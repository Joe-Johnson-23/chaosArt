import React, { useEffect, useRef } from 'react';

function StarryBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Initial black background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        // Set canvas dimensions to match window size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Configuration options - adjust these to change the effect
        const config = {
            numStars: 100,           // Number of stars
            connectionDistance: 150,  // Maximum distance for connecting lines
            starSpeed: 0.5,          // Speed of star movement
            starSizeMin: 1,          // Minimum star radius
            starSizeMax: 3,          // Maximum star radius
            glowSize: 12,            // Size multiplier for the star's glow effect
            trailOpacity: 0.1,       // Opacity of the trail effect (0-1)
            connectionOpacity: 0.5,   // Maximum opacity of connection lines
            connectionWidth: 0.8,     // Width of connection lines
            colors: {                 // Star colors
                blue: 'rgba(135, 206, 235, opacity)',  // Light blue
                red: 'rgba(255, 182, 193, opacity)'    // Light red
            }
        };

        // Create stars array
        const stars = [];
        for (let i = 0; i < config.numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * (config.starSizeMax - config.starSizeMin) + config.starSizeMin,
                vx: (Math.random() - 0.5) * config.starSpeed,
                vy: (Math.random() - 0.5) * config.starSpeed,
                // Randomly choose between blue and red with random opacity between 0.5 and 1
                color: Math.random() > 0.5 ? 
                    config.colors.blue.replace('opacity', Math.random() * 0.5 + 0.5) : 
                    config.colors.red.replace('opacity', Math.random() * 0.5 + 0.5)
            });
        }

        function animate() {
            // Trail effect - higher opacity = less trail
            ctx.fillStyle = `rgba(0, 0, 0, ${config.trailOpacity})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update and draw each star
            stars.forEach(star => {
                // Update position
                star.x += star.vx;
                star.y += star.vy;

                // Bounce off edges
                if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
                if (star.y < 0 || star.y > canvas.height) star.vy *= -1;

                // Draw the star core
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
                ctx.fillStyle = star.color;
                ctx.fill();

                // Draw the star's glow effect
                const gradient = ctx.createRadialGradient(
                    star.x, star.y, 0,
                    star.x, star.y, star.radius * config.glowSize
                );
                gradient.addColorStop(0, star.color);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius * config.glowSize, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw connections between nearby stars
            stars.forEach((star, i) => {
                stars.slice(i + 1).forEach(otherStar => {
                    const dx = star.x - otherStar.x;
                    const dy = star.y - otherStar.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < config.connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(star.x, star.y);
                        ctx.lineTo(otherStar.x, otherStar.y);
                        // Opacity decreases with distance
                        ctx.strokeStyle = `rgba(255, 255, 255, ${
                            config.connectionOpacity - distance/config.connectionDistance * config.connectionOpacity
                        })`;
                        ctx.lineWidth = config.connectionWidth;
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animate);
        }

        animate();

        // Handle window resizing
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
            pointerEvents: 'none'  // Makes the canvas non-interactive
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