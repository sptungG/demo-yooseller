import { DownOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { useSize } from "ahooks";
import { Divider, Drawer, TreeSelect, theme } from "antd";
import { useRef, useState } from "react";
import { TbListSearch } from "react-icons/tb";
import useChangeLocale from "src/hooks/useChangeLocale";
import { useGetAllCategoriesQuery } from "src/redux/query/category.query";
import { useGetAllCategoriesQuery as useGetAllCategoriesQueryFarm } from "src/redux/query/farm.query";
import { vietnameseSlug } from "src/utils/utils";
import Button, { TButtonProps } from "../button/Button";
import Image from "../next/Image";

type TCategorySelectDrawerProps = {
  placeholder?: string;
  selectableLastChildrenOnly?: boolean;
  value?: number;
  onChange?: (value?: number) => void;
  buttonProps?: Pick<TButtonProps, "size" | "block" | "style" | "disabled">;
  businessType?: number;
  type?: string;
};

const CategorySelectDrawer = ({
  value,
  onChange,
  placeholder = "Chọn danh mục...",
  selectableLastChildrenOnly = false,
  businessType,
  buttonProps,
  type,
}: TCategorySelectDrawerProps) => {
  const { i18n } = useChangeLocale();
  const ref = useRef<HTMLDivElement | null>(null);
  const sizeContainer = useSize(ref);

  const {
    token: { colorTextPlaceholder },
  } = theme.useToken();

  const { data } = useGetAllCategoriesQuery({ businessType }, { refetchOnMountOrArgChange: true });

  const categoriesData = data?.data || [];
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<number | undefined>(value);
  const handleOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    onChange?.(internalValue);
    setOpen(false);
  };

  const handleReset = () => {
    onClose();
  };

  const foundedInternalValue = categoriesData.find(({ id }) => id === internalValue);

  const foundedValue = categoriesData.find(({ id }) => id === value);

  return (
    <>
      <BtnLabelStyled {...buttonProps} onClick={() => handleOpen()}>
        {!!foundedValue ? (
          <>
            <Image
              src={foundedValue.iconUrl}
              alt={String(foundedValue.id)}
              width={44}
              height={44}
            />
            <div className="name-wrapper">{foundedValue.name}</div>
          </>
        ) : (
          <div style={{ color: colorTextPlaceholder, marginRight: 8 }}>{i18n["Chọn danh mục"]}</div>
        )}
        <Divider type="vertical" />
        <TbListSearch size={18} color={colorTextPlaceholder} />
      </BtnLabelStyled>
      <Drawer
        closeIcon={null}
        className="hide-close"
        onClose={onClose}
        open={open}
        placement="right"
        styles={{
          header: { padding: "8px 12px" },
          body: { padding: "12px 12px" },
          footer: { padding: 0 },
        }}
        title={
          <TreeSelect
            size="large"
            open
            showSearch
            placeholder={i18n["Tìm kiếm danh mục"]}
            allowClear
            onClear={() => {
              onChange?.(undefined);
              setInternalValue(undefined);
            }}
            treeDataSimpleMode
            treeLine
            treeNodeFilterProp="name"
            autoClearSearchValue
            value={internalValue}
            onChange={(value) => setInternalValue(value)}
            listHeight={sizeContainer?.height || 400}
            getPopupContainer={() => document.getElementById("area") || document.body}
            style={{ width: "100%" }}
            switcherIcon={<DownOutlined rev={undefined} />}
            dropdownStyle={{ boxShadow: "none", width: "100%" }}
            treeData={categoriesData.map(({ parentId, id, name, hasChildren, ...item }) => ({
              id,
              name: vietnameseSlug(name, " "),
              pId: parentId,
              selectable: selectableLastChildrenOnly ? !hasChildren : true,
              title: (
                <TreeItemStyled>
                  <Image
                    src={item.iconUrl}
                    alt={String(id)}
                    width={44}
                    height={44}
                    className="tree-item-image"
                  />
                  <div className="name-wrapper line-clamp-1">{name}</div>
                </TreeItemStyled>
              ),
              value: id,
              ...item,
            }))}
          />
        }
        footer={
          <FooterStyled>
            <Button
              size="large"
              onClick={() => handleReset()}
              bgColor="rgba(0,0,0,0.05)"
              type="text"
            >
              {i18n["Hủy"]}
            </Button>
            <Button block type="primary" size="large" onClick={() => handleSubmit()}>
              {!!foundedInternalValue
                ? `${i18n["Xác nhận"]} · ${foundedInternalValue.name}`
                : i18n["Xác nhận"]}
            </Button>
          </FooterStyled>
        }
      >
        <AreaStyled id="area" ref={ref}></AreaStyled>
      </Drawer>
    </>
  );
};

export const CategorySelectDrawerFarm = ({
  value,
  onChange,
  placeholder = "Chọn danh mục...",
  selectableLastChildrenOnly = false,
  businessType,
  buttonProps,
  type,
}: TCategorySelectDrawerProps) => {
  const { i18n } = useChangeLocale();
  const ref = useRef<HTMLDivElement | null>(null);
  const sizeContainer = useSize(ref);

  const {
    token: { colorTextPlaceholder },
  } = theme.useToken();

  const { data } = useGetAllCategoriesQueryFarm(
    { businessType },
    { refetchOnMountOrArgChange: true },
  );
  const categoriesData = data?.data || [];
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<number | undefined>(value);
  const handleOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    onChange?.(internalValue);
    setOpen(false);
  };

  const handleReset = () => {
    onClose();
  };

  const foundedInternalValue = categoriesData.find(({ id }) => id === internalValue);

  const foundedValue = categoriesData.find(({ id }) => id === value);

  return (
    <>
      <BtnLabelStyled {...buttonProps} onClick={() => handleOpen()}>
        {!!foundedValue ? (
          <>
            <Image
              src={foundedValue.iconUrl}
              alt={String(foundedValue.id)}
              width={44}
              height={44}
            />
            <div className="name-wrapper">{foundedValue.name}</div>
          </>
        ) : (
          <div style={{ color: colorTextPlaceholder, marginRight: 8 }}>{i18n["Chọn danh mục"]}</div>
        )}
        <Divider type="vertical" />
        <TbListSearch size={18} color={colorTextPlaceholder} />
      </BtnLabelStyled>
      <Drawer
        closeIcon={null}
        className="hide-close"
        onClose={onClose}
        open={open}
        placement="right"
        styles={{
          header: { padding: "8px 12px" },
          body: { padding: "12px 12px" },
          footer: { padding: 0 },
        }}
        title={
          <TreeSelect
            size="large"
            open
            showSearch
            placeholder={i18n["Tìm kiếm danh mục"]}
            allowClear
            onClear={() => {
              onChange?.(undefined);
              setInternalValue(undefined);
            }}
            treeDataSimpleMode
            treeLine
            treeNodeFilterProp="name"
            autoClearSearchValue
            value={internalValue}
            onChange={(value) => setInternalValue(value)}
            listHeight={sizeContainer?.height || 400}
            getPopupContainer={() => document.getElementById("area") || document.body}
            style={{ width: "100%" }}
            switcherIcon={<DownOutlined rev={undefined} />}
            dropdownStyle={{ boxShadow: "none", width: "100%" }}
            treeData={categoriesData.map(({ parentId, id, name, hasChildren, ...item }) => ({
              id,
              name: vietnameseSlug(name, " "),
              pId: parentId,
              selectable: selectableLastChildrenOnly ? !hasChildren : true,
              title: (
                <TreeItemStyled>
                  <Image
                    src={item.iconUrl}
                    alt={String(id)}
                    width={44}
                    height={44}
                    className="tree-item-image"
                  />
                  <div className="name-wrapper line-clamp-1">{name}</div>
                </TreeItemStyled>
              ),
              value: id,
              ...item,
            }))}
          />
        }
        footer={
          <FooterStyled>
            <Button
              size="large"
              onClick={() => handleReset()}
              bgColor="rgba(0,0,0,0.05)"
              type="text"
            >
              {i18n["Hủy"]}
            </Button>
            <Button block type="primary" size="large" onClick={() => handleSubmit()}>
              {!!foundedInternalValue
                ? `${i18n["Xác nhận"]} · ${foundedInternalValue.name}`
                : i18n["Xác nhận"]}
            </Button>
          </FooterStyled>
        }
      >
        <AreaStyled id="area" ref={ref}></AreaStyled>
      </Drawer>
    </>
  );
};

const BtnLabelStyled = styled(Button)`
  padding: 4px 8px;
  justify-content: flex-start;
  gap: 0;
  & > span {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    padding-bottom: 2px;
    margin-right: 8px;
    max-width: 236px;
    .name-wrapper {
      margin-left: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .ant-image,
    .ant-image img {
      width: 24px !important;
      height: 24px !important;
    }
  }
  & > .ant-divider {
    margin-left: auto;
    height: 22px;
  }
`;

const FooterStyled = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  gap: 12px;
`;
const TreeItemStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px 4px 0;
  .ant-image {
    position: relative;
    img.tree-item-image {
      border-radius: 6px;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  }
`;

const AreaStyled = styled.div`
  position: relative;
  height: 100%;
  .ant-select-dropdown {
    border-radius: 0 !important;
  }
  .ant-tree-select-dropdown {
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    padding: 0 !important;
  }
  .ant-select-tree-switcher {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export default CategorySelectDrawer;
