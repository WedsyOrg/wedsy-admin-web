import NotificationCard from "@/components/cards/NotificationCard";
import { Select } from "flowbite-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiRupee } from "react-icons/bi";
import { BsArrowUp } from "react-icons/bs";
import { MdOpenInNew } from "react-icons/md";

export default function Dashboard({}) {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [orderStats, setOrderStats] = useState("today");
  const [totalVendors, setTotalVendors] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [todayOrderWedsyPackages, setTodayOrderWedsyPackages] = useState(0);
  const [todayOrderPersonalPackages, setTodayOrderPersonalPackages] =
    useState(0);
  const [todayOrderBidding, setTodayOrderBidding] = useState(0);
  const [tomorrowOrderWedsyPackages, setTomorrowOrderWedsyPackages] =
    useState(0);
  const [tomorrowOrderPersonalPackages, setTomorrowOrderPersonalPackages] =
    useState(0);
  const [tomorrowOrderBidding, setTomorrowOrderBidding] = useState(0);

  const fetchStats = () => {
    setLoading(true);
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats?key=total-users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((response) => response.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats?key=total-vendors`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((response) => response.json()),
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stats?key=today-order-wedsy-packages`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ).then((response) => response.json()),
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stats?key=today-order-personal-packages`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ).then((response) => response.json()),
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stats?key=today-order-bidding`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ).then((response) => response.json()),
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stats?key=tomorrow-order-wedsy-packages`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ).then((response) => response.json()),
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stats?key=tomorrow-order-personal-packages`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ).then((response) => response.json()),
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stats?key=tomorrow-order-bidding`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ).then((response) => response.json()),
    ]).then((result) => {
      if (result[0]?.message === "success") {
        setTotalUsers(result[0]?.stats);
      }
      if (result[1]?.message === "success") {
        setTotalVendors(result[1]?.stats);
      }
      if (result[2]?.message === "success") {
        setTodayOrderWedsyPackages(result[2]?.stats);
      }
      if (result[3]?.message === "success") {
        setTodayOrderPersonalPackages(result[3]?.stats);
      }
      if (result[4]?.message === "success") {
        setTodayOrderBidding(result[4]?.stats);
      }
      if (result[2]?.message === "success") {
        setTomorrowOrderWedsyPackages(result[5]?.stats);
      }
      if (result[3]?.message === "success") {
        setTomorrowOrderPersonalPackages(result[6]?.stats);
      }
      if (result[4]?.message === "success") {
        setTomorrowOrderBidding(result[7]?.stats);
      }
      setLoading(false);
    });
  };
  const fetchNotifications = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/notification/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setNotifications(response.list);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    fetchNotifications();
    fetchStats();
  }, []);
  return (
    <>
      <div className="p-8 flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-semibold">Wedsy MAKEUP Dashboard</h2>
        </div>
        <div>
          <p className="text-lg font-medium">Vendor Details</p>
          <div className="grid grid-cols-6 gap-4 py-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
              <p className="text-gray-800 font-medium">Total Vendors</p>
              <p className="text-4xl py-4 font-bold">{totalVendors}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
              <p className="text-gray-800 font-medium">Total Users</p>
              <p className="text-4xl py-4 font-bold">{totalUsers}</p>
            </div>
          </div>
        </div>
        <div>
          <p className="text-lg font-medium">Orders</p>
          <div className="grid grid-cols-5 gap-4 py-4">
            <Select
              value={orderStats}
              onChange={(e) => {
                setOrderStats(e.target.value);
              }}
            >
              <option value={"today"}>Today</option>
              <option value={"tomorrow"}>Tomorrow</option>
            </Select>
          </div>
          <div className="grid grid-cols-6 gap-4 py-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
              <p className="text-gray-800 font-medium">Packages</p>
              <p className="text-4xl py-4 font-bold">
                {orderStats === "today" && todayOrderWedsyPackages}
                {orderStats === "tomorrow" && tomorrowOrderWedsyPackages}
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
              <p className="text-gray-800 font-medium">Bids</p>
              <p className="text-4xl py-4 font-bold">
                {orderStats === "today" && todayOrderBidding}
                {orderStats === "tomorrow" && tomorrowOrderBidding}
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
              <p className="text-gray-800 font-medium">Personal</p>
              <p className="text-4xl py-4 font-bold">
                {orderStats === "today" && todayOrderPersonalPackages}
                {orderStats === "tomorrow" && tomorrowOrderPersonalPackages}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4 py-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
              <p className="text-gray-800 font-medium">Total Revenue</p>
              {/* --StatsPending-- */}
              <p className="text-4xl font-bold">0</p>
              <p className="flex flex-row gap-1 items-center">
                <BsArrowUp color="#00AC4F" size={18} />
                <span className="text-green-600 font-medium">0%</span>
                <span className="font-medium">this month</span>
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
              <p className="text-gray-800 font-medium">Avg. Monthly Revenue</p>
              {/* --StatsPending-- */}
              <p className="text-4xl py-4 font-bold text-rose-900">0</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
              <p className="text-gray-800 font-medium">Last Monthly Revenue</p>
              {/* --StatsPending-- */}
              <p className="text-4xl py-4 font-bold text-rose-900">0</p>
            </div>
          </div>
        </div>
        <div>
          <p className="text-lg font-medium">Total Bidding Information</p>
          <div className="grid grid-cols-6 gap-4 py-4">
            <div className="col-span-2 bg-white rounded-2xl shadow-lg p-6 flex flex-row gap-4 items-center justify-evenly">
              <div className="bg-gradient-to-b from-emerald-100 to-green-50 rounded-full p-3">
                <BiRupee size={64} color="#00AC4F" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-gray-400 font-medium">Total Sales</p>
                {/* --StatsPending-- */}
                <p className="text-4xl font-bold">0</p>
                <p className="flex flex-row gap-1 items-center">
                  <BsArrowUp color="#00AC4F" size={18} />
                  <span className="text-green-600 font-medium">0%</span>
                  <span className="font-medium">this month</span>
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
              <p className="text-gray-800 font-medium">Bids Received</p>
              {/* --StatsPending-- */}
              <p className="text-4xl py-4 font-bold">0</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
              <p className="text-gray-800 font-medium">Bids Sent</p>
              {/* --StatsPending-- */}
              <p className="text-4xl py-4 font-bold">0</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
              <p className="text-gray-800 font-medium">Bids Confirmed</p>
              {/* --StatsPending-- */}
              <p className="text-4xl py-4 font-bold">0</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
              <p className="text-gray-800 font-medium">In Negotiation</p>
              {/* --StatsPending-- */}
              <p className="text-4xl py-4 font-bold">0</p>
            </div>
          </div>
        </div>
        <div>
          <p className="text-lg font-medium">Wedsy Packages Information</p>
          <div className="grid grid-cols-6 gap-4 py-4">
            <div className="col-span-2 bg-white rounded-2xl shadow-lg p-6 flex flex-row gap-4 items-center justify-evenly">
              <div className="bg-gradient-to-b from-emerald-100 to-green-50 rounded-full p-3">
                <BiRupee size={64} color="#00AC4F" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-gray-400 font-medium">Total Sales</p>
                {/* --StatsPending-- */}
                <p className="text-4xl font-bold">0</p>
                <p className="flex flex-row gap-1 items-center">
                  <BsArrowUp color="#00AC4F" size={18} />
                  <span className="text-green-600 font-medium">0%</span>
                  <span className="font-medium">this month</span>
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
              <p className="text-gray-800 font-medium">Packages Received</p>
              {/* --StatsPending-- */}
              <p className="text-4xl py-4 font-bold">0</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
              <p className="text-gray-800 font-medium">Packages Accepted</p>
              {/* --StatsPending-- */}
              <p className="text-4xl py-4 font-bold">0</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
              <p className="text-gray-800 font-medium">Packages Completed</p>
              {/* --StatsPending-- */}
              <p className="text-4xl py-4 font-bold">0</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
              <p className="text-gray-800 font-medium">Packages Declined</p>
              {/* --StatsPending-- */}
              <p className="text-4xl py-4 font-bold">0</p>
            </div>
          </div>
        </div>
        <div>
          <p className="text-lg font-medium">Personal Packages Information</p>
          <div className="grid grid-cols-6 gap-4 py-4">
            <div className="col-span-2 bg-white rounded-2xl shadow-lg p-6 flex flex-row gap-4 items-center justify-evenly">
              <div className="bg-gradient-to-b from-emerald-100 to-green-50 rounded-full p-3">
                <BiRupee size={64} color="#00AC4F" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-gray-400 font-medium">Total Sales</p>
                {/* --StatsPending-- */}
                <p className="text-4xl font-bold">0</p>
                <p className="flex flex-row gap-1 items-center">
                  <BsArrowUp color="#00AC4F" size={18} />
                  <span className="text-green-600 font-medium">0%</span>
                  <span className="font-medium">this month</span>
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
              <p className="text-gray-800 font-medium">Packages Received</p>
              {/* --StatsPending-- */}
              <p className="text-4xl py-4 font-bold">0</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
              <p className="text-gray-800 font-medium">Packages Accepted</p>
              {/* --StatsPending-- */}
              <p className="text-4xl py-4 font-bold">0</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
              <p className="text-gray-800 font-medium">Packages Completed</p>
              {/* --StatsPending-- */}
              <p className="text-4xl py-4 font-bold">0</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
              <p className="text-gray-800 font-medium">Packages Declined</p>
              {/* --StatsPending-- */}
              <p className="text-4xl py-4 font-bold">0</p>
            </div>
          </div>
        </div>
        <div>
          <p className="text-lg font-medium">Ongoing chats</p>
          <div className="grid grid-cols-6 gap-4 py-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
              <p className="text-gray-800 font-medium">Total Chats</p>
              {/* --StatsPending-- */}
              <p className="text-4xl py-4 font-bold">0</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
              <p className="text-gray-800 font-medium">Bidding Chats</p>
              {/* --StatsPending-- */}
              <p className="text-4xl py-4 font-bold">0</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
              <p className="text-gray-800 font-medium">Package Chats</p>
              {/* --StatsPending-- */}
              <p className="text-4xl py-4 font-bold">0</p>
            </div>
          </div>
        </div>
        <NotificationCard link={"/notifications"} list={notifications.slice(0, 6 )} display={"10"}/>
      </div>
    </>
  );
}
