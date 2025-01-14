import styled from "@emotion/styled";
import { Form, FormItemProps, Input, InputNumber, Space } from "antd";
import { useEffect } from "react";
import { cssPriceRangeWrapper } from "../shared/ItemStyled";

type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;
type TInputPriceRangeProps = {
  size?: "small" | "middle" | "large" | undefined;
  minFormProps: RequiredField<FormItemProps, "name"> & { placeholder?: string };
  maxFormProps: RequiredField<FormItemProps, "name"> & { placeholder?: string };
};

const InputPriceRange = ({ minFormProps, maxFormProps, size }: TInputPriceRangeProps) => {
  const { placeholder: minPlaceholder, ...restMinFormProps } = minFormProps;
  const { placeholder: maxPlaceholder, ...restMaxFormProps } = maxFormProps;
  const form = Form.useFormInstance();
  const minWatch = Form.useWatch(restMinFormProps.name, form);
  const maxWatch = Form.useWatch(restMaxFormProps.name, form);

  useEffect(() => {
    if ((maxWatch || 0) < minWatch) form.setFieldValue(restMaxFormProps.name, minWatch + 1);
  }, [form, maxWatch, minWatch, restMaxFormProps.name]);

  return (
    <InputPriceRangeStyled size={size} block>
      <Form.Item noStyle {...restMinFormProps}>
        <InputNumber<number>
          className="site-input-left"
          placeholder={minPlaceholder}
          controls={false}
          prefix={"₫"}
          step={1000}
          min={0}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
      <Input className="site-input-split" placeholder="⇀" disabled />
      <Form.Item noStyle {...restMaxFormProps}>
        <InputNumber<number>
          className="site-input-right"
          placeholder={maxPlaceholder}
          controls={false}
          prefix={"₫"}
          step={1000}
          min={1}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={(value) => +value!.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
    </InputPriceRangeStyled>
  );
};
const InputPriceRangeStyled = styled(Space.Compact)`
  ${cssPriceRangeWrapper}
`;

export default InputPriceRange;
