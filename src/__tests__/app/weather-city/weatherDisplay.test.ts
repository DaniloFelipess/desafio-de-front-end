import {
  getConditionLabel,
  PERIOD_LABELS,
} from "@/app/weather/[city]/(components)/weatherDisplay";

describe("weatherDisplay", () => {
  it("returns labels for weather conditions and loading state", () => {
    expect(getConditionLabel()).toBe("Loading");
    expect(getConditionLabel("sunny")).toBe("Clear");
    expect(getConditionLabel("drizzle")).toBe("Clouds");
    expect(getConditionLabel("thunderstorm")).toBe("Storm");
  });

  it("keeps period labels aligned with the challenge copy", () => {
    expect(PERIOD_LABELS).toEqual({
      dawn: "Dawn",
      morning: "Morning",
      afternoon: "Afternoon",
      night: "Night",
    });
  });
});
