import { render, screen } from "@testing-library/react";
import { WeatherClient } from "@/app/weather/[city]/WeatherClient";
import { useCityWeather } from "@/app/weather/[city]/useCityWeather";
import { CITIES } from "@/constants";
import { CityWeather } from "@/types/weather";

jest.mock("@/app/weather/[city]/useCityWeather", () => ({
  useCityWeather: jest.fn(),
}));

const mockUseCityWeather = jest.mocked(useCityWeather);

const weather: CityWeather = {
  city: CITIES.vancouver,
  current: {
    temperature: -4,
    condition: "snowy",
    humidity: 95,
    windSpeed: 1.69,
    feelsLike: -9,
    temperatureMax: 0,
    temperatureMin: -9,
    sunrise: "12:38 PM",
    sunset: "10:13 PM",
  },
  hourly: [
    { time: "dawn", temperature: -8, condition: "snowy" },
    { time: "morning", temperature: -8, condition: "sunny" },
    { time: "afternoon", temperature: -4, condition: "snowy" },
    { time: "night", temperature: -1, condition: "cloudy" },
  ],
};

describe("WeatherClient", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("queries the selected city and renders the panel", () => {
    mockUseCityWeather.mockReturnValue({
      data: weather,
      isPending: false,
      isError: false,
    } as ReturnType<typeof useCityWeather>);

    render(<WeatherClient city={CITIES.vancouver} />);

    expect(mockUseCityWeather).toHaveBeenCalledWith("Vancouver");
    expect(screen.getByRole("heading", { name: "Vancouver" })).toBeInTheDocument();
    expect(screen.getByText("-4")).toBeInTheDocument();
  });

  it("keeps the black loading screen while there is no cached data", () => {
    mockUseCityWeather.mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
    } as ReturnType<typeof useCityWeather>);

    render(<WeatherClient city={CITIES.vancouver} />);

    expect(
      screen.getByRole("status", { name: "Loading weather data" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Vancouver" }),
    ).not.toBeInTheDocument();
  });
});
