"use client";

import { useCallback, useRef } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";

interface CityLocation {
  city: string;
  country: string;
  lat: number;
  lng: number;
}

interface LocationChartProps {
  cities: CityLocation[];
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

export function LocationChart({ cities }: LocationChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!chartRef.current) return;
    try {
      const dataUrl = await toPng(chartRef.current, {
        backgroundColor: "#fff",
        pixelRatio: 4,
      });
      const link = document.createElement("a");
      link.download = "location-chart.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    }
  }, []);

  const chartData = cities.map((city, index) => ({
    x: city.lng,
    y: city.lat,
    name: city.city,
    country: city.country,
    color: COLORS[index % COLORS.length],
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
        <ResponsiveContainer width="100%" height={280}>
          <ScatterChart margin={{ top: 10, right: 20, left: 5, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              dataKey="x"
              name="Longitude"
              domain={[-180, 180]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11 }}
              label={{ value: "Longitude", position: "bottom", fontSize: 12, fill: "#6b7280" }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Latitude"
              domain={[-90, 90]}
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tick={{ fontSize: 11 }}
              width={50}
              label={{ value: "Latitude", angle: -90, position: "insideLeft", fontSize: 12, fill: "#6b7280" }}
            />
            <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="3 3" />
            <ReferenceLine x={0} stroke="#9ca3af" strokeDasharray="3 3" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value, name) => {
                const label = name === "y" ? "Latitude" : "Longitude";
                return [value, label];
              }}
              labelFormatter={(_, payload) => {
                if (payload && payload[0]) {
                  const data = payload[0].payload;
                  return `${data.name}, ${data.country}`;
                }
                return "";
              }}
            />
            <Scatter data={chartData}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          {chartData.map((city, index) => (
            <div key={index} className="flex items-center gap-1.5 text-xs">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: city.color }}
              />
              <span>{city.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
