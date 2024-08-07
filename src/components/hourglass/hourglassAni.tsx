'use client';

import { useHourglassStore } from '../../../store/hourglassStore';
import Image from "next/image";
import './cascade.css';
import ClippathSVG from './clippathSVG';
import OuterSVG from './outerSVG';

const HourglassAni = ({wd}:any) => {
  const styles = {
    container: {
      width: wd*1.02+'px',
      height: wd*1.02*1.6+'px',
      clipPath: `path("M0,0 C 0 ${wd*1.02*0.72}, ${wd*1.02*0.42} ${wd*1.02*0.6}, ${wd*1.02*0.42} ${wd*1.02*0.8} C ${wd*1.02*0.42} ${wd*1.02}, 0 ${wd*1.02*0.88}, 0 ${wd*1.02*1.6} H${wd*1.02} C ${wd*1.02} ${wd*1.02*0.88}, ${wd*1.02*0.58} ${wd*1.02}, ${wd*1.02*0.58} ${wd*1.02*0.8} C ${wd*1.02*0.58} ${wd*1.02*0.6}, ${wd*1.02} ${wd*1.02*0.72}, ${wd*1.02} 0 L 0 0")`,
      // backgroundColor: '#eeeeee',
      // position: 'relative' as 'relative',
    },
    loadingBar: {
      width: '100%',
      // backgroundColor: '#F2CD88',
      position: 'absolute' as 'absolute',
      bottom: 0,
      transition: 'height 1s',
    },
    maskR: {
      width: '100%',
      height: '100%',
      clipPath: `path("M0,0 C 0 ${wd*0.72}, ${wd*0.46} ${wd*0.6}, ${wd*0.3} ${wd*0.8} H${wd*0.7} C ${wd*0.7} ${wd*0.6}, ${wd} ${wd*0.72}, ${wd} 0 L 0 0")`,
      position: 'absolute' as 'absolute',
      backgroungColor: 'transparent'
    },
  };

  const isRunning = useHourglassStore((state) => state.isRunning);
  const pause = useHourglassStore((state) => state.pause);
  const timeBurst = useHourglassStore((state) => state.timeBurst);
  const timeGoal = useHourglassStore((state) => state.timeGoal);

  const loadingBarColor = (timeGoal:number) => {
    if (timeGoal <= 1000000) return "#F2CD88";
    else if ( 1000000 < timeGoal && timeGoal <= 2000000) return "#B4E380";
    else if ( 2000000 < timeGoal && timeGoal <= 4000000) return "#36C2CE";
    else return "#FF7777";
  }

    return (
      <div className="mt-4 mb-2 flex flex-col justify-center items-center relative" style={{width: wd*2, height: wd*2}}>
        <div className='absolute flex'><OuterSVG wd = {wd*2.20} /></div>
        <div className='absolute flex' style={styles.container}>
        {isRunning&&
          <div>
            <div style={styles.maskR}>
              <div style={{...styles.loadingBar, height: (54+(1-timeBurst!/timeGoal!)*30)+"%", backgroundColor: loadingBarColor(timeGoal!)}}></div>
            </div>
            {!pause&&
              <div className='waterfall-container' style={{backgroundColor: loadingBarColor(timeGoal!)}}>
                <div className="waterfall rounded"></div>
                <div className="waterfall rounded"></div>
                <div className="waterfall rounded"></div>
                <div className="waterfall rounded"></div>
                <div className="waterfall rounded"></div>
                <div className="waterfall rounded"></div>
                <div className="waterfall rounded"></div>
              </div>}
              <div style={{...styles.loadingBar, height: (timeBurst!/timeGoal!)*30+"%", backgroundColor: loadingBarColor(timeGoal!)}}></div>
          </div>
        }
        </div>
        <div className='absolute flex justify-center items-center' ><ClippathSVG wd={wd*1.68}/>
        </div>
      </div>
    )
}

export default HourglassAni;