import { ComponentType } from "react";
import {
  BsCloud,
  BsCloudDrizzle,
  BsCloudFog,
  BsCloudHail,
  BsCloudLightningRain,
  BsCloudRain,
  BsCloudSnow,
  BsCloudy,
  BsMoon,
  BsSun,
  BsWind,
} from "react-icons/bs";
import { WeatherCondition } from "@/types/weather";

type WeatherIconProps = {
  condition: WeatherCondition;
  isNight?: boolean;
  size?: "large" | "small";
};

const ICONS: Record<WeatherCondition, ComponentType<{ className?: string }>> = {
  sunny: BsSun,
  cloudy: BsCloudy,
  rainy: BsCloudRain,
  snowy: BsCloudSnow,
  stormy: BsCloudLightningRain,
  windy: BsWind,
  foggy: BsCloudFog,
  hail: BsCloudHail,
  drizzle: BsCloudDrizzle,
  thunderstorm: BsCloudLightningRain,
};

export function WeatherIcon({
  condition,
  isNight = false,
  size = "large",
}: WeatherIconProps) {
  const className =
    size === "large" ? "h-22 w-22 md:h-26 md:w-26" : "h-7 w-7";
  const Icon = isNight && condition === "sunny" ? BsMoon : ICONS[condition] ?? BsCloud;

  return <Icon className={className} aria-hidden="true" />;
}
