const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const items = Array.from({ length: count }, (_, i) => i);

  const templates = {
    card: (
      <div className="card p-5 space-y-3">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="skeleton h-2 w-full mt-4" />
        <div className="flex gap-2 mt-3">
          <div className="skeleton h-8 w-8 rounded-full" />
          <div className="skeleton h-8 w-8 rounded-full" />
        </div>
      </div>
    ),
    stat: (
      <div className="card p-5 space-y-3">
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton h-8 w-1/2" />
        <div className="skeleton h-3 w-2/3" />
      </div>
    ),
    table: (
      <div className="card p-4 space-y-3">
        <div className="skeleton h-10 w-full rounded-lg" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-4 items-center">
            <div className="skeleton h-8 w-8 rounded-full" />
            <div className="skeleton h-4 w-1/4" />
            <div className="skeleton h-4 w-1/3" />
            <div className="skeleton h-4 w-1/6" />
          </div>
        ))}
      </div>
    ),
    task: (
      <div className="flex items-center gap-3 p-3">
        <div className="skeleton h-4 w-4 rounded" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-3 w-1/2" />
        </div>
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
    ),
    chart: (
      <div className="card p-5 space-y-4">
        <div className="skeleton h-4 w-1/3" />
        <div className="skeleton h-48 w-full rounded-lg" />
      </div>
    ),
  };

  return (
    <>
      {items.map(i => (
        <div key={i}>{templates[type]}</div>
      ))}
    </>
  );
};

export default SkeletonLoader;
