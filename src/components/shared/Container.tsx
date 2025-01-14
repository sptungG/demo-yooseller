import styled from "@emotion/styled";
import { MacScrollbar, MacScrollbarProps } from "mac-scrollbar";
import { ForwardRefRenderFunction, forwardRef } from "react";

// const MacScrollbar = dynamic(() => import("mac-scrollbar").then((m) => m.MacScrollbar));

type TContainerProps = MacScrollbarProps & {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

const InternalContainer: ForwardRefRenderFunction<HTMLDivElement, TContainerProps> = (
  { children, className, style },
  forwardedRef,
) => {
  return (
    <ContainerStyled ref={forwardedRef} className={className} style={style}>
      {children}
    </ContainerStyled>
  );
};
const ContainerStyled = styled(MacScrollbar)`
  position: relative;
  z-index: 0;
`;

const Container = forwardRef(InternalContainer);
export default Container;
