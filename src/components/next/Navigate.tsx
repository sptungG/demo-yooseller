import { useRouter } from "next/router";
import { useEffect } from "react";

type TNavigateProps = {
  to: string;
};

const Navigate = ({ to }: TNavigateProps) => {
  const router = useRouter();

  useEffect(() => {
    router.push(to);
  }, [JSON.stringify(router), to]);

  return <></>;
};

export default Navigate;
