export default function Loading() {
  return (
    <div className="space-y-5">
      <div className="glass-panel h-8 w-52 animate-pulse rounded" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="glass-panel h-28 animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="glass-panel h-72 animate-pulse rounded-lg" />
    </div>
  );
}
