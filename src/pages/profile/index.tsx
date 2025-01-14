import DatePicker from "@/components/picker/DatePicker";
import styled from "@emotion/styled";
import { Affix, Form, Input, Menu, Select, Steps, Typography } from "antd";
import { useId } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { FaBell } from "react-icons/fa";
import { MdDelete, MdLock } from "react-icons/md";
import Button from "src/components/button/Button";
import ImageUploadWithQuery from "src/components/field/ImageUploadWithQuery";
import withAuth from "src/components/hoc/withAuth";
import BreadcrumbHeader from "src/components/layout/BreadcrumbHeader";
import SiderHeaderLayout from "src/components/layout/SiderHeaderLayout";
import StyledPage from "src/components/layout/StyledPage";
import ImageItem from "src/components/shared/ImageItem";
import useApp from "src/hooks/useApp";
import useChangeLocale from "src/hooks/useChangeLocale";
import { useUpdateUserMutation } from "src/redux/query/user.query";
import { useAppSelector } from "src/redux/store";
import { regexVNPhone } from "src/utils/utils";
import { dayjs } from "src/utils/utils-date";

const Page = () => {
  const uid = useId();
  const { i18n } = useChangeLocale();
  const userData = useAppSelector((s) => s.user.data);
  const mappedUserData = {
    ...userData,
    dateOfBirth: !!userData?.dateOfBirth ? dayjs(userData.dateOfBirth) : undefined,
  };
  const [form] = Form.useForm();
  const { notification } = useApp();
  const [mutateUpdateUser, {}] = useUpdateUserMutation();

  const handleUpdateProfile = (formData: any) => {
    const {
      id,
      imageUrl,
      name,
      surname,
      gender,
      dateOfBirth,
      nationality,
      emailAddress,
      phoneNumber,
      homeAddress,
      userName,
      isActive,
      ...restData
    } = formData;
    mutateUpdateUser({
      ...restData,
      id,
      imageUrl,
      name,
      surname,
      userName,
      gender,
      dateOfBirth,
      nationality,
      emailAddress,
      phoneNumber,
      homeAddress,
      isActive,
      fullName: `${surname} ${name}`,
    })
      .unwrap()
      .then((res) => {
        notification.success({
          message: i18n["Cập nhật thông tin thành công"],
          placement: "bottomRight",
        });
      })
      .catch((err) => {
        notification.error({
          message: i18n["Đã có lỗi xảy ra khi cập nhật thông tin"],
          placement: "bottomRight",
        });
      });
  };

  return (
    <SiderHeaderLayout
      hideSider
      hideProviderSelect={userData?.userName === "imax_admin"}
      headerLeft={<BreadcrumbHeader current={userData?.fullName} />}
    >
      <PageWrapper>
        <div className="wrapper">
          <div className="left-wrapper">
            <Affix offsetTop={76}>
              <Menu
                mode="inline"
                inlineIndent={12}
                items={[
                  { key: "profile", label: i18n["Tài khoản"], icon: <BsPersonCircle /> },
                  {
                    key: "setting",
                    type: "group",
                    label: i18n["Cài đặt"],
                    children: [
                      {
                        key: "security",
                        label: i18n["Bảo mật"],
                        icon: <MdLock />,
                      },
                      {
                        key: "notification",
                        label: i18n["Thông báo"],
                        icon: <FaBell />,
                      },
                    ],
                  },
                  {
                    key: "auth",
                    type: "group",
                    label: i18n["Đăng nhập"],
                    children: [
                      {
                        key: "delete-account",
                        label: i18n["Xóa tài khoản"],
                        icon: <MdDelete />,
                        danger: true,
                      },
                    ],
                  },
                ]}
              />
            </Affix>
          </div>
          <div className="right-wrapper">
            {!!userData && (
              <Form
                id={uid}
                form={form}
                layout="vertical"
                size="large"
                initialValues={mappedUserData}
                className="profile-wrapper"
                onFinish={(formData) => handleUpdateProfile({ ...mappedUserData, ...formData })}
              >
                <div className="header-wrapper">
                  <div className="banner"></div>
                  <div className="avatar-wrapper">
                    <Form.Item name={"imageUrl"} noStyle>
                      <ImageUploadWithQuery
                        renderUploadedItem={(item) => (
                          <ImageItem
                            src={item || undefined}
                            isUploaded
                            onClickRemove={() => form.setFieldValue("imageUrl", undefined)}
                          />
                        )}
                        buttonUploadProps={{ block: false, size: "middle", shape: "round" }}
                      />
                    </Form.Item>
                  </div>
                  <div className="name-wrapper">
                    <Typography.Title level={3} ellipsis style={{ margin: 0 }}>
                      {userData?.fullName}
                    </Typography.Title>
                    <Typography.Text type="secondary">{`@${userData?.userName}`}</Typography.Text>
                  </div>
                </div>
                <Steps
                  className="content-wrapper"
                  current={-1}
                  direction="vertical"
                  progressDot
                  items={[
                    {
                      description: (
                        <div className="profile-item-wrapper">
                          <div className="header-wrapper">
                            <Typography.Text strong type="secondary" style={{ fontSize: 16 }}>
                              {i18n["Thông tin cơ bản"]}
                            </Typography.Text>
                          </div>
                          <div className="row5050">
                            <Form.Item name="surname" label={i18n["Tên đệm"]}>
                              <Input placeholder={i18n["Tên đệm"]} />
                            </Form.Item>
                            <Form.Item name="name" label={i18n["Tên"]}>
                              <Input placeholder={i18n["Tên"]} />
                            </Form.Item>
                          </div>
                        </div>
                      ),
                    },
                    {
                      description: (
                        <div className="profile-item-wrapper">
                          <div className="header-wrapper">
                            <Typography.Text strong type="secondary" style={{ fontSize: 16 }}>
                              {i18n["Chi tiết"]}
                            </Typography.Text>
                          </div>
                          <div className="row5050">
                            <Form.Item name="gender" label={i18n["Giới tính"]}>
                              <Select
                                placeholder={i18n["Giới tính"]}
                                style={{ width: "100%" }}
                                options={[
                                  { value: "male", label: i18n["Nam"] },
                                  { value: "female", label: i18n["Nữ"] },
                                  { value: "other", label: i18n["Khác"] },
                                ]}
                              />
                            </Form.Item>
                            <Form.Item name="dateOfBirth" label={i18n["Ngày sinh nhật"]}>
                              <DatePicker
                                placeholder="DD-MM-YYYY"
                                showToday={false}
                                allowClear
                                format={"DD-MM-YYYY"}
                                style={{ width: "100%" }}
                                disabledDate={(current) => current > dayjs()}
                              />
                            </Form.Item>
                            <Form.Item name="nationality" label={i18n["Quốc tịch"]}>
                              <Select
                                placeholder={i18n["Quốc tịch"]}
                                options={[
                                  { value: "Vietnam", label: i18n["Việt Nam"] },
                                  { value: "other", label: "Khác" },
                                ]}
                              />
                            </Form.Item>
                          </div>
                        </div>
                      ),
                    },
                    {
                      description: (
                        <div className="profile-item-wrapper">
                          <div className="header-wrapper">
                            <Typography.Text strong type="secondary" style={{ fontSize: 16 }}>
                              {i18n["Thông tin liên lạc"]}
                            </Typography.Text>
                          </div>
                          <div className="row5050">
                            <Form.Item name="emailAddress" label="Email">
                              <Input placeholder={i18n["Địa chỉ Email"]} />
                            </Form.Item>
                            <Form.Item
                              name="phoneNumber"
                              label={i18n["Số điện thoại"]}
                              rules={[
                                {
                                  pattern: regexVNPhone,
                                  message: i18n["Số điện thoại chưa đúng định dạng"],
                                },
                              ]}
                            >
                              <Input type="tel" placeholder={i18n["Số điện thoại"]} />
                            </Form.Item>
                            <Form.Item name="homeAddress" label={i18n["Địa chỉ"]}>
                              <Input.TextArea
                                autoSize={{ minRows: 2 }}
                                placeholder={i18n["Địa chỉ"]}
                              />
                            </Form.Item>
                          </div>
                        </div>
                      ),
                    },
                    {
                      description: (
                        <FooterStyled>
                          <Button
                            type="text"
                            size="large"
                            htmlType="button"
                            onClick={() => {
                              form.resetFields();
                            }}
                          >
                            {i18n["Hủy"]}
                          </Button>
                          <Button size="large" type="primary" htmlType="submit" form={uid}>
                            {i18n["Cập nhật"]}
                          </Button>
                        </FooterStyled>
                      ),
                    },
                  ]}
                />
                <Form.Item name="id" label="ID" rules={[{ required: true, type: "number" }]} hidden>
                  <Input />
                </Form.Item>
                <Form.Item name="userName" label="userName" rules={[{ required: true }]} hidden>
                  <Input />
                </Form.Item>
                <Form.Item
                  name="isActive"
                  label="isActive"
                  rules={[{ required: true, type: "boolean" }]}
                  hidden
                >
                  <Input />
                </Form.Item>
              </Form>
            )}
          </div>
        </div>
      </PageWrapper>
    </SiderHeaderLayout>
  );
};
const PageWrapper = styled(StyledPage)`
  padding: 12px;
  width: 100%;
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
  & > .wrapper {
    background-color: #fff;
    display: flex;
    border-radius: 8px;
    & > .left-wrapper {
      flex: 0 0 200px;
      min-width: 0px;
      padding: 12px;
      border-right: 1px solid rgba(0, 0, 0, 0.05);
      .ant-menu-inline {
        border-inline-end: none;
      }
    }
    & > .right-wrapper {
      flex: 1 1 auto;
      min-width: 0px;
      padding: 12px;
      .profile-wrapper > .header-wrapper {
        position: relative;
        height: 96px;
        margin-bottom: 76px;
        .banner {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background-color: rgba(0, 0, 0, 0.05);
          border-radius: 8px;
        }
        .name-wrapper {
          position: absolute;
          bottom: 0;
          left: calc(108px + 28px);
          transform: translateY(100%);
          padding: 4px 6px;
        }
        .avatar-wrapper {
          position: absolute;
          top: 108px;
          left: 0;
          width: 108px;
          height: 108px;
          border-radius: 50%;
          background-color: #fff;
          box-shadow: 0 0 0 4px #fff, 0 1px 6px -1px rgba(0, 0, 0, 0.02),
            0 2px 4px 0 rgba(0, 0, 0, 0.02);
          transform: translate(24px, -50%);
          .image-upload-wrapper {
            position: relative;
            .ant-upload-text {
              display: none;
            }
            .image-wrapper,
            .ant-upload,
            .ant-image img {
              border-radius: 50%;
              width: 108px !important;
              height: 108px !important;
            }
            .image-wrapper .uploaded-badge {
              position: absolute;
              top: auto;
              left: 2px;
              bottom: 2px;
              border-radius: 50%;
              padding: 4px 4px;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .actions-wrapper {
              border-radius: 50%;
            }
            .ant-upload-drag-container .ant-upload-drag-icon {
              margin-bottom: 0px;
            }
            .btn-upload {
              position: absolute;
              bottom: 0;
              left: 50%;
              transform: translate(-50%, 50%);
              background-color: auto !important;
            }
          }
        }
      }
      .profile-item-wrapper {
        padding: 12px 12px;
        border-radius: 8px;
        border: 1px dashed rgba(217, 217, 217, 0.4);
        margin-bottom: 12px;
        & > .header-wrapper {
          margin-bottom: 12px;
        }
      }
      .content-wrapper {
        .row5050 {
          --f-columns: 2;
          --f-gap: 24px;
          display: flex;
          flex-wrap: wrap;
          margin-left: calc(-1 * var(--f-gap));
          margin-bottom: calc(-1 * var(--f-gap));
          & > * {
            margin-left: var(--f-gap);
            margin-bottom: var(--f-gap);
            width: calc((100% / var(--f-columns) - var(--f-gap)));
          }
        }
      }
    }
  }
`;

const FooterStyled = styled.div`
  display: flex;
  flex-wrap: nowrap;
  column-gap: 8px;
  width: 50%;
`;

export default withAuth(Page, true);
