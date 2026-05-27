import { City, CityWeather } from "@/types/weather";
import { BackButton } from "./BackButton";
import { WeatherHeader } from "./WeatherHeader";
import { WeatherHeroIcon } from "./WeatherHeroIcon";
import { WeatherMetrics } from "./WeatherMetrics";
import { WeatherPeriods } from "./WeatherPeriods";
import { WeatherTemperature } from "./WeatherTemperature";

type WeatherPanelProps = {
  city: City;
  isError: boolean;
  isPending: boolean;
  weather?: CityWeather;
};

export function WeatherPanel({
  city,
  isError,
  isPending,
  weather,
}: WeatherPanelProps) {
  const isWarm = weather ? weather.current.temperature >= 0 : false;
  const panelClass =
    weather && isWarm
      ? "bg-(--weather-blue) text-white"
      : "bg-(--weather-gray) text-(--text-dark)";

  return (
    <main
      className={`relative flex min-h-screen items-start justify-center p-0 transition-colors duration-200 md:items-center md:p-12 ${panelClass}`}
    >
      <BackButton isWarm={isWarm} />

      <section className="flex w-(--layout-mobile-width) flex-col items-center px-0 pt-(--layout-mobile-top) pb-8 text-center md:w-(--layout-desktop-width) md:px-20 md:py-20">
        <WeatherHeader
          fallbackCityName={city.name}
          isError={isError}
          weather={weather}
        />
        <WeatherTemperature current={weather?.current} />
        <WeatherHeroIcon current={weather?.current} />
        <WeatherPeriods hourly={weather?.hourly} />
        <WeatherMetrics current={weather?.current} />

        {isError && (
          <p className="mt-6 text-[12px] leading-tight opacity-75">
            Weather service unavailable. Try again soon.
          </p>
        )}
        {isPending && <span className="sr-only">Loading weather data</span>}
      </section>
    </main>
  );
}
