import Avatar from "@/components/avatar/Avatar";
import PageForm, { cssItemForm } from "@/components/form/PageForm";
import BreadcrumbHeader from "@/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "@/components/layout/SiderHeaderLayout";
import useApp from "@/hooks/useApp";
import useChangeLocale from "@/hooks/useChangeLocale";
import useGetProvider from "@/hooks/useGetProvider";
import { useCreatePageInformationsMutation } from "@/redux/query/pageprivate.query";
import styled from "@emotion/styled";
import { Button, Divider, Form, Input } from "antd";
import { useRouter } from "next/router";
import { useId } from "react";
import { MdOutlineStore } from "react-icons/md";
import withAuth from "src/components/hoc/withAuth";
import StyledPage from "src/components/layout/StyledPage";
const Page = () => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const {
    replace,
    query: { storeId },
  } = useRouter();
  const { notification } = useApp();
  const [form] = Form.useForm();
  const { gSelectedProvider } = useGetProvider({});
  const [createMutate, { isLoading: isLoadingCreateItem }] = useCreatePageInformationsMutation();
  const handleCreateItem = (formValues: any) => {
    const {
      pageTemplatesCode,
      website,
      aboutUs,
      background,
      logo,
      providerId,
      certificate,
      aboutUsImageUrl,
      productImageRanking,
    } = formValues as any;

    createMutate({
      pageTemplatesCode,
      website,
      aboutUs,
      background,
      logo,
      providerId,
      certificate,
      aboutUsImageUrl,
      productImageRanking,
    })
      .unwrap()
      .then(() => {
        notification.success({
          message: "Tạo website thành công",
          placement: "bottomRight",
        });
        form.resetFields();
        replace(`/supplier/store/${storeId}/website`);
      })
      .catch(() => {
        notification.error({
          message: "Đã có lỗi xảy ra khi tạo mới website",
          placement: "bottomRight",
        });
      });
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
            { [`/supplier/store/${storeId}/webiste`]: "Website" },
          ]}
          current="Tạo mới website"
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
              status: 1,
              providerId: gSelectedProvider.id,
            }}
            onFinish={handleCreateItem}
            // eslint-disable-next-line no-unused-vars
            onValuesChange={(changedValues, values) => {}}
          >
            <Form.Item
              name="providerId"
              label={i18n["Trang trại"]}
              rules={[{ required: true }, { type: "number" }]}
              hidden
            >
              <Input />
            </Form.Item>
            <PageForm id={uid} />
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
            Tạo mới website
          </Button>
        </div>
      </PageWrapper>
    </SiderHeaderLayout>
  );
};
const PageWrapper = styled(StyledPage)`
  padding: 12px;
  width: 100%;
  max-width: 800px;
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
export default withAuth(Page);
