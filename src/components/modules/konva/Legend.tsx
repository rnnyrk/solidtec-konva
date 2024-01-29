// 20px === 10cm
export function Legend() {
  return (
    <div className="absolute left-8 bottom-8 flex flex-col items-center">
      <div className="legend" />
      <span className="text-xs">10cm</span>
    </div>
  );
}
