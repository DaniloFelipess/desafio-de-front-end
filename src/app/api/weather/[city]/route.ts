import { CITIES } from "@/constants";
import { fetchWeatherData } from "@/services/weatherService";

type WeatherRouteContext = {
  params: Promise<{ city: string }>;
};

export async function GET(_request: Request, { params }: WeatherRouteContext) {
  const { city } = await params;
  const cityObj = Object.values(CITIES).find(
    (candidate) => candidate.name.toLowerCase() === city.toLowerCase(),
  );

  if (!cityObj) {
    return Response.json({ message: "City not found" }, { status: 404 });
  }

  const weather = await fetchWeatherData(cityObj);

  return Response.json(weather);
}
