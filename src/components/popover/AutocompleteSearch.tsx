import styled from "@emotion/styled";
import { useSafeState } from "ahooks";
import { Dropdown, Empty, Input, InputProps, InputRef, Tabs, Typography, theme } from "antd";
import { useRouter } from "next/router";
import { ChangeEventHandler, useRef } from "react";
import { BiSearch } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { useMediaQuery } from "react-responsive";
import useChangeLocale from "src/hooks/useChangeLocale";
import Button from "../button/Button";

type TAutocompleteSearchProps = { inputProps?: InputProps };

const AutocompleteSearch = ({ inputProps }: TAutocompleteSearchProps) => {
  const { i18n } = useChangeLocale();
  const mediaAbove1280 = useMediaQuery({ minWidth: 1280 });
  const inputRef = useRef<InputRef>(null);
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useSafeState<boolean>(false);
  const [text, setText] = useSafeState("");
  const initialPlaceholder = i18n["Tìm kiếm sản phẩm, danh mục"];
  const [placeholder, setPlaceholder] = useSafeState(initialPlaceholder);
  const [activeKey, setActiveKey] = useSafeState("product");
  const {
    token: { colorTextPlaceholder },
  } = theme.useToken();

  const {
    query: { storeId },
  } = useRouter();

  const handleChangeInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    setText(e.target.value);
  };

  return (
    <Dropdown
      trigger={["click"]}
      open={isOpen}
      onOpenChange={setIsOpen}
      mouseEnterDelay={0.01}
      mouseLeaveDelay={0.01}
      placement="bottomRight"
      destroyPopupOnHide
      dropdownRender={() => (
        <DropdownWrapper style={{ width: 500 }}>
          <Input
            className="search-input"
            // variant="borderless"
            ref={inputRef}
            autoFocus
            value={text}
            placeholder={placeholder}
            allowClear
            onChange={handleChangeInput}
            size="middle"
            prefix={<BsSearch size={18} color={colorTextPlaceholder} />}
            {...inputProps}
          />
          <Tabs
            defaultActiveKey="product"
            activeKey={activeKey}
            onChange={(key) => {
              setActiveKey(key);
              if (mediaAbove1280)
                inputRef.current!.focus({
                  cursor: "end",
                });
            }}
            items={[
              { key: "product", label: i18n["Sản phẩm"] },
              { key: "category", label: i18n["Danh mục"] },
            ]}
            tabBarExtraContent={
              <>
                {activeKey === "product" && (
                  <Button
                    type="primary"
                    ghost
                    size="small"
                    href={`/supplier/item/${storeId}/create`}
                  >
                    {i18n["Thêm sản phẩm"]}
                  </Button>
                )}
              </>
            }
          />
          <div className={activeKey !== "product" ? "hidden" : ""}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                !!text && (
                  <Typography.Paragraph
                    ellipsis={{ rows: 3 }}
                    type="secondary"
                    style={{ maxWidth: 400, margin: "0 auto" }}
                  >
                    {i18n["Không tìm thấy sản phẩm phù hợp"]} {`"${text}"`}
                  </Typography.Paragraph>
                )
              }
            />
          </div>
          <div className={activeKey !== "category" ? "hidden" : ""}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                !!text && (
                  <Typography.Paragraph
                    ellipsis={{ rows: 3 }}
                    type="secondary"
                    style={{ maxWidth: 400, margin: "0 auto" }}
                  >
                    {i18n["Không tìm thấy danh mục phù hợp"]} {`"${text}"`}
                  </Typography.Paragraph>
                )
              }
            />
          </div>
        </DropdownWrapper>
      )}
    >
      <Button icon={<BiSearch size={22} />} type="text"></Button>
    </Dropdown>
  );
};

const DropdownWrapper = styled.div`
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 2px 8px #f0f1f2;
  border-radius: 8px;
  width: 100%;
  padding: 8px;
  .search-input {
    .ant-input-clear-icon {
      font-size: 16px;
    }
    .ant-select-auto-complete {
      width: 100%;
    }
    .ant-input-affix-wrapper {
      padding-right: 10px;
    }
  }
  .ant-tabs {
    max-width: 100%;
  }
  .dropdown-item-loading {
    padding: 8px;
    display: flex;
    align-items: center;
    width: 100%;
    gap: 16px;
    & .ant-skeleton-title {
      margin-top: 10px;
    }
    & .ant-skeleton-paragraph {
      margin-top: 10px !important;
    }
    & .ant-skeleton-header {
      vertical-align: middle;
    }
  }
  .dropdown-item {
    padding: 8px;
    width: 100%;
    margin: 0 !important;
    & .title {
      margin-bottom: 2px;
    }
    & .paragraph {
      margin-bottom: 0;
    }
    & .reaction-container {
      margin-top: 6px;
    }
    & .reaction-tag {
      padding: 2px 10px;
      border: 0;
      border-radius: 1000px;
      display: flex;
      align-items: center;
      gap: 4px;
      & span {
        font-size: 14px;
      }
    }
  }
  .dropdown-item:hover {
    background-color: ${(props) => props.theme.generatedColors[0]};
  }
  .dropdown-item:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
  .dropdown-item:last-child {
    border-radius: 0 0 10px 10px;
  }
  .dropdown-searchresult {
    padding: 4px 8px;
    color: #adb5bd;
  }
  #scrollableDivProducts,
  #scrollableDivCombos,
  #scrollableDivCategories {
    max-width: 100%;
    max-height: 320px;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #999;
      border-radius: 10px;
    }
  }
  .ant-tabs-nav {
    margin-bottom: 2px;
    padding: 0 8px;
  }
`;

export default AutocompleteSearch;
