import styled from "@emotion/styled";
import { Card, Divider, Form, Input, theme } from "antd";
import { useRouter } from "next/router";
import { useId, useMemo, useState } from "react";
import { MdOutlineStore } from "react-icons/md";
import Button from "src/components/button/Button";
import StyledPage from "src/components/layout/StyledPage";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProvider from "src/hooks/useGetProvider";
import { useGetItemByIdQuery, useUpdateItemBookingMutation } from "src/redux/query/item.query";
import { TItem } from "src/types/item.types";
import Avatar from "../avatar/Avatar";
import BreadcrumbHeader from "../layout/BreadcrumbHeader";
import SiderHeaderLayout from "../layout/SiderHeaderLayout";
import BookingHotelForm, { cssBookingHotelForm } from "./BookingHotelForm";

type TUpdateBookingHotelFormProps = {};

const UpdateBookingHotelForm = ({}: TUpdateBookingHotelFormProps) => {
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

  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const [form] = Form.useForm();
  const { gSelectedProvider } = useGetProvider({});

  const { data, isLoading } = useGetItemByIdQuery(
    { id: +(itemId as string) },
    { refetchOnMountOrArgChange: true },
  );
  const itemData = data?.data || ({} as TItem);
  const { properties, ...restItemData } = itemData;
  const mappedProperties = !!properties ? (JSON.parse(properties) as any) : undefined;
  const mappedInitialFormValues = useMemo(
    () => ({
      ...(itemData || {}),
      price: itemData?.maxPrice,
      imageFileList: [],
      providerId: gSelectedProvider?.id,
    }),
    [gSelectedProvider?.id, itemData, itemId],
  );

  const [updateItemMutate, { isLoading: isLoadingUpdateItem }] = useUpdateItemBookingMutation();
  const handleUpdateItem = (formValues: any) => {
    const {
      id,
      name,
      description,
      properties,
      imageUrlList,
      providerId,
      type,
      itemModel,
      condition,
      sizeInfo,
      logisticInfo,
      videoUrlList,
      attributeList,
    } = formValues as any;

    updateItemMutate({
      ...itemData,
      name,
      description: properties?.description || "",
      imageUrlList,
      condition,
      attributeList,
      sizeInfo: "",
      videoUrlList,
      id,
      logisticInfo: "",
      properties: JSON.stringify(properties),
    })
      .unwrap()
      .then((result) => {
        if (result.data === true) {
          notification.success({
            message: i18n["Cập nhật sản phẩm thành công"],
            placement: "bottomRight",
          });
          form.resetFields();
          replace(`/supplier/store/${storeId}/item`);
        } else {
          notification.error({
            message: i18n["Đã có lỗi xảy ra khi cập nhật sản phẩm"],
            placement: "bottomRight",
          });
        }
      })
      .catch((err) => {
        notification.error({
          message: i18n["Đã có lỗi xảy ra khi cập nhật sản phẩm"],
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
            { [`/supplier/store/${storeId}/item`]: i18n["Sản phẩm"] },
            { [`/supplier/store/${storeId}/item/${String(itemId)}`]: itemData?.name },
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
            <Form.Item name="id" rules={[{ required: true }, { type: "number" }]} hidden>
              <Input />
            </Form.Item>
            <Form.Item name="condition" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="sizeInfo" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="logisticInfo" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="attributeList" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="videoUrlList" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              name="providerId"
              label={i18n["Cửa hàng"]}
              rules={[{ required: true }, { type: "number" }]}
              hidden
            >
              <Input />
            </Form.Item>
            <Form.Item name="properties" hidden>
              <Input />
            </Form.Item>
            <BookingHotelForm id={uid} />
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
};
const PageWrapper = styled(StyledPage)`
  padding: 12px;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  .form-wrapper {
    ${cssBookingHotelForm}
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

export default UpdateBookingHotelForm;
