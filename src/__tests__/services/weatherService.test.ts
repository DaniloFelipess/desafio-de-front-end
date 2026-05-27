import { CITIES } from "@/constants";
import { fetchWeatherData } from "@/services/weatherService";

function makeOpenMeteoResponse() {
  const hours = Array.from(
    { length: 24 },
    (_, index) => `2026-01-01T${String(index).padStart(2, "0")}:00`,
  );

  return {
    current: {
      time: "2026-01-01T09:00",
      temperature_2m: 13.4,
      weather_code: 0,
      relative_humidity_2m: 45,
      wind_speed_10m: 1.92,
    },
    hourly: {
      time: hours,
      temperature_2m: hours.map((_, index) => index),
      weather_code: hours.map(() => 0),
      relative_humidity_2m: hours.map(() => 40),
      wind_speed_10m: hours.map(() => 2),
    },
    daily: {
      time: ["2026-01-01"],
      temperature_2m_max: [17.3],
      temperature_2m_min: [8.1],
      sunrise: ["2026-01-01T04:21"],
      sunset: ["2026-01-01T14:36"],
    },
  };
}

describe("weatherService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("maps Open-Meteo current, hourly and daily data to the app shape", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => makeOpenMeteoResponse(),
    } as Response);

    const data = await fetchWeatherData(CITIES.recife);

    expect(data.city).toEqual(CITIES.recife);
    expect(data.current).toEqual({
      currentTime: "2026-01-01T09:00",
      temperature: 13,
      condition: "sunny",
      humidity: 45,
      windSpeed: 1.92,
      feelsLike: 13,
      temperatureMax: 17,
      temperatureMin: 8,
      sunrise: "04:21 AM",
      sunset: "02:36 PM",
    });
    expect(data.hourly.map(({ time, temperature }) => [time, temperature])).toEqual([
      ["dawn", 3],
      ["morning", 9],
      ["afternoon", 15],
      ["night", 21],
    ]);
  });

  it("calls Open-Meteo with the required parameters", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => makeOpenMeteoResponse(),
    } as Response);

    await fetchWeatherData(CITIES.vancouver);

    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toContain("https://api.open-meteo.com/v1/forecast?");
    expect(url).toContain("latitude=49.2827");
    expect(url).toContain("longitude=-123.1207");
    expect(url).toContain("current=temperature_2m%2Cweather_code");
    expect(options).toMatchObject({
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });
  });

  it("returns fallback weather when the API fails", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      statusText: "Service unavailable",
    } as Response);

    const data = await fetchWeatherData(CITIES.vancouver);

    expect(data.current.temperature).toBe(-4);
    expect(data.current.condition).toBe("snowy");
    expect(data.hourly).toHaveLength(4);
  });

  it("uses hourly data when current data is unavailable", async () => {
    const response = makeOpenMeteoResponse();
    delete response.current;
    response.hourly.weather_code[3] = 45;
    response.daily.sunrise = [];
    response.daily.sunset = ["not-a-time"];
    jest.spyOn(Date.prototype, "getHours").mockReturnValue(3);
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => response,
    } as Response);

    const data = await fetchWeatherData(CITIES.fairbanks);

    expect(data.current.temperature).toBe(3);
    expect(data.current.condition).toBe("foggy");
    expect(data.current.sunrise).toBe("--:--");
    expect(data.current.sunset).toBe("not-a-time:--");
  });

  it("maps the Open-Meteo weather code groups used by the UI", async () => {
    const response = makeOpenMeteoResponse();
    response.current = {
      ...response.current,
      weather_code: 95,
    };
    response.hourly.weather_code[3] = 1;
    response.hourly.weather_code[9] = 3;
    response.hourly.weather_code[15] = 61;
    response.hourly.weather_code[21] = 71;
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => response,
    } as Response);

    const data = await fetchWeatherData(CITIES.london);

    expect(data.current.condition).toBe("thunderstorm");
    expect(data.hourly.map(({ condition }) => condition)).toEqual([
      "drizzle",
      "cloudy",
      "rainy",
      "snowy",
    ]);
  });

  it("falls back to a generic weather profile for unknown country codes", async () => {
    jest.spyOn(global, "fetch").mockRejectedValue(new Error("network error"));

    const data = await fetchWeatherData({
      ...CITIES.recife,
      code: "ZZ",
      name: "Unknown",
    });

    expect(data.city.name).toBe("Unknown");
    expect(data.current.temperature).toBe(18);
    expect(data.current.condition).toBe("cloudy");
  });
});
