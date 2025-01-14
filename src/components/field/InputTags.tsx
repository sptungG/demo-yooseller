import styled from "@emotion/styled";
import { Button, Input, Select } from "antd";
import { useMemo, useState } from "react";
import { MdCheck, MdClose, MdEdit } from "react-icons/md";
import { TbTrash } from "react-icons/tb";

type TInputTagsProps = {
  value?: string[];
  onChange?: (v?: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
};

const InputTags = ({ value, onChange, disabled, ...props }: TInputTagsProps) => {
  return (
    <StyledSelect
      mode="tags"
      tokenSeparators={[","]}
      suffixIcon={null}
      open={false}
      value={value}
      onChange={(value) => onChange?.(value as string[])}
      disabled={disabled}
      size="large"
      tagRender={(props) => (
        <ItemTag
          value={props.value}
          onChange={(v) => {
            const newValues = value?.map((item) => (item === props.value ? v : item)) as string[];
            onChange?.(newValues);
          }}
          onPressEnter={() => {}}
          onClose={() => props.onClose()}
          disabled={disabled}
        />
      )}
      {...props}
    />
  );
};
const StyledSelect = styled(Select)`
  .ant-select-selector {
    padding: 2px 4px !important;
  }
  .ant-select-selection-overflow {
    gap: 4px;
  }
  .ant-select-selection-overflow-item {
    height: 32px !important;
  }
`;

type TItemTagProps = {
  value?: string;
  onChange?: (v?: string) => void;
  onClose?: (v?: string) => void;
  onPressEnter?: () => void;
  disabled?: boolean;
};
const ItemTag = ({ value, onChange, onClose, onPressEnter, disabled, ...props }: TItemTagProps) => {
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [internalValue, setInternalValue] = useState<string | undefined>(value);

  const isSameValue = useMemo(() => internalValue === value, [internalValue, value]);
  return (
    <StyledItem>
      {isOpenEdit ? (
        <Input
          style={{
            width: !!internalValue ? `${internalValue.length + 1}ch` : 56,
            padding: "0 0 0 8px",
          }}
          value={internalValue}
          onChange={(e) => setInternalValue(e.target.value)}
          onPressEnter={() => onChange?.(internalValue)}
          onKeyDown={(e) => {
            if (e.key === "Backspace") {
              return e.stopPropagation();
            }
          }}
          autoFocus
          size="middle"
          variant="borderless"
        />
      ) : (
        <span style={{ paddingLeft: 8 }}>{value}</span>
      )}
      {disabled ? (
        <></>
      ) : (
        <div className="actions-wrapper">
          {isSameValue ? (
            <>
              <Button
                type={isOpenEdit ? "link" : "text"}
                size="small"
                htmlType="button"
                style={{ width: 20, height: 20, padding: 0 }}
                onClick={() => {
                  setIsOpenEdit(!isOpenEdit);
                }}
                icon={<MdEdit size={16} />}
              ></Button>
            </>
          ) : (
            <>
              <Button
                type="text"
                size="small"
                htmlType="button"
                style={{ width: 20, height: 20, padding: 0 }}
                onClick={() => {
                  onChange?.(internalValue);
                  setIsOpenEdit(!isOpenEdit);
                }}
                icon={<MdCheck size={16} />}
              ></Button>
              <Button
                type="text"
                size="small"
                htmlType="button"
                style={{ width: 20, height: 20, padding: 0 }}
                onClick={() => {
                  setInternalValue(value);
                  setIsOpenEdit(false);
                }}
                icon={<MdClose size={16} />}
              ></Button>
            </>
          )}
          <Button
            type="text"
            danger
            size="small"
            htmlType="button"
            style={{ width: 20, height: 20, padding: 0 }}
            onClick={() => onClose?.()}
            icon={<TbTrash size={16} />}
          ></Button>
        </div>
      )}
    </StyledItem>
  );
};
const StyledItem = styled.div`
  z-index: 10;
  padding-right: 6px;
  background-color: rgba(0, 0, 0, 0.08);
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  border-radius: 4px;
  cursor: pointer;
  .ant-input {
    background-color: transparent;
    width: fit-content;
    font-size: 16px;
  }
  .actions-wrapper {
    display: flex;
    align-items: center;
    gap: 2px;
    margin-left: 4px;
    & > svg {
      cursor: pointer;
      user-select: none;
      pointer-events: none;
    }
  }
`;

export default InputTags;
