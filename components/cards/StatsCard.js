export default function StatsCard({ title, value, subtitle }) {
  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
        <p className="text-gray-800 font-medium">{title}</p>
        <p className="text-4xl py-4 font-bold">{value}</p>
        {subtitle && <p className="">{subtitle}</p>}
      </div>
    </>
  );
}
