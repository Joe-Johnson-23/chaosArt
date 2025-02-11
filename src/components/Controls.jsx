import React from 'react';

function Controls({ 
  onPause, 
  onRestart, 
  onAngleChange,
  onAddPendulum,
  onDeletePendulum,
  onVerticalPositionChange,
  onToggleTrailEffect,
  onToggleDirectionalGravity,
  isPaused,
  verticalPosition,
  hasTrailEffect,
  hasDirectionalGravity,
  onLengthChange,
  currentLength,
  onToggleVacuum,
  isVacuum,
  onGravityStrengthChange,
  gravityStrength,
  onClear,
  theta1,
  theta2,
  pendulumAngles
}) {
  // Helper function to format angle with fixed width
  const formatAngle = (radians) => {
    // Normalize angle to 0-2π range
    const normalized = ((radians % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const degrees = (normalized * 180 / Math.PI).toFixed(1);
    const rads = normalized.toFixed(3);
    // Pad with spaces to maintain fixed width
    return `${degrees.padStart(6, ' ')}° (${rads.padStart(5, ' ')} rad)`;
  };

  const CircularSlider = ({ value, onChange, color, size = 80 }) => {
    const center = size / 2;
    const radius = (size / 2) - 10;
    
    // Convert value to coordinates on circle
    const getPointFromAngle = (angle) => {
      return {
        x: center + radius * Math.sin(angle),
        y: center - radius * Math.cos(angle)
      };
    };

    // Convert mouse position to angle
    const handleMouseMove = (event) => {
      if (event.buttons !== 1) return; // Only run while primary mouse button is pressed
      
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left - center;
      const y = event.clientY - rect.top - center;
      const angle = Math.atan2(x, -y);
      const normalizedAngle = (angle + 2 * Math.PI) % (2 * Math.PI);
      onChange(normalizedAngle);
    };

    const point = getPointFromAngle(value);

    return (
      <svg 
        width={size} 
        height={size}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseMove}
        style={{ cursor: 'pointer' }}
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
        />
        
        {/* Arc showing current angle */}
        <path
          d={`
            M ${center} ${center}
            L ${center} ${center - radius}
            A ${radius} ${radius} 0 ${value > Math.PI ? 1 : 0} 1 ${point.x} ${point.y}
            L ${center} ${center}
          `}
          fill={color}
          fillOpacity="0.3"
        />
        
        {/* Line showing current angle */}
        <line
          x1={center}
          y1={center}
          x2={point.x}
          y2={point.y}
          stroke={color}
          strokeWidth="2"
        />
        
        {/* Handle */}
        <circle
          cx={point.x}
          cy={point.y}
          r="6"
          fill={color}
        />
      </svg>
    );
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      background: 'rgba(0, 0, 0, 0.7)',
      padding: '20px',
      borderRadius: '8px',
      maxHeight: '95vh',
      overflowY: 'auto'
    }}>
      {/* First row of buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          style={{ 
            width: '80px',
            minWidth: '80px',
            padding: '0.6em 0',  // Reduce horizontal padding
            textAlign: 'center', // Ensure text is centered
            overflow: 'hidden',  // Prevent text overflow
            whiteSpace: 'nowrap' // Prevent text wrapping
          }} 
          onClick={onPause}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button 
          style={{ 
            width: '80px',
            minWidth: '80px',
            padding: '0.6em 0',  // Reduce horizontal padding
            textAlign: 'center', // Ensure text is centered
            overflow: 'hidden',  // Prevent text overflow
            whiteSpace: 'nowrap' // Prevent text wrapping
          }} 
          onClick={onRestart}
        >
          Restart
        </button>
        <button 
          style={{
            width: '80px',
            minWidth: '80px',
            padding: '0.6em 0',  // Reduce horizontal padding
            textAlign: 'center', // Ensure text is centered
            overflow: 'hidden',  // Prevent text overflow
            whiteSpace: 'nowrap', // Prevent text wrapping
            backgroundColor: '#ff9800'
          }}
          onClick={onClear}
        >
          Clear
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label style={{ color: 'white' }}>Pendulum Length</label>
        <input 
          type="range" 
          min="0.05" 
          max="0.3" 
          step="0.01"
          value={currentLength}
          onChange={(e) => onLengthChange(parseFloat(e.target.value))}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label style={{ color: 'white' }}>Vertical Position</label>
        <input 
          type="range" 
          min="0.1" 
          max="0.8" 
          step="0.1"
          value={verticalPosition}
          onChange={(e) => onVerticalPositionChange(parseFloat(e.target.value))}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', borderTop: '1px solid #666', paddingTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ color: '#0000ff' }}>Blue Pendulum - Theta 1</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CircularSlider
                value={pendulumAngles[0].t1 || 0}
                onChange={(value) => onAngleChange('theta1', value, 0)}
                color="#0000ff"
              />
              <div style={{ 
                color: '#0000ff', 
                minWidth: '160px',
                backgroundColor: 'rgba(0,0,0,0.3)',
                padding: '2px 5px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                textAlign: 'right'
              }}>
                {formatAngle(pendulumAngles[0].t1 || 0)}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ color: '#0000ff' }}>Blue Pendulum - Theta 2</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CircularSlider
                value={pendulumAngles[0].t2 || 0}
                onChange={(value) => onAngleChange('theta2', value, 0)}
                color="#0000ff"
              />
              <div style={{ 
                color: '#0000ff', 
                minWidth: '160px',
                backgroundColor: 'rgba(0,0,0,0.3)',
                padding: '2px 5px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                textAlign: 'right'
              }}>
                {formatAngle(pendulumAngles[0].t2 || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', borderTop: '1px solid #666', paddingTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ color: '#ff0000' }}>Red Pendulum - Theta 1</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CircularSlider
                value={pendulumAngles[1].t1 || 0}
                onChange={(value) => onAngleChange('theta1', value, 1)}
                color="#ff0000"
              />
              <div style={{ 
                color: '#ff0000', 
                minWidth: '160px',
                backgroundColor: 'rgba(0,0,0,0.3)',
                padding: '2px 5px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                textAlign: 'right'
              }}>
                {formatAngle(pendulumAngles[1].t1 || 0)}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ color: '#ff0000' }}>Red Pendulum - Theta 2</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CircularSlider
                value={pendulumAngles[1].t2 || 0}
                onChange={(value) => onAngleChange('theta2', value, 1)}
                color="#ff0000"
              />
              <div style={{ 
                color: '#ff0000', 
                minWidth: '160px',
                backgroundColor: 'rgba(0,0,0,0.3)',
                padding: '2px 5px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                textAlign: 'right'
              }}>
                {formatAngle(pendulumAngles[1].t2 || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vacuum/Gravity buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={onToggleVacuum}
          style={{
            backgroundColor: isVacuum ? '#4CAF50' : '#f44336',
            flex: 1,
            minWidth: '80px'
          }}
        >
          Vacuum
        </button>
        <button 
          onClick={onToggleVacuum}
          style={{
            backgroundColor: !isVacuum ? '#4CAF50' : '#f44336',
            flex: 1,
            minWidth: '80px'
          }}
        >
          Gravity
        </button>
      </div>

      {/* Gravity strength slider */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label style={{ color: 'white' }}>Gravity Strength</label>
        <input 
          type="range" 
          min="0.1" 
          max="3" 
          step="0.1"
          value={gravityStrength}
          onChange={(e) => onGravityStrengthChange(parseFloat(e.target.value))}
          disabled={isVacuum}
          style={{ opacity: isVacuum ? 0.5 : 1 }}
        />
      </div>

      <button 
        onClick={onToggleDirectionalGravity}
        style={{
          backgroundColor: hasDirectionalGravity ? '#4CAF50' : '#f44336',
          opacity: isVacuum ? 0.5 : 1,
          cursor: isVacuum ? 'not-allowed' : 'pointer',
          minWidth: '120px',
          padding: '0.6em 0',
          textAlign: 'center',
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        }}
        disabled={isVacuum}
      >
        {hasDirectionalGravity ? 'Freefall' : 'Freefall'}
      </button>

      {/* Bottom row of buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '10px',
        marginTop: 'auto',  // Push to bottom
        borderTop: '1px solid #666',
        paddingTop: '10px'
      }}>
        <button 
          style={{ flex: 1, minWidth: '80px', padding: '0.6em 0', textAlign: 'center' }}
          onClick={onAddPendulum}
        >
          Add
        </button>
        <button 
          style={{ flex: 1, minWidth: '80px', padding: '0.6em 0', textAlign: 'center' }}
          onClick={onDeletePendulum}
        >
          Delete
        </button>
        <button 
          style={{
            flex: 1,
            minWidth: '80px',
            padding: '0.6em 0',
            textAlign: 'center',
            backgroundColor: hasTrailEffect ? '#4CAF50' : '#f44336'
          }}
          onClick={onToggleTrailEffect}
        >
          Prism
        </button>
      </div>
    </div>
  );
}

export default Controls; 