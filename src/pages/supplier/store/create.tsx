import styled from "@emotion/styled";
import { Divider, Form } from "antd";
import { useRouter } from "next/router";
import { useId, useState } from "react";
import Button from "src/components/button/Button";
import StoreForm, { cssStoreFormWrapper } from "src/components/form/StoreForm";
import withAuth from "src/components/hoc/withAuth";
import BreadcrumbHeader from "src/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "src/components/layout/SiderHeaderLayout";
import StyledPage from "src/components/layout/StyledPage";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import { useCreateProviderMutation } from "src/redux/query/provider.query";
import { useAppSelector } from "src/redux/store";
import { dayjs } from "src/utils/utils-date";

const Page = () => {
  const { message, notification } = useApp();
  const uid = useId();
  const { i18n } = useChangeLocale();
  const { replace } = useRouter();
  const [form] = Form.useForm();

  const userData = useAppSelector((s) => s.user.data);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const [createProviderMutate, { isLoading: isLoadingCreateProvider }] =
    useCreateProviderMutation();
  const handleCreateStore = (formData: any) => {
    const {
      name,
      description,
      provinceId,
      districtId,
      wardId,
      address,
      geoLocation,
      imageUrls,
      email,
      phoneNumber,
      types,
      workTime,
      contact,
      carrierList,
    } = formData;
    const [groupType, type] = types as [any, any];
    const mappedWorkTime =
      workTime?.map((item: any) =>
        !!item?.length
          ? [dayjs(item?.[0]).toISOString(), dayjs(item?.[1]).toISOString()]
          : undefined,
      ) || [];
    createProviderMutate({
      name,
      email,
      description,
      imageUrls,
      latitude: geoLocation?.lat,
      longitude: geoLocation?.lng,
      provinceId,
      districtId,
      wardId,
      address,
      phoneNumber,
      groupType,
      type,
      contact,
      ownerInfo: "",
      businessInfo: "",
      properties: "",
      workTime: !!mappedWorkTime?.every((w: any) => !w) ? "" : JSON.stringify(mappedWorkTime),
      carrierList,
    })
      .unwrap()
      .then(({ result }) => {
        notification.success({
          message: i18n["Thêm cửa hàng thành công"],
          placement: "bottomRight",
        });
        form.resetFields();
        replace("/supplier/store");
      })
      .catch((err) => {
        notification.error({
          message: i18n["Đã có lỗi xảy ra khi thêm cửa hàng"],
          placement: "bottomRight",
        });
      });
  };

  return (
    <SiderHeaderLayout
      hideSider
      headerLeft={
        <BreadcrumbHeader
          items={[{ "/supplier/store": i18n["Cửa hàng"] }]}
          current={i18n["Tạo cửa hàng"]}
        />
      }
    >
      <PageWrapper>
        <Form
          id={uid}
          form={form}
          layout="vertical"
          size="large"
          className="form-wrapper"
          onFinish={handleCreateStore}
        >
          <StoreForm id={uid} />
        </Form>
        <Divider style={{ margin: "24px 0 24px 6px" }} />
        <div className="actions-wrapper">
          <Button
            className="btn-reset"
            form={uid}
            htmlType="button"
            size="large"
            disabled={isLoadingCreateProvider}
            onClick={() => {
              form.resetFields();
            }}
          >
            {i18n["Hủy"]}
          </Button>
          <Button
            className="btn-submit"
            htmlType="submit"
            type="primary"
            form={uid}
            size="large"
            loading={isLoadingCreateProvider}
            disabled={isLoadingCreateProvider}
          >
            {i18n["Tạo cửa hàng"]}
          </Button>
        </div>
      </PageWrapper>
    </SiderHeaderLayout>
  );
};

const PageWrapper = styled(StyledPage)`
  padding: 12px;
  width: 100%;
  max-width: 694px;
  margin-left: auto;
  margin-right: auto;
  .form-wrapper {
    ${cssStoreFormWrapper}
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

export default withAuth(Page);
