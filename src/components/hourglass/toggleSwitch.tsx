
import React, { useState } from 'react';
import style from 'styled-jsx/style';

const styles = {
    container: {
      display: 'inline-block',
      cursor: 'pointer',
      userSelect: 'none',
    },
    switch: {
      width: '50px',
      height: '25px',
      borderRadius: '25px',
      backgroundColor: '#ccc',
      display: 'flex',
      alignItems: 'center',
      padding: '3px',
      boxSizing: 'border-box',
      transition: 'background-color 0.3s',
    },
    switchOn: {
      backgroundColor: '#4caf50',
    },
    switchOff: {
      backgroundColor: '#ccc',
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
function ToggleSwitch(isOn:boolean) {
  isOn = useState(false);
  const handleToggle = () => {setIsOn(!isOn);}
  return (
    <div style={styles.container} onClick={handleToggle}>
      <div style={{ styles.switch, (isOn ? styles.switchOn : styles.switchOff) }}>
        <div style={{ styles.circle, (isOn ? styles.circleOn : styles.circleOff) }} />
      </div>
    </div>
  );
}

export default ToggleSwitch;