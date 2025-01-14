import styled from "@emotion/styled";
import { Divider, Form } from "antd";
import { useRouter } from "next/router";
import { useId } from "react";
import Button from "src/components/button/Button";
import FarmForm, { cssFarmFormWrapper } from "src/components/form/FarmForm";
import withAuth from "src/components/hoc/withAuth";
import BreadcrumbHeader from "src/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "src/components/layout/SiderHeaderLayout";
import StyledPage from "src/components/layout/StyledPage";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import { useCreateProviderEcoFarmMutation } from "src/redux/query/farm.query";

const Page = () => {
  const { notification } = useApp();
  const uid = useId();
  const { i18n } = useChangeLocale();
  const { replace } = useRouter();
  const [form] = Form.useForm();

  const [createProviderMutate, { isLoading: isLoadingCreateProvider }] =
    useCreateProviderEcoFarmMutation();
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
      contact,
      carrierList,
    } = formData;
    const [groupType, type] = types as [any, any];
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
      properties: "",
      carrierList,
    })
      .unwrap()
      .then(() => {
        notification.success({
          message: i18n["Thêm trang trại thành công"],
          placement: "bottomRight",
        });
        form.resetFields();
        replace("/supplier/farm/list");
      })
      .catch(() => {
        notification.error({
          message: i18n["Đã có lỗi xảy ra khi thêm trang trại"],
          placement: "bottomRight",
        });
      });
  };

  return (
    <SiderHeaderLayout
      hideSider
      headerLeft={
        <BreadcrumbHeader
          items={[{ "/supplier/farm": i18n["Trang trại"] }]}
          current={i18n["Thêm mới trang trại"]}
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
          <FarmForm id={uid} />
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
            {i18n["Thêm mới trang trại"]}
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
    ${cssFarmFormWrapper}
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
