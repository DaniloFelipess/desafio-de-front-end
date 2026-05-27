import { Skeleton } from "./Skeleton";

type WeatherMetricProps = {
  label: string;
  value: string;
  separatorClassName?: string;
};

export function WeatherMetric({
  label,
  value,
  separatorClassName = "",
}: WeatherMetricProps) {
  return (
    <div className="relative flex min-w-14.5 flex-col items-center px-3">
      <span className="text-[12px] leading-tight font-light opacity-70 md:text-[13px]">
        {label}
      </span>
      <span className="mt-1 text-[11px] leading-tight font-light opacity-90 md:text-[12px]">
        {value || <Skeleton className="mx-auto h-3 w-12" />}
      </span>
      {separatorClassName && (
        <span
          className={`absolute top-1/2 right-0 h-7 -translate-y-1/2 border-r border-current opacity-25 ${separatorClassName}`}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
