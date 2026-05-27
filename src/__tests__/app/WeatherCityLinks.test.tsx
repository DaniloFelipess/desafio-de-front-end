import React, { ReactNode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WeatherCityLinks } from "@/app/WeatherCityLinks";
import { CITIES } from "@/constants";
import { CityWeather } from "@/types/weather";

const mockWeather: CityWeather = {
  city: CITIES.recife,
  current: {
    temperature: 28,
    condition: "drizzle",
    humidity: 78,
    windSpeed: 4.2,
    feelsLike: 28,
  },
  hourly: [],
};

function renderWithQueryClient(children: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return {
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
    ),
  };
}

describe("WeatherCityLinks", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders city links", () => {
    renderWithQueryClient(
      <WeatherCityLinks cities={[CITIES.recife, CITIES.vancouver]} />,
    );

    expect(screen.getByRole("link", { name: "Recife" })).toHaveAttribute(
      "href",
      "/weather/recife",
    );
    expect(screen.getByRole("link", { name: "Vancouver" })).toHaveAttribute(
      "href",
      "/weather/vancouver",
    );
  });

  it("prefetches weather when a city receives focus", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockWeather,
    } as Response);
    const { queryClient } = renderWithQueryClient(
      <WeatherCityLinks cities={[CITIES.recife]} />,
    );

    fireEvent.focus(screen.getByRole("link", { name: "Recife" }));

    await waitFor(() =>
      expect(queryClient.getQueryData(["weather", "recife"])).toEqual(mockWeather),
    );
    expect(global.fetch).toHaveBeenCalledWith("/api/weather/recife");
  });

  it("does not block the native Next link navigation on click", () => {
    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    renderWithQueryClient(<WeatherCityLinks cities={[CITIES.recife]} />);
    const link = screen.getByRole("link", { name: "Recife" });

    link.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it("prefetches weather on pointer down", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockWeather,
    } as Response);
    renderWithQueryClient(<WeatherCityLinks cities={[CITIES.recife]} />);

    fireEvent.pointerDown(screen.getByRole("link", { name: "Recife" }));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith("/api/weather/recife"),
    );
  });
});
