import { TVoucherStatus } from "@/types/voucher.types";
import { vietnameseSlug } from "@/utils/utils";
import { dayjs } from "@/utils/utils-date";
import styled from "@emotion/styled";
import { skipToken } from "@reduxjs/toolkit/query";
import { useCreation } from "ahooks";
import { Card, Divider, Form, Input } from "antd";
import { useRouter } from "next/router";
import { useId } from "react";
import { MdOutlineStore } from "react-icons/md";
import Button from "src/components/button/Button";
import StyledPage from "src/components/layout/StyledPage";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProvider from "src/hooks/useGetProvider";
import { useGetVoucherByIdQuery, useUpdateVoucherMutation } from "src/redux/query/voucher.query";
import Avatar from "../avatar/Avatar";
import BreadcrumbHeader from "../layout/BreadcrumbHeader";
import SiderHeaderLayout from "../layout/SiderHeaderLayout";
import VoucherForm, { cssVoucherForm } from "./VoucherForm";

function VoucherUpdateForm() {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const {
    replace,
    query: { voucherId, storeId },
  } = useRouter();
  const { message, notification } = useApp();
  const [form] = Form.useForm();
  const { gSelectedProvider } = useGetProvider({});
  const prefixVoucherCode = gSelectedProvider?.name
    ? vietnameseSlug(gSelectedProvider?.name, "")
        .toUpperCase()
        .replace(/[^A-Za-z0-9]/g, "")
        .substring(0, 4)
    : undefined;

  const { data: getVoucherByIdRes, isLoading: isLoadingGetVoucherById } = useGetVoucherByIdQuery(
    voucherId ? { id: +(voucherId as string) } : skipToken,
    { refetchOnMountOrArgChange: true },
  );
  const voucherData = getVoucherByIdRes?.data;

  const mappedInitialFormValues = useCreation(
    () => ({
      ...(voucherData
        ? {
            ...voucherData,
            voucherCode:
              prefixVoucherCode && voucherData.voucherCode.includes(prefixVoucherCode)
                ? voucherData.voucherCode.substring(4)
                : voucherData.voucherCode,
            dateStart: voucherData?.dateStart ? dayjs(voucherData.dateStart) : undefined,
            dateEnd: voucherData?.dateEnd ? dayjs(voucherData.dateEnd) : undefined,
          }
        : {}),
    }),
    [gSelectedProvider?.id, voucherData, voucherId],
  );

  const [updateVoucherMutate, { isLoading: isLoadingUpdateVoucher }] = useUpdateVoucherMutation();
  const isLoading = isLoadingGetVoucherById;

  const handleUpdateVoucher = async (formValues: any) => {
    try {
      const {
        id,
        name,
        description,
        quantity,
        minBasketPrice,
        maxPrice,
        percentage,
        discountAmount,
        dateStart,
        dateEnd,
        maxDistributionBuyer,
        displayChannelList,
        displayDateStart,
      } = formValues as any;
      const updateVoucherRes = await updateVoucherMutate({
        ...voucherData,
        id,
        name,
        description,
        quantity,
        minBasketPrice,
        maxPrice,
        percentage,
        discountAmount,
        dateStart,
        dateEnd,
        maxDistributionBuyer,
      }).unwrap();

      if (updateVoucherRes.success === true) {
        notification.success({
          message: i18n["Cập nhật mã giảm giá thành công"],
          placement: "bottomRight",
        });
        form.resetFields();
        replace(`/supplier/store/${storeId}/marketing/voucher`);
      } else {
        notification.error({
          message: i18n["Đã có lỗi xảy ra khi cập nhật mã giảm giá"],
          placement: "bottomRight",
        });
      }
    } catch (error) {
      notification.error({
        message: i18n["Đã có lỗi xảy ra khi cập nhật mã giảm giá"],
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
            { [`/supplier/store/${storeId}/marketing/voucher`]: i18n["Mã giảm giá"] },
          ]}
          current={i18n["Sửa khuyến mãi"]}
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
            onFinish={handleUpdateVoucher}
            disabled={voucherData?.status === TVoucherStatus.EXPIRED}
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
            <VoucherForm mode={"UPDATE"} />
          </Form>
        )}
        <Divider />
        <div className="actions-wrapper">
          <Button
            className="btn-reset"
            form={uid}
            size="large"
            disabled={isLoadingUpdateVoucher}
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
            loading={isLoadingUpdateVoucher}
            disabled={isLoadingUpdateVoucher}
          >
            {i18n["Cập nhật khuyến mãi"]}
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
    ${cssVoucherForm}
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
export default VoucherUpdateForm;
