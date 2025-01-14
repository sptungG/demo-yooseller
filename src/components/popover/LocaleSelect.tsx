import styled from "@emotion/styled";
import { Dropdown, Typography } from "antd";
import { useRouter } from "next/router";
import { MdOutlineGTranslate } from "react-icons/md";
import Button from "../button/Button";

type TLocaleSelectProps = {};

const LocaleSelect = ({}: TLocaleSelectProps) => {
  const { replace, pathname, asPath, query, locale } = useRouter();
  return (
    <Dropdown
      menu={{
        items: [
          {
            key: "vi",
            label: <MenuItem prefix="vi">Vietnam</MenuItem>,
          },
          {
            key: "en",
            label: <MenuItem prefix="en">English</MenuItem>,
          },
          {
            key: "ko",
            label: <MenuItem prefix="ko">Korean</MenuItem>,
          },
        ],
        selectable: true,
        defaultSelectedKeys: ["vi"],
        selectedKeys: [locale || "vi"],
        onSelect: ({ key }) => {
          replace({ pathname, query }, asPath, { locale: key });
        },
      }}
      trigger={["click"]}
      arrow={false}
      placement="bottomRight"
    >
      <Button color="#595959" type="text" icon={<MdOutlineGTranslate size={22} />}></Button>
    </Dropdown>
  );
};

type TMenuItemProps = { children?: string; prefix?: string };
const MenuItem = ({ children, prefix }: TMenuItemProps) => {
  return (
    <ItemStyled>
      <Typography.Text strong type="secondary" ellipsis>
        {prefix}
      </Typography.Text>
      {children}
    </ItemStyled>
  );
};

const ItemStyled = styled.div`
  padding: 2px 4px 2px 2px;
  .ant-typography {
    margin-right: 4px;
    width: 22px;
    display: inline-block;
  }
`;

export default LocaleSelect;
