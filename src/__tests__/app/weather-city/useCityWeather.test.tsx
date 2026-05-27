import { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCityWeather } from "@/app/weather/[city]/useCityWeather";
import { CITIES } from "@/constants";
import { CityWeather } from "@/types/weather";

const weather: CityWeather = {
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

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useCityWeather", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("normalizes the city name before fetching data", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => weather,
    } as Response);

    const { result } = renderHook(() => useCityWeather("Recife"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(global.fetch).toHaveBeenCalledWith("/api/weather/recife");
    expect(result.current.data).toEqual(weather);
  });
});
