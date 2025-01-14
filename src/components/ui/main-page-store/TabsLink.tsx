import useChangeLocale from "@/hooks/useChangeLocale";
import { Tabs, TabsProps } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useId } from "react";

type TTabsLinkProps = TabsProps & {};

const TabsLink = (props: TTabsLinkProps) => {
  const uid = useId();
  const { pathname } = useRouter();
  const { i18n } = useChangeLocale();

  return (
    <Tabs
      size="middle"
      activeKey={uid + pathname}
      tabBarGutter={12}
      tabBarStyle={{ margin: "0 0 2px", padding: "0 8px", height: 36 }}
      items={[
        {
          key: uid + "/",
          label: (
            <Link href={"/"} style={{ color: "inherit" }}>
              {i18n["Cửa hàng"]}
            </Link>
          ),
        },
        {
          key: uid + "/supplier/farm",
          label: (
            <Link href={"/supplier/farm"} style={{ color: "inherit" }}>
              {i18n["Trang trại"]}
            </Link>
          ),
        },
      ]}
      {...props}
    />
  );
};

export default TabsLink;
