import useChangeLocale from "@/hooks/useChangeLocale";
import { TEDeliveryProvider } from "@/types/farm.types";
import styled from "@emotion/styled";
import { Avatar, TagProps } from "antd";
import Tag from "./Tag";

type TDeliveryMethodTagProps = { method?: number; bordered?: boolean };

const DeliveryMethodTag = ({ method, bordered = false }: TDeliveryMethodTagProps) => {
  const { i18n } = useChangeLocale();
  const paymentMethodConf: Record<string, TagProps> = {
    [TEDeliveryProvider.GiaoHangNhanh]: {
      color: "default",
      children: i18n["Giao hàng nhanh"],
      icon: (
        <Avatar
          src={"/images/giaohangnhanh.png"}
          size={16}
          style={{ border: "none", margin: "0 4px 0 -4px" }}
        />
      ),
    },
    [TEDeliveryProvider.GiaoHangTietKiem]: {
      color: "default",
      children: i18n["Giao hàng tiết kiệm"],
      icon: (
        <Avatar
          src={"/images/giaohangtietkiem.png"}
          size={16}
          style={{ border: "none", margin: "0 4px 0 -4px" }}
        />
      ),
    },
    [TEDeliveryProvider.Lalamove]: {
      color: "default",
      children: i18n["Lalamove"],
      icon: (
        <Avatar
          src={"/images/lalamove-logo.png"}
          size={16}
          style={{ border: "none", margin: "0 4px 0 -4px" }}
        />
      ),
    },
    [TEDeliveryProvider.Self]: {
      color: "default",
      children: i18n["Tự giao hàng"],
      icon: (
        <Avatar
          src={"/images/delivery-truck.svg"}
          size={16}
          style={{ border: "none", margin: "0 4px 0 -4px" }}
        />
      ),
    },
  };

  return (
    <DeliveryMethodTagStyled
      bordered={bordered}
      {...(paymentMethodConf?.[String(method)] || { children: "---" })}
    />
  );
};
const DeliveryMethodTagStyled = styled(Tag)``;

export default DeliveryMethodTag;
