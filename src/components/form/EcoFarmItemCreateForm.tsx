import styled from "@emotion/styled";
import { Divider, Form, Input } from "antd";
import reduce from "lodash/reduce";
import { useRouter } from "next/router";
import { useId } from "react";
import Button from "src/components/button/Button";
import StyledPage from "src/components/layout/StyledPage";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProviderFarm from "src/hooks/useGetProviderFarm";
import { useCreateItemForEcoFarmMutation } from "src/redux/query/farm.query";
import Avatar from "../avatar/Avatar";
import { EcofarmSvg } from "../icons";
import BreadcrumbHeader from "../layout/BreadcrumbHeader";
import SiderHeaderLayout from "../layout/SiderHeaderLayout";
import EcofarmItemForm, { cssItemForm } from "./EcofarmItemForm";

function EcoFarmItemCreateForm() {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const {
    replace,
    query: { farmId },
  } = useRouter();
  const { notification } = useApp();
  const [form] = Form.useForm();
  const { gSelectedProvider } = useGetProviderFarm();

  const [createMutate, { isLoading: isLoadingCreateItem }] = useCreateItemForEcoFarmMutation();
  const handleCreateItem = (formValues: any) => {
    const {
      tenantId,
      name,
      providerId,
      categoryId,
      sku,
      imageUrlList,
      videoUrlList,
      description,
      logisticInfo,
      sizeInfo,
      status,
      condition,
      complaintPolicy,
      attributeList,
      tierVariationList,
      modelList,
      ecofarmPackageId,
      minPrice,
      maxPrice,
      stock,
    } = formValues as any;

    const finalModelList = !modelList?.length
      ? [
          {
            currentPrice: minPrice,
            originalPrice: maxPrice || minPrice,
            imageUrl: imageUrlList?.[0] || "",
            sku,
            stock,
            tierIndex: [],
          },
        ]
      : modelList;

    createMutate({
      name,
      description,
      imageUrlList,
      tierVariationList,
      modelList: finalModelList,
      sku: sku || "---",
      categoryId,
      providerId,
      condition,
      attributeList,
      complaintPolicy,
      logisticInfo,
      sizeInfo,
      status,
      videoUrlList,
      tenantId,
      properties: "",
      ecofarmPackageId,
    })
      .unwrap()
      .then(() => {
        notification.success({
          message: i18n["Tạo sản phẩm thành công"],
          placement: "bottomRight",
        });
        form.resetFields();
        replace(`/supplier/farm/${farmId}/item`);
      })
      .catch(() => {
        notification.error({
          message: i18n["Đã có lỗi xảy ra khi tạo sản phẩm"],
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
            { [`/supplier/farm/${farmId}/item`]: i18n["Sản phẩm"] },
          ]}
          current={i18n["Thêm sản phẩm"]}
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
              tierVariationList: [],
              modelList: [],
              imageUrlList: [],
              imageFileList: [],
              videoUrlList: [],
              videoFileList: [],
              status: 1,
              condition: 1,
              providerId: gSelectedProvider.id,
              complaintPolicy: "",
              logisticInfo: "",
              sizeInfo: "",
              tenantId: 0,
            }}
            onFinish={handleCreateItem}
            onValuesChange={(changedValues, values) => {
              const { modelList } = values as any;
              if (!!modelList?.length) {
                const totalStock = reduce(modelList, (prev, cur) => prev + (cur?.stock || 0), 0);
                form.setFieldValue(["stock"], totalStock);
                form.setFieldValue(["price"], undefined);
              }
            }}
          >
            <Form.Item
              name="providerId"
              label={i18n["Trang trại"]}
              rules={[{ required: true }, { type: "number" }]}
              hidden
            >
              <Input />
            </Form.Item>
            <EcofarmItemForm id={uid} />
          </Form>
        )}
        <Divider />
        <div className="actions-wrapper">
          <Button
            className="btn-reset"
            form={uid}
            size="large"
            disabled={isLoadingCreateItem}
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
            loading={isLoadingCreateItem}
            disabled={isLoadingCreateItem}
          >
            {i18n["Thêm sản phẩm"]}
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
    ${cssItemForm}
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
export default EcoFarmItemCreateForm;
