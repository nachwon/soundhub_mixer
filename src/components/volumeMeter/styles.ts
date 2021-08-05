import styled from "styled-components";

interface VolumeMeterProps {
  position?: "L" | "R";
  meterWidth: number;
}

export const ChannelVolumeMeter = styled.canvas<VolumeMeterProps>`
  position: absolute;
  top: 0;
  left: ${(props) => {
    if (!props.position) {
      return "0px";
    } else if (props.position === "L") {
      return "0px";
    } else if (props.position === "R") {
      return "unset";
    }
  }};
  right: ${(props) => {
    if (!props.position) {
      return "unset";
    } else if (props.position === "L") {
      return "unset";
    } else if (props.position === "R") {
      return "0px";
    }
  }};
  width: ${(props) => props.meterWidth}px;
  height: 280px;
`;
