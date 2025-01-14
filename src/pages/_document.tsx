import { Head, Html, Main, NextScript } from "next/document";
import { useId } from "react";

export default function Document() {
  const uid = useId();
  return (
    <Html>
      <Head />
      <body key={uid} style={{ background: "#fff" }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
