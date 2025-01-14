import dynamic from "next/dynamic";
import { memo } from "react";
const DualAxes = dynamic(() => import("@ant-design/plots/es/components/dual-axes"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const DualAxesChart = ({ data, xField, yField }: any) => {
  if (!data.length || !xField || !yField) return <></>;

  return (
    <DualAxes
      data={[data, data]}
      xField={xField}
      yField={yField}
      meta={{
        count: {
          alias: "Số đơn hàng",
          formatter: (datum: any) => `${datum}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        },
        revenue: {
          alias: "Doanh thu",
          formatter: (datum: any) => `${datum}₫`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        },
      }}
      geometryOptions={[
        {
          geometry: "column",
          color: "#5B8FF9",
          columnWidthRatio: 0.4,
          label: {
            position: "middle",
          },
        },
        {
          geometry: "line",
          smooth: true,
          color: "#52c41a",
        },
      ]}
      legend={{
        position: "top-left",
      }}
      animation={{
        appear: {
          animation: "path-in",
          duration: 5000,
        },
      }}
      renderer="svg"
    />
  );
};

export default memo(DualAxesChart);
