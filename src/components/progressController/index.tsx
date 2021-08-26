import { observer } from "mobx-react";
import React from "react";
import { useEffect } from "react";
import { useRef, useState } from "react";
import Mixer from "../../models/mixer";
import { WaveformStore } from "../../stores";
import { toMMSS } from "../../utils";
import * as S from "./styles";
import Waveform from "./waveform";

interface ProgressControllerProps {
  mixer: Mixer;
}

const ProgressController: React.FC<ProgressControllerProps> = observer((props) => {
  const mixerRef = useRef(props.mixer);
  const mixer = mixerRef.current;
  const animationRef = useRef<number>(0);
  const isSeeking = useRef(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pointerPosition, setPointerPosition] = useState<number>(0);
  const [isPointing, setIsPointing] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const resetProgress = () => {
    setProgress(0);
    setCurrentTime(0);
  };

  useEffect(() => {
    mixer.onEnded = resetProgress;
  }, [mixer]);

  useEffect(() => {
    if (!mixer.channelsLoaded) {
      resetProgress();
    }
  }, [mixer.channelsLoaded]);

  useEffect(() => {
    const updateProgress = () => {
      if (!mixer.isPlaying) {
        cancelAnimationFrame(animationRef.current);
        return;
      }

      if (mixer.isPlaying && !isSeeking.current) {
        const currentDuration = mixer.getCurrentDuration();
        setCurrentTime(currentDuration);
        setProgress((currentDuration / mixer.duration) * 100);
      }
      animationRef.current = requestAnimationFrame(updateProgress);
    };

    animationRef.current = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animationRef.current);
  }, [mixer, mixer.isPlaying]);

  const getPointerPosition = (e: MouseEvent, toPercent: boolean = false) => {
    if (!progressBarRef.current) {
      return 0;
    }
    const progressBarRect = progressBarRef.current.getBoundingClientRect();
    const positionX =
      Math.min(Math.max(e.clientX, progressBarRect.left), progressBarRect.left + progressBarRect.width) -
      progressBarRect.left;

    return toPercent ? positionX / progressBarRect.width : positionX;
  };

  const handleMixerStop = (e: React.MouseEvent) => {
    mixer.stop();
    setCurrentTime(0);
    setProgress(0);
  };

  const handleProgressBarMouseDown = (e: any) => {
    isSeeking.current = true;
    window.addEventListener("mousemove", handleProgressBarMouseMove);
    window.addEventListener("mouseup", handleProgressBarMouseUp);
  };

  const handleProgressBarMouseMove = (e: any) => {
    if (!progressBarRef.current) {
      return;
    }
    const positionX = getPointerPosition(e);
    setPointerPosition(positionX);
    if (isSeeking.current && mixer.channelsLoaded) {
      const positionXPercent = getPointerPosition(e, true);
      setProgress(positionXPercent * 100);
      const newCurrentTime = positionXPercent * mixer.duration;
      setCurrentTime(newCurrentTime);
    }
  };

  const handleProgressBarMouseUp = (e: any) => {
    if (!progressBarRef.current || !mixer.channelsLoaded) {
      return;
    }

    const positionXPercent = getPointerPosition(e, true);
    const relativeDuration = positionXPercent * mixer.duration;
    setProgress(positionXPercent * 100);
    setCurrentTime(mixer.duration * positionXPercent);
    mixer.seek(relativeDuration);
    window.removeEventListener("mousemove", handleProgressBarMouseMove);
    window.removeEventListener("mouseup", handleProgressBarMouseUp);
    isSeeking.current = false;
  };

  const handleProgressBarMouseEnter = (e: React.MouseEvent) => {
    setIsPointing(true);
  };

  const handleProgressBarMouseLeave = (e: React.MouseEvent) => {
    setIsPointing(false);
  };

  return (
    <S.MixerControllerContainer>
      <S.MixerPlayButton
        playing={mixer.isPlaying}
        onClick={() => {
          if (mixer.channelsLoaded) {
            mixer.playToggle();
          }
        }}
      />
      <S.MixerStopButton onClick={handleMixerStop} />
      <S.MixerProgressBarContainer>
        <S.MixerProgressBar
          ref={progressBarRef}
          onMouseMove={handleProgressBarMouseMove}
          onMouseDown={handleProgressBarMouseDown}
          onMouseUp={handleProgressBarMouseUp}
          onMouseEnter={handleProgressBarMouseEnter}
          onMouseLeave={handleProgressBarMouseLeave}
        >
          <S.MixerProgressBarGuide>
            <Waveform width={650} height={40} data={WaveformStore.waveform} />
            <S.MixerProgressIndicator progress={progress}>
              <S.MixerProgressPointer position={isPointing ? `${pointerPosition}px` : "100%"} />
            </S.MixerProgressIndicator>
          </S.MixerProgressBarGuide>
        </S.MixerProgressBar>
        <S.CurrentTimeDisplay>
          <S.TimeText>{toMMSS(currentTime)}</S.TimeText>
          <S.Splitter />
          <S.TimeText>{toMMSS(mixer.duration ? mixer.duration : 0)}</S.TimeText>
        </S.CurrentTimeDisplay>
      </S.MixerProgressBarContainer>
    </S.MixerControllerContainer>
  );
});

export default ProgressController;
