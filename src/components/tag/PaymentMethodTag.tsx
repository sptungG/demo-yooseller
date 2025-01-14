import { VIETTELPAY_LOGO } from "@/configs/constant.config";
import styled from "@emotion/styled";
import { Avatar, TagProps } from "antd";
import { TPaymentMethods } from "src/types/order.types";
import { MomoSvg, VNPaySvg } from "../icons";
import Tag from "./Tag";

type TPaymentMethodTagProps = { method?: number; bordered?: boolean };

const PaymentMethodTag = ({ method, bordered = false }: TPaymentMethodTagProps) => {
  const paymentMethodConf: Record<string, TagProps> = {
    [TPaymentMethods.COD]: {
      color: "default",
      children: "COD",
    },
    [TPaymentMethods.MOMO]: {
      color: "default",
      children: "MOMO",
      icon: <MomoSvg width={14} style={{ margin: "0 2px 0 -4px" }} />,
    },
    [TPaymentMethods.VIETTELPAY]: {
      color: "default",
      children: "VIETTELPAY",
      icon: (
        <Avatar
          src={VIETTELPAY_LOGO}
          size={16}
          style={{ border: "none", margin: "0 2px 0 -4px" }}
        />
      ),
    },
    [TPaymentMethods.VNPAY]: {
      color: "default",
      children: "VNPAY",
      icon: <VNPaySvg width={14} style={{ margin: "0 2px 0 -4px" }} />,
    },
  };

  return (
    <PaymentMethodTagStyled
      bordered={bordered}
      {...(paymentMethodConf?.[String(method)] || { children: "---" })}
    />
  );
};
const PaymentMethodTagStyled = styled(Tag)``;

export default PaymentMethodTag;
