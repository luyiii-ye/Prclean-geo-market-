export function MapLegend() {
  return (
    <div className="grid gap-2 rounded-lg border border-dashboard-line bg-white/90 p-3 text-xs text-dashboard-sub shadow-sm">
      <div className="flex items-center gap-2">
        <span className="h-5 w-5 rounded-full bg-dashboard-orange" />
        气泡越大 = 线下市场价值越高
      </div>
      <div className="flex items-center gap-2">
        <span className="h-5 w-5 rounded-full bg-gradient-to-r from-dashboard-yellow to-dashboard-deepOrange" />
        颜色越深 = 线下市场价值越高
      </div>
      <div className="flex items-center gap-2">
        <span className="h-5 w-5 rounded-full border-2 border-dashed border-dashboard-deepOrange bg-dashboard-yellow" />
        虚线边框 = 公共/商业/特殊口径市场
      </div>
    </div>
  );
}
