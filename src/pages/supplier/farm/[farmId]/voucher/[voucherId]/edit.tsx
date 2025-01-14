import Avatar from "@/components/avatar/Avatar";
import VoucherFarmForm, { cssItemForm } from "@/components/form/VoucherFarmForm";
import { EcofarmSvg } from "@/components/icons";
import BreadcrumbHeader from "@/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "@/components/layout/SiderHeaderLayout";
import { isAfterDate } from "@/utils/utils-date";
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
import { useGetVoucherByIdQuery, useUpdateVoucherMutation } from "src/redux/query/farm.query";

const Page = () => {
  const uid = useId();
  const {
    query: { voucherId, farmId },
    replace,
  } = useRouter();
  const { i18n } = useChangeLocale();
  const { notification } = useApp();
  const [form] = Form.useForm();
  const { gSelectedProvider } = useGetProviderFarm();

  const { data, isLoading: isLoadingGetItemById } = useGetVoucherByIdQuery(
    { id: +(voucherId as string) },
    { refetchOnMountOrArgChange: true },
  );
  const itemData = data?.data;

  const mappedInitialFormValues = useCreation(
    () => ({
      ...(itemData || {}),
      dateStart: itemData?.dateStart ? new Date(itemData.dateStart) : null,
      dateEnd: itemData?.dateEnd ? new Date(itemData.dateEnd) : null,
      rangeDate: [dayjs(itemData?.dateStart), dayjs(itemData?.dateEnd)],
      providerId: gSelectedProvider?.id,
      listItems: itemData?.listItems ? itemData?.listItems : [],
    }),
    [gSelectedProvider?.id, itemData, voucherId],
  );

  const [updateItemMutate, { isLoading: isLoadingUpdateItem }] = useUpdateVoucherMutation();
  const isLoading = isLoadingGetItemById;
  const handleUpdateItem = (formValues: any) => {
    const {
      id,
      tenantId,
      providerId,
      type,
      scope,
      description,
      discountType,
      voucherCode,
      name,
      quantity,
      minBasketPrice,
      maxPrice,
      percentage,
      discountAmount,
      dateStart,
      dateEnd,
      maxDistributionBuyer,
      listItems,
      displayChannelList,
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
      tenantId,
      providerId,
      type,
      scope,
      description,
      discountType,
      voucherCode,
      name,
      quantity,
      minBasketPrice,
      maxPrice,
      percentage,
      discountAmount,
      dateStart: dateFrom ? dateFrom : dateStart,
      dateEnd: dateTo ? dateTo : dateEnd,
      maxDistributionBuyer,
      listItems,
      displayChannelList,
    })
      .unwrap()
      .then(() => {
        notification.success({
          message: i18n["Cập nhật voucher thành công"],
          placement: "bottomRight",
        });
        replace(`/supplier/farm/${farmId}/voucher`);
      })
      .catch(() => {
        notification.error({
          message: i18n["Đã có lỗi xảy ra khi cập nhật voucher"],
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
            { [`/supplier/farm/${farmId}/voucher`]: i18n["Voucher"] },
            { [`/supplier/farm/${farmId}/voucher/${String(voucherId)}`]: itemData?.name },
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
              label={i18n["Cửa hàng"]}
              rules={[{ required: true }, { type: "number" }]}
              hidden
            >
              <Input />
            </Form.Item>
            {itemData && isAfterDate(itemData.dateStart, dayjs()) && <VoucherFarmForm id={uid} />}
          </Form>
        )}
        <Divider />
        {itemData && isAfterDate(itemData.dateStart, dayjs()) && (
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
        )}
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
