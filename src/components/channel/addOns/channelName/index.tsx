import { useEffect, useRef, useState, MouseEvent } from "react";
import { Channel } from "../../../../models/channels";
import * as S from "./styles";

interface ChannelNameProps {
  channel: Channel;
}

const ChannelName: React.FC<ChannelNameProps> = (props) => {
  const channel = props.channel;
  const initialTrackNamePosition = 3.5;
  const trackNameRef = useRef<HTMLDivElement>(null);
  const trackNamePosition = useRef(initialTrackNamePosition);
  const [centered, setCentered] = useState(false);
  const [position, setPosition] = useState(initialTrackNamePosition);
  const [animation, setAnimation] = useState<number | null>(null);
  const textAnimationReversed = useRef(false);

  useEffect(() => {
    if (trackNameRef.current) {
      const width = trackNameRef.current.offsetWidth - initialTrackNamePosition;
      const child = trackNameRef.current.querySelector("div");
      if (!child) {
        return;
      }
      const maxPosition = Math.max(0, child.offsetWidth - width + initialTrackNamePosition);
      setCentered(maxPosition <= 0);
    }
  }, []);

  const handleTrackNameMouseEnter = (e: MouseEvent) => {
    const target = e.target as HTMLDivElement;
    const width = target.offsetWidth - initialTrackNamePosition;
    const child = target.querySelector("div");
    if (!child) {
      return;
    }

    const maxPosition = Math.max(0, child.offsetWidth - width + initialTrackNamePosition);
    if (maxPosition > 0) {
      const animation = setInterval(() => {
        if (!textAnimationReversed.current) {
          trackNamePosition.current -= 0.1;
          if (trackNamePosition.current <= -maxPosition) {
            textAnimationReversed.current = true;
          }
        } else {
          trackNamePosition.current += 0.1;
          if (trackNamePosition.current >= initialTrackNamePosition) {
            textAnimationReversed.current = false;
          }
        }
        setPosition(trackNamePosition.current);
      }, 10);

      setAnimation(animation);
    }
  };

  const handleTrackNameMouseLeave = (e: MouseEvent) => {
    trackNamePosition.current = initialTrackNamePosition;
    textAnimationReversed.current = false;
    setPosition(initialTrackNamePosition);
    if (animation) {
      clearInterval(animation);
      setAnimation(null);
    }
  };

  return (
    <S.TrackNameSection
      ref={trackNameRef}
      onMouseEnter={handleTrackNameMouseEnter}
      onMouseLeave={handleTrackNameMouseLeave}
    >
      <S.TrackName position={position} centered={centered}>
        {channel.title}
      </S.TrackName>
    </S.TrackNameSection>
  );
};

export default ChannelName;
