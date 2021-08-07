import { ChangeEvent, useRef, useState } from "react";
import { useEffect } from "react";
import { Channel } from "../../models/channels";
import Mixer from "../../models/mixer";
import ChannelsContainer from "../channel";
import MasterChannelComponent from "../masterChannel";
import ProgressController from "../progressController";

import * as S from "./styles";

interface SoundHubMixerProps {
  mixer: Mixer;
}

const SoundHubMixer: React.FC<SoundHubMixerProps> = (props) => {
  const mixer = useRef(props.mixer);
  const [channels, setChannels] = useState<Array<Channel>>([]);
  const [_, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(mixer.current.currentTime);
    }, 10);
    return () => clearInterval(intervalId);
  }, []);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      mixer.current.addChannel({
        title: files[0]?.name,
        src: files[0],
      });

      setChannels(mixer.current.channels);
    } else {
      return;
    }
  };

  return (
    <S.MixerContainer>
      <input type="file" onChange={handleFileSelect} />
      <S.MixerInnerWrapper>
        <ChannelsContainer channels={channels} />
        <S.MasterChannelContainer>
          {/* <S.SoundHubIcon /> */}
          <S.SoundHubLogo />
          <MasterChannelComponent masterChannel={mixer.current.masterChannel} />
        </S.MasterChannelContainer>
      </S.MixerInnerWrapper>
      <ProgressController mixer={mixer.current} />
    </S.MixerContainer>
  );
};

export default SoundHubMixer;
