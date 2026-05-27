import { isValidElement } from "react";
import { notFound } from "next/navigation";
import { CITIES } from "@/constants";
import WeatherPage from "@/app/weather/[city]/page";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

jest.mock("@/app/weather/[city]/WeatherClient", () => ({
  WeatherClient: ({ city }: { city: { name: string } }) => (
    <div>Weather client for {city.name}</div>
  ),
}));

describe("WeatherPage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the weather client for a valid city slug", async () => {
    const page = await WeatherPage({
      params: Promise.resolve({ city: "recife" }),
    });

    expect(isValidElement(page)).toBe(true);
    expect(page.props).toEqual({ city: CITIES.recife });
  });

  it("calls notFound for an unknown city", async () => {
    await expect(
      WeatherPage({ params: Promise.resolve({ city: "unknown" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalled();
  });
});
