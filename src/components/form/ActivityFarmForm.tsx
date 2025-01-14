import useGetProviderFarm from "@/hooks/useGetProviderFarm";
import { useGetListEcofarmPackageQuery } from "@/redux/query/farm.query";
import { dateFormatVoucher, dayjs } from "@/utils/utils-date";
import { css } from "@emotion/react";
import { useDebounce } from "ahooks";
import { Affix, Card, Divider, Form, FormProps, Input, Select, Typography } from "antd";
import { cssAddItemModel } from "src/components/shared/ItemStyled";
import useChangeLocale from "src/hooks/useChangeLocale";
import Editor from "../field/Editor";
import ImagesUploadWithQuery from "../field/ImagesUploadWithQuery";
import VideosUploadWithQuery from "../field/VideosUploadWithQuery";
import StepAnchor from "../list/StepAnchor";
import RangePicker from "../picker/RangePicker";

type TActivityFarmFormProps = Pick<FormProps, "initialValues" | "onFinish" | "id"> & {
  extraRight?: React.ReactNode;
};

const ActivityFarmForm = ({}: TActivityFarmFormProps) => {
  const { i18n } = useChangeLocale();

  const { gSelectedProvider } = useGetProviderFarm();
  const debouncedFilterData = useDebounce(
    {
      maxResultCount: 1000,
      providerId: gSelectedProvider?.id,
    },
    { wait: 500 },
  );
  const { data: resPackage } = useGetListEcofarmPackageQuery(debouncedFilterData, {
    refetchOnMountOrArgChange: true,
    skip: !debouncedFilterData?.providerId,
  });
  const dataPackage = resPackage?.data || [];
  const filterOptionPackage = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  return (
    <>
      <Affix offsetTop={76}>
        <div className="right-wrapper-Affix" style={{ width: 204 }}>
          <Card size="small" bodyStyle={{ padding: "6px 6px 0 6px" }}>
            <StepAnchor
              items={[
                {
                  title: i18n["Thông tin hoạt động"],
                  formFields: [["name"], ["ecofarmPackageId"], ["description"], ["rangeDate"]],
                },
                {
                  title: i18n["Hình ảnh và video"],
                  formFields: [["imageUrlList"], ["videoUrlList"]],
                },
              ]}
              anchorProps={{ targetOffset: 12, bounds: 400 }}
            />
          </Card>
        </div>
      </Affix>
      <div className="left-wrapper">
        <Card id="thong-tin-co-ban">
          <Typography.Title
            level={4}
            type="secondary"
            style={{ lineHeight: 1, margin: "0 0 12px" }}
          >
            {i18n["Thông tin hoạt động"]}
          </Typography.Title>
          <Form.Item
            name="name"
            label={i18n["Tên hoạt động"]}
            rules={[{ required: true }, { type: "string" }]}
          >
            <Input placeholder={i18n["Nhập vào"]} />
          </Form.Item>
          <Form.Item
            name="ecofarmPackageId"
            label={i18n["Gói dịch vụ farming"]}
            rules={[{ required: true }, { type: "number" }]}
          >
            <Select
              allowClear
              placement="bottomRight"
              placeholder={i18n["Chọn"]}
              showSearch={true}
              filterOption={filterOptionPackage}
              options={dataPackage?.map((item: any) => ({
                value: item.id,
                label: item.name,
              }))}
            />
          </Form.Item>
          <Form.Item
            label={i18n["Thời gian diễn ra hoạt động"]}
            labelCol={{ span: 8 }}
            labelAlign="left"
            name="rangeDate"
            help=""
            rules={[{ required: true }, { type: "array" }]}
          >
            <RangePicker
              inputReadOnly
              disabledDate={(current) => current && current < dayjs().startOf("day")}
              placeholder={[i18n["Từ ngày"], i18n["Đến ngày"]]}
              style={{ width: "100%" }}
              showTime={{ format: dateFormatVoucher }} // Hiển thị chỉ giờ và phút
              format={dateFormatVoucher}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label={i18n["Mô tả"]}
            rules={[{ required: false }, { type: "string" }]}
          >
            <Editor theme="snow" placeholder={i18n["Nhập vào"]} />
          </Form.Item>
        </Card>

        <Card id="hinh-anh-va-video">
          <Typography.Title
            level={4}
            type="secondary"
            style={{ lineHeight: 1, margin: "0 0 12px" }}
          >
            {i18n["Hình ảnh và video"]}
          </Typography.Title>
          <Form.Item
            label={i18n["Ảnh hoạt động"]}
            name="imageUrlList"
            rules={[{ type: "array", required: true, defaultField: { type: "url" } }]}
          >
            <ImagesUploadWithQuery />
          </Form.Item>
          <Divider />
          <Form.Item
            label="Video hoạt động"
            name="videoUrlList"
            rules={[{ type: "array", required: false, defaultField: { type: "url" } }]}
          >
            <VideosUploadWithQuery />
          </Form.Item>
        </Card>
      </div>
    </>
  );
};

export const cssItemForm = css`
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;
  gap: 12px;
  position: relative;
  & > .left-wrapper {
    flex: 1 1 auto;
    min-width: 0px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  & .right-wrapper-Affix {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    transform: translateX(-100%);
    @media screen and (max-width: 1200px) {
      display: none;
    }
  }
  .ant-form-item-control-input-content .quill {
    .ql-toolbar {
      border-radius: 8px 8px 0 0;
    }
    .ql-container {
      border-radius: 0 0 8px 8px;
    }
  }
  .ant-form-item-label .ant-typography-secondary {
    margin-left: 8px;
  }
  .add-itemmodel-wrapper {
    margin-bottom: 24px;
    .container {
      ${cssAddItemModel}
    }
  }
`;

export default ActivityFarmForm;
