import styled from "@emotion/styled";
import { Result as AntdResult, ResultProps } from "antd";
import { TError } from "src/types/response.types";

type TResultProps = ResultProps & {
  error?: any;
};

const Result = ({ error, ...props }: TResultProps) => {
  if (!error) return <></>;

  const internalError = error as {
    status: ResultProps["status"];
    data: { error: TError };
  };

  return (
    <ResultStyled
      status={internalError.status}
      title={<>{String(internalError.status)}</>}
      subTitle={<>{internalError.data?.error?.message}</>}
      {...props}
    />
  );
};
const ResultStyled = styled(AntdResult)``;

export default Result;
