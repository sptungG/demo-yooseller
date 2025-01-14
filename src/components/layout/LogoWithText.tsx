import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { theme } from "antd";
import { YooIcon } from "../icons";
import { NextImage } from "../next/Image";
const { useToken } = theme;

type TLogoWithTextProps = {
  logoSize?: [number, number];
  fontSize?: [number, number];
  fontWeight?: [number, number];
  style?: React.CSSProperties;
};

function LogoWithText({
  logoSize = [42, 42],
  fontSize = [26, 24],
  fontWeight = [500, 500],
  style,
}: TLogoWithTextProps) {
  const {
    token: { colorText },
  } = useToken();
  const [width, height] = logoSize;
  const [fontSize01, fontSize02] = fontSize;
  const [fontWeight01, fontWeight02] = fontWeight;
  return (
    <LogoWrapper className="logo-wrapper" style={style}>
      {width > 0 && height > 0 && (
        <NextImage
          src="/images/logo-transparent-02.png"
          alt="/images/logo-transparent.png"
          width={width}
          height={height}
        />
      )}
      {fontSize01 > 0 && fontSize02 > 0 && (
        <div className="logo-text-wrapper">
          <span className="logo-yoo-wrapper">
            <YooIcon height={21} />
          </span>
          <span
            className="logo-text logo-text-gradient-green"
            style={{ fontSize: fontSize02, fontWeight: fontWeight02, marginLeft: 0 }}
          >
            Seller
          </span>
        </div>
      )}
    </LogoWrapper>
  );
}

const gradient = keyframes`
0% {
  background-position: 0 50%;
}
50% {
  background-position: 100% 50%;
}
100% {
  background-position: 0 50%;
}`;

const LogoWrapper = styled.div<TLogoWithTextProps>`
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  flex-shrink: 0;
  max-height: 64px;
  overflow: hidden;
  img {
    flex-shrink: 0;
  }
  .logo-text {
    display: inline-flex;
    align-items: baseline;
    justify-content: flex-start;
  }
  .logo-yoo-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .logo-text-gradient-primary {
    animation: ${gradient} 5s ease-in-out infinite;
    background: ${({ theme }) =>
      `linear-gradient(to right,${theme.generatedColors[6]},${theme.generatedColors[4]},${theme.generatedColors[6]},${theme.generatedColors[8]})`};
    color: transparent;
    background-size: 300%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .logo-text-gradient-blue {
    animation: ${gradient} 5s ease-in-out infinite;
    background: linear-gradient(to right, #4eafe2, #1877b1, #4eafe2, #c2e2f5);
    color: transparent;
    background-size: 300%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .logo-text-gradient-green {
    animation: ${gradient} 5s ease-in-out infinite;
    background: linear-gradient(to right, #3e8349, #357a37, #3e8349, #d9efa4);
    color: transparent;
    background-size: 300%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .logo-text-gradient-volcano {
    animation: ${gradient} 5s ease-in-out infinite;
    background: linear-gradient(to right, #ff9c6e, #ff7a45, #ff9c6e, #ffbb96);
    color: transparent;
    background-size: 300%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .logo-text-wrapper {
    display: flex;
    align-items: baseline;
    flex-wrap: nowrap;
    margin-left: 0;
    span {
      line-height: 1.1;
    }
  }
`;
export default LogoWithText;
