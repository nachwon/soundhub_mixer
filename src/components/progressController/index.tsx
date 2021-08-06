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
  const [offset, setOffset] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleProgressBarMouseDown = (e: any) => {
    isSeeking.current = true;
    window.addEventListener("mousemove", handleProgressBarMouseMove);
    window.addEventListener("mouseup", handleProgressBarMouseUp);
  };

  const handleProgressBarMouseMove = (e: any) => {};

  const handleProgressBarMouseUp = (e: any) => {
    const offsetX = e.nativeEvent.offsetX;
    const relativeDuration = (offsetX / 500) * mixer.duration;
    console.log(relativeDuration, progress);
    setOffset(relativeDuration);
    setProgress((relativeDuration / mixer.duration) * 100);
    mixer.seek(relativeDuration);
    window.removeEventListener("mousemove", handleProgressBarMouseMove);
    window.removeEventListener("mouseup", handleProgressBarMouseUp);
  };

  return (
    <S.MixerControllerContainer>
      <S.MixerPlayButton playing={mixer.isPlaying} onClick={() => mixer.playToggle()} />
      <S.MixerProgressBarContainer>
        <S.MixerProgressBar
          ref={progressBarRef}
          onMouseMove={handleProgressBarMouseMove}
          onMouseDown={handleProgressBarMouseDown}
          onMouseUp={handleProgressBarMouseUp}
        >
          <S.MixerProgressBarGuide>
            <S.MixerProgressIndicator progress={0}>
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
