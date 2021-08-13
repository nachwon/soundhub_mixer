import { observer } from "mobx-react";
import React, { useState } from "react";
import Mixer from "../../models/mixer";
import { MixerExporter } from "../../models/mixerExporter";
import editModeStore from "../../stores/editModeStore";
import * as S from "./styles";

interface MixerActionsContainerProps {
  mixer: Mixer;
}

const MixerActionsContainer: React.FC<MixerActionsContainerProps> = observer((props) => {
  const store = editModeStore;
  const [isPreparing, setIsPreparing] = useState(false);
  const mixer = props.mixer;

  const handleExport = () => {
    const mixerSettings = mixer.exportSettings();
    if (!mixerSettings) {
      return;
    }

    setIsPreparing(true);

    const exporter = new MixerExporter(mixerSettings);
    exporter.export(() => setIsPreparing(false));
  };

  return (
    <S.MixerActionButtonsContainer>
      <S.MixerTitleContainer>
        <S.SoundHubIcon />
        <S.MixerTitle>SoundHub</S.MixerTitle>
        <S.MixerTitle>mixer</S.MixerTitle>
      </S.MixerTitleContainer>
      <S.ButtonsWrapper>
        <S.EditButton
          isLoaded={mixer.channelsLoaded}
          isEditing={store.isEditing}
          onClick={() => (mixer.channelsLoaded ? store.toggleEditMode() : null)}
        />
        <S.ResetButton onClick={() => mixer.resetSettings()} isLoaded={mixer.channelsLoaded} />
        <S.ButtonDivider />
        <S.DownloadButton onClick={() => handleExport()} isLoaded={mixer.channelsLoaded} isPreparing={isPreparing} />
      </S.ButtonsWrapper>
    </S.MixerActionButtonsContainer>
  );
});

export default MixerActionsContainer;
