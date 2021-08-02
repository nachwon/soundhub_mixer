import Mixer from "../../models/mixer";
import MasterChannelComponent from "../masterChannel"

import * as S from "./styles";


const SoundHubMixer: React.FC = () => {
  const mixer = new Mixer();

  return (
    <S.MixerContainer>
      <S.MixerInnerWrapper>
        <S.ChannelsContainer>{ }</S.ChannelsContainer>
        <S.MasterChannelContainer>
          <S.SoundHubLogo />
          <MasterChannelComponent masterChannel={mixer.masterChannel} />
        </S.MasterChannelContainer>
      </S.MixerInnerWrapper>
    </S.MixerContainer>
  )
}

export default SoundHubMixer
