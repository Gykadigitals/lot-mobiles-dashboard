"use client";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const PaymentAnalytics = () => {
  const options: ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
    },
    colors: ["#3b82f6"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (value) => `$${value}k`,
      },
    },
    grid: {
      strokeDashArray: 5,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
  };

  const series = [
    {
      name: "Revenue",
      data: [31, 40, 28, 51, 42, 109, 100, 120, 150],
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Revenue Overview
        </h3>
      </div>
      <div className="h-[300px]">
        <Chart options={options} series={series} type="area" height="100%" width="100%" />
      </div>
    </div>
  );
};
