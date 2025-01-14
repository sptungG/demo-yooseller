import { APP_NAME, URL } from "./constant.config";

export const metaConfig = {
  site_name: APP_NAME,
  title: `${APP_NAME}`,
  description: `${APP_NAME}`,
  canonical: URL,
  keywords: "yoo, seller, supplier, supplier chain, ecosystem, shop, shopping",
  image: `${URL}/images/logo-transparent.png`,
  url: URL,
  type: "website",
  locale: "vi",
  facebook: "https://www.facebook.com/YoolifeAIoTPlatform",
  googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
};
