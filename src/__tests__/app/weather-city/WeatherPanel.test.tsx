import { render, screen } from "@testing-library/react";
import { WeatherPanel } from "@/app/weather/[city]/(components)/WeatherPanel";
import { CITIES } from "@/constants";
import { CityWeather } from "@/types/weather";

const recifeWeather: CityWeather = {
  city: CITIES.recife,
  current: {
    temperature: 28,
    condition: "drizzle",
    humidity: 78,
    windSpeed: 4.2,
    feelsLike: 28,
    temperatureMax: 32,
    temperatureMin: 23,
    sunrise: "05:04 AM",
    sunset: "05:26 PM",
  },
  hourly: [
    { time: "dawn", temperature: 26, condition: "drizzle" },
    { time: "morning", temperature: 29, condition: "sunny" },
    { time: "afternoon", temperature: 30, condition: "drizzle" },
    { time: "night", temperature: 27, condition: "cloudy" },
  ],
};

describe("WeatherPanel", () => {
  it("renders the complete weather details when data is available", () => {
    render(
      <WeatherPanel
        city={CITIES.recife}
        isError={false}
        isPending={false}
        weather={recifeWeather}
      />,
    );

    expect(screen.getByRole("link", { name: "Back to city selection" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("heading", { name: "Recife" })).toBeInTheDocument();
    expect(screen.getByText("Clouds")).toBeInTheDocument();
    expect(screen.getByText("28")).toBeInTheDocument();
    expect(screen.getByText("↑ 32°")).toBeInTheDocument();
    expect(screen.getByText("↓ 23°")).toBeInTheDocument();
    expect(screen.getByText("Dawn")).toBeInTheDocument();
    expect(screen.getByText("Night")).toBeInTheDocument();
    expect(screen.getByText("4.2 m/s")).toBeInTheDocument();
    expect(screen.getByText("05:04 AM")).toBeInTheDocument();
    expect(screen.getByText("05:26 PM")).toBeInTheDocument();
    expect(screen.getByText("78%")).toBeInTheDocument();
  });

  it("renders skeleton-friendly loading content before data arrives", () => {
    render(
      <WeatherPanel
        city={CITIES.vancouver}
        isError={false}
        isPending
      />,
    );

    expect(screen.getByRole("heading", { name: "Vancouver" })).toBeInTheDocument();
    expect(screen.getByText("Loading weather data")).toBeInTheDocument();
    expect(screen.getByText("Dawn")).toBeInTheDocument();
    expect(screen.getByText("Humidity")).toBeInTheDocument();
  });

  it("shows an error message when the query fails", () => {
    render(
      <WeatherPanel
        city={CITIES.vancouver}
        isError
        isPending={false}
      />,
    );

    expect(screen.getByText("Unavailable")).toBeInTheDocument();
    expect(
      screen.getByText("Weather service unavailable. Try again soon."),
    ).toBeInTheDocument();
  });
});
