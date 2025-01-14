import useChangeLocale from "@/hooks/useChangeLocale";
import { formatNumber } from "@/utils/utils";
import styled from "@emotion/styled";
import { useUpdateEffect } from "ahooks";
import { Button, Flex, Form, Input, InputNumber, Space, Typography, theme } from "antd";
import { useRouter } from "next/router";
import { useId, useState } from "react";
import { BsXCircleFill } from "react-icons/bs";
import { RiEdit2Fill } from "react-icons/ri";

type TNumberPriceSharesProps = {};

const NumberPriceShares = ({}: TNumberPriceSharesProps) => {
  const uid = useId();
  const {
    query: { voucherId },
  } = useRouter();
  const {
    token: { colorSuccess, colorTextSecondary, colorPrimary },
  } = theme.useToken();
  const form = Form.useFormInstance();
  const { i18n } = useChangeLocale();
  const formPricePerShare = Form.useWatch("pricePerShare", form);
  const formTotalNumberShares = Form.useWatch("totalNumberShares", form);
  const totalPackagePrice = (formPricePerShare || 0) * (formTotalNumberShares || 0);

  const [editPackagePrice, setEditPackagePrice] = useState<boolean>(false);
  const formPackagePrice = Form.useWatch("packagePrice", form);

  useUpdateEffect(() => {
    form.setFieldValue("packagePrice", totalPackagePrice);
  }, [totalPackagePrice]);

  return (
    <StyleWrapper>
      <Form.Item
        required
        label="Giá tiền từng suất trong gói | Tổng số suất"
        style={{ width: "50%" }}
      >
        <Space.Compact style={{ width: "100%" }}>
          <Form.Item
            name={"pricePerShare"}
            label="Giá tiền từng suất trong gói"
            noStyle
            rules={[{ required: true }, { type: "number", min: 0 }]}
          >
            <InputNumber<number>
              suffix={"₫"}
              step={1000}
              min={0}
              placeholder={i18n["Nhập vào"]}
              style={{ color: colorSuccess, width: "100%" }}
              formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => +value!.replace(/[^0-9]/g, "")}
            />
          </Form.Item>
          <Form.Item
            name={"totalNumberShares"}
            label="Số suất trong gói"
            noStyle
            rules={[{ required: true }, { type: "number", min: 1 }]}
          >
            <InputNumber<number>
              suffix={i18n["suất"]}
              step={1}
              min={0}
              placeholder={i18n["Nhập vào"]}
              style={{ color: colorTextSecondary, width: "100%", maxWidth: 130 }}
              formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => +value!.replace(/[^0-9]/g, "")}
            />
          </Form.Item>
        </Space.Compact>
      </Form.Item>

      <div className="right-wrapper" style={{ width: "50%" }}>
        {!editPackagePrice ? (
          <Flex vertical align="flex-end">
            <Typography.Text style={{ lineHeight: 1.1, marginBottom: 16, paddingTop: 4 }}>
              Tổng giá tiền cả gói
            </Typography.Text>
            <Flex align="center">
              <Typography.Text type="success" style={{ fontSize: 24, lineHeight: 1.1 }}>
                {formatNumber(formPackagePrice || 0)}₫
              </Typography.Text>
              <Button
                type="text"
                size="small"
                icon={<RiEdit2Fill size={22} />}
                style={{ color: colorPrimary, marginLeft: 4 }}
                onClick={() => setEditPackagePrice(true)}
              ></Button>
            </Flex>
            <Form.Item
              name={"packagePrice"}
              hidden
              rules={[{ min: 0, type: "number", required: true }]}
            >
              <Input />
            </Form.Item>
          </Flex>
        ) : (
          <Flex vertical align="flex-end">
            <Typography.Text style={{ lineHeight: 1.1, marginBottom: 14 }}>
              Tổng giá tiền cả gói
            </Typography.Text>
            <Flex align="center">
              <Form.Item
                name={"packagePrice"}
                className="hide-error"
                rules={[{ min: 0, type: "number", required: true }]}
              >
                <InputNumber<number>
                  suffix={"₫"}
                  step={1000}
                  min={0}
                  placeholder={i18n["Nhập vào"]}
                  style={{ color: colorSuccess, width: "100%" }}
                  formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => +value!.replace(/[^0-9]/g, "")}
                />
              </Form.Item>
              <Button
                type="text"
                size="small"
                icon={<BsXCircleFill size={16} />}
                style={{ color: colorTextSecondary, marginLeft: 4 }}
                onClick={() => setEditPackagePrice(false)}
              ></Button>
            </Flex>
          </Flex>
        )}
      </div>
    </StyleWrapper>
  );
};

const StyleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 24px;
`;

export default NumberPriceShares;
