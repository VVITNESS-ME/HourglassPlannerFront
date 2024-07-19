import React from "react";

interface SvgProps {
    wd: number;
}

const OuterSVG: React.FC<SvgProps> = ({ wd }) => {
    return(
    <svg width={wd} height={wd} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="">
        <rect x="10" y="4.5" width="80" height="8" rx="4" ry="4" fill="transparent" style={{stroke: 'black', strokeWidth: '2', strokeLinecap: 'round'}}/>
        <line x1="20" y1="13" x2="20" y2="45" style={{stroke: 'black', strokeWidth: '2', strokeLinecap: 'round'}}/>
        <line x1="20" y1="55" x2="20" y2="87" style={{stroke: 'black', strokeWidth: '2', strokeLinecap: 'round'}}/>
        <line x1="80" y1="13" x2="80" y2="45" style={{stroke: 'black', strokeWidth: '2', strokeLinecap: 'round'}}/>
        <line x1="80" y1="55" x2="80" y2="87" style={{stroke: 'black', strokeWidth: '2', strokeLinecap: 'round'}}/>
        <rect x="10" y="87.5" width="80" height="8" rx="4" ry="4" fill="transparent" style={{stroke: 'black', strokeWidth: '2', strokeLinecap: 'round'}}/>
        {/* <path d = 'M0,0 C 0 180, 105 150, 105 200 C 105 250, 0 220, 0 400 H250 C 250 220, 140 250, 140 200 C 140 150, 250 180, 250 0z' /> */}
    </svg>
    )
};

export default OuterSVG;