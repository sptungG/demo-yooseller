import styled from "@emotion/styled";
import { Breadcrumb as AntdBreadcrumb, BreadcrumbProps } from "antd";
import { useRouter } from "next/router";
import { useId } from "react";
import Link from "src/components/next/Link";
import useChangeLocale from "src/hooks/useChangeLocale";
import LogoWithText from "./LogoWithText";

type TBreadcrumbHeaderProps = Omit<BreadcrumbProps, "items"> & {
  items?: { [K: string]: React.ReactNode }[];
  current?: React.ReactNode;
  showText?: boolean;
};

const BreadcrumbHeader = ({ items, current, showText, ...props }: TBreadcrumbHeaderProps) => {
  const uid = useId();
  const { asPath, pathname } = useRouter();
  const { i18n } = useChangeLocale();

  return (
    <AntdBreadcrumbStyled
      items={[{ ["/"]: "/" }, ...(items || []), !!current && { [asPath]: current }]
        .filter((i) => !!i)
        .map((item) => {
          const [path, label] = Object.entries(item)[0];
          if (path === "/")
            return {
              title: (
                <Link href="/">
                  <LogoWithText
                    fontSize={!!showText ? [26, 26] : pathname !== "/" ? [0, 0] : [26, 26]}
                    fontWeight={[700, 700]}
                    logoSize={[40, 40]}
                  />
                </Link>
              ),
              key: path + uid,
              className: `logo-item ${!!showText ? "" : pathname !== "/" ? "hide-text" : ""}`,
            };
          return {
            title: (
              <Link href={path} style={{ maxWidth: 250 }}>
                <div className="line-clamp-1">{label}</div>
              </Link>
            ),
            key: path + uid,
            className: "breadcrumb-item",
          };
        })}
      {...props}
    />
  );
};

const AntdBreadcrumbStyled = styled(AntdBreadcrumb)`
  & > ol {
    flex-wrap: nowrap;
  }
  .logo-item a {
    padding: 0;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-right: 8px;
  }
  .logo-item.hide-text a {
    padding-right: 0;
  }
  .breadcrumb-item a {
    font-weight: 500;
    font-size: 18px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  li {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
`;

export default BreadcrumbHeader;
