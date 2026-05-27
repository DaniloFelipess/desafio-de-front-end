import { notFound } from "next/navigation";
import { CITIES } from "@/constants";
import { fetchWeatherData } from "@/services/weatherService";
import { WeatherClient } from "./WeatherClient";

type WeatherPageProps = {
  params: Promise<{ city: string }>;
};

export default async function WeatherPage({ params }: WeatherPageProps) {
  const { city } = await params;
  const cityObj = Object.values(CITIES).find(
    (candidate) => candidate.name.toLowerCase() === city.toLowerCase(),
  );

  if (!cityObj) {
    notFound();
  }

  const initialWeather = await fetchWeatherData(cityObj);

  return <WeatherClient city={cityObj} initialWeather={initialWeather} />;
}
