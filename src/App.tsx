import React, { useState } from 'react';
import { useEffect } from 'react';
import './App.css';
import Mixer from './models/mixer';

const mixer = new Mixer();

function App() {
  const [currentTime, setCurrentTime] = useState(0)
  const [progress, setProgress] = useState(0)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(mixer.audioCtx.currentTime)
      if (mixer.duration === 0) {
        setProgress(0)
      } else {
        if (mixer.isPlaying) {
          setProgress(mixer.currentDuration / mixer.duration * 100)
        }
      } 
    }, 10)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="App">
      <input type="file" onChange={(e) => e.target.files ? mixer.addChannel(
        {
          title: e.target.files[0]?.name,
          src: e.target.files[0]
        }) : null
      } />
      <button onClick={() => mixer.play(offset)}>Play</button>
      <button onClick={() => { mixer.stop(); setCurrentTime(0); setOffset(0); setProgress(0)}}>Stop</button>
      <button onClick={() => mixer.pause()}>Pause</button>
      <button onClick={() => mixer.seek(15)}>Seek to 15</button>
      <button onClick={() => mixer.seek(100)}>Seek to 100</button>
      <button onClick={() => mixer.seek(1000)}>Seek to 1000</button>
      <div>{currentTime}</div>

      {mixer.channels.map((value) => {
        return (
          <div key={value.channelIndex}>
            channel {value.channelIndex}: { value.title} loaded: {value.loaded ? 'true' : 'false'}
            <button onClick={() => mixer.gainController.mute(value.channelIndex)}>Mute</button>
            <button onClick={() => mixer.gainController.unMute(value.channelIndex)}>unMute</button>
            <button onClick={() => mixer.gainController.solo(value.channelIndex)}>Solo</button>
            <button onClick={() => mixer.gainController.unSolo(value.channelIndex)}>unSolo</button>
          </div>
        )
      })}
      <div>{mixer.duration}</div>
      

      <div
        style={{ width: 500, height: 30, backgroundColor: 'red', margin: '0 auto' }}
        onClick={(e) => {
          const offsetX = e.nativeEvent.offsetX;
          const relativeDuration = offsetX / 500 * mixer.duration;
          console.log(relativeDuration, progress)
          setOffset(relativeDuration)
          setProgress(relativeDuration / mixer.duration * 100)
          mixer.seek(relativeDuration)
        }}
      >
        <div style={{ width: `${progress}%` , height: 30, backgroundColor: 'blue', pointerEvents: 'none'}} />
      </div>

      <div>{progress} %</div>
      <div>{mixer.currentDuration}</div>
      <div>{mixer.gainController.mutedControllers.map((value) => value.index).join(', ')}</div>
      <div>solo count : { mixer.gainController.soloCount}</div>

    </div>
  );
}

export default App;
