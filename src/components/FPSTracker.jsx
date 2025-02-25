import React, { useState, useRef, useEffect } from 'react';

export function FPSTracker() {
    const [fps, setFps] = useState(0);
    const [maxFps, setMaxFps] = useState(0);
    const [minFps, setMinFps] = useState(Infinity);
    const frameTimesRef = useRef([]);
    const lastFrameTimeRef = useRef(performance.now());

    useEffect(() => {
        function updateFPS(timestamp) {
            const frameTime = timestamp - lastFrameTimeRef.current;
            lastFrameTimeRef.current = timestamp;
            
            // Calculate instantaneous FPS
            const instantFps = Math.round(1000 / frameTime);
            
            // Update min/max
            setMaxFps(prev => Math.max(prev, instantFps));
            setMinFps(prev => Math.min(prev, instantFps));
            
            // Calculate rolling average
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
            color: '#4dabf7',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: '12px 20px',
            borderRadius: '8px',
            zIndex: 9999,
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 0 10px rgba(77, 171, 247, 0.3)',
            border: '1px solid rgba(77, 171, 247, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
        }}>
            <div>Current FPS: {fps}</div>
            <div>Max FPS: {maxFps}</div>
            <div>Min FPS: {minFps}</div>
        </div>
    );
} 