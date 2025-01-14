import useChangeLocale from "@/hooks/useChangeLocale";
import useGetProvider from "@/hooks/useGetProvider";
import { useGetAllAmenitiesAttributesQuery } from "@/redux/query/amenity.query";
import { TAmenityAttribute } from "@/types/amenity.types";
import { dayjs } from "@/utils/utils-date";
import { skipToken } from "@reduxjs/toolkit/query";
import { Button, Checkbox, Flex, Form, Input, InputNumber, Radio, Select, Typography } from "antd";
import { parseAsInteger, useQueryStates } from "next-usequerystate";
import { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { TiMinus } from "react-icons/ti";
import DatePicker from "../picker/DatePicker";
import Editor from "./Editor";
import ImagesUploadWithQuery from "./ImagesUploadWithQuery";
import VideosUploadWithQuery from "./VideosUploadWithQuery";

const { TextArea } = Input;
const defaultFilter = {
  type: parseAsInteger,
  objectType: parseAsInteger,
};
type TAmenityAttributeListProps = {
  type?: string;
};
const AmenityAttributeList = ({ type }: TAmenityAttributeListProps) => {
  const { i18n } = useChangeLocale();

  const { gSelectedProvider } = useGetProvider({});
  const [filterData, setFilterData] = useQueryStates(defaultFilter);
  const form = Form.useFormInstance();
  const { data: getAllAmenitiesAttributesRes } = useGetAllAmenitiesAttributesQuery(
    !!gSelectedProvider?.id
      ? {
          ...filterData,
          type: gSelectedProvider?.type,
          objectType: type === "GROUP" ? 2 : type === "COMBO" ? 3 : 1,
        }
      : skipToken,
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const attributeList = getAllAmenitiesAttributesRes?.data;

  const [attributes, setAttributes] = useState<any>(form.getFieldValue("attributeExtensions"));
  const [showAttributes, setShowAttributes] = useState<any>(
    form.getFieldValue("attributeExtensions"),
  );

  useEffect(() => form.setFieldValue("attributeExtensions", attributes), [attributes]);
  const renderAttributeList = (item: TAmenityAttribute) => {
    switch (item?.inputType) {
      case 1:
        return (
          <Form.Item rules={[{ type: "string" }]}>
            <Input
              defaultValue={attributes?.[item?.key]}
              style={{ width: "100%" }}
              onChange={(e) => setAttributes({ ...attributes, [item?.key]: e.target.value })}
            />
          </Form.Item>
        );
      case 2:
        return (
          <Form.Item rules={[{ type: "string" }]}>
            <TextArea
              autoSize={{ minRows: 3, maxRows: 5 }}
              defaultValue={attributes?.[item?.key]}
              onChange={(e) => setAttributes({ ...attributes, [item?.key]: e.target.value })}
            />
          </Form.Item>
        );
      case 3:
        return (
          <Form.Item rules={[{ type: "string" }]}>
            <InputNumber
              defaultValue={attributes?.[item?.key]}
              style={{ width: "50%" }}
              onChange={(value) => setAttributes({ ...attributes, [item?.key]: value })}
            />
          </Form.Item>
        );
      case 4:
        return (
          <Form.Item>
            <DatePicker
              defaultValue={dayjs(attributes?.[item?.key])}
              style={{ width: "50%" }}
              format="DD-MM-YYYY"
              onChange={(value) => setAttributes({ ...attributes, [item?.key]: value })}
            />
          </Form.Item>
        );
      case 5:
        return (
          <Form.Item rules={[{ type: "string" }]}>
            <Select
              defaultValue={attributes?.[item?.key]}
              style={{ width: "50%" }}
              options={item?.valueList?.map((option) => ({ label: option, value: option }))}
            />
          </Form.Item>
        );
      case 6:
        return (
          <Form.Item rules={[{ type: "string" }]}>
            <Select
              mode="multiple"
              allowClear
              style={{ width: "50%" }}
              defaultValue={attributes?.[item?.key]}
              options={item?.valueList?.map((option) => ({ label: option, value: option }))}
              onChange={(value: any[]) => setAttributes({ ...attributes, [item?.key]: value })}
            />
          </Form.Item>
        );
      case 7:
        return (
          <Form.Item>
            <Checkbox.Group
              style={{ width: "50%" }}
              options={item?.valueList}
              defaultValue={attributes?.[item?.key]}
              onChange={(value) => setAttributes({ ...attributes, [item?.key]: value })}
            />
          </Form.Item>
        );
      case 8:
        return (
          <Form.Item>
            <Radio.Group
              options={item?.valueList}
              defaultValue={attributes?.[item?.key]}
              onChange={(e) => setAttributes({ ...attributes, [item?.key]: e.target.value })}
            />
          </Form.Item>
        );
      case 9:
        return (
          <Form.Item rules={[{ type: "string" }]}>
            <Editor
              value={attributes?.[item?.key]}
              onChange={(value) => setAttributes({ ...attributes, [item?.key]: value })}
            />
          </Form.Item>
        );
      case 10:
        return (
          <Form.Item rules={[{ type: "array", required: false, defaultField: { type: "url" } }]}>
            <ImagesUploadWithQuery
              value={attributes?.[item?.key]}
              onChange={(value) => setAttributes({ ...attributes, [item?.key]: value })}
            />
          </Form.Item>
        );
      case 11:
        return (
          <Form.Item rules={[{ type: "array", required: false, defaultField: { type: "url" } }]}>
            <VideosUploadWithQuery
              onChange={(value) => setAttributes({ ...attributes, [item?.key]: value })}
            />
          </Form.Item>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Typography.Title level={4} type="secondary" style={{ lineHeight: 1, margin: "0 0 12px" }}>
        {i18n["Cấu hình thuộc tính dịch vụ"]}
      </Typography.Title>
      <Flex vertical gap={5}>
        {attributeList?.map((item, index) => (
          <Flex key={index} vertical>
            <Flex>
              <Button
                type="text"
                icon={<CiCirclePlus />}
                onClick={() =>
                  setShowAttributes({
                    ...showAttributes,
                    [item?.key]: true,
                  })
                }
              />
              <Button
                ghost={!!showAttributes?.[item?.key]}
                type={!!showAttributes?.[item?.key] ? "primary" : "default"}
                style={{ width: "100%", justifyContent: "left", marginBottom: 10 }}
              >
                {item?.displayName}
              </Button>
            </Flex>
            {showAttributes?.[item?.key] ? (
              <Flex>
                <Button
                  danger
                  type="text"
                  icon={<TiMinus />}
                  onClick={() => {
                    setShowAttributes({
                      ...showAttributes,
                      [item?.key]: false,
                    });
                    const newAttributes = { ...attributes };
                    delete newAttributes?.[item?.key];
                    setAttributes(newAttributes);
                  }}
                />
                <div style={{ width: "100%" }}>{renderAttributeList(item)}</div>
              </Flex>
            ) : undefined}
          </Flex>
        ))}{" "}
      </Flex>
    </>
  );
};

export default AmenityAttributeList;
