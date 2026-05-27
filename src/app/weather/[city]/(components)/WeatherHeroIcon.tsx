import { WeatherData } from "@/types/weather";
import { Skeleton } from "./Skeleton";
import { WeatherIcon } from "./WeatherIcon";

type WeatherHeroIconProps = {
  current?: WeatherData;
};

function isNightNow(current?: WeatherData): boolean {
  if (!current?.sunrise || !current?.sunset) return false;
  const now = new Date();
  const sunrise = new Date(current.sunrise);
  const sunset = new Date(current.sunset);
  return now < sunrise || now > sunset;
}

export function WeatherHeroIcon({ current }: WeatherHeroIconProps) {
  const night = current ? isNightNow(current) : false;
  return (
    <div className="mt-4 min-h-22 md:mt-5 md:min-h-26">
      {current ? (
        <WeatherIcon condition={current.condition} isNight={night} />
      ) : (
        <Skeleton className="h-22 w-22 rounded-full md:h-26 md:w-26" />
      )}
    </div>
  );
}
