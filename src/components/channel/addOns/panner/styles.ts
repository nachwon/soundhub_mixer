import styled from "styled-components";
import { THEME } from "../../../../constants";

const knobSize = 25;

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

export const PannerContainer = styled.div.attrs<PannerComponentProps>((props) => ({
  style: {
    transform: `rotate(${props.value ? props.value : 0}deg)`,
  },
}))<PannerComponentProps>`
  box-shadow: 8px 1px 7px -2px black;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${knobSize}px;
  height: ${knobSize}px;
  border-radius: 50%;
`;

export const PannerKnobTop = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const PannerKnobPlate = styled.div`
  width: ${knobSize - 2}px;
  height: ${knobSize - 2}px;
  border-radius: 50%;
  position: absolute;
  pointer-events: none;
  background: -webkit-linear-gradient(311deg, #8a8a8a 0%, #d0d0d0 49%, #bfbfbf 51%, #efefef 100%);
  background: linear-gradient(311deg, #8a8a8a 0%, #d0d0d0 49%, #bfbfbf 51%, #efefef 100%);
`;

export const PannerKnobPlateMask = styled.div`
  background: -webkit-radial-gradient(circle, rgb(212 212 212 / 31%) 53%, rgb(43 43 43) 100%);
  background: radial-gradient(circle, rgb(212 212 212 / 31%) 53%, rgb(43 43 43) 100%);
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  border: 2px solid #333333;
  z-index: 1;
`;

export const PannerPointerWrapper = styled.div.attrs<PannerComponentProps>((props) => ({
  style: {
    transform: `rotate(${props.value ? props.value : 0}deg)`,
  },
}))<PannerComponentProps>`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
  border: 2px solid #2d2d2d;
  border-radius: 50%;
  display: flex;
  justify-content: center;
`;

export const PannerPointer = styled.div`
  width: 3px;
  height: ${knobSize / 2 - 2}px;
  background: #c5c5c5;
  display: inline-block;
  border-radius: 2px;
  pointer-events: none;
  top: -2px;
  position: absolute;
  box-shadow: 1px 0px 4px 0px #0000009c;
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
