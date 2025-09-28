import NotificationCard from "@/components/cards/NotificationCard";
import VendorHeaderDropdown from "@/components/dropdown/VendorHeaderDropdown";
import { Select, TextInput } from "flowbite-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Notification({}) {
  const router = useRouter();
  const { vendorId } = router.query;
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState({});
  const [list, setList] = useState([]);
  const [dateFilter, setDateFilter] = useState(["", ""]);
  const [filter, setFilter] = useState("Date");
  const fetchNotifications = () => {
    setLoading(true);
    fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/notification?category=Vendor&vendor=${vendorId}${
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
  const fetchVendor = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/${vendorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setVendor(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    if (vendorId) {
      fetchVendor();
      fetchNotifications();
    }
  }, [vendorId]);
  useEffect(() => {
    if (vendorId) {
      fetchNotifications();
    }
  }, [dateFilter]);
  return (
    <>
      <div className="p-8 flex flex-col gap-6">
        <div>
          <div className="grid grid-cols-4 gap-4 items-end">
            <p className="text-xl font-medium col-span-3">
              {vendor.name} Notifications
            </p>
            <VendorHeaderDropdown
              display={"Notifications"}
              vendorId={vendorId}
            />
          </div>
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
        <NotificationCard list={list} />
      </div>
    </>
  );
}
