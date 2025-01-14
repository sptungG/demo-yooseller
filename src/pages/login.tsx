import styled from "@emotion/styled";
import { Checkbox, Divider, Form, Input, theme, Typography } from "antd";
import { useId } from "react";
import { FaApple, FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import Button from "src/components/button/Button";
import withoutAuth from "src/components/hoc/withoutAuth";
import { NextImage } from "src/components/next/Image";
import Link from "src/components/next/Link";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import { useLoginMutation } from "src/redux/query/auth.query";
import { useAppSelector } from "src/redux/store";

type TLoginProps = {};

const LoginPage = ({}: TLoginProps) => {
  const {
    token: { colorTextPlaceholder },
  } = theme.useToken();
  const { i18n } = useChangeLocale();

  const uid = useId();
  const [form] = Form.useForm();

  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const { notification } = useApp();

  const [loginMutate, { isLoading }] = useLoginMutation();

  const handleSubmit = (formData: any) => {
    loginMutate(formData)
      .unwrap()
      .then(({ result }) => {
        notification.success({ message: i18n["Đăng nhập thành công"], placement: "bottomRight" });
      })
      .catch((err) => {
        if (!!err?.data?.error?.details) {
          notification.error({ message: err.data.error.details, placement: "bottomRight" });
        } else if (!!err?.data?.error?.message) {
          notification.error({ message: err.data.error.message, placement: "bottomRight" });
        } else {
          notification.error({ message: i18n["Đăng nhập thất bại"], placement: "bottomRight" });
        }
      });
  };

  return (
    <LoginStyled>
      <div className="title-wrapper">
        <div className="title-1">{i18n["Trải nghiệm và khám phá cùng với"]}</div>
      </div>
      <div className="logo-wrapper">
        <NextImage
          src="/images/logo-transparent.png"
          alt="/logo-transparent.png"
          width={196}
          height={196}
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
        >
          <Form.Item
            label={i18n["Tên đăng nhập / Email"]}
            name="userNameOrEmailAddress"
            hasFeedback={isLoading}
            validateStatus={isLoading ? "validating" : undefined}
            rules={[{ required: true }, { type: "string" }]}
          >
            <Input type="text" placeholder={i18n["Nhập tên đăng nhập hoặc Email"]} />
          </Form.Item>
          <Form.Item
            label={i18n["Mật khẩu"]}
            name="password"
            hasFeedback={isLoading}
            validateStatus={isLoading ? "validating" : undefined}
            validateFirst
            rules={[
              { required: true },
              // { min: 8, message: i18n.field.password.v_lengthMin8 },
              // { pattern: /[0-9]/, message: i18n.field.password.v_hasNumber },
              // { pattern: /[a-z]/, message: i18n.field.password.v_hasLowercase },
              // { pattern: /[A-Z]/, message: i18n.field.password.v_hasUppercase },
              // { pattern: /[^\w]/, message: i18n.field.password.v_hasSymbol },
            ]}
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
          <Form.Item name="rememberMe" valuePropName="checked" noStyle>
            <div className="forgot-password-container">
              <Checkbox>{i18n["Ghi nhớ đăng nhập"]}</Checkbox>
              <Link href="/forgot-password" as="a">
                {i18n["Quên mật khẩu"]}?
              </Link>
            </div>
          </Form.Item>
          <Form.Item noStyle>
            <Button
              loading={isLoading}
              type="primary"
              htmlType="submit"
              block
              className="button-submit"
            >
              {i18n["Đăng nhập"]}
            </Button>
          </Form.Item>
        </Form>
        <Divider plain style={{ margin: "0 0 16px 0" }}>
          {i18n["hoặc đăng nhập với"]}
        </Divider>
        <div className="others-wrapper">
          <Button size="large" shape="circle">
            <FcGoogle size={24} />
          </Button>
          <Button size="large" shape="circle" bgColor="#1877F2">
            <FaFacebookF color="#fff" size={22} />
          </Button>
          <Button size="large" shape="circle" bgColor="#000">
            <FaApple color="#fff" size={24} style={{ marginBottom: 2 }} />
          </Button>
        </div>
        <div className="link-to-register-container">
          <Typography.Text>{i18n["Bạn chưa có tài khoản"]}?</Typography.Text>
          <Link href="/register" as="a">
            {i18n["Đăng kí ngay"]}
          </Link>
        </div>
      </div>
    </LoginStyled>
  );
};

const LoginStyled = styled.main`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  .title-wrapper {
    margin-top: 48px;
    .title-1,
    .title-2 {
      font-size: 20px;
      font-weight: 600;
      line-height: 24px;
      letter-spacing: 0em;
      text-align: center;
    }
    .title-1 {
      color: ${({ theme }) => theme.colorPrimary};
    }
    .title-2 {
      color: #2a9476;
    }
  }
  .logo-wrapper {
    margin: 0 0 12px 0;
  }
  .form-wrapper {
    width: 100%;
    max-width: 440px;
    padding: 24px;
    .ant-form-item-label {
      padding-bottom: 6px;
    }
    .input-password {
      .ant-input-suffix {
        cursor: pointer;
      }
    }
    .others-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }
    .link-to-register-container {
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
    .button-submit {
      margin-top: 12px;
      margin-bottom: 16px;
    }
  }
`;

export default withoutAuth(LoginPage);
