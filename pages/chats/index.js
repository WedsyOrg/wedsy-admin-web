import NotificationCard from "@/components/cards/NotificationCard";
import StatsCard from "@/components/cards/StatsCard";
import StatsIconCard from "@/components/cards/StatsIconCard";
import VendorHeaderDropdown from "@/components/dropdown/VendorHeaderDropdown";
import HorizontalLine from "@/components/other/HorizontalLine";
import {
  Button,
  Checkbox,
  Label,
  Modal,
  Pagination,
  Select,
  Table,
  TextInput,
  ToggleSwitch,
  Tooltip,
} from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiPlus, BiRupee } from "react-icons/bi";
import { BsArrowUp, BsPlus, BsSearch } from "react-icons/bs";
import { MdOpenInNew } from "react-icons/md";

export default function Vendor({ message, setMessage }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("");
  const [totalOngoinChats, setTotalOngoingChats] = useState(0);
  const [chats, setChats] = useState([]);

  const fetchStats = () => {
    setLoading(true);
    Promise.all([
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stats?key=total-ongoing-chats`,
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
        setTotalOngoingChats(result[0]?.stats);
      }
      setLoading(false);
    });
  };

  const fetchChats = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setChats(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  useEffect(() => {
    fetchChats();
    fetchStats();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-6 p-8">
        <div>
          <h2 className="text-2xl font-semibold">Main Chats</h2>
        </div>
        <p className="text-lg font-medium">Total</p>
        <div className="grid grid-cols-6 gap-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
            <p className="text-gray-800 font-medium">Ongoing Chats</p>
            <p className="text-4xl py-4 font-bold">{totalOngoinChats}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-lg">Filter by:</p>
          <div className="grid grid-cols-6 gap-6 gap-y-2">
            <div>
              <Select disabled={loading}>
                <option value={""}>Event Date</option>
              </Select>
            </div>
            <div>
              <Select disabled={loading}>
                <option value={""}>Booked</option>
              </Select>
            </div>
            <div>
              <Select disabled={loading}>
                <option value={""}>Package Name</option>
              </Select>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl flex-col flex gap-3 shadow-xl">
          <div className="flex flex-row justify-between items-center pt-4 px-12">
            <div className="flex flex-col">
              <p className="text-lg font-medium">Packages</p>
            </div>
            <div className="flex flex-row gap-4">
              <TextInput
                icon={BsSearch}
                id="search"
                placeholder="search"
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <Select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                }}
                disabled={loading}
              >
                <option value={""}>Sort By:</option>
              </Select>
              <Select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(e.target.value);
                }}
                disabled={loading}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Select>
            </div>
          </div>
          <div className="width-full overflow-x-auto">
            <Table hoverable className="width-full overflow-x-auto">
              <Table.Head>
                <Table.HeadCell className="p-4">
                  <Checkbox className="sr-only" />
                </Table.HeadCell>
                <Table.HeadCell>Customer Name</Table.HeadCell>
                <Table.HeadCell>Phone Number</Table.HeadCell>
                <Table.HeadCell>Event Day</Table.HeadCell>
                <Table.HeadCell>No.of Events</Table.HeadCell>
                <Table.HeadCell>Source</Table.HeadCell>
                <Table.HeadCell>Price</Table.HeadCell>
                <Table.HeadCell>Chats</Table.HeadCell>
                <Table.HeadCell>Vendor Booked</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {chats?.map((item, index) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={item._id}
                  >
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      <a
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 relative"
                        href={`/chats/${item._id}`}
                        target="_blank"
                      >
                        {item?.user?.name}
                      </a>
                    </Table.Cell>
                    <Table.Cell>{item?.user?.phone}</Table.Cell>
                    <Table.Cell>{""}</Table.Cell>
                    <Table.Cell>{""}</Table.Cell>
                    <Table.Cell>{""}</Table.Cell>
                    <Table.Cell>{""}</Table.Cell>
                    <Table.Cell>{""}</Table.Cell>
                    <Table.Cell>{item?.vendor?.name}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
          <div className="p-4 mb-4 mx-auto">
            <Pagination
              currentPage={page}
              layout="pagination"
              nextLabel=""
              onPageChange={(newPage) => {
                setPage(newPage);
              }}
              previousLabel=""
              showIcons
              totalPages={Math.ceil(chats.length / itemsPerPage)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
