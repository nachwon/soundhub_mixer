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
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mixer.duration === 0) {
      setProgress(0);
    } else {
      if (mixer.isPlaying) {
        setProgress((mixer.currentDuration / mixer.duration) * 100);
        setCurrentTime(mixer.currentDuration);
      }
    }
  }, [mixer.audioCtx.currentTime, mixer.currentDuration, mixer.duration, mixer.isPlaying, mixer.elapsedTime]);

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

  const handleProgressBarMouseMove = (e: any) => {};

  const handleProgressBarMouseUp = (e: any) => {
    const offsetX = e.offsetX;
    if (!offsetX || !progressBarRef.current) {
      return;
    }
    const relativeDuration = (offsetX / progressBarRef.current.getBoundingClientRect().width) * mixer.duration;
    setProgress((relativeDuration / mixer.duration) * 100);
    mixer.seek(relativeDuration);
    window.removeEventListener("mousemove", handleProgressBarMouseMove);
    window.removeEventListener("mouseup", handleProgressBarMouseUp);
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
              <S.MixerProgressPointer position={0} />
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
