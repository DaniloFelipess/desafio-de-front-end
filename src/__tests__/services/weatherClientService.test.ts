import { fetchCityWeather, weatherQueryKey } from "@/services/weatherClientService";
import { CityWeather } from "@/types/weather";

const mockWeather: CityWeather = {
  city: {
    name: "Recife",
    code: "BR",
    country: "Brazil",
    latitude: -8.0726,
    longitude: -34.8767,
  },
  current: {
    temperature: 28,
    condition: "drizzle",
    humidity: 78,
    windSpeed: 4.2,
    feelsLike: 28,
  },
  hourly: [],
};

describe("weatherClientService", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("normalizes the query key by city name", () => {
    expect(weatherQueryKey("Recife")).toEqual(["weather", "recife"]);
  });

  it("fetches city weather from the internal API route", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockWeather,
    } as Response);

    await expect(fetchCityWeather("Recife")).resolves.toEqual(mockWeather);
    expect(global.fetch).toHaveBeenCalledWith("/api/weather/Recife");
  });

  it("encodes city names before calling the API route", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockWeather,
    } as Response);

    await fetchCityWeather("Sao Paulo");

    expect(global.fetch).toHaveBeenCalledWith("/api/weather/Sao%20Paulo");
  });

  it("throws when the internal API route fails", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
    } as Response);

    await expect(fetchCityWeather("Recife")).rejects.toThrow(
      "Unable to load weather data",
    );
  });
});
