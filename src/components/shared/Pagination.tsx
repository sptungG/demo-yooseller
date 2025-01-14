import { Pagination as AntdPagination, PaginationProps } from "antd";
import sortedUniq from "lodash/sortedUniq";

type TPaginationProps = Omit<PaginationProps, "pageSizeOptions"> & { pageSizeOptions?: number[] };

const Pagination = ({ pageSizeOptions, ...props }: TPaginationProps) => {
  const newPageSizeOptions = sortedUniq<number>(pageSizeOptions);
  return <AntdPagination pageSizeOptions={newPageSizeOptions} {...props} />;
};

export default Pagination;
