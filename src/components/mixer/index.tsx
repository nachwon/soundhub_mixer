import { ChangeEvent, useRef, useState } from "react";
import { useEffect } from "react";
import { FileInputId } from "../../constants";
import { Channel } from "../../models/channels";
import Mixer from "../../models/mixer";
import ChannelsContainer from "../channel";
import MasterChannelComponent from "../masterChannel";
import ProgressController from "../progressController";
import { observer } from "mobx-react";

import * as S from "./styles";

interface SoundHubMixerProps {
  mixer: Mixer;
}

const SoundHubMixer: React.FC<SoundHubMixerProps> = observer((props) => {
  const mixer = useRef(props.mixer);
  const [channels, setChannels] = useState<Array<Channel>>([]);
  const [pressedKey, setPressedKey] = useState<string>("default");

  const handleKeyDown = (e: KeyboardEvent) => {
    setPressedKey(e.code);
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    setPressedKey("default");
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
  }, []);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      mixer.current.addChannel({
        title: files[0]?.name,
        src: files[0],
      });

      setChannels(mixer.current.channels);
      e.target.value = "";
    } else {
      return;
    }
  };

  return (
    <S.MixerContainer>
      <input type="file" id={FileInputId} onChange={handleFileSelect} />
      <S.MixerInnerWrapper>
        <ChannelsContainer channels={channels} pressedKey={pressedKey} />
        <S.MasterChannelContainer>
          {/* <S.SoundHubIcon /> */}
          <S.SoundHubLogo />
          <MasterChannelComponent masterChannel={mixer.current.masterChannel} pressedKey={pressedKey} />
        </S.MasterChannelContainer>
      </S.MixerInnerWrapper>
      <ProgressController mixer={mixer.current} />
    </S.MixerContainer>
  );
});

export default SoundHubMixer;
