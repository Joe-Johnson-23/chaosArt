import React, { useEffect, useRef } from 'react';

function StarryBackground() {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const explosionsRef = useRef([]); // Store explosions
    const timeRef = useRef(0); // Track time for color cycling

    // Configuration could be moved to a separate file
    const CONFIG = {
        stars: {
            count: 100,
            speedRange: { min: -0.5, max: 0.5 },
            sizeRange: { min: 1, max: 3 },
            colors: {
                red: 'rgba(255, 50, 50, 1.0)',      // M-type (red dwarfs)
                orange: 'rgba(255, 140, 0, 1.0)',   // K-type
                yellow: 'rgba(255, 255, 0, 1.0)',  // G-type (like our Sun)
                blue: 'rgba(100, 150, 255, 1.0)'     // O/B/A types combined
            },
            colorProbability: {
                red: 0.76,    // 76% red dwarfs
                orange: 0.12,  // 12% orange stars
                yellow: 0.076, // 7.6% yellow stars
                blue: 0.044    // 4.4% blue stars
            }
        },
        glow: {
            baseSize: 5,
            hoverSize: 24,
            maxSize: 40,
            growthRate: 0.8,
            shrinkRate: 0.1
        },
        mouse: {
            influenceDistance: 50
        },
        connections: {
            maxDistance: 150,
            opacity: 0.5,
            width: 0.8
        },
        interactivity: {
            clickEffect: true,      // Create explosion effect on click
            hoverFreeze: true,      // Freeze stars when hovering
            colorCycle: true,        // Cycle through colors over time
            pulseEffect: true,       // Stars pulse periodically
            colorCycleSpeed: 0.1
        },
        performance: {
            targetFPS: 60,  // Adjust this to control frame rate
            useFrameSkipping: true
        },
        explosion: {
            maxRadius: 100,
            speed: 5,
            duration: 1000 // ms
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Star creation with exact colors
        const stars = [];
        for (let i = 0; i < CONFIG.stars.count; i++) {
            let hue;
            const rand = Math.random();
            
            if (rand < CONFIG.stars.colorProbability.red) {        // 76% Red dwarfs
                hue = 0;                                          // Pure red
            } else if (rand < CONFIG.stars.colorProbability.red + CONFIG.stars.colorProbability.orange) {  // 12% Orange
                hue = 30;                                         // Orange
            } else if (rand < CONFIG.stars.colorProbability.red + CONFIG.stars.colorProbability.orange + CONFIG.stars.colorProbability.yellow) {  // 7.6% Yellow
                hue = 60;                                         // Yellow
            } else {                                              // 4.4% Blue
                hue = 240;                                        // Blue
            }

            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * (CONFIG.stars.sizeRange.max - CONFIG.stars.sizeRange.min) + CONFIG.stars.sizeRange.min,
                vx: (Math.random() - 0.5) * CONFIG.stars.speedRange.max,
                vy: (Math.random() - 0.5) * CONFIG.stars.speedRange.max,
                hue: hue,
                currentGlowSize: CONFIG.glow.baseSize,
                targetGlowSize: CONFIG.glow.baseSize,
                color: `hsl(${hue}, 100%, 50%)`
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

        function updateStarColor(star) {
            if (CONFIG.interactivity.colorCycle) {
                star.hue = (star.hue + CONFIG.interactivity.colorCycleSpeed) % 360;
                return `hsl(${star.hue}, 100%, 50%)`;
            }
            return star.color;
        }

        function animate() {
            timeRef.current++;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            stars.forEach(star => {
                star.x += star.vx;
                star.y += star.vy;

                if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
                if (star.y < 0 || star.y > canvas.height) star.vy *= -1;

                const dx = star.x - mouseRef.current.x;
                const dy = star.y - mouseRef.current.y;
                const distanceToMouse = Math.sqrt(dx * dx + dy * dy);

                if (distanceToMouse < CONFIG.mouse.influenceDistance) {
                    star.targetGlowSize = Math.min(
                        star.targetGlowSize + CONFIG.glow.growthRate,
                        CONFIG.glow.maxSize
                    );
                } else {
                    star.targetGlowSize = CONFIG.glow.baseSize;
                }

                if (star.currentGlowSize < star.targetGlowSize) {
                    star.currentGlowSize += CONFIG.glow.growthRate;
                } else if (star.currentGlowSize > star.targetGlowSize) {
                    star.currentGlowSize -= CONFIG.glow.shrinkRate;
                }

                const starColor = updateStarColor(star);

                // Draw star
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
                ctx.fillStyle = starColor;
                ctx.fill();

                // Draw glow
                const gradient = ctx.createRadialGradient(
                    star.x, star.y, 0,
                    star.x, star.y, star.radius * star.currentGlowSize
                );
                gradient.addColorStop(0, starColor);
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

                    if (distance < CONFIG.connections.maxDistance) {
                        ctx.beginPath();
                        ctx.moveTo(star.x, star.y);
                        ctx.lineTo(otherStar.x, otherStar.y);
                        // Opacity decreases with distance
                        ctx.strokeStyle = `rgba(255, 255, 255, ${
                            CONFIG.connections.opacity - distance/CONFIG.connections.maxDistance * CONFIG.connections.opacity
                        })`;
                        ctx.lineWidth = CONFIG.connections.width;
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
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
            
            // Adjust star count based on screen size
            const area = canvas.width * canvas.height;
            CONFIG.stars.count = Math.floor(area / 20000);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    function drawExplosions(ctx) {
        explosionsRef.current = explosionsRef.current.filter(explosion => {
            const elapsed = Date.now() - explosion.startTime;
            if (elapsed > CONFIG.explosion.duration) return false;

            const progress = elapsed / CONFIG.explosion.duration;
            explosion.radius = explosion.maxRadius * progress;
            const opacity = 1 - progress;

            ctx.beginPath();
            ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 2;
            ctx.stroke();

            return true;
        });
    }

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