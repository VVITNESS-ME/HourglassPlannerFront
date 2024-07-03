'use client';

import { useHourglassStore } from '../../../store/hourglassStore';
import Image from "next/image"
import './cascade.css';

  const styles = {
    container: {
      width: '300px',
      clipPath: 'polygon(100% 100%, 0 100%, 100% 0, 0 0)',

      backgroundColor: '#eeeeee',
      height: '400px',
      position: 'relative' as 'relative',
    },
    loadingBar: {
      width: '100%',
      backgroundColor: '#F2CD88',
      position: 'absolute' as 'absolute',
      bottom: 0,
      transition: 'height 2s',
    },
    loadingBarR: {
      width: '100%',
      backgroundColor: '#F2CD88',
      position: 'absolute' as 'absolute',
      bottom: 0,
      transition: 'height 2s',
    },
    mask: {
      width: '100%',
      height: '100%',
      clipPath: 'polygon(100% 100%, 0 100%, 100% 0, 0 0)',
      position: 'absolute' as 'absolute',
      backgroungColor: 'transparent'
    },
    maskR: {
      width: '100%',
      height: '100%',
      clipPath: 'polygon(0 0, 100% 0, 50% 50%)',
      position: 'absolute' as 'absolute',
      backgroungColor: 'transparent'
    },
  };

const HourglassAni = () => {

  const isRunning = useHourglassStore((state) => state.isRunning);
  const pause = useHourglassStore((state) => state.pause);
  const timeBurst = useHourglassStore((state) => state.timeBurst);
  const timeGoal = useHourglassStore((state) => state.timeGoal);

    return (
        <div className='mt-16'>
        {isRunning?
        <div>
          <div style={styles.container}>
            {/* <Image style={{position: "absolute"}} src="/img/logo_binary_crop.png" alt="hourglass" height={500} width={500} /> */}
            <div style={styles.maskR}>
              <div style={{...styles.loadingBar, height: (200+(1-timeBurst!/timeGoal!)*160)}}></div>
            </div>
            {(pause || (timeBurst! > (timeGoal!-1000)))?null:
              <div className='waterfall-container'>
                <div className="waterfall"></div>
                <div className="waterfall"></div>
                <div className="waterfall"></div>
                <div className="waterfall"></div>
                <div className="waterfall"></div>
              </div>}
            <div style={styles.mask}>
              <div style={{...styles.loadingBar, height: (timeBurst!/timeGoal!)*150}}></div>
            </div>
          </div>

        </div>:
        <Image src="/img/logo_binary_crop.png" alt="hourglass" height={500} width={500} />
    }
    </div>
    )
}

export default HourglassAni;