import Avatar from "@/components/avatar/Avatar";
import ActivityFarmForm, { cssItemForm } from "@/components/form/ActivityFarmForm";
import { EcofarmSvg } from "@/components/icons";
import BreadcrumbHeader from "@/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "@/components/layout/SiderHeaderLayout";
import styled from "@emotion/styled";
import { useCreation } from "ahooks";
import { Card, Divider, Form, Input } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useId } from "react";
import Button from "src/components/button/Button";
import withAuth from "src/components/hoc/withAuth";
import StyledPage from "src/components/layout/StyledPage";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProviderFarm from "src/hooks/useGetProviderFarm";
import {
  useGetEcofarmPackageActivityByIdQuery,
  useUpdateEcofarmPackageActivityMutation,
} from "src/redux/query/farm.query";

const Page = () => {
  const uid = useId();
  const {
    query: { activityId, farmId },
    replace,
  } = useRouter();
  const { i18n } = useChangeLocale();
  const { notification } = useApp();
  const [form] = Form.useForm();
  const { gSelectedProvider } = useGetProviderFarm();

  const { data, isLoading: isLoadingGetItemById } = useGetEcofarmPackageActivityByIdQuery(
    { id: +(activityId as string) },
    { refetchOnMountOrArgChange: true },
  );
  const itemData = data?.data;
  const mappedInitialFormValues = useCreation(
    () => ({
      ...(itemData || {}),
      dateStart: itemData?.dateStart ? new Date(itemData.dateStart) : null,
      dateExpect: itemData?.dateExpect ? new Date(itemData.dateExpect) : null,
      rangeDate: [dayjs(itemData?.dateStart), dayjs(itemData?.dateExpect)],
      providerId: gSelectedProvider?.id,
    }),
    [gSelectedProvider?.id, itemData, activityId],
  );

  const [updateItemMutate, { isLoading: isLoadingUpdateItem }] =
    useUpdateEcofarmPackageActivityMutation();
  const isLoading = isLoadingGetItemById;
  const handleUpdateItem = (formValues: any) => {
    const {
      id,
      providerId,
      ecofarmPackageId,
      name,
      dateStart,
      dateExpect,
      imageUrlList,
      videoUrlList,
      description,
      properties,
      type,
      rangeDate,
    } = formValues as any;

    let dateFrom = null;
    let dateTo = null;
    if (!!rangeDate?.length) {
      dateFrom = dayjs(rangeDate[0]).toISOString();
      dateTo = dayjs(rangeDate[1]).toISOString();
    }
    updateItemMutate({
      ...itemData,
      id,
      providerId,
      ecofarmPackageId,
      name,
      imageUrlList,
      videoUrlList,
      description,
      properties,
      type,
      dateStart: dateFrom ? dateFrom : dateStart,
      dateExpect: dateTo ? dateTo : dateExpect,
    })
      .unwrap()
      .then(() => {
        notification.success({
          message: i18n["Cập nhật hoạt động thành công"],
          placement: "bottomRight",
        });
        replace(`/supplier/farm/${farmId}/activity`);
      })
      .catch(() => {
        notification.error({
          message: i18n["Đã có lỗi xảy ra khi cập nhật hoạt động"],
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
            { [`/supplier/farm/${farmId}/activity`]: i18n["Hoạt động"] },
            { [`/supplier/farm/${farmId}/activity/${String(activityId)}`]: itemData?.name },
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
            <ActivityFarmForm id={uid} />
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
