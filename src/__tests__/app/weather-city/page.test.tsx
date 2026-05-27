import { isValidElement } from "react";
import { notFound } from "next/navigation";
import { CITIES } from "@/constants";
import WeatherPage from "@/app/weather/[city]/page";
import { fetchWeatherData } from "@/services/weatherService";
import { CityWeather } from "@/types/weather";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

jest.mock("@/app/weather/[city]/WeatherClient", () => ({
  WeatherClient: ({ city }: { city: { name: string } }) => (
    <div>Weather client for {city.name}</div>
  ),
}));

jest.mock("@/services/weatherService", () => ({
  fetchWeatherData: jest.fn(),
}));

const weather: CityWeather = {
  city: CITIES.recife,
  current: {
    temperature: 28,
    condition: "drizzle",
    humidity: 78,
    windSpeed: 4.2,
    feelsLike: 28,
  },
  hourly: [],
};

const mockFetchWeatherData = jest.mocked(fetchWeatherData);

describe("WeatherPage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the weather client for a valid city slug", async () => {
    mockFetchWeatherData.mockResolvedValue(weather);

    const page = await WeatherPage({
      params: Promise.resolve({ city: "recife" }),
    });

    expect(isValidElement(page)).toBe(true);
    expect(page.props).toEqual({
      city: CITIES.recife,
      initialWeather: weather,
    });
    expect(fetchWeatherData).toHaveBeenCalledWith(CITIES.recife);
  });

  it("calls notFound for an unknown city", async () => {
    await expect(
      WeatherPage({ params: Promise.resolve({ city: "unknown" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalled();
  });
});
