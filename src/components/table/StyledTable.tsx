import styled from "@emotion/styled";
import { Table } from "antd";

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th,
  .ant-table-thead > tr > td {
    border-radius: 0 !important;
  }
  .ant-table-tbody .ant-table-row-selected > .ant-table-cell {
    background: rgba(0, 0, 0, 0.05) !important;
    backdrop-filter: blur(10px);
  }
  .ant-table-tbody .ant-table-row-selected:hover > .ant-table-cell {
    background: rgba(0, 0, 0, 0.05) !important;
    backdrop-filter: blur(10px);
  }
`;
export default StyledTable;

export const ItemNameCombined4 = styled.div`
  display: flex;
  justify-content: flex-start;
  max-width: 100%;
  .image-wrapper {
    margin-right: 8px;
    flex-shrink: 0;
  }
  .container {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-width: 0px;
    max-width: 100%;
  }
  .desc-wrapper {
    user-select: none;
    pointer-events: none;
    opacity: 0.45;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    margin-bottom: 0;
    max-width: 100%;
    height: 24px;
    overflow: hidden;
    p {
      margin-bottom: 0;
    }
  }
  .price-wrapper {
    margin-top: auto;
  }
`;

export const ItemRateView = styled.div`
  flex-shrink: 0;
  display: flex;
  min-width: 120px;
  flex-wrap: wrap;
  gap: 8px;
  & > * {
    display: flex;
    flex-shrink: 0;
    svg {
      margin-right: 4px;
      flex-shrink: 0;
    }
  }
`;

export const ItemStock = styled.div`
  display: flex;
  align-items: center;
  .info {
    margin-left: auto;
  }
`;

export const NameWithViewIcon = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: fit-content;
  cursor: pointer;
  .name,
  .code {
    flex: 1 1 auto;
    min-width: 0px;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    word-break: break-word;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.1;
  }
  .code {
    color: ${({ theme }) => theme.colorPrimary};
    margin: 0;
  }
  .view-icon {
    display: none;
    flex-shrink: 0;
    color: ${({ theme }) => theme.colorPrimary};
    margin-left: 4px;
    /* position: absolute;
    top: 50%;
    right: 0;
    transform: translate(calc(100% + 8px), -50%); */
  }
  &:hover {
    .ant-typography {
      text-decoration: underline;
    }
    .view-icon {
      display: block;
    }
  }
`;

export const CurrentStateActionBtn = styled.button`
  position: relative;
  width: 100%;
  border: none;
  outline: none;
  padding: 0;
  background-color: transparent;
  cursor: pointer;
  min-width: fit-content;
  .tag {
    padding: 0 42px 0 14px;
    height: 32px;
    justify-content: flex-start;
    width: 100%;
  }
  .dots-icon {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
  }
  & > .actions-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    transform: translateY(100%);
  }
`;

export const Price2Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .price-container {
    .ant-typography {
      font-size: 16px;
    }
  }
`;

export const RecipientAddressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  .header-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 2px;
  }
  .ant-typography {
    line-height: 1.25;
  }
`;

export const ItemsInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .info {
    margin-left: 8px;
  }
  .remain-items {
    flex-shrink: 0;
  }
  .remain-item {
    position: relative;
    .quantity-wrapper {
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 2px 4px;
      background-color: #d9d9d9;
      border-radius: 0 4px 0 4px;
      font-size: 13px;
      max-width: calc(100% - 8px);
      overflow: hidden;
      line-height: 1.1;
    }
  }
`;

export const TrackingInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  .ant-timeline-item {
    padding-bottom: 0;
    display: flex;
    flex-direction: column;
    .ant-timeline-item-head {
      top: 16px;
    }
    .ant-timeline-item-tail {
      height: 100%;
      inset-block-start: 0px;
    }
    .ant-timeline-item-content {
      display: flex;
      flex-direction: column;
      margin-top: 8px;
      & > .ant-typography {
        line-height: 1.2;
        margin-bottom: 0;
      }
    }
  }
  .ant-timeline-item:first-of-type {
    display: block;
    .ant-timeline-item-head {
      top: 0;
      background-color: transparent;
    }
  }
  .ant-timeline-item-last {
    .ant-timeline-item-content {
      min-height: 0px;
    }
  }
  & > .actions-wrapper {
    display: none;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    .btn-update {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
  &:hover {
    & > .actions-wrapper {
      display: block;
    }
  }
`;

export const StoreDetailWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  .detail-images {
    margin-right: 8px;
    flex-shrink: 0;
    position: relative;
    & > span.ant-avatar.ant-avatar-circle {
      position: absolute;
      bottom: 4px;
      right: 4px;
    }
  }
  .container {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-width: 0px;
    max-width: 244px;
  }
  .desc-wrapper {
    user-select: none;
    pointer-events: none;
    opacity: 0.45;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    margin-bottom: 0;
    p {
      margin-bottom: 0;
    }
  }
  .rate-wrapper {
    margin-top: auto;
    display: flex;
    align-items: center;
    gap: 2px;
    & .ant-tag {
      line-height: 0;
      gap: 4px;
      padding: 2px 6px;
    }
    & .ant-typography {
      font-size: 13px;
    }
  }
`;

export const IconsInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
