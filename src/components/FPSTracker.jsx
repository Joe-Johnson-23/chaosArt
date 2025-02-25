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
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '10px',
            borderRadius: '5px',
            zIndex: 1000
        }}>
            FPS: {fps}
        </div>
    );
} 