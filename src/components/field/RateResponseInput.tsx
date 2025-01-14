import useApp from "@/hooks/useApp";
import useChangeLocale from "@/hooks/useChangeLocale";
import { useCreateRateResponseMutation } from "@/redux/query/item.query";
import { useSafeState } from "ahooks";
import { Flex, Form, Input, InputProps, Typography } from "antd";
import { useId } from "react";
import { FaRegCommentAlt } from "react-icons/fa";
import Button from "../button/Button";
import ImagesUploadWithQuery from "./ImagesUploadWithQuery";
const { TextArea } = Input;
type TRateResponseInputProps = InputProps & { rateId: number };

const RateResponseInput = ({ ...props }: TRateResponseInputProps) => {
  const { i18n } = useChangeLocale();
  const { notification } = useApp();
  const [form] = Form.useForm();
  const uid = useId();

  const [showResponseInput, setShowResponseInput] = useSafeState<boolean>(false);

  const [createResponseMutate, { isLoading: isLoadingCreateResponse }] =
    useCreateRateResponseMutation();
  const handleCreateResponse = (formValues: any) => {
    const { content, imageUrls } = formValues as any;
    createResponseMutate({
      id: props.rateId,
      content,
      imageUrls,
    })
      .unwrap()
      .then((result) => {
        if (result.data === true) {
          notification.success({
            message: i18n["Phản hồi thành công"],
            placement: "bottomRight",
          });
          form.resetFields();
        } else {
          notification.error({
            message: i18n["Đã có lỗi xảy ra khi phản hồi"],
            placement: "bottomRight",
          });
        }
      })
      .catch((err) => {
        notification.error({
          message: i18n["Đã có lỗi xảy ra khi phản hồi"],
          placement: "bottomRight",
        });
      });
  };
  return (
    <Flex vertical>
      <Button
        type="link"
        icon={<FaRegCommentAlt />}
        style={{ width: "fit-content" }}
        onClick={() => setShowResponseInput(!showResponseInput)}
      >
        {i18n["Phản hồi"]}
      </Button>
      {showResponseInput && (
        <Form
          id={uid}
          form={form}
          layout="vertical"
          initialValues={{}}
          onFinish={handleCreateResponse}
        >
          <Form.Item name="content" rules={[{ required: true }]}>
            <TextArea placeholder="Nhập phản hồi của bạn" />
          </Form.Item>

          <Form.Item
            name="imageUrls"
            rules={[{ type: "array", required: false, defaultField: { type: "url" } }]}
            style={{ marginTop: 35 }}
          >
            <ImagesUploadWithQuery />
          </Form.Item>
          <Flex justify="space-between">
            <Typography.Text type="secondary">Bạn chỉ có thể phản hồi 1 lần</Typography.Text>

            <Button
              className="btn-submit"
              htmlType="submit"
              type="primary"
              form={uid}
              size="small"
              style={{ width: 50 }}
              loading={isLoadingCreateResponse}
              disabled={isLoadingCreateResponse}
            >
              {i18n["Gửi"]}
            </Button>
          </Flex>
        </Form>
      )}
    </Flex>
  );
};

export default RateResponseInput;
