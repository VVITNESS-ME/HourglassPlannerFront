'use client';

import { useHourglassStore } from '../../../store/hourglassStore';
import Image from "next/image";
import './cascade.css';



const HourglassAni = ({wd}:any) => {
  const styles = {
    container: {
      width: wd+'px',
      height: wd*1.6+'px',
      clipPath: `path("M0,0 C 0 ${wd*0.72}, ${wd*0.42} ${wd*0.6}, ${wd*0.42} ${wd*0.8} C ${wd*0.42} ${wd}, 0 ${wd*0.88}, 0 ${wd*1.6} H${wd} C ${wd} ${wd*0.88}, ${wd*0.58} ${wd}, ${wd*0.58} ${wd*0.8} C ${wd*0.58} ${wd*0.6}, ${wd} ${wd*0.72}, ${wd} 0 L 0 0")`,
      backgroundColor: '#eeeeee',
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
      transition: 'height 0.1s',
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
      clipPath: `path("M0,0 C 0 ${wd*0.72}, ${wd*0.46} ${wd*0.6}, ${wd*0.46} ${wd*0.8} H${wd*0.54} C ${wd*0.54} ${wd*0.6}, ${wd} ${wd*0.72}, ${wd} 0 L 0 0")`,
      position: 'absolute' as 'absolute',
      backgroungColor: 'transparent'
    },
  };

  const isRunning = useHourglassStore((state) => state.isRunning);
  const pause = useHourglassStore((state) => state.pause);
  const timeBurst = useHourglassStore((state) => state.timeBurst);
  const timeGoal = useHourglassStore((state) => state.timeGoal);

    return (
      <div className='mt-4 justify-center items-center'>
        <div style={styles.container}>
        {isRunning&&
          <div>
            <div style={styles.maskR}>
              <div style={{...styles.loadingBar, height: (54+(1-timeBurst!/timeGoal!)*30)+"%"}}></div>
            </div>
            {/* {(pause || (timeBurst! > (timeGoal!-1000)))?null: */
              !pause&&
              <div className='waterfall-container'>
                <div className="waterfall"></div>
                <div className="waterfall"></div>
                <div className="waterfall"></div>
                <div className="waterfall"></div>
                <div className="waterfall"></div>
              </div>}
              <div style={{...styles.loadingBar, height: (timeBurst!/timeGoal!)*30+"%"}}></div>
          </div>
        }
        </div>
      </div>
    )
}

export default HourglassAni;