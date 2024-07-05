'use client';

import React, { useState } from 'react';
import GardenCalendar from '../../../components/statistics/gardenCalendar';

const GardenCalendarTestPage: React.FC = () => {
  const [entries] = useState([
    { date: '2024-07-01', timeBurst: 400 },
    { date: '2024-07-02', timeBurst: 45 },
    { date: '2024-07-03', timeBurst: 90 },
    { date: '2024-07-04', timeBurst: 700 },
    { date: '2024-07-05', timeBurst: 150 },
  ]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
      <GardenCalendar initialEntries={entries} />
    </div>
  );
};

export default GardenCalendarTestPage;
