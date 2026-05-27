import { GET } from "@/app/api/health/route";

describe("health route", () => {
  it("returns an ok response for platform and Kubernetes probes", async () => {
    const response = GET();

    await expect(response.json()).resolves.toEqual({
      status: "ok",
      service: "weather-app",
    });
    expect(response.status).toBe(200);
  });
});
