import { Drawer } from "antd";
import { memo, useId, useState } from "react";
import Button, { TButtonProps } from "../button/Button";

type TFormItemDrawerProps = {
  formId: string;
  formValidateFields?: string[];
  title?: React.ReactNode;
  extra?: React.ReactNode;
  children?: React.ReactNode;
  buttonProps?: Pick<TButtonProps, "size" | "block" | "style" | "children" | "type" | "icon">;
};

function FormItemDrawer({
  formId,
  formValidateFields,
  title,
  extra,
  children,
  buttonProps,
}: TFormItemDrawerProps) {
  const uid = useId();
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
    document.body.style.overflowY = "hidden";
  };

  const handleClose = () => {
    setOpen(false);
    document.body.style.overflowY = "auto";
  };
  return (
    <>
      <Button {...buttonProps} onClick={handleOpen}>
        {buttonProps?.children}
      </Button>
      <Drawer
        title={title}
        placement="right"
        onClose={handleClose}
        open={open}
        extra={extra}
        getContainer={document.getElementById(formId) || document.body}
      >
        {children}
      </Drawer>
    </>
  );
}

export default memo(FormItemDrawer);
