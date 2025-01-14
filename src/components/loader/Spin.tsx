import { LoadingOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Spin as AntdSpin, SpinProps } from "antd";

type TSpinProps = {};

const Spin = ({ children, ...props }: SpinProps) => {
  return (
    <SpinStyled indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} {...props}>
      {children}
    </SpinStyled>
  );
};
const SpinStyled = styled(AntdSpin)`
  & .loading-indicator {
    svg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
`;

export default Spin;
