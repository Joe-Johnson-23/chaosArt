import React, { useEffect, useRef } from 'react';

function StarryBackground() {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });

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
            glowSize: 5,           // Base glow size
            glowSizeHover: 12,      // Initial hover glow size
            maxGlowSize: 40,        // Maximum glow size after hovering
            growthRate: 0.2,        // How fast the glow grows while hovering
            shrinkRate: 0.1,        // How fast the glow shrinks when not hovering
            mouseInfluenceDistance: 50,  // Reduced for more precise interaction
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
                    config.colors.red.replace('opacity', Math.random() * 0.5 + 0.5),
                currentGlowSize: config.glowSize, // Track current glow size
                targetGlowSize: config.glowSize    // Target glow size for smooth transitions
            });
        }

        // Updated mouse move handler
        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        function animate() {
            ctx.fillStyle = `rgba(0, 0, 0, ${config.trailOpacity})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            stars.forEach(star => {
                // Update position
                star.x += star.vx;
                star.y += star.vy;

                if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
                if (star.y < 0 || star.y > canvas.height) star.vy *= -1;

                // Calculate distance to mouse
                const dx = star.x - mouseRef.current.x;
                const dy = star.y - mouseRef.current.y;
                const distanceToMouse = Math.sqrt(dx * dx + dy * dy);

                // Update target glow size based on mouse proximity
                if (distanceToMouse < config.mouseInfluenceDistance) {
                    // Increase target size while mouse is near
                    star.targetGlowSize = Math.min(
                        star.targetGlowSize + config.growthRate,
                        config.maxGlowSize
                    );
                } else {
                    // Gradually return to base size
                    star.targetGlowSize = config.glowSize;
                }

                // Smoothly transition current glow size towards target
                if (star.currentGlowSize < star.targetGlowSize) {
                    star.currentGlowSize += config.growthRate;
                } else if (star.currentGlowSize > star.targetGlowSize) {
                    star.currentGlowSize -= config.shrinkRate;
                }

                // Draw star
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
                ctx.fillStyle = star.color;
                ctx.fill();

                // Draw glow with current size
                const gradient = ctx.createRadialGradient(
                    star.x, star.y, 0,
                    star.x, star.y, star.radius * star.currentGlowSize
                );
                gradient.addColorStop(0, star.color);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius * star.currentGlowSize, 0, Math.PI * 2);
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

        // Make sure we're adding the event listener to the canvas
        canvas.addEventListener('mousemove', handleMouseMove);

        // Handle window resizing
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 0
        }}>
            <canvas 
                ref={canvasRef} 
                style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    cursor: 'default'
                }}
            />
        </div>
    );
}

export default StarryBackground; 