import './App.css';
import { ContributeCard } from './components/contributeCard';
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import { useEffect, useState } from 'react';
import { ENTROPY_ARRAY_MAX_SIZE, CIRCUITS } from './constants';

const entropyArr = [];

function App() {
  const [mousePos, setMousePos] = useState({});
  const [doneCapturing, setDoneCapturing] = useState(false);
  const [entropy, setEntropy] = useState(0);
  const isMobile = window.innerWidth < 1024;

  useEffect(() => {
    const handleMouseMove = event => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!mousePos.x || entropy || isMobile) return;
    if (!doneCapturing) {
      entropyArr.push(Math.round(mousePos.x * mousePos.y));
      if (entropyArr.length >= ENTROPY_ARRAY_MAX_SIZE) setDoneCapturing(true);
    } else if (!entropy) {
      const stream = new TextEncoder().encode(entropyArr.reduce((acc, current) => acc + current));
      crypto.subtle.digest('SHA-256', stream).then(hash => {
        setEntropy(new TextDecoder().decode(hash));
      });
    }
  }, [mousePos, doneCapturing, entropy, isMobile]);

  return (
    <Grid2 container spacing={2} justifyContent="center" alignItems="center">
      <Grid2 xs={8}>
        <ContributeCard
          setEntropy={setEntropy}
          entropy={entropy}
          entropyArr={entropyArr}
          circuits={CIRCUITS}
          isMobile={isMobile}
        />
      </Grid2>
    </Grid2>
  );
}

export default App;
