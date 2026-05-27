"use client";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { fetchCityWeather, weatherQueryKey } from "@/services/weatherClientService";
import { City } from "@/types/weather";

type WeatherCityLinksProps = {
  cities: City[];
};

export function WeatherCityLinks({ cities }: WeatherCityLinksProps) {
  const queryClient = useQueryClient();

  function warmCache(city: City) {
    const cityName = city.name.toLowerCase();

    void queryClient.prefetchQuery({
      queryKey: weatherQueryKey(cityName),
      queryFn: () => fetchCityWeather(cityName),
    });
  }

  return (
    <nav className="mt-7 grid w-full grid-cols-3 gap-x-5 gap-y-5 text-[12px] font-light md:mt-8 md:gap-x-7 md:text-[14px]">
      {cities.map((city) => {
        const cityName = city.name.toLowerCase();

        return (
          <Link
            key={city.code}
            href={`/weather/${cityName}`}
            className="text-center text-white/95 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onFocus={() => warmCache(city)}
            onMouseEnter={() => warmCache(city)}
            onPointerDown={() => warmCache(city)}
          >
            {city.name}
          </Link>
        );
      })}
    </nav>
  );
}
