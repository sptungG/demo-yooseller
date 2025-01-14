import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Menu } from "antd";
import { rgba } from "emotion-rgba";
import { useRouter } from "next/router";
import { useId } from "react";
import { FaRegCheckCircle, FaRegLightbulb } from "react-icons/fa";
import { FcPlus } from "react-icons/fc";
import { FiBox, FiPackage } from "react-icons/fi";
import {
  MdChecklist,
  MdGroups,
  MdOutlineAddBox,
  MdOutlineAddBusiness,
  MdOutlineStore,
} from "react-icons/md";
import { RiBillLine, RiShoppingBag3Line } from "react-icons/ri";
import { TbBrandGoogleHome, TbClipboardText, TbDiscount2, TbMap2 } from "react-icons/tb";

import { AiOutlineGlobal } from "react-icons/ai";
import { BiGridAlt, BiLibrary, BiOutline } from "react-icons/bi";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProvider from "src/hooks/useGetProvider";
import useGetProviderFarm from "src/hooks/useGetProviderFarm";
import { useAppSelector } from "src/redux/store";
import { EcofarmSvg } from "../icons";
import Link from "../next/Link";

function SiderMenuNav() {
  const {
    locale,
    asPath,
    pathname,
    query: { storeId, farmId },
  } = useRouter();
  const uid = useId();

  const { i18n } = useChangeLocale();
  const { isSiderCollapsed } = useAppSelector((s) => s.visible);
  const { generatedColors } = useTheme();

  const { gSelectedProvider, gTypeProvider } = useGetProvider({});

  return (
    <MenuWrapper className={`${isSiderCollapsed ? "collapsed" : ""} ${locale || ""}`}>
      <Menu
        key={String(storeId) + uid}
        inlineIndent={12}
        defaultOpenKeys={[
          "/supplier/store" + uid,
          `/supplier/store/item` + uid,
          `/supplier/store/order` + uid,
          `/supplier/store/booking` + uid,
          `/supplier/store/marketing` + uid,
          `/supplier/store/addresses` + uid,
          `/supplier/store/amenities` + uid,
        ]}
        selectedKeys={[asPath.split("?")[0]]}
        selectable={false}
        style={{ backgroundColor: "transparent" }}
        theme="light"
        mode="inline"
        className="side-menu"
        items={(
          [
            {
              label: (
                <Link href={!!storeId ? `/supplier/store/${storeId}` : "/"}>
                  {i18n["Tổng quan"]}
                </Link>
              ),
              icon: <TbBrandGoogleHome size={22} />,
              key: !!storeId ? `/supplier/store/${storeId}` : "/",
              className: "side-menu-item",
            },
            !!storeId
              ? {
                  label: i18n["Sản phẩm"],
                  key: `/supplier/store/item` + uid,
                  children: [
                    {
                      label: (
                        <Link href={`/supplier/store/${storeId}/item`}>
                          {i18n["Tất cả sản phẩm"]}
                        </Link>
                      ),
                      key: `/supplier/store/${storeId}/item`,
                      className: "side-menu-item",
                      ...(isSiderCollapsed ? { icon: <RiShoppingBag3Line size={22} /> } : {}),
                    },
                    {
                      label: (
                        <Link href={`/supplier/store/${storeId}/item/create`}>
                          {i18n["Tạo sản phẩm"]}
                        </Link>
                      ),
                      key: `/supplier/store/${storeId}/item/create`,
                      className: "side-menu-item",
                      ...(isSiderCollapsed ? { icon: <MdOutlineAddBox size={22} /> } : {}),
                    },
                  ],
                  ...(isSiderCollapsed
                    ? { type: "group" }
                    : { icon: <RiShoppingBag3Line size={22} /> }),
                }
              : undefined,
            !!storeId
              ? {
                  label: i18n["Đơn hàng"],
                  key: `/supplier/store/order` + uid,
                  children: [
                    {
                      label: (
                        <Link href={`/supplier/store/${storeId}/order`}>
                          {i18n["Tất cả đơn hàng"]}
                        </Link>
                      ),
                      key: `/supplier/store/${storeId}/order`,
                      className: "side-menu-item",
                      ...(isSiderCollapsed ? { icon: <TbClipboardText size={22} /> } : {}),
                    },
                  ],
                  ...(isSiderCollapsed
                    ? { type: "group" }
                    : { icon: <TbClipboardText size={22} /> }),
                }
              : undefined,
            !!storeId
              ? {
                  label: "Marketing",
                  key: `/supplier/store/marketing` + uid,
                  children: [
                    {
                      label: (
                        <Link href={`/supplier/store/${storeId}/marketing`}>
                          {i18n["Kênh marketing"]}
                        </Link>
                      ),
                      key: `/supplier/store/${storeId}/marketing`,
                      className: "side-menu-item",
                      ...(isSiderCollapsed ? { icon: <FaRegLightbulb size={22} /> } : {}),
                    },
                    {
                      label: (
                        <Link href={`/supplier/store/${storeId}/marketing/voucher`}>
                          {i18n["Mã giảm giá"]}
                        </Link>
                      ),
                      key: `/supplier/store/${storeId}/marketing/voucher`,
                      className: "side-menu-item",
                      ...(isSiderCollapsed ? { icon: <TbDiscount2 size={22} /> } : {}),
                    },
                    // {
                    //   label: (
                    //     <Link href={`/supplier/store/${storeId}/marketing/promotion`}>
                    //       {i18n["Chương trình khuyến mãi"]}
                    //     </Link>
                    //   ),
                    //   key: `/supplier/store/${storeId}/marketing/promotion`,
                    //   className: "side-menu-item",
                    //   ...(isSiderCollapsed ? { icon: <FaRegLightbulb size={22} /> } : {}),
                    // },
                    // {
                    //   label: (
                    //     <Link href={`/supplier/store/${storeId}/marketing/advertisement`}>
                    //       {i18n["Quảng cáo"]}
                    //     </Link>
                    //   ),
                    //   key: `/supplier/store/${storeId}/marketing/advertisement`,
                    //   className: "side-menu-item",
                    //   ...(isSiderCollapsed ? { icon: <RiAdvertisementLine size={22} /> } : {}),
                    // },
                    // {
                    //   label: (
                    //     <Link href={`/supplier/store/${storeId}/marketing/flashsale`}>
                    //       Flash Sale
                    //     </Link>
                    //   ),
                    //   key: `/supplier/store/${storeId}/marketing/flashsale`,
                    //   className: "side-menu-item",
                    //   ...(isSiderCollapsed ? { icon: <IoIosFlash size={22} /> } : {}),
                    // },
                  ],
                  ...(isSiderCollapsed
                    ? { type: "group" }
                    : { icon: <FaRegLightbulb size={22} /> }),
                }
              : undefined,
            !!storeId
              ? {
                  label: "Địa chỉ",
                  key: `/supplier/store/addresses` + uid,
                  children: [
                    {
                      label: (
                        <Link href={`/supplier/store/${storeId}/addresses`}>
                          {i18n["Tất cả địa chỉ"]}
                        </Link>
                      ),
                      key: `/supplier/store/${storeId}/addresses`,
                      className: "side-menu-item",
                      ...(isSiderCollapsed ? { icon: <TbMap2 size={22} /> } : {}),
                    },
                  ],
                  ...(isSiderCollapsed ? { type: "group" } : { icon: <TbMap2 size={22} /> }),
                }
              : undefined,
            !!storeId
              ? {
                  label: i18n["Dịch vụ"],
                  key: `/supplier/store/amenities` + uid,
                  children: [
                    {
                      label: (
                        <Link href={`/supplier/store/${storeId}/amenities/group`}>
                          {i18n["Nhóm dịch vụ"]}
                        </Link>
                      ),
                      key: `/supplier/store/${storeId}/amenities/group`,
                      className: "side-menu-item",
                      ...(isSiderCollapsed ? { icon: <BiLibrary size={22} /> } : {}),
                    },
                    {
                      label: (
                        <Link href={`/supplier/store/${storeId}/amenities/combo`}>
                          {i18n["Combo dịch vụ"]}
                        </Link>
                      ),
                      key: `/supplier/store/${storeId}/amenities/combo`,
                      className: "side-menu-item",
                      ...(isSiderCollapsed ? { icon: <BiGridAlt size={22} /> } : {}),
                    },
                    {
                      label: (
                        <Link href={`/supplier/store/${storeId}/amenities`}>
                          {i18n["Tất cả dịch vụ"]}
                        </Link>
                      ),
                      key: `/supplier/store/${storeId}/amenities`,
                      className: "side-menu-item",
                      ...(isSiderCollapsed ? { icon: <BiOutline size={22} /> } : {}),
                    },
                    {
                      label: (
                        <Link href={`/supplier/store/${storeId}/amenities/booking`}>
                          {i18n["Đơn hàng dịch vụ"]}
                        </Link>
                      ),
                      key: `/supplier/store/${storeId}/amenities/booking`,
                      className: "side-menu-item",
                      ...(isSiderCollapsed ? { icon: <RiBillLine size={22} /> } : {}),
                    },
                  ],
                  ...(isSiderCollapsed ? { type: "group" } : { icon: <BiOutline size={22} /> }),
                }
              : undefined,
            !!storeId
              ? {
                  label: "Website",
                  key: `/supplier/store/website` + uid,
                  children: [
                    {
                      label: <Link href={`/supplier/store/${storeId}/website`}>Giao diện</Link>,
                      key: `/supplier/store/${storeId}/website`,
                      className: "side-menu-item",
                      ...(isSiderCollapsed ? { icon: <AiOutlineGlobal size={22} /> } : {}),
                    },
                    {
                      label: <Link href={`/supplier/store/${storeId}/partnerlink`}>Liên kết</Link>,
                      key: `/supplier/store/${storeId}/partnerlink`,
                      className: "side-menu-item",
                      ...(isSiderCollapsed ? { icon: <AiOutlineGlobal size={22} /> } : {}),
                    },
                  ],
                  ...(isSiderCollapsed
                    ? { type: "group" }
                    : { icon: <AiOutlineGlobal size={22} /> }),
                }
              : undefined,
            !!storeId
              ? {
                  label: i18n["Khách hàng"],
                  key: `/supplier/store/customers` + uid,
                  children: [
                    {
                      label: (
                        <Link href={`/supplier/store/${storeId}/customers`}>
                          {i18n["Tất cả khách hàng"]}
                        </Link>
                      ),
                      key: `/supplier/store/${storeId}/customers`,
                      className: "side-menu-item",
                      ...(isSiderCollapsed ? { icon: <MdGroups size={22} /> } : {}),
                    },
                  ],
                  ...(isSiderCollapsed ? { type: "group" } : { icon: <MdGroups size={22} /> }),
                }
              : undefined,
            { type: "divider" },
            {
              label: i18n["Cửa hàng"],
              key: `/supplier/store` + uid,
              children: [
                {
                  label: <Link href={`/supplier/store`}>{i18n["Tất cả cửa hàng"]}</Link>,
                  key: `/supplier/store`,
                  className: "side-menu-item",
                  ...(isSiderCollapsed ? { icon: <MdOutlineStore size={22} /> } : {}),
                },
                {
                  label: <Link href={`/supplier/store/create`}>{i18n["Thêm cửa hàng"]}</Link>,
                  key: `/supplier/store/create`,
                  className: "side-menu-item",
                  ...(isSiderCollapsed
                    ? { icon: <MdOutlineAddBusiness size={22} style={{ marginLeft: 2 }} /> }
                    : {}),
                },
              ],
              ...(isSiderCollapsed ? { type: "group" } : { icon: <MdOutlineStore size={22} /> }),
            },
          ] as any[]
        ).filter((item) => !!item)}
      />
    </MenuWrapper>
  );
}

export function SiderMenuNavFarm() {
  const {
    locale,
    asPath,
    query: { storeId, farmId },
  } = useRouter();
  const uid = useId();

  const { i18n } = useChangeLocale();
  const { isSiderCollapsed } = useAppSelector((s) => s.visible);
  const { generatedColors } = useTheme();

  const { gSelectedProvider: gSelectedProviderFarm, gTypeProvider: gTypeProviderFarm } =
    useGetProviderFarm();

  return (
    <MenuWrapper className={`${isSiderCollapsed ? "collapsed" : ""} ${locale || ""}`}>
      <Menu
        key={String(farmId) + uid}
        inlineIndent={12}
        defaultOpenKeys={[
          "/supplier/farm" + uid,
          // `/supplier/farm/item` + uid,
          // `/supplier/farm/package` + uid,
          // `/supplier/farm/order` + uid,
          // `/supplier/farm/register` + uid,
          // `/supplier/farm/marketing` + uid,
          // `/supplier/farm/addresses` + uid,
        ]}
        selectedKeys={[asPath.split("?")[0]]}
        selectable={false}
        style={{ backgroundColor: "transparent" }}
        theme="light"
        mode="inline"
        className="side-menu"
        items={(
          [
            {
              label: (
                <Link href={!!farmId ? `/supplier/farm/${farmId}` : "/"}>{i18n["Tổng quan"]}</Link>
              ),
              icon: <TbBrandGoogleHome size={22} />,
              key: !!farmId ? `/supplier/farm/${farmId}` : "/",
              className: "side-menu-item",
            },
            //Farming
            !!farmId
              ? {
                  label: i18n["Gói farming"],
                  key: `/supplier/farm/package` + uid,
                  children: [
                    {
                      label: (
                        <Link href={`/supplier/farm/${farmId}/package`}>
                          {i18n["Danh sách gói farming"]}
                        </Link>
                      ),
                      key: `/supplier/farm/${farmId}/package`,
                      className: "side-menu-item",
                      ...(isSiderCollapsed ? { icon: <FiBox size={22} /> } : {}),
                    },
                    {
                      label: (
                        <Link href={`/supplier/farm/${farmId}/activity`}>
                          {i18n["Danh sách hoạt động"]}
                        </Link>
                      ),
                      key: `/supplier/farm/${farmId}/activity`,
                      className: "side-menu-item",
                      ...(isSiderCollapsed ? { icon: <FiBox size={22} /> } : {}),
                    },
                  ],
                  ...(isSiderCollapsed ? { type: "group" } : { icon: <FiPackage size={22} /> }),
                }
              : undefined,
            !!farmId
              ? {
                  label: i18n["Sản phẩm"],
                  key: `/supplier/farm/item` + uid,
                  children: [
                    {
                      label: (
                        <Link href={`/supplier/farm/${farmId}/item`}>
                          {i18n["Danh sách sản phẩm"]}
                        </Link>
                      ),
                      key: `/supplier/farm/${farmId}/item`,
                      className: "side-menu-item",
                      ...(isSiderCollapsed ? { icon: <RiShoppingBag3Line size={22} /> } : {}),
                    },
                    {
                      label: (
                        <Link href={`/supplier/farm/${farmId}/item/create`}>
                          {i18n["Tạo sản phẩm"]}
                        </Link>
                      ),
                      key: `/supplier/farm/${farmId}/item/create`,
                      className: "side-menu-item",
                      ...(isSiderCollapsed ? { icon: <MdOutlineAddBox size={22} /> } : {}),
                    },
                  ],
                  ...(isSiderCollapsed
                    ? { type: "group" }
                    : { icon: <RiShoppingBag3Line size={22} /> }),
                }
              : undefined,
            !!farmId
              ? {
                  label: i18n["Đăng ký"],
                  key: `/supplier/farm/register` + uid,
                  children: [
                    {
                      label: (
                        <Link href={`/supplier/farm/${farmId}/register`}>
                          {i18n["Đăng ký gói farming"]}
                        </Link>
                      ),
                      key: `/supplier/farm/${farmId}/register`,
                      className: "side-menu-item",
                      ...(isSiderCollapsed ? { icon: <MdChecklist size={22} /> } : {}),
                    },
                  ],
                  ...(isSiderCollapsed
                    ? { type: "group" }
                    : { icon: <FaRegCheckCircle size={21} /> }),
                }
              : undefined,
            !!farmId
              ? {
                  label: i18n["Đơn hàng"],
                  key: `/supplier/farm/order` + uid,
                  children: [
                    {
                      label: (
                        <Link href={`/supplier/farm/${farmId}/order`}>
                          {i18n["Tất cả đơn hàng"]}
                        </Link>
                      ),
                      key: `/supplier/farm/${farmId}/order`,
                      className: "side-menu-item",
                      ...(isSiderCollapsed ? { icon: <TbClipboardText size={22} /> } : {}),
                    },
                  ],
                  ...(isSiderCollapsed
                    ? { type: "group" }
                    : { icon: <TbClipboardText size={22} /> }),
                }
              : undefined,
            !!farmId
              ? {
                  label: "Marketing",
                  key: `/supplier/farm/marketing` + uid,
                  children: [
                    // {
                    //   label: (
                    //     <Link href={`/supplier/farm/${farmId}/marketing`}>
                    //       {i18n["Kênh marketing"]}
                    //     </Link>
                    //   ),
                    //   key: `/supplier/farm/${farmId}/marketing`,
                    //   className: "side-menu-item",
                    //   ...(isSiderCollapsed ? { icon: <FaRegLightbulb size={22} /> } : {}),
                    // },
                    {
                      label: (
                        <Link href={`/supplier/farm/${farmId}/voucher`}>{i18n["Mã giảm giá"]}</Link>
                      ),
                      key: `/supplier/farm/${farmId}/voucher`,
                      className: "side-menu-item",
                      ...(isSiderCollapsed ? { icon: <TbDiscount2 size={22} /> } : {}),
                    },
                  ],
                  ...(isSiderCollapsed
                    ? { type: "group" }
                    : { icon: <FaRegLightbulb size={22} /> }),
                }
              : undefined,
            !!farmId
              ? {
                  label: "Địa chỉ",
                  key: `/supplier/farm/addresses` + uid,
                  children: [
                    {
                      label: (
                        <Link href={`/supplier/farm/${farmId}/addresses`}>
                          {i18n["Tất cả địa chỉ"]}
                        </Link>
                      ),
                      key: `/supplier/farm/${farmId}/addresses`,
                      className: "side-menu-item",
                      ...(isSiderCollapsed ? { icon: <TbMap2 size={22} /> } : {}),
                    },
                  ],
                  ...(isSiderCollapsed ? { type: "group" } : { icon: <TbMap2 size={22} /> }),
                }
              : undefined,
            !!farmId
              ? {
                  label: "Website",
                  key: `/supplier/farm/website` + uid,
                  children: [
                    {
                      label: <Link href={`/supplier/farm/${farmId}/website`}>Giao diện</Link>,
                      key: `/supplier/farm/${farmId}/website`,
                      className: "side-menu-item",
                      ...(isSiderCollapsed ? { icon: <AiOutlineGlobal size={22} /> } : {}),
                    },
                    {
                      label: <Link href={`/supplier/farm/${farmId}/partnerlink`}>Liên kết</Link>,
                      key: `/supplier/farm/${farmId}/partnerlink`,
                      className: "side-menu-item",
                      ...(isSiderCollapsed ? { icon: <AiOutlineGlobal size={22} /> } : {}),
                    },
                  ],
                  ...(isSiderCollapsed
                    ? { type: "group" }
                    : { icon: <AiOutlineGlobal size={22} /> }),
                }
              : undefined,
            !!farmId
              ? {
                  label: i18n["Khách hàng"],
                  key: `/supplier/farm/customers` + uid,
                  children: [
                    {
                      label: (
                        <Link href={`/supplier/farm/${farmId}/customers`}>
                          {i18n["Tất cả khách hàng"]}
                        </Link>
                      ),
                      key: `/supplier/farm/${farmId}/customers`,
                      className: "side-menu-item",
                      ...(isSiderCollapsed ? { icon: <MdGroups size={22} /> } : {}),
                    },
                  ],
                  ...(isSiderCollapsed ? { type: "group" } : { icon: <MdGroups size={22} /> }),
                }
              : undefined,
            { type: "divider" },
            {
              label: i18n["Trang trại"],
              key: `/supplier/farm` + uid,
              children: [
                {
                  label: <Link href={`/supplier/farm/list`}>{i18n["Tất cả trang trại"]}</Link>,
                  key: `/supplier/farm/list`,
                  className: "side-menu-item",
                  ...(isSiderCollapsed ? { icon: <EcofarmSvg width={21} /> } : {}),
                },
                {
                  label: <Link href={`/supplier/farm/create`}>{i18n["Thêm trang trại"]}</Link>,
                  key: `/supplier/farm/create`,
                  className: "side-menu-item",
                  ...(isSiderCollapsed ? { icon: <FcPlus size={22} /> } : {}),
                },
              ],
              ...(isSiderCollapsed ? { type: "group" } : { icon: <EcofarmSvg width={21} /> }),
            },
          ] as any[]
        ).filter((item) => !!item)}
      />
    </MenuWrapper>
  );
}

const MenuWrapper = styled.div`
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding: 6px 6px;
  &.collapsed {
    padding: 8px 8px;
  }
  &::-webkit-scrollbar {
    display: none;
  }
  .message-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 1px;
  }
  .ant-menu-item {
    margin-inline: 0;
    margin-block: 0;
    width: 100%;
  }
  .ant-menu-item-divider {
    margin-block: 4px;
  }
  .ant-menu-light {
    border: none !important;
  }
  .ant-menu-inline .ant-menu-submenu-title {
    margin-inline: 0px;
    width: 100%;
  }
  .side-menu-item,
  .ant-menu-submenu-title {
    display: flex;
    align-items: center;
    & > * {
      flex-shrink: 0;
    }
  }
  .ant-menu-light .ant-menu-item-selected {
    color: ${({ theme }) => theme.generatedColors[7]};
    background-color: ${({ theme }) => rgba(theme.generatedColors[7], 0.05)};
  }
  .ant-menu-item-group-title {
    padding-left: 10px;
    font-size: 10px;
  }
  &.en .ant-menu-item-group-title {
    font-size: 12px;
    padding-left: 18px;
  }
  &.ko .ant-menu-item-group-title {
    font-size: 12px;
    padding-left: 22px;
  }
`;

export default SiderMenuNav;
