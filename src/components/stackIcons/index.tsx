import * as S from "./styles";
import ReactIconImage from "../../assets/logo192.png";
import TypeScriptIconImage from "../../assets/typescript-icon.png";
import MobxIconImage from "../../assets/mobx.png";
import StyledCompIconImage from "../../assets/styled-components.png";

const StackIcons: React.FC = () => {
  return (
    <S.StackIconsContainer>
      <S.StackIconsText>Built with</S.StackIconsText>
      <S.IconBadge url={ReactIconImage} color={"#383838"} href="https://reactjs.org/" target="_blank" />
      <S.IconBadge url={TypeScriptIconImage} href="https://www.typescriptlang.org/" target="_blank" />
      <S.IconBadge url={MobxIconImage} href="https://mobx.js.org/README.html" target="_blank" />
      <S.IconBadge url={StyledCompIconImage} color={"wheat"} href="https://styled-components.com/" target="_blank" />
    </S.StackIconsContainer>
  );
};

export default StackIcons;
