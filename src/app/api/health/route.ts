export function GET() {
  return Response.json({
    status: "ok",
    service: "weather-app",
  });
}
