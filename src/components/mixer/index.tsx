import Mixer from "../../models/mixer";
import MasterChannelComponent from "../masterChannel"

import * as S from "./styles";

interface MixerComponentProps {
  mixer: Mixer
}


export const MixerComponent: React.FC<MixerComponentProps> = (props) => {
  return (
    <S.MixerContainer>
      <S.MixerInnerWrapper>
        <S.ChannelsContainer>{ }</S.ChannelsContainer>
        <S.MasterChannelContainer>
          <S.SoundHubLogo />
          <MasterChannelComponent masterChannel={props.mixer.masterChannel} />
        </S.MasterChannelContainer>
      </S.MixerInnerWrapper>
    </S.MixerContainer>
  )
}
