import styled from "@emotion/styled";
import { Button as AntdButton, ButtonProps, Tooltip, TooltipProps } from "antd";
import Link from "next/link";
import { ForwardRefRenderFunction, forwardRef } from "react";

export type TButtonProps = ButtonProps & {
  tooltip?: string;
  bgColor?: string;
  color?: string;
  tooltipProps?: TooltipProps;
  href?: string;
};

const ButtonStyled = styled(AntdButton)``;
const Button: ForwardRefRenderFunction<HTMLElement, TButtonProps> = (
  { children, tooltip, bgColor, color, tooltipProps, ...props },
  forwardedRef,
) => {
  const button = !tooltip ? (
    <ButtonStyled
      htmlType="button"
      {...props}
      style={{ backgroundColor: bgColor, color, ...props.style }}
      ref={forwardedRef}
    >
      {children}
    </ButtonStyled>
  ) : (
    <Tooltip destroyTooltipOnHide title={tooltip} {...tooltipProps}>
      <ButtonStyled
        htmlType="button"
        {...props}
        style={{ backgroundColor: bgColor, color, ...props.style }}
        ref={forwardedRef}
      >
        {children}
      </ButtonStyled>
    </Tooltip>
  );

  if (!!props?.href) {
    return (
      <Link href={props.href} passHref legacyBehavior>
        {button}
      </Link>
    );
  }

  return button;
};

export const ButtonGroup = AntdButton.Group;

export default forwardRef(Button);
