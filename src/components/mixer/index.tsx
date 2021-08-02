import Mixer from "../../models/mixer";
import MasterChannelComponent from "../masterChannel"

import * as S from "./styles";


const SoundHubMixer: React.FC = () => {
  const mixer = new Mixer();

  return (
    <S.MixerContainer>
      <input type="file" onChange={(e) => e.target.files ? mixer.addChannel(
        {
          title: e.target.files[0]?.name,
          src: e.target.files[0]
        }) : null
      } />
      <button onClick={() => mixer.play()}>play</button>
      <button onClick={() => mixer.stop()}>stop</button>
      <S.MixerInnerWrapper>
        <S.ChannelsContainer>{ }</S.ChannelsContainer>
        <S.MasterChannelContainer>
          {/* <S.SoundHubIcon /> */}
          <S.SoundHubLogo />
          <MasterChannelComponent masterChannel={mixer.masterChannel} />
        </S.MasterChannelContainer>
      </S.MixerInnerWrapper>
    </S.MixerContainer>
  )
}

export default SoundHubMixer
