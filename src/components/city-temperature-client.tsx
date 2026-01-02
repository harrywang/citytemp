"use client";

import { useState, useMemo } from "react";
import { TemperatureChart } from "./temperature-chart";

interface CityData {
  continent: string;
  country: string;
  city: string;
  year: number;
  data: { month: string; temp: number }[];
}

interface CityTemperatureClientProps {
  citiesData: CityData[];
}

export function CityTemperatureClient({ citiesData }: CityTemperatureClientProps) {
  const [selectedCities, setSelectedCities] = useState<string[]>([
    "New York City",
    "Shanghai",
    "Paris",
    "Sydney",
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [unit, setUnit] = useState<"C" | "F">("C");

  const filteredCities = useMemo(() => {
    if (!searchTerm) return citiesData;
    const term = searchTerm.toLowerCase();
    return citiesData.filter(
      (c) =>
        c.city.toLowerCase().includes(term) ||
        c.country.toLowerCase().includes(term)
    );
  }, [citiesData, searchTerm]);

  const selectedCitiesData = useMemo(() => {
    return citiesData
      .filter((c) => selectedCities.includes(c.city))
      .map((c) => ({
        city: c.city,
        country: c.country,
        data: c.data,
      }));
  }, [citiesData, selectedCities]);

  const toggleCity = (cityName: string) => {
    setSelectedCities((prev) => {
      if (prev.includes(cityName)) {
        return prev.filter((c) => c !== cityName);
      }
      if (prev.length >= 5) {
        return prev;
      }
      return [...prev, cityName];
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* City Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-medium text-muted-foreground">Add Cities</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedCities(["New York City", "Shanghai", "Paris", "Sydney"])}
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sample
            </button>
            {selectedCities.length > 0 && (
              <button
                onClick={() => setSelectedCities([])}
                className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Reset
              </button>
            )}
            <span className="text-xs sm:text-sm text-muted-foreground">
              {selectedCities.length}/5 selected
            </span>
          </div>
        </div>

        {/* Tag Input Style Search Box */}
        <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-background min-h-[42px] items-center">
          {selectedCities.map((cityName) => {
            const city = citiesData.find((c) => c.city === cityName);
            return (
              <button
                key={cityName}
                onClick={() => toggleCity(cityName)}
                className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/80 flex items-center gap-1"
              >
                {cityName}, {city?.country} <span className="text-primary-foreground/70">✕</span>
              </button>
            );
          })}
          <input
            type="text"
            placeholder={
              selectedCities.length >= 5
                ? "Remove a city to add more"
                : selectedCities.length === 0
                ? "Search cities..."
                : "Add more..."
            }
            value={searchTerm}
            onChange={(e) => {
              if (selectedCities.length < 5) {
                setSearchTerm(e.target.value);
              }
            }}
            disabled={selectedCities.length >= 5}
            className="flex-1 min-w-[120px] outline-none bg-transparent text-sm disabled:cursor-not-allowed disabled:text-muted-foreground"
          />
        </div>

        {/* Search Results Dropdown */}
        {searchTerm && (
          <div className="border rounded-md p-2 space-y-1 max-h-48 overflow-y-auto">
            {filteredCities.slice(0, 10).map((city) => (
              <button
                key={`${city.city}-${city.country}`}
                onClick={() => {
                  toggleCity(city.city);
                  setSearchTerm("");
                }}
                disabled={
                  selectedCities.length >= 5 && !selectedCities.includes(city.city)
                }
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedCities.includes(city.city)
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted disabled:opacity-50"
                }`}
              >
                {city.city}, {city.country}
                <span className="text-muted-foreground ml-2">
                  ({unit === "F" ? (city.year * 9/5 + 32).toFixed(1) : city.year.toFixed(1)}°{unit} avg)
                </span>
              </button>
            ))}
            {filteredCities.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-2">
                No cities found
              </p>
            )}
          </div>
        )}
      </div>

      {/* Chart */}
      {selectedCitiesData.length > 0 ? (
        <TemperatureChart cities={selectedCitiesData} unit={unit} onUnitChange={setUnit} />
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          Select at least one city to view temperature data
        </div>
      )}
    </div>
  );
}
