import { Form, Input, Space, Steps } from "antd";
import { BsPlusLg } from "react-icons/bs";
import { MdOutlinePostAdd, MdWorkspacePremium } from "react-icons/md";
import { TbChevronDown, TbChevronUp, TbTrash } from "react-icons/tb";
import useChangeLocale from "src/hooks/useChangeLocale";
import Button from "../button/Button";
import { PropertiesFormListItemStyled } from "../shared/ItemStyled";

type TSkillsFormListProps = {
  name?: string | number | (string | number)[];
};

function SkillsFormList({ name = ["properties", "skills"] }: TSkillsFormListProps) {
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
                icon: <MdWorkspacePremium size={22} />,
                title: (
                  <PropertiesFormListItemStyled>
                    <Form.Item name={[field.name, "name"]} noStyle rules={[{ required: true }]}>
                      <Input
                        placeholder={`${i18n["Kĩ năng"]} ${index + 1}...`}
                        variant="borderless"
                      />
                    </Form.Item>
                    <Form.Item name={[field.name, "detail"]} noStyle rules={[{ required: true }]}>
                      <Input.TextArea
                        placeholder={`${i18n["Chi tiết Kĩ năng"]} ${index + 1}...`}
                        variant="borderless"
                        autoSize={{ minRows: 3 }}
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
                  <Button type="dashed" onClick={() => add()} block icon={<BsPlusLg />}>
                    {i18n["Thêm Kĩ năng"]}
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

export default SkillsFormList;
