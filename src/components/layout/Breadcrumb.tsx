import { Breadcrumb as AntdBreadcrumb, BreadcrumbProps } from "antd";
import { useRouter } from "next/router";
import Link from "src/components/next/Link";
import useChangeLocale from "src/hooks/useChangeLocale";

type TBreadcrumbProps = Omit<BreadcrumbProps, "items"> & {
  items?: { [K: string]: string }[];
  current?: string;
};

const Breadcrumb = ({ items, current, ...props }: TBreadcrumbProps) => {
  const { asPath } = useRouter();
  const { i18n } = useChangeLocale();

  return (
    <AntdBreadcrumb
      items={[{ ["/"]: i18n["Tổng quan"] }, ...(items || []), !!current && { [asPath]: current }]
        .filter((i) => !!i)
        .map((item) => {
          const [path, label] = Object.entries(item)[0];
          return { title: <Link href={path}>{label}</Link>, key: path };
        })}
      {...props}
    />
  );
};

export default Breadcrumb;
