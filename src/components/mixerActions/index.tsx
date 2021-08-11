import { observer } from "mobx-react";
import React from "react";
import Mixer from "../../models/mixer";
import { MixerExporter } from "../../models/mixerExporter";
import * as S from "./styles";

interface MixerActionsContainerProps {
  mixer: Mixer;
}

const MixerActionsContainer: React.FC<MixerActionsContainerProps> = observer((props) => {
  const mixer = props.mixer;

  const handleExport = () => {
    const mixerSettings = mixer.exportSettings();
    if (!mixerSettings) {
      return;
    }
    const exporter = new MixerExporter(mixerSettings);
    exporter.export();
  };

  return (
    <S.MixerActionButtonsContainer>
      <S.MixerTitleContainer>
        <S.SoundHubIcon />
        <S.MixerTitle>SoundHub</S.MixerTitle>
        <S.MixerTitle>mixer</S.MixerTitle>
      </S.MixerTitleContainer>
      <S.DownloadButton onClick={() => handleExport()} isLoaded={mixer.channelsLoaded} />
    </S.MixerActionButtonsContainer>
  );
});

export default MixerActionsContainer;
