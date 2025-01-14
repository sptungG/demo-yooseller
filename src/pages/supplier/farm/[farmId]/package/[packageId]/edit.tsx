import PackageForm, { cssPackageForm } from "@/components/form/PackageForm";
import { EcofarmSvg } from "@/components/icons";
import {
  useGetEcofarmPackageByIdQuery,
  useGetProviderEcofarmByIdQuery,
  useUpdateEcofarmPackageMutation,
} from "@/redux/query/farm.query";
import styled from "@emotion/styled";
import { Divider, Form } from "antd";
import Avatar from "antd/lib/avatar";
import { useRouter } from "next/router";
import { useId, useMemo } from "react";
import Button from "src/components/button/Button";
import Card from "src/components/card/Card";
import withAuth from "src/components/hoc/withAuth";
import BreadcrumbHeader from "src/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "src/components/layout/SiderHeaderLayout";
import StyledPage from "src/components/layout/StyledPage";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import { dayjs } from "src/utils/utils-date";

const Page = () => {
  const { notification } = useApp();
  const { i18n } = useChangeLocale();
  const uid = useId();
  const {
    query: { farmId, packageId },
    replace,
  } = useRouter();

  const { data: dataFarm } = useGetProviderEcofarmByIdQuery(
    { id: +(farmId as string) },
    { refetchOnMountOrArgChange: true, skip: !farmId },
  );
  const { data, isLoading } = useGetEcofarmPackageByIdQuery(
    { id: +(packageId as string) },
    { refetchOnMountOrArgChange: true, skip: !packageId },
  );
  const itemData = data?.data;
  const itemDataFarm = dataFarm?.data;
  const mappedInitialFormValues = useMemo(() => {
    return itemData
      ? {
          ...itemData,
          startDate: itemData?.startDate ? dayjs(itemData.startDate) : undefined,
          expectedEndDate: itemData?.expectedEndDate ? dayjs(itemData.expectedEndDate) : undefined,
        }
      : {};
  }, [itemData]);

  const [updateMutate, { isLoading: isLoadingForm }] = useUpdateEcofarmPackageMutation();

  const [form] = Form.useForm();

  const handleUpdate = (formData: any) => {
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
      numberSharesSold,
      packagePrice,
      properties,
      listItems,
    } = formData;

    updateMutate({
      ...(itemData || {}),
      id: +(packageId as string),
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
    })
      .unwrap()
      .then(() => {
        notification.success({
          message: i18n["Cập nhật gói dịch vụ farming thành công"],
          placement: "bottomRight",
        });
      })
      .catch(() => {
        notification.error({
          message: i18n["Đã có lỗi xảy ra khi cập nhật gói dịch vụ farming"],
          placement: "bottomRight",
        });
      })
      .finally(() => {
        replace("/supplier/farm/" + farmId + "/package");
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
                  key={String(itemDataFarm?.id) + uid}
                  src={itemDataFarm?.imageUrls[0]}
                  size={26}
                />
              ),
            },
            { [`/supplier/farm/${farmId}/package`]: i18n["Gói dịch vụ farming"] },
            { [`/supplier/farm/${farmId}/package/${String(packageId)}`]: itemData?.name },
          ]}
          current={i18n["Cập nhật"]}
        />
      }
    >
      <PageWrapper style={{ flexDirection: "column", padding: 15 }}>
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
            onFinish={handleUpdate}
            initialValues={mappedInitialFormValues}
          >
            <PackageForm mode={"UPDATE"} />
          </Form>
        )}
        <Divider />
        <div className="actions-wrapper">
          <Button
            className="btn-reset"
            form={uid}
            htmlType="button"
            size="large"
            disabled={isLoadingForm}
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
            loading={isLoadingForm}
            disabled={isLoadingForm}
          >
            {i18n["Cập nhật"]}
          </Button>
        </div>
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

export default withAuth(Page);
