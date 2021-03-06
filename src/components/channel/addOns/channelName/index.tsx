import { useEffect, useRef, useState, MouseEvent } from "react";
import { Channel } from "../../../../models/channels";
import * as S from "./styles";

interface ChannelNameProps {
  channel: Channel;
}

const TrackNameScrollSpeed = 0.3;
const InitialTrackNamePosition = 3.5;

const ChannelName: React.FC<ChannelNameProps> = (props) => {
  const channel = props.channel;
  const trackNameRef = useRef<HTMLDivElement>(null);
  const trackNamePosition = useRef(InitialTrackNamePosition);
  const [centered, setCentered] = useState(false);
  const [position, setPosition] = useState(InitialTrackNamePosition);
  const [animation, setAnimation] = useState<null | ReturnType<typeof setTimeout>>(null);
  const textAnimationReversed = useRef(false);

  useEffect(() => {
    if (trackNameRef.current) {
      const width = trackNameRef.current.offsetWidth - InitialTrackNamePosition;
      const child = trackNameRef.current.querySelector("div");
      if (!child) {
        return;
      }
      const maxPosition = Math.max(0, child.offsetWidth - width + InitialTrackNamePosition);
      setCentered(maxPosition <= 0);
    }
  }, []);

  const handleTrackNameMouseEnter = (e: MouseEvent) => {
    const target = e.target as HTMLDivElement;
    const width = target.offsetWidth - InitialTrackNamePosition;
    const child = target.querySelector("div");
    if (!child) {
      return;
    }

    const maxPosition = Math.max(0, child.offsetWidth - width + InitialTrackNamePosition);
    if (maxPosition > 0) {
      const animation = setInterval(() => {
        if (!textAnimationReversed.current) {
          trackNamePosition.current -= TrackNameScrollSpeed;
          if (trackNamePosition.current <= -maxPosition) {
            textAnimationReversed.current = true;
          }
        } else {
          trackNamePosition.current += TrackNameScrollSpeed;
          if (trackNamePosition.current >= InitialTrackNamePosition) {
            textAnimationReversed.current = false;
          }
        }
        setPosition(trackNamePosition.current);
      }, 10);

      setAnimation(animation);
    }
  };

  const handleTrackNameMouseLeave = (e: MouseEvent) => {
    trackNamePosition.current = InitialTrackNamePosition;
    textAnimationReversed.current = false;
    setPosition(InitialTrackNamePosition);
    if (animation) {
      clearInterval(animation);
      setAnimation(null);
    }
  };

  return (
    <S.ChannelNameSection
      ref={trackNameRef}
      onMouseEnter={handleTrackNameMouseEnter}
      onMouseLeave={handleTrackNameMouseLeave}
    >
      <S.ChannelName position={position} centered={centered}>
        {channel.title}
      </S.ChannelName>
    </S.ChannelNameSection>
  );
};

export default ChannelName;
