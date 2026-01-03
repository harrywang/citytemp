"use client";

import { useCallback, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";

interface CityPopulation {
  city: string;
  country: string;
  population: number;
}

interface PopulationChartProps {
  cities: CityPopulation[];
}

const COLORS = [
  "#e76e50",
  "#2a9d90",
  "#264653",
  "#e9c46a",
  "#f4a261",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
  "#f97316",
];

const formatPopulation = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
};

export function PopulationChart({ cities }: PopulationChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!chartRef.current) return;
    try {
      const dataUrl = await toPng(chartRef.current, {
        backgroundColor: "#fff",
        pixelRatio: 4,
      });
      const link = document.createElement("a");
      link.download = "population-chart.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    }
  }, []);

  const chartData = cities.map((city) => ({
    name: city.city,
    population: city.population,
    fullName: `${city.city}, ${city.country}`,
  }));

  return (
    <div className="w-full">
      <div className="flex justify-center sm:justify-end gap-2 mb-4">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export PNG</span>
          <span className="sm:hidden">PNG</span>
        </button>
      </div>
      <div ref={chartRef} className="bg-white p-2 sm:p-4 rounded-lg">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tickFormatter={formatPopulation}
              tick={{ fontSize: 11 }}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value) => [formatPopulation(value as number), "Population"]}
              labelFormatter={(label) => {
                const city = chartData.find((c) => c.name === label);
                return city?.fullName || label;
              }}
            />
            <Bar dataKey="population" radius={[4, 4, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
