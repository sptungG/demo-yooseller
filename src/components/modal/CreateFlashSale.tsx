import useApp from "@/hooks/useApp";
import useChangeLocale from "@/hooks/useChangeLocale";
import { flashSaleApi } from "@/redux/query/flashSale.query";
import styled from "@emotion/styled";
import { Drawer, DrawerProps, Flex, Form, Typography } from "antd";
import { useId } from "react";
import { BsPlusLg } from "react-icons/bs";
import Button from "../button/Button";
import FlashSaleConfigCalender from "../field/FlashSaleConfigCalender";
import FlashSaleItems, { TListItem } from "../field/FlashSaleItems";

type TCreateFlashSaleProps = Omit<DrawerProps, "onClose"> & {
  providerId: number;
  onClose?: () => void;
};

type TFormData = {
  listItems: TListItem[];
  rangeDate: { item1: string; item2: string };
};

const CreateFlashSale = ({ providerId, onClose, ...props }: TCreateFlashSaleProps) => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const [form] = Form.useForm();
  const { message, notification } = useApp();
  const [createManyMutate, { isLoading }] = flashSaleApi.useCreateManyMutation();

  const handleSubmitForm = async ({ listItems, rangeDate }: TFormData) => {
    try {
      const mappedItems =
        listItems?.map((item) => ({
          itemId: item.id,
          providerId: item.providerId,
          dateStart: rangeDate.item1,
          dateEnd: rangeDate.item2,
          discountType: item.discountType,
          maxDistributionBuyer: item.maxDistributionBuyer,
          listItemModels:
            item.modelList
              ?.filter((m) => !!m?.isFlashSale)
              ?.map((m) => ({
                itemModelId: m.id,
                stock: m.stock,
                discountAmount: m.discountAmount,
                percent: m.percent,
              })) || [],
        })) || [];
      const res = await createManyMutate({ items: mappedItems }).unwrap();
      notification.success({
        message: i18n["Thêm FlashSale của Shop thành công"],
        placement: "bottomRight",
      });

      form.resetFields();
      onClose?.();
    } catch (err) {
      console.log(err);
      notification.success({
        message: i18n["Đã có lỗi xảy ra khi thêm FlashSale của Shop"],
        placement: "bottomRight",
      });
    }
  };

  const handleReset = () => {
    form.resetFields();
    onClose?.();
  };

  return (
    <Drawer
      maskClosable={false}
      title={i18n["Tạo chương trình Flash Sale của Shop"]}
      style={{ top: 24 }}
      width={724}
      styles={{
        header: { padding: "14px 7px" },
        body: { padding: 12 },
        footer: { padding: 12 },
      }}
      footer={
        <Flex gap={12} justify="flex-end">
          <Button
            size="large"
            disabled={isLoading}
            onClick={() => handleReset()}
            bgColor="rgba(0,0,0,0.05)"
            type="text"
          >
            {i18n["Hủy"]}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            form={uid + "Form"}
            icon={<BsPlusLg />}
            style={{ padding: "0 32px" }}
            disabled={isLoading}
            loading={isLoading}
          >
            {i18n["Xác nhận"]}
          </Button>
        </Flex>
      }
      onClose={() => handleReset()}
      {...props}
    >
      <Form
        id={uid + "Form"}
        form={form}
        onFinish={handleSubmitForm}
        onFinishFailed={(e) => console.log(e)}
        layout="vertical"
        size="middle"
        disabled={isLoading}
      >
        {/* <Typography.Title level={5} type="secondary" style={{ margin: "-4px 0 4px" }}>
          {i18n["Thông tin cơ bản"]}
        </Typography.Title> */}
        <Form.Item name={"rangeDate"} label="Khung giờ" rules={[{ required: true }]}>
          <FlashSaleConfigCalender />
        </Form.Item>

        <Typography.Title level={5} type="secondary" style={{ margin: "-4px 0 4px" }}>
          {i18n["Sản phẩm tham gia Flash Sale của Shop"]}
        </Typography.Title>
        <Typography.Paragraph style={{ margin: "0 0 8px", lineHeight: 1.1 }}>
          {
            i18n[
              "Vui lòng kiểm tra tiêu chí sản phẩm trước khi thêm sản phẩm vào chương trình khuyến mãi của bạn."
            ]
          }
        </Typography.Paragraph>

        <FlashSaleItems providerId={providerId} />
      </Form>
    </Drawer>
  );
};

const FooterStyled = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  gap: 12px;
`;

export default CreateFlashSale;
