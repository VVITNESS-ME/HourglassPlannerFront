// components/Hourglass.tsx
'use client';

import React from 'react';
import Image from 'next/image';

const Hourglasss: React.FC = () => {
  return (
    <div className="flex justify-center">
      <Image src="/logo_binary_crop.png" alt="Hourglasss" width={300} height={400} />
    </div>
  );
};

export default Hourglasss;
