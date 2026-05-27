import { HourlyWeather } from "@/types/weather";
import { Skeleton } from "./Skeleton";
import { WeatherIcon } from "./WeatherIcon";
import { PERIOD_LABELS } from "./weatherDisplay";

type EmptyPeriod = Pick<HourlyWeather, "time">;
type PeriodItem = HourlyWeather | EmptyPeriod;

const EMPTY_PERIODS: EmptyPeriod[] = [
  { time: "dawn" },
  { time: "morning" },
  { time: "afternoon" },
  { time: "night" },
];

type WeatherPeriodsProps = {
  hourly?: HourlyWeather[];
};

export function WeatherPeriods({ hourly }: WeatherPeriodsProps) {
  const periods: PeriodItem[] = hourly ?? EMPTY_PERIODS;

  return (
    <div className="mt-7 grid grid-cols-3 gap-x-4 gap-y-5 md:mt-8 md:grid-cols-4 md:gap-x-9">
      {periods.map((item) => (
        <div
          key={item.time}
          className={`flex flex-col items-center ${
            item.time === "night" ? "col-start-2 md:col-start-auto" : ""
          }`}
        >
          <span className="text-[12px] leading-tight font-light opacity-70 md:text-[13px]">
            {PERIOD_LABELS[item.time]}
          </span>
          <span className="mt-2 flex h-7 w-7 items-center justify-center">
            {"condition" in item ? (
              <WeatherIcon
                condition={item.condition}
                isNight={item.time === "night"}
                size="small"
              />
            ) : (
              <Skeleton className="h-6 w-6 rounded-full" />
            )}
          </span>
          <span className="mt-2 text-[11px] leading-tight font-light opacity-90 md:text-[12px]">
            {"temperature" in item ? (
              `${item.temperature}\u00B0C`
            ) : (
              <Skeleton className="mx-auto h-3 w-8" />
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
