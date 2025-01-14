import Button from "@/components/button/Button";
import Card from "@/components/card/Card";
import useChangeLocale from "@/hooks/useChangeLocale";
import styled from "@emotion/styled";
import { CardProps, Menu } from "antd";
import Link from "next/link";
import { useId, useState } from "react";
import { FaRegLightbulb } from "react-icons/fa";
import { MdOutlineCategory, MdOutlineStore } from "react-icons/md";
import { RiShoppingBag3Line } from "react-icons/ri";
import { TbClipboardText, TbMap2 } from "react-icons/tb";

type TStoreMenuProps = CardProps & { storeId?: number };

const StoreMenu = ({ storeId, ...props }: TStoreMenuProps) => {
  const uid = useId();
  const { i18n } = useChangeLocale();

  const MENU_KEYS = [
    uid + "don-hang",
    uid + "san-pham",
    uid + "kenh-marketing",
    uid + "dia-chi",
    uid + "dich-vu",
  ];
  const [selectedOpenKeys, setSelectedOpenKeys] = useState<string[]>(MENU_KEYS);

  return (
    <StyledWrapper
      title={"Điều hướng"}
      extra={
        <Button
          size="small"
          type="link"
          onClick={() => {
            if (!selectedOpenKeys.length) setSelectedOpenKeys(MENU_KEYS);
            else setSelectedOpenKeys([]);
          }}
        >
          {!selectedOpenKeys.length ? "Mở tất cả" : "Thu gọn tất cả"}
        </Button>
      }
      {...props}
    >
      <Menu
        key={String(selectedOpenKeys)}
        mode="inline"
        inlineIndent={12}
        defaultOpenKeys={selectedOpenKeys}
        items={[
          {
            key: `/supplier/store/${storeId}`,
            icon: <MdOutlineStore size={22} />,
            label: <Link href={`/supplier/store/${storeId}`}>Xem cửa hàng</Link>,
          },
          {
            key: uid + "don-hang",
            label: "Đơn hàng",
            icon: <TbClipboardText size={22} />,
            children: [
              {
                label: <Link href={`/supplier/store/${storeId}/order`}>Tất cả đơn hàng</Link>,
                key: `/supplier/store/${storeId}/order`,
              },
            ],
          },
          {
            key: uid + "san-pham",
            label: "Sản phẩm",
            icon: <RiShoppingBag3Line size={22} />,
            children: [
              {
                label: <Link href={`/supplier/store/${storeId}/item`}>Tất cả sản phẩm</Link>,
                key: `/supplier/store/${storeId}/item`,
              },
              {
                label: <Link href={`/supplier/store/${storeId}/item/create`}>Tạo sản phẩm</Link>,
                key: `/supplier/store/${storeId}/item/create`,
              },
            ],
          },
          {
            key: uid + "dich-vu",
            label: i18n["Dịch vụ"],
            icon: <MdOutlineCategory size={22} />,
            children: [
              {
                label: (
                  <Link href={`/supplier/store/${storeId}/amenities/group`}>
                    {i18n["Nhóm dịch vụ"]}
                  </Link>
                ),
                key: `/supplier/store/${storeId}/amenities/group`,
              },
              {
                label: (
                  <Link href={`/supplier/store/${storeId}/amenities/combo`}>
                    {i18n["Combo dịch vụ"]}
                  </Link>
                ),
                key: `/supplier/store/${storeId}/amenities/combo`,
              },
              {
                label: (
                  <Link href={`/supplier/store/${storeId}/amenities`}>
                    {i18n["Tất cả dịch vụ"]}
                  </Link>
                ),
                key: `/supplier/store/${storeId}/amenities`,
              },
            ],
          },
          {
            key: uid + "kenh-marketing",
            label: "Kênh Marketing",
            icon: <FaRegLightbulb size={22} />,
            children: [
              {
                label: (
                  <Link href={`/supplier/store/${storeId}/marketing/voucher`}>
                    {i18n["Mã giảm giá"]}
                  </Link>
                ),
                key: `/supplier/store/${storeId}/marketing/voucher`,
              },
            ],
          },
          {
            key: uid + "dia-chi",
            label: "Địa chỉ",
            icon: <TbMap2 size={22} />,
            children: [
              {
                label: (
                  <Link href={`/supplier/store/${storeId}/addresses`}>
                    {i18n["Tất cả địa chỉ"]}
                  </Link>
                ),
                key: `/supplier/store/${storeId}/addresses`,
              },
            ],
          },
        ]}
      />
    </StyledWrapper>
  );
};

const StyledWrapper = styled(Card)`
  & .ant-menu {
    border-radius: 0;
    border-left: 1px solid rgba(0, 0, 0, 0.05);
    border-inline-end: none !important;
  }
`;

export default StoreMenu;
