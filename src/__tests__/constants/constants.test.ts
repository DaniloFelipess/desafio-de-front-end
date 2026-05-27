import { CITIES, WEATHER_TIMES } from "@/constants";

describe("constants", () => {
  it("contains the six challenge cities", () => {
    expect(Object.keys(CITIES)).toEqual([
      "dallol",
      "fairbanks",
      "london",
      "recife",
      "vancouver",
      "yakutsk",
    ]);
  });

  it("keeps the required country codes", () => {
    expect(Object.values(CITIES).map((city) => city.code)).toEqual([
      "NG",
      "US",
      "GB",
      "BR",
      "CA",
      "RU",
    ]);
  });

  it("uses the required hourly periods", () => {
    expect(WEATHER_TIMES.map(({ key, hour }) => [key, hour])).toEqual([
      ["dawn", 3],
      ["morning", 9],
      ["afternoon", 15],
      ["night", 21],
    ]);
  });
});
