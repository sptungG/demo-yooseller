import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Avatar, Dropdown, MenuProps, Space, Typography } from "antd";
import { FaRegUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineStore } from "react-icons/md";
import useChangeLocale from "src/hooks/useChangeLocale";
import useLogout from "src/hooks/useLogout";
import { useAppSelector } from "src/redux/store";
import Button from "../button/Button";
import Link from "../next/Link";

type TProfilePopoverProps = {};

const ProfilePopover = ({}: TProfilePopoverProps) => {
  const { i18n } = useChangeLocale();
  const { data: dataUser } = useAppSelector((s) => s.user);
  const { handleLogout, isLoadingLogout } = useLogout();

  const items: MenuProps["items"] = [
    {
      label: (
        <MenuItemLinkStyled href="/profile">
          <Space direction="vertical" size={0}>
            <Typography.Text>{i18n["Tài khoản"]}</Typography.Text>
            <Typography.Text type="secondary" style={{ width: 100 }} ellipsis>
              {dataUser?.fullName || ""}
            </Typography.Text>
          </Space>
          <FaRegUserCircle size={22} />
        </MenuItemLinkStyled>
      ),
      key: "profile",
    },
    { type: "divider" },
    {
      label: (
        <MenuItemLinkStyled href="/supplier/store">
          {i18n["Tất cả cửa hàng"]} <MdOutlineStore size={22} />
        </MenuItemLinkStyled>
      ),
      key: "/supplier/store",
    },
    { type: "divider" },
    {
      label: (
        <MenuItemStyled onClick={() => handleLogout()}>
          <span style={{ fontWeight: "normal" }}>{i18n["Đăng xuất"]}</span> <FiLogOut size={22} />
        </MenuItemStyled>
      ),
      key: "logout",
    },
  ];

  return (
    <Dropdown
      menu={{ style: { borderRadius: 8, padding: 8 }, items }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <AvatarWrapper size="large" shape="circle" title="Đi đến trang cá nhân">
        <Avatar
          src={dataUser?.imageUrl || "https://source.unsplash.com/random?vietnam,nature"}
          alt="avatar"
        />
      </AvatarWrapper>
    </Dropdown>
  );
};

const AvatarWrapper = styled(Button)`
  height: 48px !important;
  width: 48px;
  padding: 0 !important;
  background-color: rgba(${({ theme }) => theme.generatedColors[0]}, 0.5);
  backdrop-filter: blur(4px);
  .ant-avatar-image {
    position: relative;
    height: 100%;
    width: 100%;
    border-width: 4px;
    img {
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      object-fit: cover;
    }
  }
`;

const commonCss = css`
  padding: 7px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  gap: 16px;
`;

const MenuItemLinkStyled = styled(Link)`
  ${commonCss}
`;

const MenuItemStyled = styled.div`
  ${commonCss}
`;

export default ProfilePopover;
