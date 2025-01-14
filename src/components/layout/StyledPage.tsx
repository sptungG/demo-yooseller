import { css } from "@emotion/react";
import styled from "@emotion/styled";

const StyledPage = styled.div`
  --box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02),
    0 2px 4px 0 rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: 0px;
  .page-header {
    display: flex;
    align-items: flex-start;
    flex-wrap: nowrap;
    flex: 0 0 auto;
    min-height: 0px;
    & > .left-wrapper {
      flex: 1 1 auto;
      min-width: 0px;
    }
    & > .right-wrapper {
      flex: 0 0 auto;
      min-width: 0px;
      display: flex;
      align-items: center;
    }
  }
`;

export const cssListWrapper = css`
  .ant-card-head {
    padding: 0 14px 0 16px;
  }
  .ant-card-extra {
    display: flex;
    align-items: center;
  }
  .ant-card-body {
    padding: 0;
    & > .header-wrapper {
      display: flex;
      align-items: center;
      padding: 16px 16px;
      justify-content: space-between;
    }
  }
  .list-empty {
    height: 240px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 0;
  }
`;

export const cssFilterWrapper = css`
  display: flex;
  align-items: center;
  width: 480px;
  .btn-popover {
    align-self: stretch;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    height: 33.3px;
    flex-shrink: 0;
  }
  .btn-reset {
    height: 33.3px;
    flex-shrink: 0;
    border-radius: 0;
    align-self: stretch;
  }
  .input-search {
    height: 33.4px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;
export const cssFooterWrapper = css`
  border-top: 1px solid rgba(5, 5, 5, 0.06);
  padding: 10px 16px;
  border-radius: 0 0 6px 6px;
  display: flex;
  align-items: center;
`;

export default StyledPage;
