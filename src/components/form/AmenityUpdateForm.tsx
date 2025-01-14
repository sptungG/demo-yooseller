import { useGetAmenityItemQuery, useUpdateAmenityItemMutation } from "@/redux/query/amenity.query";
import styled from "@emotion/styled";
import { skipToken } from "@reduxjs/toolkit/query";
import { useCreation } from "ahooks";
import { Card, Divider, Form, Input } from "antd";
import { useRouter } from "next/router";
import { useId, useState } from "react";
import { MdOutlineStore } from "react-icons/md";
import Button from "src/components/button/Button";
import StyledPage from "src/components/layout/StyledPage";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProvider from "src/hooks/useGetProvider";
import Avatar from "../avatar/Avatar";
import BreadcrumbHeader from "../layout/BreadcrumbHeader";
import SiderHeaderLayout from "../layout/SiderHeaderLayout";
import AmenityForm, { cssAmenityForm } from "./AmenityForm";

function AmenityUpdateForm() {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const {
    replace,
    query: { storeId, amenityId },
  } = useRouter();
  const { message, notification } = useApp();
  const [form] = Form.useForm();
  const { gSelectedProvider } = useGetProvider({});

  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const { data: getAmenityItemByIdRes, isLoading: isLoadingGetAmenityItemById } =
    useGetAmenityItemQuery(amenityId ? { id: +(amenityId as string) } : skipToken, {
      refetchOnMountOrArgChange: true,
    });
  const amenityItemData = getAmenityItemByIdRes?.data;

  const mappedInitialFormValues = useCreation(
    () => ({
      ...(amenityItemData
        ? {
            ...amenityItemData,
            attributeExtensions: amenityItemData?.attributeExtensions
              ? JSON.parse(amenityItemData?.attributeExtensions)
              : undefined,
          }
        : {}),
    }),
    [gSelectedProvider?.id, amenityItemData, amenityId],
  );

  const [updateAmenityItemMutate, { isLoading: isLoadingUpdateAmenityItem }] =
    useUpdateAmenityItemMutation();
  const isLoading = isLoadingGetAmenityItemById;

  const handleUpdateAmenity = async (formValues: any) => {
    try {
      const {
        id,
        providerId,
        name,
        detail,
        price,
        minimumDeposit,
        attributeExtensions,
        groupId,
        isActive,
        isDisplay,
        stock,
        avatarUrl,
        imageUrls,
        videoUrls,
      } = formValues as any;

      const updateAmenityRes = await updateAmenityItemMutate({
        ...amenityItemData,
        // id,
        providerId,
        name,
        detail,
        price,
        minimumDeposit,
        attributeExtensions: attributeExtensions ? JSON.stringify(attributeExtensions) : undefined,
        groupId,
        isActive,
        isDisplay,
        stock,
        avatarUrl,
        imageUrls,
        videoUrls,
      }).unwrap();

      if (updateAmenityRes.success === true) {
        notification.success({
          message: i18n["Cập nhật dịch vụ thành công"],
          placement: "bottomRight",
        });
        form.resetFields();
        replace(`/supplier/store/${storeId}/amenities`);
      } else {
        notification.error({
          message: i18n["Đã có lỗi xảy ra khi cập nhật dịch vụ"],
          placement: "bottomRight",
        });
      }
    } catch (error) {
      notification.error({
        message: i18n["Đã có lỗi xảy ra khi cập nhật dịch vụ"],
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
            { [`/supplier/store/${storeId}/amenities`]: i18n["Dịch vụ"] },
          ]}
          current={i18n["Cập nhật dịch vụ"]}
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
            initialValues={{ ...mappedInitialFormValues }}
            onFinish={handleUpdateAmenity}
          >
            <Form.Item
              name="providerId"
              label={i18n["Cửa hàng"]}
              rules={[{ required: true }, { type: "number" }]}
              hidden
            >
              <Input />
            </Form.Item>
            <AmenityForm />
          </Form>
        )}
        <Divider />
        <div className="actions-wrapper">
          <Button
            className="btn-reset"
            form={uid}
            size="large"
            disabled={isLoadingUpdateAmenityItem}
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
            loading={isLoadingUpdateAmenityItem}
            disabled={isLoadingUpdateAmenityItem}
          >
            {i18n["Cập nhật dịch vụ"]}
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
export default AmenityUpdateForm;
