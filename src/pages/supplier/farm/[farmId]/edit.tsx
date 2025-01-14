import { EcofarmSvg } from "@/components/icons";
import styled from "@emotion/styled";
import { Divider, Form } from "antd";
import { useRouter } from "next/router";
import { useId, useMemo } from "react";
import Avatar from "src/components/avatar/Avatar";
import Button from "src/components/button/Button";
import Card from "src/components/card/Card";
import FarmForm, { cssFarmFormWrapper } from "src/components/form/FarmForm";
import withAuth from "src/components/hoc/withAuth";
import BreadcrumbHeader from "src/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "src/components/layout/SiderHeaderLayout";
import StyledPage from "src/components/layout/StyledPage";
import { DEFAULT_POSITION } from "src/configs/constant.config";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProviderFarm from "src/hooks/useGetProviderFarm";
import { useUpdateProviderEcoFarmMutation } from "src/redux/query/farm.query";
import { dayjs } from "src/utils/utils-date";

const Page = () => {
  const { notification } = useApp();
  const { i18n } = useChangeLocale();
  const uid = useId();
  const {
    query: { farmId },
    replace,
  } = useRouter();
  const { gSelectedProvider: farmData, isLoading } = useGetProviderFarm();
  const mappedInitialFormValues = useMemo(
    () => ({
      ...(farmData || {}),
      geoLocation:
        !!farmData?.latitude && !!farmData?.longitude
          ? {
              lat: farmData.latitude || DEFAULT_POSITION.lat,
              lng: farmData.longitude || DEFAULT_POSITION.lng,
            }
          : undefined,
      workTime: !!farmData?.workTime
        ? (JSON.parse(farmData.workTime) as any).map((item: any) =>
            !!item?.length ? [dayjs(item?.[0]), dayjs(item?.[1])] : undefined,
          )
        : undefined,
      types: !!farmData?.groupType
        ? !!farmData?.type
          ? [farmData.groupType, farmData.type]
          : [farmData.groupType]
        : undefined,
    }),
    [farmData],
  );

  const [updateProviderMutate, { isLoading: isLoadingUpdateProvider }] =
    useUpdateProviderEcoFarmMutation();

  const [form] = Form.useForm();

  const handleUpdateFarm = (formData: any) => {
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

    updateProviderMutate({
      ...(farmData || {}),
      id: +(farmId as string),
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
      contact,
      groupType,
      type: type || 0,
      carrierList,
    })
      .unwrap()
      .then(() => {
        notification.success({
          message: i18n["Cập nhật trang trại thành công"],
          placement: "bottomRight",
        });
      })
      .catch(() => {
        notification.error({
          message: i18n["Đã có lỗi xảy ra khi cập nhật trang trại"],
          placement: "bottomRight",
        });
      })
      .finally(() => {
        replace("/supplier/farm/list");
      });
  };

  return (
    <SiderHeaderLayout
      hideSider
      headerLeft={
        <BreadcrumbHeader
          items={[
            { "/supplier/farm": <EcofarmSvg width={26} /> },
            {
              [`/supplier/farm/${farmId}`]: (
                <Avatar
                  shape="square"
                  key={String(farmData?.id) + uid}
                  src={farmData?.imageUrls[0]}
                  size={26}
                />
              ),
            },
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
            onFinish={handleUpdateFarm}
            initialValues={mappedInitialFormValues}
          >
            <FarmForm id={uid} />
          </Form>
        )}
        <Divider />
        <div className="actions-wrapper">
          <Button
            className="btn-reset"
            form={uid}
            htmlType="button"
            size="large"
            disabled={isLoadingUpdateProvider}
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
            loading={isLoadingUpdateProvider}
            disabled={isLoadingUpdateProvider}
          >
            {i18n["Cập nhật"]}
          </Button>
        </div>
      </PageWrapper>
    </SiderHeaderLayout>
  );
};

const PageWrapper = styled(StyledPage)`
  padding: 12px 12px 24px;
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
