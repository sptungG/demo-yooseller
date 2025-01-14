import styled from "@emotion/styled";
import { Checkbox, Form, Input, theme, Typography } from "antd";
import { useRouter } from "next/router";
import { useEffect, useId } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import Button from "src/components/button/Button";
import withoutAuth from "src/components/hoc/withoutAuth";
import { NextImage } from "src/components/next/Image";
import Link from "src/components/next/Link";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import { useRegisterMutation } from "src/redux/query/auth.query";
import { useAppSelector } from "src/redux/store";
import { regexVNPhone } from "src/utils/utils";

type TRegisterProps = {};

const RegisterPage = ({}: TRegisterProps) => {
  const { replace } = useRouter();
  const uid = useId();
  const {
    token: { colorTextPlaceholder, colorTextSecondary },
  } = theme.useToken();
  const { i18n } = useChangeLocale();

  const [form] = Form.useForm();
  const emailWatch = Form.useWatch("emailAddress", form);
  const tenancyIdWatch = Form.useWatch("tenancyId", form);

  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const { notification, message } = useApp();

  const [registerMutate, { isLoading }] = useRegisterMutation();

  const handleSubmit = ({
    emailAddress,
    tenancyName,
    confirmPassword,
    termAccepted,
    lastName,
    firstName,
    ...formData
  }: any) => {
    const userName = (emailAddress || "").split("@")[0];
    registerMutate({ userName, emailAddress, fullName: lastName + " " + firstName, ...formData })
      .unwrap()
      .then(({ result }) => {
        notification.success({ message: i18n["Đăng kí thành công"], placement: "bottomRight" });
        form.resetFields();
        replace("/login");
      })
      .catch((err: any) => {
        if (!!err?.data?.error?.details) {
          notification.error({ message: err.data.error.details, placement: "bottomRight" });
        } else if (!!err?.data?.error?.message) {
          notification.error({ message: err.data.error.message, placement: "bottomRight" });
        } else {
          notification.error({ message: i18n["Đăng kí thất bại"], placement: "bottomRight" });
        }
      });
  };

  useEffect(() => {
    if (!!emailWatch) {
      form.setFieldValue("userName", emailWatch.split("@")[0]);
    } else {
      form.setFieldValue("userName", undefined);
    }
  }, [emailWatch]);

  return (
    <LoginStyled>
      <div className="logo-wrapper">
        <NextImage
          src="/images/logo-transparent.png"
          alt="/logo-transparent.png"
          width={240}
          height={240}
        />
      </div>
      <div className="form-wrapper">
        <Form
          id={uid}
          form={form}
          layout="vertical"
          size="large"
          onFinish={handleSubmit}
          disabled={!!accessToken || isLoading}
          initialValues={{ tenancyId: null, termAccepted: true }}
        >
          {/* <Form.Item
            label={i18n["Khu chung cư, căn hộ"]}
            name="tenancyId"
            rules={[{ required: false }, { type: "number" }]}
            hasFeedback={!!tenancyIdWatch}
            validateStatus={!!tenancyIdWatch ? "success" : undefined}
          >
            <TenantIdSelect placeholder={i18n["Chọn khu chung cư, căn hộ"]} />
          </Form.Item> */}
          <Form.Item
            label={i18n["Họ và tên đệm"]}
            name="lastName"
            hasFeedback={isLoading}
            validateStatus={isLoading ? "validating" : undefined}
            rules={[{ required: true }, { type: "string" }]}
          >
            <Input type="text" placeholder={i18n["Nhập họ và tên đệm"]} />
          </Form.Item>
          <Form.Item
            label={i18n["Tên"]}
            name="firstName"
            hasFeedback={isLoading}
            validateStatus={isLoading ? "validating" : undefined}
            rules={[{ required: true }, { type: "string" }]}
          >
            <Input type="text" placeholder={i18n["Nhập tên"]} />
          </Form.Item>
          <div className="row5050">
            <Form.Item
              label={i18n["Số điện thoại"]}
              name="phoneNumber"
              hasFeedback={isLoading}
              validateStatus={isLoading ? "validating" : undefined}
              rules={[
                {
                  pattern: regexVNPhone,
                  message: i18n["Số điện thoại chưa đúng định dạng"],
                },
              ]}
              tooltip={{
                title: "Có thể nhập số máy bàn, số điện thoại cá nhân",
              }}
            >
              <Input type="tel" placeholder={i18n["Nhập số điện thoại"]} />
            </Form.Item>
            <Form.Item
              label={i18n["Địa chỉ Email"]}
              name="emailAddress"
              hasFeedback={isLoading}
              validateStatus={isLoading ? "validating" : undefined}
              rules={[{ type: "email", required: true }]}
            >
              <Input type="email" placeholder={i18n["Nhập địa chỉ Email"]} />
            </Form.Item>
          </div>
          <Form.Item name="userName" label={i18n["Tên đăng nhập"]} rules={[{ required: true }]}>
            <Input placeholder={i18n["Nhập tên đăng nhập"]} />
          </Form.Item>
          <Form.Item
            label={i18n["Mật khẩu"]}
            name="password"
            hasFeedback={isLoading}
            validateStatus={isLoading ? "validating" : undefined}
            validateFirst
            rules={[
              { required: true },
              { min: 8, message: i18n[""] },
              // { pattern: /[0-9]/, message: i18n.field.password.v_hasNumber },
              // { pattern: /[a-z]/, message: i18n.field.password.v_hasLowercase },
              // { pattern: /[A-Z]/, message: i18n.field.password.v_hasUppercase },
              // { pattern: /[^\w]/, message: i18n.field.password.v_hasSymbol },
            ]}
            tooltip={{
              title: (
                <ul style={{ paddingInlineStart: 20, margin: 0 }}>
                  <li>{i18n["Mật khẩu cần tối thiểu 8 kí tự"]}</li>
                  <li>{i18n["Mật khẩu cần tối thiểu 01 kí tự số"]}</li>
                  <li>{i18n["Mật khẩu cần tối thiểu 01 chữ cái thường"]}</li>
                  <li>{i18n["Mật khẩu cần tối thiểu 01 chữ cái in hoa"]}</li>
                  <li>{i18n["Mật khẩu cần tối thiểu 01 kí tự đặc biệt"]}</li>
                </ul>
              ),
              overlayStyle: { maxWidth: 320 },
              style: { padding: "0 4px" },
              arrow: false,
            }}
          >
            <Input.Password
              className="input-password"
              placeholder={i18n["Nhập mật khẩu"]}
              iconRender={(visible) =>
                visible ? (
                  <MdVisibility size={20} color={colorTextPlaceholder} />
                ) : (
                  <MdVisibilityOff size={20} color={colorTextPlaceholder} />
                )
              }
            />
          </Form.Item>
          <Form.Item
            label={i18n["Xác nhận mật khẩu"]}
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(i18n["Mật khẩu không trùng khớp"]));
                },
              }),
            ]}
          >
            <Input.Password
              className="input-password"
              placeholder={i18n["Nhập lại mật khẩu"]}
              iconRender={(visible) =>
                visible ? (
                  <MdVisibility size={20} color={colorTextPlaceholder} />
                ) : (
                  <MdVisibilityOff size={20} color={colorTextPlaceholder} />
                )
              }
            />
          </Form.Item>

          <div className="submit-wrapper">
            <Button
              loading={isLoading}
              type="primary"
              htmlType="submit"
              block
              className="button-submit"
            >
              {i18n["Đăng kí"]}
            </Button>
            <Form.Item name="termAccepted" valuePropName="checked">
              <Checkbox>
                {i18n["Bạn đồng ý với"]}{" "}
                <Typography.Link
                  target="_blank"
                  style={{ fontSize: 12 }}
                  href="https://yootek.com.vn/"
                >
                  {i18n["Điều khoản dịch vụ"]}
                </Typography.Link>{" "}
                {i18n["và"]}{" "}
                <Typography.Link
                  target="_blank"
                  style={{ fontSize: 12 }}
                  href="https://yootek.com.vn/"
                >
                  {i18n["Chính sách quyền riêng tư"]}
                </Typography.Link>{" "}
                {i18n["của"]}{" "}
                <Typography.Link
                  target="_blank"
                  style={{ fontSize: 12 }}
                  href="https://yootek.com.vn/"
                >
                  Yootek
                </Typography.Link>
              </Checkbox>
            </Form.Item>
          </div>
        </Form>
        <div className="link-to-login-container">
          <Typography.Text>{i18n["Bạn đã có tài khoản"]}?</Typography.Text>
          <Link href="/login">{i18n["Đăng nhập"]}</Link>
        </div>
      </div>
    </LoginStyled>
  );
};

const LoginStyled = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
  padding: 24px;
  .logo-wrapper {
    flex-shrink: 0;
    width: 240px;
    margin-right: 48px;
  }
  .others-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
  }
  .form-wrapper {
    width: 100%;
    max-width: 484px;
    .ant-form-item-label {
      padding-bottom: 6px;
    }
    .ant-input-suffix button {
      padding: 0;
      background-color: transparent;
      outline: none;
      border: none;
      cursor: pointer;
      text-decoration: underline;
      font-size: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .ant-input-group-addon {
      padding: 0;
      position: relative;
      width: 84px;
      overflow: hidden;
      & > button {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        border-radius: 0;
        gap: 0;
      }
    }
    .email-wrapper {
      position: relative;
      .userName-wrapper {
        position: absolute;
        top: 0;
        right: 0;
        .ant-form-item-control-input {
          height: 24px;
          min-height: 24px;
        }
        input {
          padding-right: 0;
        }
      }
    }
    .input-password {
      .ant-input-suffix {
        cursor: pointer;
      }
    }
    .link-to-login-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .forgot-password-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .submit-wrapper {
      margin: 12px 0 0 0;
      .button-submit {
        margin-bottom: 4px;
      }
    }
  }
  .row5050 {
    --f-columns: 2;
    --f-gap: 24px;
    display: flex;
    flex-wrap: wrap;
    margin-left: calc(-1 * var(--f-gap));
    margin-bottom: 0px;
    & > * {
      margin-left: var(--f-gap);
      width: calc((100% / var(--f-columns) - var(--f-gap)));
    }
  }
  @media screen and (max-width: 727.98px) {
    .logo-wrapper {
      margin-right: 24px;
    }
  }
  @media screen and (max-width: 649.98px) {
    flex-direction: column;
    .logo-wrapper {
      margin-right: 0;
      margin-bottom: 24px;
    }
    .row5050 {
      flex-direction: column;
    }
  }
`;

export default withoutAuth(RegisterPage);
