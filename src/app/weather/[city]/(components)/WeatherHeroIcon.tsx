import { WeatherData } from "@/types/weather";
import { Skeleton } from "./Skeleton";
import { WeatherIcon } from "./WeatherIcon";

type WeatherHeroIconProps = {
  current?: WeatherData;
};

function parseClockTime(value?: string): number | undefined {
  if (!value) return undefined;

  const match = value.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)?$/i);

  if (!match) return undefined;

  const [, rawHour, rawMinute, rawPeriod] = match;
  const period = rawPeriod?.toUpperCase();
  let hour = Number(rawHour);
  const minute = Number(rawMinute);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return undefined;
  }

  if (period === "PM" && hour < 12) {
    hour += 12;
  }

  if (period === "AM" && hour === 12) {
    hour = 0;
  }

  return hour * 60 + minute;
}

function getCurrentLocalMinutes(current?: WeatherData): number {
  const time = current?.currentTime?.split("T")[1]?.slice(0, 5);
  const fromApiTime = parseClockTime(time);

  if (fromApiTime !== undefined) {
    return fromApiTime;
  }

  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function isNightNow(current?: WeatherData): boolean {
  if (!current?.sunrise || !current?.sunset) return false;

  const sunrise = parseClockTime(current.sunrise);
  const sunset = parseClockTime(current.sunset);

  if (sunrise === undefined || sunset === undefined) {
    return false;
  }

  const now = getCurrentLocalMinutes(current);

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
