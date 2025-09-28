import NotificationCard from "@/components/cards/NotificationCard";
import StatsCard from "@/components/cards/StatsCard";
import StatsIconCard from "@/components/cards/StatsIconCard";
import VendorLastActiveCard from "@/components/cards/VendorLastActiveCard";
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
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("");
  const [dateFilter, setDateFilter] = useState(["", ""]);
  const fetchOrders = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setOrders(response);
        setTotalPages(Math.ceil(response.length / itemsPerPage));
        if (page > Math.ceil(response.length / itemsPerPage)) {
          setPage(1);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    setTotalPages(Math.ceil(orders.length / itemsPerPage));
    setPage(1);
  }, [itemsPerPage]);
  useEffect(() => {
    fetchOrders();
  }, []);
  return (
    <>
      <div className="flex flex-col gap-6 p-8">
        <div>
          <h2 className="text-2xl font-semibold">Main Orders</h2>
        </div>
        <div className="grid grid-cols-5 gap-4">
          <Select>
            <option>Today</option>
          </Select>
        </div>
        <div className="grid grid-cols-6 gap-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
            <p className="text-gray-800 font-medium">Packages</p>
            <p className="text-4xl py-4 font-bold">12</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
            <p className="text-gray-800 font-medium">Bids</p>
            <p className="text-4xl py-4 font-bold">23</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
            <p className="text-gray-800 font-medium">Personal</p>
            <p className="text-4xl py-4 font-bold">12</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-lg">Filter by:</p>
          <div className="grid grid-cols-6 gap-6 gap-y-2">
            <div>
              <Select disabled={loading}>
                <option value={""}>Select Source</option>
                <option value={"Bidding"}>Bidding</option>
              </Select>
            </div>
            <div className="col-span-2">
              <div className="grid grid-cols-2 gap-2">
                <TextInput
                  type="date"
                  // value={dateFilter[0]}
                  // onChange={(e) => {
                  //   setDateFilter([e.target.value, dateFilter[1]]);
                  // }}
                  disabled={loading}
                />
                <TextInput
                  type="date"
                  // value={dateFilter[1]}
                  // onChange={(e) => {
                  //   setDateFilter([dateFilter[0], e.target.value]);
                  // }}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl flex-col flex gap-3 shadow-xl">
          <div className="flex flex-row justify-between items-center pt-4 px-12">
            <div className="flex flex-col">
              <p className="text-lg font-medium">Orders</p>
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
                <option value={"Orders (Highest to Lowest)"}>
                  Orders (Highest to Lowest)
                </option>
                <option value={"Orders (Lowest to Highest)"}>
                  Orders (Lowest to Highest)
                </option>
                <option value={"Newest (Registration)"}>
                  Newest (Registration)
                </option>
                <option value={"Older (Registration)"}>
                  Older (Registration)
                </option>
                <option value={"Alphabetical Order"}>Alphabetical Order</option>
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
                <Table.HeadCell>Balance</Table.HeadCell>
                <Table.HeadCell>Vendor Booked</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {orders
                  ?.filter(
                    (_, i) =>
                      i > (page - 1) * itemsPerPage && i <= page * itemsPerPage
                  )
                  ?.map((item, index) => (
                    <Table.Row
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      key={item._id}
                    >
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        <a
                          className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 relative"
                          href={`/makeup/orders/${item._id}`}
                          target="_blank"
                        >
                          {item?.user?.name}
                        </a>
                      </Table.Cell>
                      <Table.Cell>{item?.user?.phone}</Table.Cell>
                      <Table.Cell>
                        {item.source === "Personal-Package" &&
                          item?.vendorPersonalPackageBooking?.date}
                        {item.source === "Wedsy-Package" &&
                          item?.wedsyPackageBooking?.date}
                        {item.source === "Bidding" &&
                          item?.biddingBooking?.events[0]?.date}
                      </Table.Cell>
                      <Table.Cell>
                        {item.source === "Bidding"
                          ? item?.biddingBooking?.events?.length
                          : "1"}
                      </Table.Cell>
                      <Table.Cell>{item?.source}</Table.Cell>
                      <Table.Cell>{item?.amount?.total}</Table.Cell>
                      <Table.Cell>{item?.amount?.due}</Table.Cell>
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
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </>
  );
}
