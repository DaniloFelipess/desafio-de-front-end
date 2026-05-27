import { render } from "@testing-library/react";
import { WeatherIcon } from "@/app/weather/[city]/(components)/WeatherIcon";
import { WeatherCondition } from "@/types/weather";

describe("WeatherIcon", () => {
  it.each<WeatherCondition>([
    "sunny",
    "snowy",
    "rainy",
    "drizzle",
    "foggy",
    "cloudy",
    "stormy",
    "windy",
    "hail",
    "thunderstorm",
  ])("renders an svg for %s", (condition) => {
    const { container } = render(<WeatherIcon condition={condition} />);

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("uses the compact size when requested", () => {
    const { container } = render(<WeatherIcon condition="sunny" size="small" />);

    expect(container.querySelector("svg")).toHaveClass("h-7", "w-7");
  });

  it("renders the moon icon for night periods", () => {
    const { container } = render(
      <WeatherIcon condition="rainy" isNight size="small" />,
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveClass("h-7", "w-7");
  });
});
