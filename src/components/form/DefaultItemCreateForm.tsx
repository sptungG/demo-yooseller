import styled from "@emotion/styled";
import { Divider, Form, Input } from "antd";
import { useRouter } from "next/router";
import { useId } from "react";
import { MdOutlineStore } from "react-icons/md";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProvider from "src/hooks/useGetProvider";
import { useCreateItemBookingMutation } from "src/redux/query/item.query";
import Avatar from "../avatar/Avatar";
import Button from "../button/Button";
import BreadcrumbHeader from "../layout/BreadcrumbHeader";
import SiderHeaderLayout from "../layout/SiderHeaderLayout";
import StyledPage from "../layout/StyledPage";
import DefaultItemForm, { cssItemForm } from "./DefaultItemForm";

type TDefaultItemCreateFormProps = {};

const DefaultItemCreateForm = ({}: TDefaultItemCreateFormProps) => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const {
    replace,
    query: { storeId },
  } = useRouter();
  const { message, notification } = useApp();
  const [form] = Form.useForm();
  const { gSelectedProvider } = useGetProvider({});

  const [createItemMutate, { isLoading: isLoadingCreateItem }] = useCreateItemBookingMutation();

  const handleCreateItem = (formValues: any) => {
    const { name, description, properties, imageUrlList, providerId, type, itemModel } =
      formValues as any;
    createItemMutate({
      name,
      description,
      imageUrlList,
      providerId,
      type,
      properties: !!properties ? JSON.stringify(properties) : "",
      videoUrlList: [],
      sizeInfo: "",
      itemModel: {
        originalPrice: itemModel?.originalPrice || 0,
        currentPrice: itemModel?.originalPrice || 0,
        imageUrl: imageUrlList[0],
      },
    })
      .unwrap()
      .then((result) => {
        if (result.data === true) {
          notification.success({
            message: i18n["Tạo sản phẩm thành công"],
            placement: "bottomRight",
          });
          form.resetFields();
          replace(`/supplier/store/${storeId}/item`);
        } else {
          notification.error({
            message: i18n["Đã có lỗi xảy ra khi tạo sản phẩm"],
            placement: "bottomRight",
          });
        }
      })
      .catch((err) => {
        notification.error({
          message: i18n["Đã có lỗi xảy ra khi tạo sản phẩm"],
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
          ]}
          current={i18n["Thêm sản phẩm"]}
        />
      }
    >
      <PageWrapper>
        {!!gSelectedProvider?.id ? (
          <>
            <Form
              id={uid}
              form={form}
              layout="vertical"
              size="large"
              className="form-wrapper"
              initialValues={{
                imageUrlList: [],
                imageFileList: [],
                providerId: gSelectedProvider.id,
              }}
              onFinish={handleCreateItem}
            >
              <Form.Item
                name="providerId"
                label={i18n["Cửa hàng"]}
                rules={[{ required: true }, { type: "number" }]}
                hidden
              >
                <Input />
              </Form.Item>
              <DefaultItemForm id={uid} />
            </Form>
            <Divider />
            <div className="actions-wrapper">
              <Button
                className="btn-reset"
                form={uid}
                size="large"
                disabled={isLoadingCreateItem}
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
                loading={isLoadingCreateItem}
                disabled={isLoadingCreateItem}
              >
                {i18n["Thêm sản phẩm"]}
              </Button>
            </div>
          </>
        ) : (
          <></>
        )}
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

export default DefaultItemCreateForm;
