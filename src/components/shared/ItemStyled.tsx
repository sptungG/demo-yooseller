import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { rgba } from "emotion-rgba";
import Link from "../next/Link";

export const SelectItemStyled = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 8px;
  position: relative;
  z-index: 0;
  max-width: 100%;
  & > * {
    flex-shrink: 0;
  }
  .ant-image {
    position: relative;
    img.select-image {
      border-radius: 6px;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  }
  .name-wrapper {
    flex: 1 1 auto;
    min-width: 0px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    max-width: fit-content;
  }
  .type-wrapper {
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 0 0 auto;
    min-width: 0px;
    .ant-tag {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

export const SelectItemStyledLink = styled(Link)`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 8px;
  & > * {
    flex-shrink: 0;
  }
  .ant-image {
    position: relative;
    img.select-image {
      border-radius: 6px;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  }
  .name-wrapper {
    color: ${({ theme }) => theme.generatedColors[8]};
    font-size: 15px;
    font-weight: 400;
  }
  .type-wrapper {
    margin-left: auto;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
  }
`;

export const TierItemStyled = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;
  gap: 12px;
  .form-item-name {
    flex: 0 0 200px;
  }
  .form-item-optionList {
    flex: 1 1 auto;
    min-width: 0;
  }
`;

export const FormItemModelStyled = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;
  position: relative;
  border: 1px dashed #d9d9d9;
  margin-bottom: 12px;
  border-radius: 8px;
  padding: 8px;
  .left-wrapper {
    position: relative;
    flex: 0 0 140px;
    align-self: stretch;
    margin-right: 8px;
    .badge-default {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
    }
    & .image-upload-wrapper {
    }
    .ant-upload {
      border-radius: 4px;
      padding-top: 2px;
    }
    .ant-upload-drag-container {
      padding: 0 16px;
    }
    .ant-upload-drag-icon {
      margin-bottom: 0px !important;
    }
    .ant-upload-text {
      font-size: 14px !important;
      line-height: 1.1;
    }
    .btn-upload {
      gap: 4px;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 50%);
      &:disabled {
        background-color: #eee;
      }
    }
  }
  .right-wrapper {
    flex: 1 1 auto;
    min-width: 0;
    position: relative;
    height: 140px;
    display: flex;
    flex-direction: column;
    .name-wrapper {
      display: flex;
      align-items: center;
      .name {
        margin: 0 12px 0 11px;
      }
    }
    .ant-input-number-affix-wrapper-status-error {
      .ant-input-number-prefix {
        color: #ff4d4f;
      }
      input::placeholder {
        color: #ff4d50b8;
      }
    }
  }
  .price-wrapper {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    width: 100%;
    .middle-icon {
      flex: 0 0 16px;
    }
  }
  .action-update-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-16px, -50%);
  }
  & > .actions-wrapper {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(50%, -50%);
  }
  .image-upload-wrapper {
    /* .image-wrapper {
      height: 124px;
      .ant-image img {
        height: 124px;
      }
    } */
    height: 100%;
    .btn-upload {
      margin-top: 24px;
    }
  }
  &:focus-within {
    border-color: ${({ theme }) => theme.colorPrimary};
  }
`;

export const cssPriceRangeWrapper = css`
  .price-wrapper-extra {
    margin-left: 8px;
  }
  .ant-form-item-control-input-content {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: 12px;
  }
  .site-input-split {
    width: 36px;
    border-left: 0;
    border-right: 0;
    pointer-events: none;
    flex-shrink: 0;
    text-align: center;
    background-color: transparent;
  }
  .ant-input-number-affix-wrapper {
    width: 100%;
  }
  .ant-input-number {
    width: 100%;
  }
  .site-input-left {
    border-right-width: 0;
    border-radius: 8px 0 0 8px;
    &:hover,
    &:focus {
      border-right-width: 1px;
    }
  }
  .site-input-right {
    border-left-width: 0;
    border-radius: 0 8px 8px 0;
    &:hover,
    &:focus {
      border-left-width: 1px;
    }
  }
  .left-wrapper {
    flex: 1 1 50%;
    min-width: 0px;
  }
  .right-wrapper {
    flex: 1 1 50%;
    min-width: 0px;
  }
`;

export const cssAddItemModel = css`
  position: relative;
  .content-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
  }
`;

export const PropertiesFormListItemStyled = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  margin-bottom: 24px;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  padding-right: 8px;
  &:focus-within {
    border-color: ${({ theme }) => theme.colorPrimary};
  }
  .date-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    & > span {
      flex-shrink: 0;
    }
  }
  .actions-wrapper {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(50%, -50%);
  }
`;

export const DatePickerStyled = styled.div`
  & > .title-wrapper {
    display: flex;
    align-items: center;
    height: 42px;
    padding: 0 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
  & > .wrapper {
    display: flex;
    & > .left-wrapper {
      padding: 20px 8px 20px 0;
      border-right: 1px solid rgba(217, 217, 217, 0.5);
      .ant-tabs-nav {
        width: 100%;
        margin-left: 1px;
      }
      .ant-tabs-tab {
        padding: 0 0 0 8px;
        & > .ant-tabs-tab-btn {
          padding: 8px 12px;
          width: 100%;
          border-radius: 4px;
          text-align: left;
          font-size: 14px;
        }
        &.ant-tabs-tab-active .ant-tabs-tab-btn {
          background-color: ${({ theme }) => rgba(theme.colorPrimary, 0.1)};
        }
        &:hover {
          .ant-tabs-tab-btn {
            background-color: rgba(0, 0, 0, 0.05);
          }
        }
      }
      .ant-tabs-tab + .ant-tabs-tab {
        margin: 8px 0 0;
      }
    }
    & > .right-wrapper {
      .ant-picker-presets {
        ul {
          padding: 20px 6px;
        }
        li {
          padding-inline: 8px !important;
          padding-block: 8px !important;
        }
      }
    }
  }
`;

export const cssCurrentStateTable = css`
  position: relative;
  width: 100%;
  border: none;
  outline: none;
  padding: 0;
  background-color: transparent;
  cursor: pointer;
  .tag {
    padding: 0 42px 0 14px;
    height: 32px;
    justify-content: flex-start;
  }
  .dots-icon {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
  }
`;

export const cssSwiperNavigation = css`
  .swiper-button-prev,
  .swiper-button-next {
    --swiper-navigation-size: 20px;
    --swiper-navigation-color: #fff;
    user-select: none;
    pointer-events: none;
    background-color: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(2px);
    border-radius: 50%;
    width: calc(var(--swiper-navigation-size) + 12px);
    height: calc(var(--swiper-navigation-size) + 12px);
  }
  .swiper-button-prev {
    left: 6px;
    &::after {
      margin-left: -2px;
    }
  }
  .swiper-button-next {
    right: 6px;
    &::after {
      margin-left: 2px;
    }
  }
`;
