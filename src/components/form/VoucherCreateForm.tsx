import { useCreateVoucherMutation } from "@/redux/query/voucher.query";
import { vietnameseSlug } from "@/utils/utils";
import { dayjs } from "@/utils/utils-date";
import styled from "@emotion/styled";
import { Divider, Form, Input } from "antd";
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
import VoucherForm, { cssVoucherForm } from "./VoucherForm";

function VoucherCreateForm() {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const {
    replace,
    query: { storeId },
  } = useRouter();
  const { message, notification } = useApp();
  const [form] = Form.useForm();
  const { gSelectedProvider } = useGetProvider({});
  const prefixVoucherCode = gSelectedProvider?.name
    ? vietnameseSlug(gSelectedProvider?.name, "")
        .toUpperCase()
        .replace(/[^A-Za-z0-9]/g, "")
        .substring(0, 4)
    : "";

  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const [createVoucherMutate, { isLoading: isLoadingCreateVoucher }] = useCreateVoucherMutation();

  const handleCreateVoucher = async (formValues: any) => {
    try {
      const {
        tenantId,
        providerId,
        type,
        scope,
        name,
        description,
        discountType,
        voucherCode,
        quantity,
        minBasketPrice,
        maxPrice,
        percentage,
        discountAmount,
        dateStart,
        dateEnd,
        isAdminCreate,
        maxDistributionBuyer,
        listItems,
        displayChannelList,
        displayDateStart,
      } = formValues as any;

      const createVoucherRes = await createVoucherMutate({
        tenantId,
        providerId,
        type,
        scope,
        name,
        description,
        discountType,
        voucherCode: prefixVoucherCode + voucherCode,
        quantity,
        minBasketPrice,
        maxPrice,
        percentage,
        discountAmount,
        dateStart,
        dateEnd,
        isAdminCreate,
        maxDistributionBuyer,
        listItems: listItems || [],
        displayChannelList,
        displayDateStart: dateStart,
      }).unwrap();

      if (createVoucherRes.success === true) {
        notification.success({
          message: i18n["Tạo mã giảm giá thành công"],
          placement: "bottomRight",
        });
        form.resetFields();
        replace(`/supplier/store/${storeId}/marketing/voucher`);
      } else {
        notification.error({
          message: i18n["Đã có lỗi xảy ra khi tạo mã giảm giá"],
          placement: "bottomRight",
        });
      }
    } catch (error) {
      notification.error({
        message: i18n["Đã có lỗi xảy ra khi tạo mã giảm giá"],
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
          current={i18n["Tạo khuyến mãi"]}
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
              tenantId: 0,
              isAdminCreate: false,
              listItems: [],
              scope: 1,
              discountType: 1,
              type: 1,
              dateStart: dayjs(),
              dateEnd: dayjs().add(1, "hour").endOf("minute"),
              maxDistributionBuyer: 1,
            }}
            onFinish={handleCreateVoucher}
          >
            <Form.Item
              name="providerId"
              label={i18n["Cửa hàng"]}
              rules={[{ required: true }, { type: "number" }]}
              hidden
            >
              <Input />
            </Form.Item>
            <VoucherForm mode={"CREATE"} />
          </Form>
        )}
        <Divider />
        <div className="actions-wrapper">
          <Button
            className="btn-reset"
            form={uid}
            size="large"
            disabled={isLoadingCreateVoucher}
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
            loading={isLoadingCreateVoucher}
            disabled={isLoadingCreateVoucher}
          >
            {i18n["Tạo khuyến mãi"]}
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
export default VoucherCreateForm;
