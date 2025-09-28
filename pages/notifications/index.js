import NotificationCard from "@/components/cards/NotificationCard";
import { Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";

export default function Dashboard({}) {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [dateFilter, setDateFilter] = useState(["", ""]);
  const [filter, setFilter] = useState("Date");
  const fetchNotifications = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/notification/?display=all${
        dateFilter[0]
          ? dateFilter[1]
            ? `&startDate=${dateFilter[0]}&endDate=${dateFilter[1]}`
            : `&date=${dateFilter[0]}`
          : ""
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setList(response.list);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    fetchNotifications();
  }, []);
  useEffect(() => {
    fetchNotifications();
  }, [dateFilter]);
  return (
    <>
      <div className="p-8 flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-semibold">Notifications</h2>
        </div>
        <div>
          <p className="text-lg font-medium">Filter By:</p>
          <div className="grid grid-cols-5 gap-4 py-4">
            <Select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                if (e.target.value === "Date") {
                  setDateFilter([dateFilter[0], ""]);
                }
              }}
            >
              <option value={"Date"}>Date</option>
              <option value={"Date Range"}>Date Range</option>
            </Select>
            <TextInput
              type="date"
              value={dateFilter[0]}
              onChange={(e) => {
                setDateFilter([e.target.value, dateFilter[1]]);
              }}
              disabled={loading}
            />
            {filter === "Date Range" && (
              <TextInput
                type="date"
                value={dateFilter[1]}
                onChange={(e) => {
                  setDateFilter([dateFilter[0], e.target.value]);
                }}
                disabled={loading}
              />
            )}
          </div>
        </div>
        <NotificationCard list={list} display={"all"}/>
      </div>
    </>
  );
}
