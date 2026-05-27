import { CITIES } from "@/constants";
import { fetchWeatherData } from "@/services/weatherService";
import { GET } from "@/app/api/weather/[city]/route";
import { CityWeather } from "@/types/weather";

jest.mock("@/services/weatherService", () => ({
  fetchWeatherData: jest.fn(),
}));

const mockWeather: CityWeather = {
  city: CITIES.vancouver,
  current: {
    temperature: -4,
    condition: "snowy",
    humidity: 95,
    windSpeed: 1.69,
    feelsLike: -4,
  },
  hourly: [],
};

describe("weather route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns weather data for a valid city", async () => {
    (fetchWeatherData as jest.Mock).mockResolvedValue(mockWeather);

    const response = await GET(new Request("http://localhost/api/weather/vancouver"), {
      params: Promise.resolve({ city: "vancouver" }),
    });

    await expect(response.json()).resolves.toEqual(mockWeather);
    expect(fetchWeatherData).toHaveBeenCalledWith(CITIES.vancouver);
  });

  it("matches cities case-insensitively", async () => {
    (fetchWeatherData as jest.Mock).mockResolvedValue(mockWeather);

    const response = await GET(new Request("http://localhost/api/weather/Vancouver"), {
      params: Promise.resolve({ city: "Vancouver" }),
    });

    expect(response.status).toBe(200);
    expect(fetchWeatherData).toHaveBeenCalledWith(CITIES.vancouver);
  });

  it("returns 404 for an invalid city", async () => {
    const response = await GET(new Request("http://localhost/api/weather/atlantis"), {
      params: Promise.resolve({ city: "atlantis" }),
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ message: "City not found" });
    expect(fetchWeatherData).not.toHaveBeenCalled();
  });
});
