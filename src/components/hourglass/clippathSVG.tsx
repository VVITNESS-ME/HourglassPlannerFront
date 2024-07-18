import React from "react";

interface SvgProps {
    wd: number;
}

const ClippathSVG: React.FC<SvgProps> = ({ wd }) => {
    return(
    <svg width={wd} height={wd*8/5} viewBox="0 0 250 400">
        <path d = 'M0,0 C 0 180, 105 150, 105 200 C 105 250, 0 220, 0 400 H250 C 250 220, 140 250, 140 200 C 140 150, 250 180, 250 0z'
        style={{fill: 'none', stroke: 'black', strokeWidth: '6', strokeLinecap: 'round'}} />
    </svg>
    )
};

export default ClippathSVG;