import styled from "@emotion/styled";
import { useCreation } from "ahooks";
import { Card, Divider, Form, Input } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useId } from "react";
import Button from "src/components/button/Button";
import StyledPage from "src/components/layout/StyledPage";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProviderFarm from "src/hooks/useGetProviderFarm";
import {
  useGetItemByIdForEcoFarmQuery,
  useUpdateItemForEcoFarmMutation,
} from "src/redux/query/farm.query";

import { reduce } from "lodash";
import Avatar from "../avatar/Avatar";
import { EcofarmSvg } from "../icons";
import BreadcrumbHeader from "../layout/BreadcrumbHeader";
import SiderHeaderLayout from "../layout/SiderHeaderLayout";
import { cssItemForm } from "./EcofarmItemForm";

const EcofarmItemForm = dynamic(() => import("./EcofarmItemForm"), {});

function EcofarmItemUpdateForm() {
  const uid = useId();
  const {
    query: { itemId, farmId },
    replace,
  } = useRouter();
  const { i18n } = useChangeLocale();
  const { notification } = useApp();
  const [form] = Form.useForm();
  const { gSelectedProvider } = useGetProviderFarm();

  const { data, isLoading: isLoadingGetItemById } = useGetItemByIdForEcoFarmQuery(
    { id: +(itemId as string) },
    { refetchOnMountOrArgChange: true },
  );
  const itemData = data?.data;

  const mappedInitialFormValues = useCreation(
    () => ({
      ...(itemData || {}),
      imageFileList: [],
      providerId: gSelectedProvider?.id,
    }),
    [gSelectedProvider?.id, itemData, itemId],
  );

  const [updateItemMutate, { isLoading: isLoadingUpdateItem }] = useUpdateItemForEcoFarmMutation();
  const isLoading = isLoadingGetItemById;
  const handleUpdateItem = (formValues: any) => {
    const {
      id,
      name,
      sku,
      imageUrlList,
      videoUrlList,
      description,
      logisticInfo,
      sizeInfo,
      properties,
      modelList,
      ecofarmPackageId,
      stock,
      minPrice,
    } = formValues as any;
    const finalModelList =
      !!modelList?.length && modelList.length > 1
        ? modelList
        : [
            {
              ...modelList[0]!,
              currentPrice: minPrice,
              //originalPrice: maxPrice || minPrice,
              stock,
              name,
            },
          ];

    updateItemMutate({
      ...itemData,
      id,
      name,
      description,
      imageUrlList,
      modelList: finalModelList,
      logisticInfo,
      sizeInfo,
      videoUrlList,
      properties: properties || "",
      ecofarmPackageId,
      sku,
    })
      .unwrap()
      .then(() => {
        notification.success({
          message: i18n["Cập nhật sản phẩm thành công"],
          placement: "bottomRight",
        });
        replace(`/supplier/farm/${farmId}/item`);
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
            { [`/supplier/farm/${farmId}/item`]: i18n["Sản phẩm"] },
            { [`/supplier/farm/${farmId}/item/${String(itemId)}`]: itemData?.name },
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
            <EcofarmItemForm id={uid} />
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
    justify-content: flex-end;
    padding-bottom: 12px;
    .btn-submit {
      flex: 0 0 360px;
    }
  }
`;

export default EcofarmItemUpdateForm;
