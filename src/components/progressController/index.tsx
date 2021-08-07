import { useEffect } from "react";
import { useRef, useState } from "react";
import Mixer from "../../models/mixer";
import { toMMSS } from "../../utils";
import * as S from "./styles";

interface ProgressControllerProps {
  mixer: Mixer;
}

const ProgressController: React.FC<ProgressControllerProps> = (props) => {
  const mixer = props.mixer;
  const isSeeking = useRef(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pointerPosition, setPointerPosition] = useState<number>(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mixer.duration === 0) {
      setProgress(0);
    } else {
      if (mixer.isPlaying) {
        if (!isSeeking.current) {
          setCurrentTime(mixer.currentDuration);
          setProgress((mixer.currentDuration / mixer.duration) * 100);
        }
      }
    }
  }, [mixer.audioCtx.currentTime, mixer.currentDuration, mixer.duration, mixer.isPlaying, mixer.elapsedTime]);

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
    if (isSeeking.current) {
      const positionXPercent = getPointerPosition(e, true);
      setProgress(positionXPercent * 100);
      const newCurrentTime = positionXPercent * mixer.duration;
      setCurrentTime(newCurrentTime);
    }
  };

  const handleProgressBarMouseUp = (e: any) => {
    if (!progressBarRef.current) {
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

  return (
    <S.MixerControllerContainer>
      <S.MixerPlayButton
        playing={mixer.isPlaying}
        onClick={() => {
          mixer.playToggle();
        }}
      />
      <S.MixerStopButton onClick={handleMixerStop} />
      <S.MixerProgressBarContainer>
        <S.MixerProgressBar
          ref={progressBarRef}
          onMouseMove={handleProgressBarMouseMove}
          onMouseDown={handleProgressBarMouseDown}
          onMouseUp={handleProgressBarMouseUp}
        >
          <S.MixerProgressBarGuide>
            <S.MixerProgressIndicator progress={progress}>
              <S.MixerProgressPointer position={pointerPosition} />
            </S.MixerProgressIndicator>
          </S.MixerProgressBarGuide>
        </S.MixerProgressBar>
        <S.CurrentTimeDisplay>
          <S.TimeText>{toMMSS(currentTime)}</S.TimeText>
          <S.Splitter />
          <S.TimeText>{toMMSS(mixer.duration)}</S.TimeText>
        </S.CurrentTimeDisplay>
      </S.MixerProgressBarContainer>
    </S.MixerControllerContainer>
  );
};

export default ProgressController;
