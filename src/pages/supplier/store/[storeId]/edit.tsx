import styled from "@emotion/styled";
import { Divider, Form } from "antd";
import { useRouter } from "next/router";
import { useId, useMemo, useState } from "react";
import { MdOutlineStore } from "react-icons/md";
import Avatar from "src/components/avatar/Avatar";
import Button from "src/components/button/Button";
import Card from "src/components/card/Card";
import StoreForm, { cssStoreFormWrapper } from "src/components/form/StoreForm";
import withAuth from "src/components/hoc/withAuth";
import BreadcrumbHeader from "src/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "src/components/layout/SiderHeaderLayout";
import StyledPage from "src/components/layout/StyledPage";
import { DEFAULT_POSITION } from "src/configs/constant.config";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProvider from "src/hooks/useGetProvider";
import { useUpdateProviderDetailMutation } from "src/redux/query/provider.query";
import { dayjs } from "src/utils/utils-date";

const Page = () => {
  const { message, notification } = useApp();
  const { i18n } = useChangeLocale();
  const uid = useId();
  const {
    query: { storeId },
    replace,
  } = useRouter();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const { gSelectedProvider: storeData, isLoading } = useGetProvider({});
  const mappedInitialFormValues = useMemo(
    () => ({
      ...(storeData || {}),
      geoLocation:
        !!storeData?.latitude && !!storeData?.longitude
          ? {
              lat: storeData.latitude || DEFAULT_POSITION.lat,
              lng: storeData.longitude || DEFAULT_POSITION.lng,
            }
          : undefined,
      workTime: !!storeData?.workTime
        ? (JSON.parse(storeData.workTime) as any).map((item: any) =>
            !!item?.length ? [dayjs(item?.[0]), dayjs(item?.[1])] : undefined,
          )
        : undefined,
      types: !!storeData?.groupType
        ? !!storeData?.type
          ? [storeData.groupType, storeData.type]
          : [storeData.groupType]
        : undefined,
    }),
    [storeData],
  );

  const [updateProviderMutate, { isLoading: isLoadingUpdateProvider }] =
    useUpdateProviderDetailMutation();

  const [form] = Form.useForm();

  const handleUpdateStore = (formData: any) => {
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
    updateProviderMutate({
      ...(storeData || {}),
      id: +(storeId as string),
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
      workTime: !!mappedWorkTime?.every((w: any) => !w) ? "" : JSON.stringify(mappedWorkTime),
      carrierList,
    })
      .unwrap()
      .then((result) => {
        notification.success({
          message: i18n["Cập nhật cửa hàng thành công"],
          placement: "bottomRight",
        });
      })
      .catch((err) => {
        notification.error({
          message: i18n["Đã có lỗi xảy ra khi cập nhật cửa hàng"],
          placement: "bottomRight",
        });
      })
      .finally(() => {
        replace("/supplier/store");
      });
  };

  return (
    <SiderHeaderLayout
      hideSider
      headerLeft={
        <BreadcrumbHeader
          items={[
            { "/supplier/store": <MdOutlineStore size={26} /> },
            {
              [`/supplier/store/${storeId}`]: (
                <Avatar
                  shape="square"
                  key={String(storeData?.id) + uid}
                  src={storeData?.imageUrls[0]}
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
            onFinish={handleUpdateStore}
            initialValues={mappedInitialFormValues}
          >
            <StoreForm id={uid} />
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
