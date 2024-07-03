import React from 'react';

interface ToggleSwitchProps {
  hideTimer: boolean;
  toggleTimer: (value: boolean) => void;
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'inline-block',
    cursor: 'pointer',
    userSelect: 'none' as 'none',
  },
  switch: {
    width: '50px',
    height: '25px',
    borderRadius: '25px',
    backgroundColor: '#EEEEEE',
    display: 'flex',
    alignItems: 'center',
    padding: '3px',
    boxSizing: 'border-box',
    transition: 'background-color 0.3s',
  },
  switchOn: {
    backgroundColor: '#F2CD88',
  },
  switchOff: {
    backgroundColor: '#BFBFBF',
  },
  circle: {
    width: '19px',
    height: '19px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    transition: 'transform 0.3s',
  },
  circleOn: {
    transform: 'translateX(25px)',
  },
  circleOff: {
    transform: 'translateX(0px)',
  },
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ hideTimer, toggleTimer }) => {
  const handleToggle = () => {
    toggleTimer(!hideTimer);
  };

  return (
    <div className='mt-6' style={styles.container} onClick={handleToggle}>
      <div style={{ ...styles.switch, ...(hideTimer ? styles.switchOn : styles.switchOff) }}>
        <div style={{ ...styles.circle, ...(hideTimer ? styles.circleOn : styles.circleOff) }} />
      </div>
    </div>
  );
};

export default ToggleSwitch;
