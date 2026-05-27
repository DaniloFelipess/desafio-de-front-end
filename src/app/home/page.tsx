import { LiaGlobeAmericasSolid } from "react-icons/lia";
import { CITIES } from "@/constants";
import { WeatherCityLinks } from "../WeatherCityLinks";

export default function Home() {
  const cities = Object.values(CITIES);

  return (
    <main className="flex min-h-screen items-start justify-center bg-(--background-dark) p-0 text-white md:items-center md:p-12">
      <section className="flex w-full items-center justify-center px-0 pt-(--layout-mobile-top) pb-12 md:w-(--layout-desktop-width) md:py-12">
        <div className="flex w-(--layout-mobile-width) flex-col items-center text-center md:w-85">
          <h1 className="text-[32px] leading-none font-light tracking-normal md:text-[34px]">
            Weather
          </h1>
          <p className="mt-2 text-[14px] leading-none font-light text-white/80">
            Select a city
          </p>

          <div className="mt-7 md:mt-8">
            <LiaGlobeAmericasSolid
              aria-hidden="true"
              className="h-22 w-22 md:h-35.75 md:w-35.75"
            />
          </div>

          <WeatherCityLinks cities={cities} />
        </div>
      </section>
    </main>
  );
}
