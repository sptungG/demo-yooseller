import { Form, Input, Space, Steps } from "antd";
import { AiOutlineSwapRight } from "react-icons/ai";
import { BsPlusLg } from "react-icons/bs";
import { FaGraduationCap } from "react-icons/fa";
import { MdOutlinePostAdd } from "react-icons/md";
import { TbChevronDown, TbChevronUp, TbTrash } from "react-icons/tb";
import useChangeLocale from "src/hooks/useChangeLocale";
import Button from "../button/Button";
import { PropertiesFormListItemStyled } from "../shared/ItemStyled";
import InputAutoSize from "./InputAutoSize";

type TEducationFormListProps = {
  name?: string | number | (string | number)[];
};

function EducationFormList({ name = ["properties", "education"] }: TEducationFormListProps) {
  const { i18n } = useChangeLocale();
  return (
    <Form.List name={name}>
      {(fields, { add, remove, move }) => (
        <div>
          <Steps
            className="w-full"
            direction="vertical"
            items={[
              ...fields.map((field, index) => ({
                status: "wait" as any,
                icon: <FaGraduationCap size={20} />,
                title: (
                  <PropertiesFormListItemStyled>
                    <div className="date-wrapper">
                      <Form.Item
                        name={[field.name, "dateFrom"]}
                        noStyle
                        rules={[{ required: true }]}
                      >
                        <InputAutoSize placeholder={i18n["Bắt đầu"]} variant="borderless" />
                      </Form.Item>
                      <span>
                        <AiOutlineSwapRight size={18} />
                      </span>
                      <Form.Item name={[field.name, "dateTo"]} noStyle rules={[{ required: true }]}>
                        <InputAutoSize placeholder={i18n["Kết thúc"]} variant="borderless" />
                      </Form.Item>
                    </div>

                    <Form.Item name={[field.name, "name"]} noStyle rules={[{ required: true }]}>
                      <Input placeholder={`${i18n["Học vấn"]} ${index + 1}`} variant="borderless" />
                    </Form.Item>
                    <Form.Item
                      name={[field.name, "description"]}
                      noStyle
                      rules={[{ required: true }]}
                    >
                      <Input.TextArea
                        placeholder={`${i18n["Mô tả Học vấn"]} ${index + 1}...`}
                        variant="borderless"
                        autoSize={{ minRows: 2 }}
                      />
                    </Form.Item>
                    <div className="actions-wrapper">
                      <Space.Compact direction="vertical" size="middle">
                        <Button
                          type="dashed"
                          onClick={() => move(field.name, field.name - 1)}
                          icon={<TbChevronUp size={20} />}
                        ></Button>
                        <Button
                          type="dashed"
                          onClick={() => move(field.name, field.name + 1)}
                          icon={<TbChevronDown size={20} />}
                        ></Button>
                        <Button
                          type="dashed"
                          onClick={() => remove(field.name)}
                          icon={<TbTrash size={20} />}
                        ></Button>
                      </Space.Compact>
                    </div>
                  </PropertiesFormListItemStyled>
                ),
              })),
              {
                status: "wait" as any,
                icon: <MdOutlinePostAdd />,
                title: (
                  <Button
                    type="dashed"
                    onClick={() =>
                      add({
                        dateTo: i18n["Hiện tại"],
                      })
                    }
                    block
                    icon={<BsPlusLg />}
                  >
                    {i18n["Thêm thông tin học vấn"]}
                  </Button>
                ),
              },
            ]}
          />
        </div>
      )}
    </Form.List>
  );
}

export default EducationFormList;
