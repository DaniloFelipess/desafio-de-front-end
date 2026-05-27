import { render } from "@testing-library/react";
import { BsCloudRain, BsMoon } from "react-icons/bs";
import { WeatherIcon } from "@/app/weather/[city]/(components)/WeatherIcon";
import { WeatherCondition } from "@/types/weather";

jest.mock("react-icons/bs", () => ({
  BsCloud: jest.fn((props) => <svg data-icon="cloud" {...props} />),
  BsCloudDrizzle: jest.fn((props) => <svg data-icon="drizzle" {...props} />),
  BsCloudFog: jest.fn((props) => <svg data-icon="fog" {...props} />),
  BsCloudHail: jest.fn((props) => <svg data-icon="hail" {...props} />),
  BsCloudLightningRain: jest.fn((props) => <svg data-icon="storm" {...props} />),
  BsCloudRain: jest.fn((props) => <svg data-icon="rain" {...props} />),
  BsCloudSnow: jest.fn((props) => <svg data-icon="snow" {...props} />),
  BsCloudy: jest.fn((props) => <svg data-icon="cloudy" {...props} />),
  BsMoon: jest.fn((props) => <svg data-icon="moon" {...props} />),
  BsSun: jest.fn((props) => <svg data-icon="sun" {...props} />),
  BsWind: jest.fn((props) => <svg data-icon="wind" {...props} />),
}));

describe("WeatherIcon", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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
      <WeatherIcon condition="sunny" isNight size="small" />,
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveClass("h-7", "w-7");
    expect(BsMoon).toHaveBeenCalled();
  });

  it("prioritizes weather condition icons over night mode", () => {
    render(<WeatherIcon condition="rainy" isNight size="small" />);

    expect(BsCloudRain).toHaveBeenCalled();
    expect(BsMoon).not.toHaveBeenCalled();
  });
});
