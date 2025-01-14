import Button from "@/components/button/Button";
import Card from "@/components/card/Card";
import { EcofarmSvg } from "@/components/icons";
import useChangeLocale from "@/hooks/useChangeLocale";
import styled from "@emotion/styled";
import { CardProps, Menu } from "antd";
import Link from "next/link";
import { useId, useState } from "react";
import { FaRegCheckCircle, FaRegLightbulb } from "react-icons/fa";
import { FiBox } from "react-icons/fi";
import { RiShoppingBag3Line } from "react-icons/ri";
import { TbClipboardText, TbMap2 } from "react-icons/tb";

type TFarmMenuProps = CardProps & { storeId?: number };

const FarmMenu = ({ storeId, ...props }: TFarmMenuProps) => {
  const uid = useId();
  const { i18n } = useChangeLocale();

  const MENU_KEYS = [
    uid + "don-hang",
    uid + "san-pham",
    uid + "goi-dich-vu",
    uid + "dang-ky",
    uid + "kenh-marketing",
    uid + "dia-chi",
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
            key: `/supplier/farm/${storeId}`,
            icon: <EcofarmSvg width={22} />,
            label: <Link href={`/supplier/farm/${storeId}`}>Xem trang trại</Link>,
          },
          {
            key: uid + "goi-dich-vu",
            label: "Gói dịch vụ",
            icon: <FiBox size={22} />,
            children: [
              {
                label: (
                  <Link href={`/supplier/farm/${storeId}/package`}>
                    {i18n["Danh sách gói farming"]}
                  </Link>
                ),
                key: `/supplier/farm/${storeId}/package`,
              },
              {
                label: (
                  <Link href={`/supplier/farm/${storeId}/activity`}>
                    {i18n["Danh sách hoạt động"]}
                  </Link>
                ),
                key: `/supplier/farm/${storeId}/activity`,
              },
            ],
          },
          {
            key: uid + "dang-ky",
            label: "Đăng ký",
            icon: <FaRegCheckCircle size={22} />,
            children: [
              {
                label: (
                  <Link href={`/supplier/farm/${storeId}/register`}>
                    {i18n["Đăng ký gói farming"]}
                  </Link>
                ),
                key: `/supplier/farm/${storeId}/register`,
              },
            ],
          },
          {
            key: uid + "san-pham",
            label: "Sản phẩm",
            icon: <RiShoppingBag3Line size={22} />,
            children: [
              {
                label: <Link href={`/supplier/farm/${storeId}/item`}>Tất cả sản phẩm</Link>,
                key: `/supplier/farm/${storeId}/item`,
              },
              {
                label: <Link href={`/supplier/farm/${storeId}/item/create`}>Tạo sản phẩm</Link>,
                key: `/supplier/farm/${storeId}/item/create`,
              },
            ],
          },

          {
            key: uid + "don-hang",
            label: "Đơn hàng",
            icon: <TbClipboardText size={22} />,
            children: [
              {
                label: <Link href={`/supplier/farm/${storeId}/order`}>Tất cả đơn hàng</Link>,
                key: `/supplier/farm/${storeId}/order`,
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
                  <Link href={`/supplier/farm/${storeId}/voucher`}>{i18n["Mã giảm giá"]}</Link>
                ),
                key: `/supplier/farm/${storeId}/voucher`,
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
                  <Link href={`/supplier/farm/${storeId}/addresses`}>{i18n["Tất cả địa chỉ"]}</Link>
                ),
                key: `/supplier/farm/${storeId}/addresses`,
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

export default FarmMenu;
