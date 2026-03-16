import React, { useState, useEffect } from 'react';

const usePerformance = (isActive) => {
  const [data, setData] = useState({
    rpm: 0,
    oilTemp: 20,
    turboPsi: 0.0,
    fuelRange: 420
  });

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        rpm: 800 + Math.random() * 40,
        oilTemp: Math.min(prev.oilTemp + 0.1, 92),
        turboPsi: Math.random() * 0.1,
        fuelRange: prev.fuelRange - 0.001
      }));
    }, 100);

    return () => {
      clearInterval(interval);
      setData(prev => ({ ...prev, rpm: 0, turboPsi: 0 }));
    };
  }, [isActive]);

  return data;
};

export default usePerformance;
