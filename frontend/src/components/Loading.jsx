const Loading = ({ label = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-20 text-ink-mute" role="status">
    <div className="flex items-end gap-1.5 h-8">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2.5 rounded-full bg-brand-600 animate-bounce"
          style={{ height: i === 1 ? 28 : 18, animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
    <p className="mt-4 text-sm font-medium">{label}</p>
  </div>
);

export default Loading;
