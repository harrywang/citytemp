"use client";

import { useCallback, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";

interface CityData {
  city: string;
  country: string;
  data: { month: string; temp: number }[];
}

interface TemperatureChartProps {
  cities: CityData[];
  unit: "C" | "F";
  onUnitChange: (unit: "C" | "F") => void;
}

const toFahrenheit = (celsius: number) => Math.round((celsius * 9/5 + 32) * 10) / 10;

const COLORS = [
  "#e76e50",
  "#2a9d90",
  "#264653",
  "#e9c46a",
  "#f4a261",
];

export function TemperatureChart({ cities, unit, onUnitChange }: TemperatureChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!chartRef.current) return;
    try {
      const dataUrl = await toPng(chartRef.current, {
        backgroundColor: "#fff",
        pixelRatio: 4,
      });
      const link = document.createElement("a");
      link.download = "temperature-chart.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    }
  }, []);

  // Transform data for recharts
  const chartData = cities[0]?.data.map((item, index) => {
    const point: Record<string, string | number> = { month: item.month };
    cities.forEach((city) => {
      const temp = city.data[index].temp;
      point[city.city] = unit === "F" ? toFahrenheit(temp) : temp;
    });
    return point;
  }) || [];

  return (
    <div className="w-full">
      <div className="flex justify-center sm:justify-end gap-2 mb-4">
        <div className="flex items-center gap-1 border rounded-md p-1">
          <button
            onClick={() => onUnitChange("C")}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              unit === "C"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            °C
          </button>
          <button
            onClick={() => onUnitChange("F")}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              unit === "F"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            °F
          </button>
        </div>
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
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tickFormatter={(value) => `${value}°`}
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
              formatter={(value) => [`${value}°${unit}`, ""]}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
              formatter={(value) => {
                // Shorten legend text on display
                const city = cities.find(c => `${c.city}, ${c.country}` === value);
                return city ? city.city : value;
              }}
            />
            {cities.map((city, index) => (
              <Line
                key={city.city}
                type="monotone"
                dataKey={city.city}
                name={`${city.city}, ${city.country}`}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
