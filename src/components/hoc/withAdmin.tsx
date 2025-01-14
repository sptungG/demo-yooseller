import { jsx } from "@emotion/react";
import { useRouter } from "next/router";
import { ComponentType } from "react";
import { useAppSelector } from "src/redux/store";
import Navigate from "../next/Navigate";

type IntrinsicAttributes = jsx.JSX.IntrinsicAttributes;

function withAdmin<T extends IntrinsicAttributes>(WrappedComponent: ComponentType<T>) {
  return function ComponentWithAuth(props: T) {
    const { asPath } = useRouter();
    const accessToken = useAppSelector((s) => s.auth.accessToken);
    const userData = useAppSelector((s) => s.user.data);

    if (!accessToken) return <Navigate to="/login" />;

    if (userData?.userName !== "imax_admin") return <Navigate to="/" />;

    return <WrappedComponent {...props} />;
  };
}

export default withAdmin;
