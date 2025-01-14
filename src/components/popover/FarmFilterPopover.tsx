import styled from "@emotion/styled";
import { useSafeState } from "ahooks";
import { Form, Popover } from "antd";
import { MdFilterListAlt } from "react-icons/md";
import useChangeLocale from "src/hooks/useChangeLocale";
import Button from "../button/Button";

type TFarmFilterPopoverProps = {
  formId: string;
  width?: number;
  children?: React.ReactNode;
};

const FarmFilterPopover = ({ formId, children, width = 384 }: TFarmFilterPopoverProps) => {
  const formOuter = Form.useFormInstance();
  const [isOpen, setIsOpen] = useSafeState(false);
  const { i18n } = useChangeLocale();

  return (
    <Popover
      placement="bottomLeft"
      trigger="click"
      zIndex={2}
      open={isOpen}
      overlayInnerStyle={{ width }}
      overlayStyle={{ zIndex: 10 }}
      autoAdjustOverflow={false}
      getPopupContainer={(node) => {
        return document.getElementById(formId) || document.body;
      }}
      content={
        <FarmFilterPopoverStyled>
          {children}
          <div className="actions-wrapper">
            <Button
              htmlType="button"
              onClick={() => {
                formOuter.resetFields();
                setIsOpen(false);
                formOuter.submit();
              }}
            >
              {i18n["Huỷ"]}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              block
              form={formId}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              {i18n["Xác nhận"]}
            </Button>
          </div>
        </FarmFilterPopoverStyled>
      }
    >
      <Button
        type="primary"
        icon={<MdFilterListAlt size={18} />}
        className="btn-popover"
        onClick={() => setIsOpen(!isOpen)}
      >
        {i18n["Bộ lọc"]}
      </Button>
    </Popover>
  );
};
const FarmFilterPopoverStyled = styled.div`
  .ant-form-item {
    margin-bottom: 16px;
    .ant-form-item-row {
      flex-wrap: nowrap;
    }
  }
  .actions-wrapper {
    display: flex;
    flex-wrap: nowrap;
    gap: 8px;
    margin-left: auto;
    width: 160px;
  }
`;

export default FarmFilterPopover;
