import Mixer from "../../models/mixer";
import * as S from "./styles";

interface MixerComponentProps {
  mixer: Mixer
}


export const MixerComponent: React.FC<MixerComponentProps> = (props) => {
  return (
    <S.MixerContainer>
      <div>Test</div>
    </S.MixerContainer>
  )
}
