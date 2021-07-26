import React, { useState } from 'react';
import { useEffect } from 'react';
import './App.css';
import Mixer from './models/mixer';

const mixer = new Mixer();

function App() {
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    setInterval(() => {
      setCurrentTime(mixer.audioCtx.currentTime)
    }, 1000)
  }, [])

  return (
    <div className="App">
      <input type="file" onChange={(e) => console.log(e.target.files ? e.target.files[0].arrayBuffer().then((arrayBuffer) => mixer.addChannel(arrayBuffer)).catch((error) => console.log(error)) : null)} />
      <button onClick={() => mixer.play()}>Play</button>
      <button onClick={() => mixer.stop()}>Stop</button>
      <button onClick={() => mixer.pause()}>Pause</button>
      <div>{currentTime}</div>
    </div>
  );
}

export default App;
