import { promises as fs } from "fs";
import path from "path";

export interface CityTemperature {
  id: string;
  continent: string;
  country: string;
  city: string;
  lat: number;
  lng: number;
  population: number;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
  year: number;
}

export async function getCityTemperatures(): Promise<CityTemperature[]> {
  const filePath = path.join(process.cwd(), "cities.csv");
  const fileContent = await fs.readFile(filePath, "utf-8");

  const lines = fileContent.trim().split("\n");
  const data: CityTemperature[] = [];

  // Skip header row
  // cities.csv columns: Continent,Country,City,lat,lng,iso2,iso3,admin_name,capital,population,id,Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec,Year
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    if (values.length >= 23) {
      data.push({
        id: values[10],
        continent: values[0],
        country: values[1],
        city: values[2],
        lat: parseFloat(values[3]),
        lng: parseFloat(values[4]),
        population: parseFloat(values[9]) || 0,
        jan: parseFloat(values[11]),
        feb: parseFloat(values[12]),
        mar: parseFloat(values[13]),
        apr: parseFloat(values[14]),
        may: parseFloat(values[15]),
        jun: parseFloat(values[16]),
        jul: parseFloat(values[17]),
        aug: parseFloat(values[18]),
        sep: parseFloat(values[19]),
        oct: parseFloat(values[20]),
        nov: parseFloat(values[21]),
        dec: parseFloat(values[22]),
        year: parseFloat(values[23]),
      });
    }
  }

  return data;
}

export function getMonthlyData(city: CityTemperature) {
  return [
    { month: "Jan", temp: city.jan },
    { month: "Feb", temp: city.feb },
    { month: "Mar", temp: city.mar },
    { month: "Apr", temp: city.apr },
    { month: "May", temp: city.may },
    { month: "Jun", temp: city.jun },
    { month: "Jul", temp: city.jul },
    { month: "Aug", temp: city.aug },
    { month: "Sep", temp: city.sep },
    { month: "Oct", temp: city.oct },
    { month: "Nov", temp: city.nov },
    { month: "Dec", temp: city.dec },
  ];
}
