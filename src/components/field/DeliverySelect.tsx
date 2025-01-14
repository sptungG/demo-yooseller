import useChangeLocale from "@/hooks/useChangeLocale";
import { TEDeliveryProvider } from "@/types/farm.types";
import { Flex, Select, SelectProps, Typography } from "antd";
import { useId } from "react";
import Avatar from "../avatar/Avatar";

type TDeliverySelectProps = SelectProps & {};

const DeliverySelect = (props: TDeliverySelectProps) => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  return (
    <Select
      {...props}
      mode="multiple"
      options={[
        {
          value: TEDeliveryProvider.GiaoHangNhanh,
          label: i18n["Giao hàng nhanh"],
          imageUrl: "/images/giaohangnhanh.png",
          disabled: true,
        },
        {
          value: TEDeliveryProvider.GiaoHangTietKiem,
          label: i18n["Giao hàng tiết kiệm"],
          imageUrl: "/images/giaohangtietkiem.png",
          disabled: true,
        },
        {
          value: TEDeliveryProvider.Lalamove,
          label: i18n["Lalamove"],
          imageUrl: "/images/lalamove-logo.png",
          disabled: true,
        },
        {
          value: TEDeliveryProvider.Self,
          label: i18n["Tự giao hàng"],
          disabled: false,
          imageUrl: "/images/delivery-truck.svg",
        },
      ].map((item) => ({
        value: item.value,
        disabled: item.disabled,
        label: (
          <Flex
            align="center"
            gap={6}
            style={{ paddingRight: 4, opacity: item.disabled ? 0.45 : 1 }}
          >
            <Avatar
              size={24}
              style={{ backgroundColor: "rgba(0,0,0,0.05)" }}
              src={item.imageUrl}
            ></Avatar>
            <Typography.Text>{item.label}</Typography.Text>

            {!!item.disabled && (
              <Typography.Text className="" style={{ marginLeft: "auto", fontSize: 11 }}>
                {i18n["Đang phát triển"]}
              </Typography.Text>
            )}
          </Flex>
        ),
      }))}
    />
  );
};

export default DeliverySelect;
