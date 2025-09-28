import { MdPeople } from "react-icons/md";
import { BiChevronDown, BiChevronUp, BiDollar } from "react-icons/bi";
import { BsArrowUp, BsChevronDown, BsChevronUp } from "react-icons/bs";
import { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";

export default function Home({ user }) {
  const [loading, setLoading] = useState(true);
  const [notificationOpen, setNotificationsOpen] = useState(false);
  const [leadStats, setLeadStats] = useState({
    total: 0,
    lost: 0,
    interested: 0,
    fresh: 0,
    new: 0,
  });
  const [eventsPendingApproval, setEventsPendingApproval] = useState(0);
  const fetchLeadStats = () => {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiry?stats=true`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          setLeadStats(response.stats);
          resolve();
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
          reject();
        });
    });
  };
  const fetchPendingEventStats = () => {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/event?stats=pending_approval`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          setEventsPendingApproval(response.pending_approval);
          resolve();
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
          reject();
        });
    });
  };
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchLeadStats(), fetchPendingEventStats()]).then((r) =>
      setLoading(false)
    );
  }, []);
  return (
    <>
      <div className="p-8 flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-semibold">
            Hello {user.name} {"👋🏼,"}
          </h2>
        </div>
        <div className="bg-white rounded-3xl shadow-lg p-6 flex flex-row gap-2">
          <div className="bg-gradient-to-b from-pink-500 to-white rounded-full p-3">
            <MdPeople size={48} color="#840032" />
          </div>
          <div className="flex flex-row flex-grow">
            <div className="flex flex-col gap-1 mx-auto">
              <p className="">Fresh leads</p>
              <p className="text-4xl font-bold">
                {loading ? <Spinner /> : <>{leadStats.fresh}</>}
              </p>
            </div>
            <div className="w-[2px] h-full bg-zinc-100" />
            <div className="flex flex-col gap-1 mx-auto">
              <p className="">New leads</p>
              <p className="text-4xl font-bold">
                {loading ? <Spinner /> : <>{leadStats.new}</>}
              </p>
            </div>
            <div className="w-[2px] h-full bg-zinc-100" />
            <div className="flex flex-col gap-1 mx-auto">
              <p className="">Interested leads</p>
              <p className="text-4xl font-bold">
                {loading ? <Spinner /> : <>{leadStats.interested}</>}
              </p>
            </div>
            <div className="w-[2px] h-full bg-zinc-100" />
            <div className="flex flex-col gap-1 mx-auto">
              <p className="">Lost leads</p>
              <p className="text-4xl font-bold">
                {loading ? <Spinner /> : <>{leadStats.lost}</>}
              </p>
            </div>
            <div className="w-[2px] h-full bg-zinc-100" />
            <div className="flex flex-col gap-1 mx-auto">
              <p className="">Total</p>
              <p className="text-4xl font-bold">
                {loading ? <Spinner /> : <>{leadStats.total}</>}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-row gap-4 flex-grow">
            <div className="bg-gradient-to-b from-emerald-100 to-green-50 rounded-full p-3 my-auto">
              <BiDollar size={48} color="#00AC4F" />
            </div>
            <div className="flex flex-col gap-1 mx-auto">
              <p className="text-gray-400 font-medium">Total</p>
              <p className="text-4xl font-bold">
                $198k
                {/* --StatsPending-- */}
              </p>
              <p className="flex flex-row gap-1 items-center">
                <BsArrowUp color="#00AC4F" size={18} />
                <span className="text-green-600 font-medium">
                  38%{/* --StatsPending-- */}
                </span>
                <span className="font-medium">this month</span>
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-row gap-4 flex-grow">
            <div className="bg-gradient-to-b from-emerald-100 to-green-50 rounded-full p-3 my-auto">
              <BiDollar size={48} color="#00AC4F" />
            </div>
            <div className="flex flex-col gap-1 mx-auto">
              <p className="text-gray-400 font-medium">Upcoming events</p>
              <p className="text-4xl font-bold">
                2nd Sept{/* --StatsPending-- */}
              </p>
              <p className="flex flex-row gap-1 items-center text-rose-900 font-semibold">
                Karan reception{/* --StatsPending-- */}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center flex-grow">
            <p className="text-gray-400 font-medium">Events to be approved</p>
            <p className="text-4xl font-bold">
              {loading ? <Spinner /> : <>{eventsPendingApproval}</>}
            </p>
          </div>
        </div>
        <div className="bg-[#f8f8f8] rounded-2xl shadow-lg flex flex-col">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-row gap-2 justify-between">
            <p className="font-semibold">NOTIFICATIONS</p>
            {notificationOpen ? (
              <BsChevronUp
                size={24}
                onClick={() => setNotificationsOpen(false)}
                className="cursor-pointer"
              />
            ) : (
              <BsChevronDown
                size={24}
                onClick={() => setNotificationsOpen(true)}
                className="cursor-pointer"
              />
            )}
          </div>
          {notificationOpen && (
            <>
              <div className="p-4">
                <p>Hello</p>
              </div>
              <div className="bg-white p-4">
                <p>Hello</p>
              </div>
              <div className="p-4">
                <p>Hello</p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
