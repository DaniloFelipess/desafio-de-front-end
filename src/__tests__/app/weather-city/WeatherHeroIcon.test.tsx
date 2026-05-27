import { render, screen } from "@testing-library/react";
import { WeatherHeroIcon } from "@/app/weather/[city]/(components)/WeatherHeroIcon";
import { WeatherIcon } from "@/app/weather/[city]/(components)/WeatherIcon";
import { WeatherData } from "@/types/weather";

jest.mock("@/app/weather/[city]/(components)/WeatherIcon", () => ({
  WeatherIcon: jest.fn(({ condition, isNight }) => (
    <div
      data-condition={condition}
      data-night={String(isNight)}
      data-testid="weather-icon"
    />
  )),
}));

const current: WeatherData = {
  currentTime: "2026-05-27T18:15",
  temperature: 26,
  condition: "sunny",
  humidity: 77,
  windSpeed: 14,
  feelsLike: 26,
  sunrise: "05:04 AM",
  sunset: "05:26 PM",
};

describe("WeatherHeroIcon", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("uses night mode after sunset based on the city local API time", () => {
    render(<WeatherHeroIcon current={current} />);

    expect(screen.getByTestId("weather-icon")).toHaveAttribute("data-night", "true");
    expect(WeatherIcon).toHaveBeenCalledWith(
      expect.objectContaining({
        condition: "sunny",
        isNight: true,
      }),
      undefined,
    );
  });

  it("uses day mode between sunrise and sunset", () => {
    render(
      <WeatherHeroIcon
        current={{
          ...current,
          currentTime: "2026-05-27T12:00",
        }}
      />,
    );

    expect(screen.getByTestId("weather-icon")).toHaveAttribute("data-night", "false");
  });
});
