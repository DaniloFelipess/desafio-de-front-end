import { render, screen } from "@testing-library/react";
import { LoadingWeather } from "@/app/weather/[city]/(components)/LoadingWeather";

describe("LoadingWeather", () => {
  it("renders accessible loading feedback", () => {
    render(<LoadingWeather />);

    expect(
      screen.getByRole("status", { name: "Loading weather data" }),
    ).toBeInTheDocument();
  });
});
