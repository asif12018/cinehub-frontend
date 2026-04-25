export default function DashboardLoading() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen w-full text-white font-sans p-4 md:p-8 animate-pulse">

      {/* HEADER SKELETON */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="h-8 w-48 bg-gray-800 rounded-lg mb-2" />
          <div className="h-4 w-72 bg-gray-800/60 rounded" />
        </div>
        <div className="h-10 w-40 bg-gray-800 rounded-lg" />
      </div>

      {/* STATS GRID SKELETON */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#141414] border border-gray-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-gray-700 rounded-full" />
              <div className="h-9 w-16 bg-gray-700 rounded-lg" />
            </div>
            <div className="h-4 w-28 bg-gray-700/60 rounded" />
          </div>
        ))}
      </div>

      {/* BOTTOM ROW SKELETON */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart skeleton */}
        <div className="lg:col-span-2 bg-[#141414] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="h-6 w-44 bg-gray-700 rounded" />
            <div className="h-6 w-24 bg-gray-800 rounded-full" />
          </div>
          <div className="h-64 flex items-end justify-between gap-2 md:gap-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex flex-col items-center flex-1 justify-end gap-3 h-full">
                <div
                  className="w-full max-w-[40px] bg-gray-700/40 rounded-t-md"
                  style={{ height: `${30 + Math.random() * 60}%` }}
                />
                <div className="h-3 w-6 bg-gray-700/40 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Pending reviews skeleton */}
        <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6 flex flex-col">
          <div className="h-6 w-40 bg-gray-700 rounded mb-6" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-gray-800 p-4 rounded-xl">
                <div className="h-4 w-3/4 bg-gray-700 rounded mb-3" />
                <div className="flex items-center justify-between">
                  <div className="h-3 w-24 bg-gray-700/60 rounded" />
                  <div className="h-5 w-10 bg-gray-700/60 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
