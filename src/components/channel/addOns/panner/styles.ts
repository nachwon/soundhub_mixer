import styled from "styled-components";
import { THEME } from "../../../../constants";

export const PannerSection = styled.div`
  width: 100%;
  height: 65px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex-shrink: 0;
  border-bottom: 1px solid black;
`;

interface PannerComponentProps {
  value?: number;
}

export const Panner = styled.div.attrs<PannerComponentProps>((props) => ({
  style: {
    transform: `rotate(${props.value ? props.value : 0}deg)`,
  },
}))<PannerComponentProps>`
  background: -webkit-radial-gradient(center, ellipse cover, hsl(214, 8%, 87%) 0%, hsl(214, 8%, 60%) 100%);
  background: radial-gradient(center, ellipse cover, hsl(214, 8%, 87%) 0%, hsl(214, 8%, 60%) 100%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
`;

export const PannerWrapper = styled.div`
  box-shadow: 3px 1px 2px 0px black;
  display: flex;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;

export const PannerDot = styled.div`
  width: 2px;
  height: 12px;
  background: black;
  display: inline-block;
  margin-top: 1px;
  border-radius: 2px;
  pointer-events: none;
`;

export const PannerValueDisplay = styled.div`
  width: 80%;
  height: 15px;
  margin-top: 5px;
  background: #0d031d;
  border-radius: 3px;
  box-shadow: inset 1px 1px 1px 1px black;
  color: ${THEME.MAIN_COLOR_BLUE};
  font-family: "Wallpoet";
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
`;
