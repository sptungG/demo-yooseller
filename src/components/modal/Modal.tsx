import { useTheme } from "@emotion/react";
import { Modal as AntdModal, ModalProps } from "antd";
import { useMediaQuery } from "react-responsive";

type TProps = ModalProps;

function Modal({ children, style = {}, styles = {}, ...props }: TProps) {
  const mediaBelow768 = useMediaQuery({ maxWidth: 767.9 });
  const mediaStyle = mediaBelow768 ? { padding: 0, ...style, top: 0 } : style;
  const mediaCentered = mediaBelow768;
  const { mode } = useTheme();
  const { footer, content, ...restStyles } = styles;
  return (
    <AntdModal
      wrapClassName={`modal-sticky-footer ${mode}`}
      centered={mediaCentered}
      style={{ ...mediaStyle }}
      styles={{
        footer: {
          display: "flex",
          justifyContent: "flex-end",
          alignSelf: "flex-end",
          position: "sticky",
          bottom: 0,
          width: "100%",
          backgroundColor: "#fff",
          height: 72,
          marginTop: "auto",
          borderTop: `1px solid rgba(0,0,0,0.05)`,
          ...footer,
        },
        content: { padding: "24px 24px 0", ...content },
        ...restStyles,
      }}
      {...props}
    >
      {children}
    </AntdModal>
  );
}

export default Modal;
