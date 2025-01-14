import styled from "@emotion/styled";
import { Divider, Form, Input } from "antd";
import reduce from "lodash/reduce";
import { useRouter } from "next/router";
import { useId } from "react";
import { MdOutlineStore } from "react-icons/md";
import Button from "src/components/button/Button";
import StyledPage from "src/components/layout/StyledPage";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import useGetProvider from "src/hooks/useGetProvider";
import { useCreateItemMutation } from "src/redux/query/item.query";
import Avatar from "../avatar/Avatar";
import BreadcrumbHeader from "../layout/BreadcrumbHeader";
import SiderHeaderLayout from "../layout/SiderHeaderLayout";
import ShoppingItemForm, { cssItemForm } from "./ShoppingItemForm";

function ShoppingItemCreateForm() {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const {
    replace,
    query: { storeId },
  } = useRouter();
  const { message, notification } = useApp();
  const [form] = Form.useForm();
  const { gSelectedProvider } = useGetProvider({});

  const [createItemMutate, { isLoading: isLoadingCreateItem }] = useCreateItemMutation();
  const handleCreateItem = async (formValues: any) => {
    try {
      const {
        name,
        description,
        imageUrlList,
        tierVariationList,
        modelList,
        sku,
        stock,
        minPrice,
        maxPrice,
        categoryId,
        providerId,
        condition,
        attributeList,
        complaintPolicy,
        creationTime,
        logisticInfo,
        sizeInfo,
        status,
        videoUrlList,
        tenantId,
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

      const createItemRes = await createItemMutate({
        name,
        description,
        imageUrlList,
        tierVariationList,
        modelList: finalModelList,
        sku: sku || "---",
        stock,
        categoryId,
        providerId,
        condition,
        minPrice: 0,
        maxPrice: 0,
        attributeList,
        complaintPolicy,
        creationTime,
        logisticInfo,
        sizeInfo,
        status,
        videoUrlList,
        tenantId,
      }).unwrap();

      if (!!createItemRes.data) {
        notification.success({
          message: i18n["Tạo sản phẩm thành công"],
          placement: "bottomRight",
        });
        form.resetFields();
        replace(`/supplier/store/${storeId}/item`);
      } else {
        notification.error({
          message: i18n["Đã có lỗi xảy ra khi tạo sản phẩm"],
          placement: "bottomRight",
        });
        form.resetFields();
      }
    } catch (error) {
      notification.error({
        message: i18n["Đã có lỗi xảy ra khi tạo sản phẩm"],
        placement: "bottomRight",
      });
    } finally {
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
            { [`/supplier/store/${storeId}/item`]: i18n["Sản phẩm"] },
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
              videoUrlList: [],
              imageFileList: [],
              status: 1,
              condition: 1,
              providerId: gSelectedProvider.id,
              complaintPolicy: "",
              logisticInfo: "",
              sizeInfo: {},
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
              label={i18n["Cửa hàng"]}
              rules={[{ required: true }, { type: "number" }]}
              hidden
            >
              <Input />
            </Form.Item>
            <ShoppingItemForm id={uid} />
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
export default ShoppingItemCreateForm;
