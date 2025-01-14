import { jsx } from "@emotion/react";
import { ComponentType } from "react";
import { useAppSelector } from "src/redux/store";
import Navigate from "../next/Navigate";

type IntrinsicAttributes = jsx.JSX.IntrinsicAttributes;

function withoutAuth<T extends IntrinsicAttributes>(WrappedComponent: ComponentType<T>) {
  return function ComponentWithoutAuth(props: T) {
    const accessToken = useAppSelector((s) => s.auth.accessToken);

    if (!!accessToken) return <Navigate to="/" />;

    return <WrappedComponent {...props} />;
  };
}

export default withoutAuth;
