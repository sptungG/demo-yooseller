import useGetProviderFarm from "@/hooks/useGetProviderFarm";
import { useGetEcofarmPackageByIdQuery } from "@/redux/query/farm.query";
import { dayjs } from "@/utils/utils-date";
import styled from "@emotion/styled";
import { Card, Divider, Form, Input } from "antd";
import { useRouter } from "next/router";
import { useId, useMemo } from "react";
import Button from "src/components/button/Button";
import StyledPage from "src/components/layout/StyledPage";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import { useUpdateItemBookingMutation } from "src/redux/query/item.query";
import Avatar from "../avatar/Avatar";
import { EcofarmSvg } from "../icons";
import BreadcrumbHeader from "../layout/BreadcrumbHeader";
import SiderHeaderLayout from "../layout/SiderHeaderLayout";
import DefaultItemForm from "./DefaultItemForm";
import { cssItemForm } from "./ShoppingItemForm";

type TPackageUpdateFormProps = {};

const PackageUpdateForm = ({}: TPackageUpdateFormProps) => {
  const uid = useId();
  const {
    query: { packageId, farmId },
    replace,
  } = useRouter();
  const { i18n } = useChangeLocale();
  const { notification } = useApp();

  const [form] = Form.useForm();
  const { gSelectedProvider } = useGetProviderFarm();

  const { data, isLoading } = useGetEcofarmPackageByIdQuery(
    { id: +(packageId as string) },
    { refetchOnMountOrArgChange: true },
  );
  const itemData = data?.data;
  const mappedInitialFormValues = useMemo(() => {
    return itemData
      ? {
          ...itemData,
          startDate: itemData?.startDate ? dayjs(itemData.startDate) : undefined,
          expectedEndDate: itemData?.expectedEndDate ? dayjs(itemData.expectedEndDate) : undefined,
        }
      : {};
  }, [itemData]);

  const [updateItemMutate, { isLoading: isLoadingUpdateItem }] = useUpdateItemBookingMutation();
  const handleUpdateItem = (formValues: any) => {
    const {
      id,
      name,
      description,
      properties,
      imageUrlList,
      condition,
      sizeInfo,
      logisticInfo,
      videoUrlList,
      attributeList,
    } = formValues as any;

    updateItemMutate({
      ...itemData,
      name,
      description,
      imageUrlList,
      condition,
      attributeList,
      sizeInfo,
      videoUrlList,
      id,
      logisticInfo,
      properties,
    })
      .unwrap()
      .then((result) => {
        if (result.data === true) {
          notification.success({
            message: i18n["Cập nhật sản phẩm thành công"],
            placement: "bottomRight",
          });
          form.resetFields();
          replace(`/supplier/farm/${farmId}/package`);
        } else {
          notification.error({
            message: i18n["Đã có lỗi xảy ra khi cập nhật sản phẩm"],
            placement: "bottomRight",
          });
        }
      })
      .catch(() => {
        notification.error({
          message: i18n["Đã có lỗi xảy ra khi cập nhật sản phẩm"],
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
            { [`/supplier/farm/${farmId}/package`]: i18n["Gói dịch vụ farming"] },
            { [`/supplier/farm/${farmId}/package/${String(packageId)}`]: itemData?.name },
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
            onValuesChange={() => {}}
          >
            <Form.Item name="id" rules={[{ required: true }, { type: "number" }]} hidden>
              <Input />
            </Form.Item>
            <Form.Item name="condition" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="sizeInfo" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="logisticInfo" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="attributeList" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="videoUrlList" hidden>
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
            <Form.Item name="properties" hidden>
              <Input />
            </Form.Item>
            <DefaultItemForm id={uid} />
          </Form>
        )}
        <Divider />
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
      </PageWrapper>
    </SiderHeaderLayout>
  );
};
const PageWrapper = styled(StyledPage)`
  padding: 12px;
  width: 100%;
  max-width: 1200px;
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

export default PackageUpdateForm;
