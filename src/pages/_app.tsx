// import "@ant-design/plots/dist/index.css";
import "antd/dist/reset.css";
import "mac-scrollbar/dist/mac-scrollbar.css";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import NextNProgress from "nextjs-progressbar";
import "react-quill/dist/quill.snow.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Loader from "src/components/loader/Loader";
import store, { persistor } from "src/redux/store";
import "src/styles/globals.css";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/thumbs";

const GlobalScrollbar = dynamic(() => import("mac-scrollbar").then((m) => m.GlobalScrollbar), {
  ssr: false,
});

const ConfigProvider = dynamic(() => import("src/components/shared/ConfigProvider"), {
  loading: () => <Loader />,
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <NextNProgress color="#0D90F3" options={{ showSpinner: false }} />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ConfigProvider>
            <Component {...pageProps} />
          </ConfigProvider>
        </PersistGate>
      </Provider>
      <GlobalScrollbar />
    </>
  );
};

export default App;
