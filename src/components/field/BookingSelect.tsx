import type { InputRef } from "antd";
import { Select } from "antd";
import React, { useRef, useState } from "react";
import useChangeLocale from "src/hooks/useChangeLocale";
const OPTIONS = [
  "Hồ bơi ngoài trời",
  "Trung tâm thể dục",
  "Chỗ đỗ xe",
  "Quầy bar",
  "Bữa sáng ",
  "Xe đưa đón sân bay",
  "Phòng gia đình",
  "Phòng không hút thuốc",
  "Dịch vụ phòng",
  "Lễ tân 24h",
  "Sân thượng/hiên",
  "Nhà hàng",
  "Thang máy",
];

const BookingSelect: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { i18n } = useChangeLocale();
  const [name, setName] = useState("");
  const inputRef = useRef<InputRef>(null);
  let index = 0;
  const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));

  return (
    <Select
      mode="multiple"
      placeholder={i18n["Các tiện nghi"]}
      value={selectedItems}
      onChange={setSelectedItems}
      style={{ width: "100%" }}
      options={filteredOptions.map((item) => ({
        value: item,
        label: item,
      }))}
      dropdownRender={(menu) => <>{menu}</>}
    />
  );
};

export default BookingSelect;
