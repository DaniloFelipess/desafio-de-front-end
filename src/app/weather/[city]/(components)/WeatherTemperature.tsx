import { WeatherData } from "@/types/weather";
import { Skeleton } from "./Skeleton";

type WeatherTemperatureProps = {
  current?: WeatherData;
};

export function WeatherTemperature({ current }: WeatherTemperatureProps) {
  return (
    <div className="mt-6 flex min-h-16 items-start justify-center gap-2 md:mt-8">
      {current ? (
        <>
          <span className="text-[76px] leading-[0.78] font-extralight tracking-normal md:text-[82px]">
            {current.temperature}
          </span>
          <span className="mt-1 text-[20px] leading-none font-light">
            &deg;C
          </span>
          <span className="mt-8 flex flex-col items-start text-[9px] leading-tight font-light opacity-75">
            <span>
              &uarr; {current.temperatureMax ?? current.temperature}&deg;
            </span>
            <span>
              &darr; {current.temperatureMin ?? current.temperature}&deg;
            </span>
          </span>
        </>
      ) : (
        <div className="flex h-16 items-start gap-2 pt-1">
          <Skeleton className="h-14 w-24" />
          <Skeleton className="mt-1 h-5 w-7" />
          <div className="mt-8 flex flex-col gap-1">
            <Skeleton className="h-2 w-5" />
            <Skeleton className="h-2 w-5" />
          </div>
        </div>
      )}
    </div>
  );
}
