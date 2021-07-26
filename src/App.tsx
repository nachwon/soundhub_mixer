import React, { useState } from 'react';
import { useEffect } from 'react';
import './App.css';
import Mixer from './models/mixer';

const mixer = new Mixer();

function App() {
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(mixer.audioCtx.currentTime)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="App">
      <input type="file" onChange={(e) => e.target.files ? mixer.addChannel(
        {
          title: e.target.files[0].name,
          src: e.target.files[0]
        }) : null
      } />
      <button onClick={() => mixer.play()}>Play</button>
      <button onClick={() => mixer.stop()}>Stop</button>
      <button onClick={() => mixer.pause()}>Pause</button>
      <button onClick={() => mixer.seek(15)}>Seek to 15</button>
      <button onClick={() => mixer.seek(100)}>Seek to 100</button>
      <button onClick={() => mixer.seek(1000)}>Seek to 1000</button>
      <div>{currentTime}</div>

      {mixer.channels.map((value) => {
        return (
          <div key={value.channelIndex}>channel {value.channelIndex} loaded: {value.loaded ? 'true' : 'false'}</div>
        )
      })}
      <div>{mixer.duration}</div>
    </div>
  );
}

export default App;
