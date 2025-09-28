import NotificationCard from "@/components/cards/NotificationCard";
import StatsCard from "@/components/cards/StatsCard";
import StatsIconCard from "@/components/cards/StatsIconCard";
import VendorHeaderDropdown from "@/components/dropdown/VendorHeaderDropdown";
import HorizontalLine from "@/components/other/HorizontalLine";
import { uploadFile } from "@/utils/file";
import { toPriceString } from "@/utils/text";
import {
  Button,
  Checkbox,
  FileInput,
  Label,
  Modal,
  Select,
  Table,
  Textarea,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function Vendor({ message, setMessage }) {
  const router = useRouter();
  const { vendorId } = router.query;
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState({});
  const [stats, setStats] = useState(null);
  const [statsFor, setStatsFor] = useState("");
  const [callList, setCallList] = useState([]);

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
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchVendorStats = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stats?vendor=${vendorId}&key=vendor-analytics`,
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
        if (response?.message === "success") {
          setStats(response?.stats);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchVendorStatList = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stats/list?vendor=${vendorId}&key=vendor-call`,
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
        if (response?.message === "success") {
          setCallList(response?.list);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    if (vendorId) {
      fetchVendor();
      fetchVendorStats();
      fetchVendorStatList();
    }
  }, [vendorId]);
  return (
    <>
      <div className="flex flex-col gap-6 p-8">
        <div className="grid grid-cols-4 gap-4 items-end">
          <p className="text-xl font-medium col-span-3">{vendor.name}</p>
          <VendorHeaderDropdown display={"Analytics"} vendorId={vendorId} />
        </div>
        <div className="flex flex-row gap-4 items-end">
          <div>
            <Label value="Registration Date" />
            <TextInput
              value={new Date(vendor.registrationDate).toLocaleString()}
              readOnly={true}
            />
          </div>
          <div>
            <Label value="Phone" />
            <TextInput value={vendor.phone} readOnly={true} />
          </div>
          <div>
            <Label value="Email" />
            <TextInput value={vendor.email} readOnly={true} />
          </div>
        </div>
        <div className="grid grid-cols-6 gap-4">
          <Select
            value={statsFor}
            onChange={(e) => {
              setStatsFor(e.target.value);
            }}
            disabled={loading}
          >
            <option value={""}>Select</option>
            {stats?.map((stat, index) => (
              <option value={`${stat.year}-${stat.month}`} key={index}>{`${
                monthNames[stat.month - 1]
              } ${stat.year}`}</option>
            ))}
          </Select>
          <div className="col-span-5" />
          {/* --StatsPending-- */}
          <StatsCard
            title={"Calls"}
            value={
              statsFor === ""
                ? stats?.reduce((sum, stat) => sum + stat.calls, 0)
                : stats?.find(
                    (stat) => `${stat.year}-${stat.month}` === statsFor
                  )?.calls || "0"
            }
          />
          {/* --StatsPending-- */}
          <StatsCard
            title={"Chats"}
            value={
              statsFor === ""
                ? stats?.reduce((sum, stat) => sum + stat.chats, 0)
                : stats?.find(
                    (stat) => `${stat.year}-${stat.month}` === statsFor
                  )?.chats || "0"
            }
          />
        </div>
        <div className="width-full overflow-x-auto">
          <Table hoverable className="width-full overflow-x-auto">
            <Table.Head>
              <Table.HeadCell className="p-4">
                <Checkbox className="sr-only" />
              </Table.HeadCell>
              <Table.HeadCell>Customer Name</Table.HeadCell>
              <Table.HeadCell>Phone Number</Table.HeadCell>
              <Table.HeadCell>Date & Time</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {callList?.map((item, index) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={item._id}
                >
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <p className="font-medium text-cyan-600 dark:text-cyan-500 relative">
                      {item?.user?.name}
                    </p>
                  </Table.Cell>
                  <Table.Cell>{item?.user?.phone}</Table.Cell>
                  <Table.Cell>
                    {new Date(item?.createdAt).toLocaleString()}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </>
  );
}
