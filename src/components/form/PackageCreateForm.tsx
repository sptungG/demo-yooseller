import styled from "@emotion/styled";
import { Divider, Form, Input } from "antd";
import { useRouter } from "next/router";
import { useId } from "react";
import Button from "src/components/button/Button";
import StyledPage from "src/components/layout/StyledPage";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProviderFarm from "src/hooks/useGetProviderFarm";
import { useCreateEcofarmPackageMutation } from "src/redux/query/farm.query";

import { dayjs } from "@/utils/utils-date";
import Avatar from "../avatar/Avatar";
import PackageForm, { cssPackageForm } from "../form/PackageForm";
import { EcofarmSvg } from "../icons";
import BreadcrumbHeader from "../layout/BreadcrumbHeader";
import SiderHeaderLayout from "../layout/SiderHeaderLayout";

function PackageCreateForm() {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const {
    replace,
    query: { farmId },
  } = useRouter();
  const { notification } = useApp();
  const [form] = Form.useForm();
  const { gSelectedProvider } = useGetProviderFarm();

  const [createMutate, { isLoading: isLoadingCreate }] = useCreateEcofarmPackageMutation();
  const handleCreateItem = async (formValues: any) => {
    try {
      const {
        name,
        description,
        providerId,
        imageUrlList,
        videoUrlList,
        address,
        startDate,
        expectedEndDate,
        totalInvestmentTerm,
        pricePerShare,
        totalNumberShares,
        packagePrice,
        properties,
      } = formValues as any;

      const internalTotalInvestmentTerm =
        totalInvestmentTerm || expectedEndDate?.diff(startDate, "month") || 0;
      const result = await createMutate({
        name,
        description,
        providerId,
        imageUrlList,
        videoUrlList,
        address,
        startDate,
        expectedEndDate,
        totalInvestmentTerm: internalTotalInvestmentTerm,
        pricePerShare,
        totalNumberShares,
        packagePrice: packagePrice || totalNumberShares * (pricePerShare || 0),
        properties: properties || null,
      }).unwrap();

      notification.success({
        message:
          i18n["Thêm"] +
          " " +
          i18n["Gói dịch vụ farming"].toLowerCase() +
          " " +
          i18n["Thành công"].toLowerCase(),
        placement: "bottomRight",
      });
      form.resetFields();
      replace(`/supplier/farm/${farmId}/package`);
    } catch (error) {
      notification.error({
        message: i18n["Đã có lỗi xảy ra khi thêm mới gói dịch vụ farming"],
        placement: "bottomRight",
      });
    }
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
            { [`/supplier/farm/${farmId}/package`]: i18n["Gói dịch vụ farming"] },
          ]}
          current={`${i18n["Thêm"]} ${i18n["Gói dịch vụ farming"].toLowerCase()}`}
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
              imageUrlList: [],
              videoUrlList: [],
              startDate: dayjs().startOf("minute"),
              expectedEndDate: dayjs().startOf("minute").add(1, "month"),
              properties: "",
              address: gSelectedProvider.address,
              totalNumberShares: 1,
              packagePrice: 0,
            }}
            onFinish={handleCreateItem}
          >
            <Form.Item
              name="providerId"
              label={i18n["Trang trại"]}
              rules={[{ required: true }, { type: "number" }]}
              hidden
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="listItems"
              label={i18n["Sản phẩm"]}
              rules={[{ required: false }, { type: "string" }]}
              hidden
            >
              <Input />
            </Form.Item>
            <PackageForm mode="CREATE" />
          </Form>
        )}
        <Divider />
        <div className="actions-wrapper">
          <Button
            className="btn-reset"
            form={uid}
            size="large"
            disabled={isLoadingCreate}
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
            loading={isLoadingCreate}
            disabled={isLoadingCreate}
          >
            {`${i18n["Thêm"]} ${i18n["Gói dịch vụ farming"].toLowerCase()}`}
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
    ${cssPackageForm}
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
export default PackageCreateForm;
