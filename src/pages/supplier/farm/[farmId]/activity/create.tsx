import Avatar from "@/components/avatar/Avatar";
import ActivityFarmForm, { cssItemForm } from "@/components/form/ActivityFarmForm";
import { EcofarmSvg } from "@/components/icons";
import BreadcrumbHeader from "@/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "@/components/layout/SiderHeaderLayout";
import useApp from "@/hooks/useApp";
import useChangeLocale from "@/hooks/useChangeLocale";
import useGetProviderFarm from "@/hooks/useGetProviderFarm";
import { useCreateEcofarmPackageActivityMutation } from "@/redux/query/farm.query";
import styled from "@emotion/styled";
import { Button, Divider, Form, Input } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useId } from "react";
import withAuth from "src/components/hoc/withAuth";
import StyledPage from "src/components/layout/StyledPage";
const Page = () => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const {
    replace,
    query: { farmId },
  } = useRouter();
  const { notification } = useApp();
  const [form] = Form.useForm();
  const { gSelectedProvider } = useGetProviderFarm();

  const [createMutate, { isLoading: isLoadingCreateItem }] =
    useCreateEcofarmPackageActivityMutation();
  const handleCreateItem = (formValues: any) => {
    const {
      providerId,
      ecofarmPackageId,
      name,
      dateStart,
      dateExpect,
      imageUrlList,
      videoUrlList,
      description,
      properties,
      rangeDate,
    } = formValues as any;
    let dateFrom = null;
    let dateTo = null;
    if (!!rangeDate?.length) {
      dateFrom = dayjs(rangeDate[0]).toISOString();
      dateTo = dayjs(rangeDate[1]).toISOString();
    }

    createMutate({
      providerId,
      ecofarmPackageId,
      name,
      imageUrlList,
      videoUrlList,
      description,
      properties,
      dateStart: dateFrom ? dateFrom : dateStart,
      dateExpect: dateTo ? dateTo : dateExpect,
      type: 0,
    })
      .unwrap()
      .then(() => {
        notification.success({
          message: i18n["Tạo hoạt động thành công"],
          placement: "bottomRight",
        });
        form.resetFields();
        replace(`/supplier/farm/${farmId}/activity`);
      })
      .catch(() => {
        notification.error({
          message: i18n["Đã có lỗi xảy ra khi tạo hoạt động"],
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
            { [`/supplier/farm/${farmId}/activity`]: i18n["Hoạt động"] },
          ]}
          current={i18n["Thêm hoạt động"]}
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
            <ActivityFarmForm id={uid} />
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
            {i18n["Thêm hoạt động"]}
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
