import { render, screen } from "@testing-library/react";
import Loading from "@/app/weather/[city]/loading";

describe("Weather loading route", () => {
  it("renders accessible loading feedback", () => {
    render(<Loading />);

    expect(
      screen.getByRole("status", { name: "Loading weather data" }),
    ).toBeInTheDocument();
  });
});
