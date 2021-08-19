import styled from "styled-components";

const iconSize = 15;

export const StackIconsContainer = styled.div`
  height: 15px;
  width: 85%;
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  margin-top: 7px;
`;

export const StackIconsText = styled.div`
  color: #d4d4d4;
  font-weight: 400;
  font-size: 12px;
  margin-right: 3px;
`;

export const IconBadge = styled.a`
  :hover {
    transform: scale(3);
    border: 1px solid silver;
  }
  transition-duration: 0.2s;
  width: ${iconSize}px;
  height: ${iconSize}px;
  background-image: url(${(props: { url: string }) => props.url});
  background-color: ${(props: { color?: string }) => props.color};
  background-size: cover;
  border-radius: 2px;
  background-position: center;
  background-repeat: no-repeat;
  margin: 0 1px;
`;
