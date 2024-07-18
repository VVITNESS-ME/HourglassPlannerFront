import React from "react";

interface SvgProps {
    wd: number;
}
/*
<svg width={wd} height={wd*8/5} viewBox="0 0 258 408" xmlns="http://www.w3.org/2000/svg" className="">
<path d = 'M4,4 C 4 184, 109 154, 109 204 C 109 254, 4 224, 4 404 H254 C 254 224, 149 254, 149 204 C 149 154, 254 184, 254 4z'
style={{fill: 'none', stroke: 'black', strokeWidth: '8', strokeLinecap: 'round'}} />
</svg>
*/
const ClippathSVG: React.FC<SvgProps> = ({ wd }) => {
    return(
    <svg width={wd} height={wd} viewBox="0 0 408 408" xmlns="http://www.w3.org/2000/svg" className="">
        <path d = 'M79,4 C 79 184, 184 154, 184 204 C 184 254, 79 224, 79 404 H329 C 329 224, 224 254, 224 204 C 224 154, 329 184, 329 4z'
        style={{fill: 'none', stroke: 'black', strokeWidth: '8', strokeLinecap: 'round'}} />
    </svg>
    )
};

export default ClippathSVG;