import styled from "styled-components";

interface TracNameProps {
  centered: boolean;
  position: number;
}

export const TrackName = styled.div.attrs<TracNameProps>((props) => ({
  style: {
    left: `${props.centered ? "50%" : props.position + "px"}`,
    transform: `translateX(${props.centered ? "-50%" : "0%"})`,
  },
}))<TracNameProps>`
  width: fit-content;
  height: 90%;
  display: inline-flex;
  align-items: center;
  border-radius: 3px;
  font-size: 13px;
  white-space: nowrap;
  position: absolute;
  pointer-events: none;
`;

export const TrackNameSection = styled.div`
  overflow: hidden;
  border-radius: 2px;
  box-shadow: inset 0px 0px 6px -2px black;
  width: 100%;
  height: 28px;
  background: #d0d0d0;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;
