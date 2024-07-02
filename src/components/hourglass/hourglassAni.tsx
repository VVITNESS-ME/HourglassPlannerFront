'use client';

import { useHourglassStore } from '../../../store/hourglassStore';
import Image from "next/image"
import './cascade.css';


  const styles = {
    container: {
      width: '300px',
      height: '250px',
    //   border: '1px solid #000',
      position: 'relative' as 'relative',
    },
    loadingBar: {
      width: '100%',
      backgroundColor: '#F2CD88',
      position: 'absolute' as 'absolute',
      transition: 'height 2s',
    },
    cascade: {
        width: '2%',
        backgroundColor: '#F2CD88',
        position: 'absolute' as 'absolute',
        transition: 'height 1s',
        height: '0',
        
    }
  };

const HourglassAni = () => {

  const isRunning = useHourglassStore((state) => state.isRunning);
  const pause = useHourglassStore((state) => state.pause);
  const timeBurst = useHourglassStore((state) => state.timeBurst);
  const timeGoal = useHourglassStore((state) => state.timeGoal);

    return (
        <div>
        {isRunning?
        <div>
            <div style={{...styles.container}}>
                <div style={{...styles.loadingBar, bottom:0, height: (1-timeBurst/timeGoal)*150}}></div>
            </div>
            {(pause || (timeBurst > (timeGoal-1000)))?null:<div className='waterfall-container '>
                <div className="waterfall"></div>
                <div className="waterfall"></div>
                <div className="waterfall"></div>
                <div className="waterfall"></div>
                <div className="waterfall"></div>
                </div>}
            <div style={{...styles.container}}>
                <div style={{...styles.loadingBar, bottom:0, height: (timeBurst/timeGoal)*150}}></div>
            </div>
        </div>:
        <Image src="/img/logo_binary_crop.png" alt="hourglass" height={500} width={500} />
    }
    </div>
    )
}

export default HourglassAni;