import { ThemeProvider } from "@emotion/react";
import { ConfigProvider as AntdConfigProvider, App, theme } from "antd";
import en_US from "antd/locale/en_US";
import ko_KR from "antd/locale/ko_KR";
import vi_VN from "antd/locale/vi_VN";
import { Suspense, useMemo } from "react";
import useChangeLocale from "src/hooks/useChangeLocale";
import { useGetCurrentUserQuery } from "src/redux/query/user.query";
import { useAppSelector } from "src/redux/store";
import Loader from "../loader/Loader";

type TConfigProviderProps = {
  children: React.ReactNode;
};

const { darkAlgorithm, defaultAlgorithm } = theme;

function ConfigProvider({ children }: TConfigProviderProps) {
  const { locale } = useChangeLocale();
  const antdLocale = useMemo(() => {
    if (locale === "en") return en_US;
    if (locale === "ko") return ko_KR;
    return vi_VN;
  }, [locale]);
  const { mode, colorPrimary, generatedColors } = useAppSelector((s) => s.theme);
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const res = useGetCurrentUserQuery(
    { at: !!accessToken },
    {
      skip: !accessToken,
      refetchOnFocus: true,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
    },
  );

  return (
    <Suspense fallback={<Loader />}>
      <AntdConfigProvider
        locale={antdLocale}
        theme={{
          token: { colorPrimary, colorLink: colorPrimary },
          algorithm: mode === "dark" ? darkAlgorithm : defaultAlgorithm,
        }}
        button={{ style: { boxShadow: "none" } }}
      >
        <ThemeProvider theme={{ mode, colorPrimary, generatedColors }}>
          <App component={false}>{children}</App>
        </ThemeProvider>
      </AntdConfigProvider>
    </Suspense>
  );
}

export default ConfigProvider;
