import { useRef, useState } from "react";
import { useEffect } from "react";
import Mixer from "../../models/mixer";
import ChannelsContainer from "../channel";
import MasterChannelComponent from "../masterChannel";
import ProgressController from "../progressController";
import { observer } from "mobx-react";

import * as S from "./styles";
import { MixerExporter } from "../../models/mixerExporter";

interface SoundHubMixerProps {
  mixer: Mixer;
}

const SoundHubMixer: React.FC<SoundHubMixerProps> = observer((props) => {
  const mixer = useRef(props.mixer);
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

  return (
    <S.MixerContainer>
      <button
        onClick={() => {
          const mixerSettings = mixer.current.exportSettings();
          const exporter = new MixerExporter(mixerSettings);
          exporter.export();
        }}
      >
        Export
      </button>
      <S.MixerInnerWrapper>
        <ChannelsContainer mixer={mixer.current} pressedKey={pressedKey} />
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
