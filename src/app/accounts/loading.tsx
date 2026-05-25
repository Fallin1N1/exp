export default function Loading() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="glass-panel h-40 animate-pulse rounded-lg" />
      ))}
    </div>
  );
}
