import { useCreateAmenitiesComboMutation } from "@/redux/query/amenity.query";
import styled from "@emotion/styled";
import { Divider, Form, Input } from "antd";
import { useRouter } from "next/router";
import { useId } from "react";
import { MdOutlineStore } from "react-icons/md";
import Button from "src/components/button/Button";
import StyledPage from "src/components/layout/StyledPage";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProvider from "src/hooks/useGetProvider";
import Avatar from "../avatar/Avatar";
import BreadcrumbHeader from "../layout/BreadcrumbHeader";
import SiderHeaderLayout from "../layout/SiderHeaderLayout";
import AmenitiesComboForm from "./AmenitiesComboForm";
import { cssAmenityForm } from "./AmenityForm";

function AmenitiesComboCreateForm() {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const {
    replace,
    query: { storeId },
  } = useRouter();
  const { message, notification } = useApp();
  const [form] = Form.useForm();
  const { gSelectedProvider } = useGetProvider({});

  const [createAmenitiesComboMutate, { isLoading: isLoadingCreateAmenitiesCombo }] =
    useCreateAmenitiesComboMutation();

  const handleCreateAmenitiesCombo = async (formValues: any) => {
    try {
      const {
        providerId,
        name,
        description,
        originPrice,
        totalPrice,
        deposit,
        stock,
        itemIds,
        businessType,
        attributeExtensions,
        avatarUrl,
      } = formValues as any;

      const createAmenitiesComboRes = await createAmenitiesComboMutate({
        providerId,
        name,
        description,
        originPrice,
        totalPrice,
        deposit,
        stock,
        itemIds,
        businessType: gSelectedProvider?.type,
        attributeExtensions: attributeExtensions ? JSON.stringify(attributeExtensions) : undefined,
        avatarUrl,
      }).unwrap();

      if (createAmenitiesComboRes.success === true) {
        notification.success({
          message: i18n["Thêm combo thành công"],
          placement: "bottomRight",
        });
        form.resetFields();
        replace(`/supplier/store/${storeId}/amenities/combo`);
      } else {
        notification.error({
          message: i18n["Đã có lỗi xảy ra khi thêm combo"],
          placement: "bottomRight",
        });
      }
    } catch (error) {
      notification.error({
        message: i18n["Đã có lỗi xảy ra khi thêm combo"],
        placement: "bottomRight",
      });
    }
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
            { [`/supplier/store/${storeId}/amenities/combo`]: i18n["Combo dịch vụ"] },
          ]}
          current={i18n["Thêm combo"]}
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
              providerId: gSelectedProvider.id,
              isActive: true,
              isDisplay: true,
              stock: 0,
              imageUrls: [],
              videoUrls: [],
            }}
            onFinish={handleCreateAmenitiesCombo}
          >
            <Form.Item
              name="providerId"
              label={i18n["Cửa hàng"]}
              rules={[{ required: true }, { type: "number" }]}
              hidden
            >
              <Input />
            </Form.Item>
            <AmenitiesComboForm />
          </Form>
        )}
        <Divider />
        <div className="actions-wrapper">
          <Button
            className="btn-reset"
            form={uid}
            size="large"
            disabled={isLoadingCreateAmenitiesCombo}
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
            loading={isLoadingCreateAmenitiesCombo}
            disabled={isLoadingCreateAmenitiesCombo}
          >
            {i18n["Thêm combo"]}
          </Button>
        </div>
      </PageWrapper>
    </SiderHeaderLayout>
  );
}

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
    ${cssAmenityForm}
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
export default AmenitiesComboCreateForm;
