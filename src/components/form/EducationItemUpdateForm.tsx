import styled from "@emotion/styled";
import { Card, Divider, Form, Input, theme } from "antd";
import { useRouter } from "next/router";
import { useId, useState } from "react";
import { MdOutlineStore } from "react-icons/md";
import Button from "src/components/button/Button";
import StyledPage from "src/components/layout/StyledPage";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProvider from "src/hooks/useGetProvider";
import { useGetItemByIdQuery, useUpdateItemBookingMutation } from "src/redux/query/item.query";
import { TItem } from "src/types/item.types";
import { dayjs } from "src/utils/utils-date";
import Avatar from "../avatar/Avatar";
import BreadcrumbHeader from "../layout/BreadcrumbHeader";
import SiderHeaderLayout from "../layout/SiderHeaderLayout";
import EducationItemForm, { cssItemForm } from "./EducationItemForm";

function EducationItemUpdateForm() {
  const uid = useId();
  const {
    query: { itemId, storeId },
    replace,
  } = useRouter();
  const { i18n } = useChangeLocale();
  const { message, notification } = useApp();
  const {
    token: { colorTextPlaceholder },
  } = theme.useToken();
  const [form] = Form.useForm();

  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const { data, isLoading } = useGetItemByIdQuery(
    { id: +(itemId as string) },
    { refetchOnMountOrArgChange: true },
  );
  const itemData = data?.data || ({} as TItem);
  const { properties, ...restItemData } = itemData;
  const mappedProperties = !!properties ? (JSON.parse(properties) as any) : undefined;
  const mappedInitialFormValues = {
    ...restItemData,
    properties: !!mappedProperties
      ? {
          ...mappedProperties,
          personalInfo: {
            ...mappedProperties.personalInfo,
            dateOfBirth: dayjs(mappedProperties.personalInfo.dateOfBirth),
          },
        }
      : undefined,
  };

  const { gSelectedProvider } = useGetProvider({});

  const [updateItemMutate, { isLoading: isLoadingUpdateItem }] = useUpdateItemBookingMutation();
  const handleUpdateItem = (formValues: any) => {
    const { id, name, properties, imageUrlList, providerId, type, itemModel } = formValues as any;

    updateItemMutate({
      id,
      name,
      imageUrlList,
      properties: JSON.stringify(properties),
      videoUrlList: [],
      description: properties?.description || "",
      sizeInfo: "",
      logisticInfo: "",
      condition: 1,
      attributeList: [],
    })
      .unwrap()
      .then((result) => {
        if (result.data === true) {
          notification.success({
            message: "Cập nhật sản phẩm thành công",
            placement: "bottomRight",
          });
          form.resetFields();
          replace(`/supplier/store/${storeId}/item`);
        } else {
          notification.error({
            message: "Đã có lỗi xảy ra khi cập nhật sản phẩm",
            placement: "bottomRight",
          });
        }
      })
      .catch((err) => {
        notification.error({
          message: "Đã có lỗi xảy ra khi cập nhật sản phẩm",
          placement: "bottomRight",
        });
      });
  };

  return (
    <SiderHeaderLayout
      headerLeft={
        <BreadcrumbHeader
          items={[
            { "/supplier/store": <MdOutlineStore size={26} /> },
            {
              [`/supplier/store/${storeId}`]: (
                <Avatar
                  shape="square"
                  key={String(gSelectedProvider?.id) + uid}
                  src={gSelectedProvider?.imageUrls[0]}
                  size={26}
                />
              ),
            },
            { [`/supplier/store/${storeId}/item`]: i18n["Danh sách"] },
            { [`/supplier/store/${storeId}/item/${String(itemId)}`]: String(itemId) },
          ]}
          current={i18n["Cập nhật"]}
        />
      }
    >
      <PageWrapper>
        {isLoading ? (
          <div className="form-wrapper">
            <div className="left-wrapper">
              <Card loading></Card>
              <Card loading></Card>
            </div>
            <div className="right-wrapper">
              <Card loading></Card>
            </div>
          </div>
        ) : (
          <Form
            id={uid}
            form={form}
            layout="vertical"
            size="large"
            className="form-wrapper"
            onFinish={handleUpdateItem}
            initialValues={mappedInitialFormValues}
            onValuesChange={(changedValues, values) => {}}
          >
            <Form.Item name="id" hidden rules={[{ required: true, type: "number" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="type" hidden rules={[{ required: true, type: "number" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="providerId" hidden rules={[{ required: true, type: "number" }]}>
              <Input />
            </Form.Item>
            <EducationItemForm id={uid} />
          </Form>
        )}
        <Divider />
        <div className="actions-wrapper">
          <Button
            className="btn-reset"
            form={uid}
            size="large"
            disabled={isLoadingUpdateItem}
            onClick={() => form.resetFields()}
          >
            {i18n["Hủy"]}
          </Button>
          <Button
            className="btn-submit"
            htmlType="submit"
            type="primary"
            form={uid}
            size="large"
            loading={isLoadingUpdateItem}
            disabled={isLoadingUpdateItem}
          >
            {i18n["Cập nhật"]}
          </Button>
        </div>
      </PageWrapper>
    </SiderHeaderLayout>
  );
}

const PageWrapper = styled(StyledPage)`
  padding: 12px;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  .form-wrapper {
    ${cssItemForm}
  }
  & > .actions-wrapper {
    display: flex;
    align-items: flex-start;
    flex-wrap: nowrap;
    gap: 12px;
    justify-content: flex-end;
    padding-bottom: 12px;
    .btn-submit {
      flex: 0 0 360px;
    }
  }
`;

export default EducationItemUpdateForm;
