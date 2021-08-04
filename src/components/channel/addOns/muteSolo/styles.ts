import styled from "styled-components";
import { THEME } from "../../../../constants";

export const ChannelMuteSoloSection = styled.div`
  width: 100%;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

export const MuteButton = styled.div`
  height: 28px;
  width: 30px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 1px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  cursor: pointer;
  background: linear-gradient(180deg, #676767, #333333);
  font-size: 13px;
  font-weight: 600;
  text-shadow: 0px 0px 1px #8c8c8c;
  box-shadow: ${(props: { muted: boolean }) => (props.muted ? "inset" : "")} 1px 1px 2px 0 black;
  color: ${(props: { muted: boolean }) => (props.muted ? THEME.ERROR : "black")};
`;

export const SoloButton = styled.div`
  height: 28px;
  width: 30px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 1px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  cursor: pointer;
  background: linear-gradient(180deg, #676767, #333333);
  font-size: 13px;
  font-weight: 600;
  text-shadow: 0px 0px 1px #8c8c8c;
  box-shadow: ${(props: { soloed: boolean }) => (props.soloed ? "inset" : "")} 1px 1px 2px 0 black;
  color: ${(props: { soloed: boolean }) => (props.soloed ? THEME.MAIN_COLOR_GREEN : "black")};
`;
