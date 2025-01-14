import Avatar from "@/components/avatar/Avatar";
import AddressesForm, { cssItemForm } from "@/components/form/AddressesForm";
import BreadcrumbHeader from "@/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "@/components/layout/SiderHeaderLayout";
import useApp from "@/hooks/useApp";
import useChangeLocale from "@/hooks/useChangeLocale";
import useGetProvider from "@/hooks/useGetProvider";
import { useCreateProviderAddressesMutation } from "@/redux/query/addresses.query";
import styled from "@emotion/styled";
import { Button, Divider, Form, Input } from "antd";
import { useRouter } from "next/router";
import { useId } from "react";
import { MdOutlineStore } from "react-icons/md";
import withAuth from "src/components/hoc/withAuth";
import StyledPage from "src/components/layout/StyledPage";
const Page = () => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const {
    replace,
    query: { storeId },
  } = useRouter();
  const { notification } = useApp();
  const [form] = Form.useForm();
  const { gSelectedProvider } = useGetProvider({});
  const [createMutate, { isLoading: isLoadingCreateItem }] = useCreateProviderAddressesMutation();
  const handleCreateItem = (formValues: any) => {
    const {
      defaultAddress,
      pickUp,
      returnAddress,
      phoneNumber,
      name,
      districtCode,
      provinceCode,
      wardCode,
      detail,
      providerId,
      geoLocation,
    } = formValues as any;
    createMutate({
      default: defaultAddress,
      pickUp,
      return: returnAddress,
      phoneNumber,
      name,
      districtCode,
      provinceCode,
      wardCode,
      detail,
      providerId,
      latitude: geoLocation?.lat,
      longitude: geoLocation?.lng,
    })
      .unwrap()
      .then(() => {
        notification.success({
          message: i18n["Tạo địa chỉ thành công"],
          placement: "bottomRight",
        });
        form.resetFields();
        replace(`/supplier/store/${storeId}/addresses`);
      })
      .catch(() => {
        notification.error({
          message: i18n["Đã có lỗi xảy ra khi tạo địa chỉ"],
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
            { [`/supplier/store/${storeId}/addresses`]: i18n["Địa chỉ"] },
          ]}
          current={i18n["Thêm địa chỉ"]}
        />
      }
    >
      <PageWrapper>
        {!!gSelectedProvider?.id && (
          <Form
            id={uid}
            form={form}
            layout="vertical"
            size="large"
            className="form-wrapper"
            initialValues={{
              defaultAddress: false,
              pickUp: false,
              providerId: gSelectedProvider.id,
              returnAddress: false,
            }}
            onFinish={handleCreateItem}
            // eslint-disable-next-line no-unused-vars
            onValuesChange={(changedValues, values) => {}}
          >
            <Form.Item
              name="providerId"
              label={i18n["Cửa hàng"]}
              rules={[{ required: true }, { type: "number" }]}
              hidden
            >
              <Input />
            </Form.Item>
            <AddressesForm id={uid} />
          </Form>
        )}
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
            {i18n["Thêm địa chỉ"]}
          </Button>
        </div>
      </PageWrapper>
    </SiderHeaderLayout>
  );
};
const PageWrapper = styled(StyledPage)`
  padding: 12px;
  width: 100%;
  max-width: 804px;
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
    padding-bottom: 12px;
    justify-content: flex-end;
    padding-bottom: 12px;
    .btn-submit {
      flex: 0 0 360px;
    }
  }
`;
export default withAuth(Page);
