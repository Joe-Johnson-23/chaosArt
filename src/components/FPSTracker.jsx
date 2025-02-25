import React, { useState, useRef, useEffect } from 'react';

export function FPSTracker() {
    const [fps, setFps] = useState(0);
    const frameTimesRef = useRef([]);
    const lastFrameTimeRef = useRef(performance.now());

    useEffect(() => {
        function updateFPS(timestamp) {
            const frameTime = timestamp - lastFrameTimeRef.current;
            lastFrameTimeRef.current = timestamp;
            frameTimesRef.current.push(frameTime);
            
            if (frameTimesRef.current.length > 60) {
                frameTimesRef.current.shift();
            }
            
            const averageFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
            const currentFps = Math.round(1000 / averageFrameTime);
            setFps(currentFps);

            requestAnimationFrame(updateFPS);
        }

        const animationId = requestAnimationFrame(updateFPS);
        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            left: '20px',
            bottom: '20px',
            color: '#4dabf7',  // Bright blue color
            backgroundColor: 'rgba(0, 0, 0, 0.8)',  // More opaque background
            padding: '12px 20px',  // Larger padding
            borderRadius: '8px',
            zIndex: 9999,  // Very high z-index to ensure visibility
            fontSize: '18px',  // Larger text
            fontWeight: 'bold',
            boxShadow: '0 0 10px rgba(77, 171, 247, 0.3)',  // Glowing effect
            border: '1px solid rgba(77, 171, 247, 0.2)'  // Subtle border
        }}>
            FPS: {fps}
        </div>
    );
} 