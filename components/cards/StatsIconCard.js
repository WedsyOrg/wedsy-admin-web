import { BiRupee } from "react-icons/bi";
import { BsArrowUp } from "react-icons/bs";

export default function StatsIconCard({ title, value, subtitle }) {
  return (
    <>
      <div className="col-span-2 bg-white rounded-2xl shadow-lg p-6 flex flex-row gap-4 items-center justify-evenly">
        <div className="bg-gradient-to-b from-emerald-100 to-green-50 rounded-full p-3">
          <BiRupee size={64} color="#00AC4F" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-gray-400 font-medium">{title}</p>
          <p className="text-4xl font-bold">{value}</p>
          <p className="flex flex-row gap-1 items-center">
            <BsArrowUp color="#00AC4F" size={18} />
            <span className="text-green-600 font-medium">38%</span>
            <span className="font-medium">this month</span>
          </p>
        </div>
      </div>
    </>
  );
}
