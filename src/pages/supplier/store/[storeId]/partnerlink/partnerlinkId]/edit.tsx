import Avatar from "@/components/avatar/Avatar";
import AddressesForm, { cssItemForm } from "@/components/form/AddressesForm";
import { EcofarmSvg } from "@/components/icons";
import BreadcrumbHeader from "@/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "@/components/layout/SiderHeaderLayout";
import { DEFAULT_POSITION } from "@/configs/constant.config";
import styled from "@emotion/styled";
import { useCreation } from "ahooks";
import { Card, Divider, Form, Input } from "antd";
import { useRouter } from "next/router";
import { useId } from "react";
import Button from "src/components/button/Button";
import withAuth from "src/components/hoc/withAuth";
import StyledPage from "src/components/layout/StyledPage";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProviderFarm from "src/hooks/useGetProviderFarm";
import {
  useGetProviderAddressesByIdQuery,
  useUpdateProviderAddressesMutation,
} from "src/redux/query/addresses.query";

const Page = () => {
  const uid = useId();
  const {
    query: { addressesId, farmId },
    replace,
  } = useRouter();
  const { i18n } = useChangeLocale();
  const { notification } = useApp();
  const [form] = Form.useForm();
  const { gSelectedProvider } = useGetProviderFarm();

  const { data, isLoading: isLoadingGetItemById } = useGetProviderAddressesByIdQuery(
    { id: +(addressesId as string) },
    { refetchOnMountOrArgChange: true },
  );
  const itemData = data?.data;
  const mappedInitialFormValues = useCreation(
    () => ({
      ...(itemData || {}),
      defaultAddress: itemData?.default,
      returnAddress: itemData?.return,
      providerId: gSelectedProvider?.id,
      geoLocation:
        !!itemData?.latitude && !!itemData?.longitude
          ? {
              lat: itemData.latitude || DEFAULT_POSITION.lat,
              lng: itemData.longitude || DEFAULT_POSITION.lng,
            }
          : undefined,
    }),
    [gSelectedProvider?.id, itemData, addressesId],
  );

  const [updateItemMutate, { isLoading: isLoadingUpdateItem }] =
    useUpdateProviderAddressesMutation();
  const isLoading = isLoadingGetItemById;
  const handleUpdateItem = (formValues: any) => {
    const {
      id,
      defaultAddress,
      pickUp,
      returnAddress,
      geoLocation,
      phoneNumber,
      name,
      districtCode,
      provinceCode,
      wardCode,
      detail,
      providerId,
    } = formValues as any;

    updateItemMutate({
      ...itemData,
      id,
      default: defaultAddress,
      pickUp,
      return: returnAddress,
      latitude: geoLocation?.lat,
      longitude: geoLocation?.lng,
      phoneNumber,
      name,
      districtCode,
      provinceCode,
      wardCode,
      detail,
      providerId,
    })
      .unwrap()
      .then(() => {
        notification.success({
          message: i18n["Cập nhật địa chỉ thành công"],
          placement: "bottomRight",
        });
        replace(`/supplier/farm/${farmId}/addresses`);
      })
      .catch(() => {
        notification.error({
          message: i18n["Đã có lỗi xảy ra khi cập nhật địa chỉ"],
          placement: "bottomRight",
        });
      });
  };
  return (
    <SiderHeaderLayout
      headerLeft={
        <BreadcrumbHeader
          items={[
            { "/supplier/farm": <EcofarmSvg width={26} /> },
            {
              [`/supplier/farm/${farmId}`]: (
                <Avatar
                  shape="square"
                  key={String(gSelectedProvider?.id) + uid}
                  src={gSelectedProvider?.imageUrls[0]}
                  size={26}
                />
              ),
            },
            { [`/supplier/farm/${farmId}/addresses`]: i18n["Địa chỉ"] },
            { [`/supplier/farm/${farmId}/addresses/${String(addressesId)}`]: itemData?.name },
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
            // eslint-disable-next-line no-unused-vars
            onValuesChange={(changedValues, values) => {}}
          >
            <Form.Item
              name="id"
              label={"ID"}
              rules={[{ required: true }, { type: "number" }]}
              hidden
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="providerId"
              label={i18n["Trang trại"]}
              rules={[{ required: true }, { type: "number" }]}
              hidden
            >
              <Input />
            </Form.Item>
            {/* {itemData && itemData.status == EEcoFarmPackageActivityStatus.ONGOING && ( */}
            <AddressesForm id={uid} />
            {/* )} */}
          </Form>
        )}
        <Divider />
        {/* {itemData && itemData.status == EEcoFarmPackageActivityStatus.ONGOING && ( */}
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
        {/* )} */}
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
    justify-content: flex-end;
    padding-bottom: 12px;
    .btn-submit {
      flex: 0 0 360px;
    }
  }
`;

export default withAuth(Page);
