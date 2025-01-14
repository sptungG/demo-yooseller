import { GoSortAsc, GoSortDesc } from "react-icons/go";
import { TbArrowsSort } from "react-icons/tb";
import Button from "../button/Button";

type TSortBySelectProps = {
  value?: number;
  onChange?: (v?: number) => void;
  style?: React.CSSProperties;
  icon1?: React.ReactNode;
  icon2?: React.ReactNode;
};

const SortBySelect = ({ value, onChange, style, icon1, icon2 }: TSortBySelectProps) => {
  const items: Record<string, React.ReactNode> = {
    "1": icon1 || <GoSortAsc size={22} style={{ opacity: 0.6 }} />,
    "2": icon2 || <GoSortDesc size={22} style={{ opacity: 0.6 }} />,
  };

  return (
    <Button
      icon={items?.[String(value)] || <TbArrowsSort size={16} />}
      onClick={() => {
        if (value === 1) onChange?.(2);
        if (value === 2) onChange?.(1);
      }}
      type="text"
      style={{ height: 30, ...style }}
    />
  );
};

export default SortBySelect;
