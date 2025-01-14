import { LinkProps, default as NextLink } from "next/link";
import { ForwardRefRenderFunction, ReactNode, forwardRef } from "react";
import useChangeLocale from "src/hooks/useChangeLocale";

export type TLinkProps = LinkProps & {
  className?: string;
  children?: ReactNode;
  as?: "a";
  style?: React.CSSProperties;
};

const Link: ForwardRefRenderFunction<HTMLAnchorElement, TLinkProps> = (
  { className, children, onClick, href = "/", as = "a", style, ...props },
  forwardedRef,
) => {
  const { locale } = useChangeLocale();
  return (
    <NextLink {...props} legacyBehavior href={href} passHref locale={locale}>
      <a
        className={className}
        onClick={onClick}
        ref={forwardedRef}
        style={{ textDecoration: "none", ...style }}
      >
        {children}
      </a>
    </NextLink>
  );
};
export default forwardRef(Link);
