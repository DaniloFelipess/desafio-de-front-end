const DOTS = [0, 160, 320];

export default function LoadingWeather() {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-(--background-dark) text-white"
      aria-label="Loading weather data"
      role="status"
    >
      <div className="flex items-center gap-3">
        {DOTS.map((delay) => (
          <span
            key={delay}
            className="loading-dot h-3 w-3 rounded-full bg-current"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </main>
  );
}
