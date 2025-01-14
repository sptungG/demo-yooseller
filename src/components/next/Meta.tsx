import { NextSeo } from "next-seo";
import Head from "next/head";
import { useRouter } from "next/router";
import { metaConfig } from "src/configs/meta.config";

interface MetaProps {
  title: string;
  description: string;
}

function Meta(props: MetaProps) {
  const router = useRouter();
  return (
    <>
      <Head>
        <meta charSet="UTF-8" key="charset" />
        <meta name="viewport" content="width=device-width,initial-scale=1" key="viewport" />
        <meta httpEquiv="Cache-Control" content="max-age=31536000, must-revalidate" />
        <meta name="keywords" content={metaConfig.keywords} />
        <link rel="apple-touch-icon" href={`${router.basePath}/apple-touch-icon.png`} key="apple" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${router.basePath}/favicon-32x32.png`}
          key="icon32"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${router.basePath}/favicon-16x16.png`}
          key="icon16"
        />
        <link rel="icon" href={`${router.basePath}/favicon.ico`} key="favicon" />
      </Head>

      <NextSeo
        title={props.title}
        description={props.description}
        canonical={metaConfig.canonical}
        openGraph={{
          title: props.title,
          description: props.description,
          url: metaConfig.canonical,
          locale: metaConfig.locale,
          site_name: metaConfig.site_name,
        }}
      />
    </>
  );
}

export default Meta;
