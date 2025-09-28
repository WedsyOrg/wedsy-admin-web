import NotificationCard from "@/components/cards/NotificationCard";
import StatsCard from "@/components/cards/StatsCard";
import StatsIconCard from "@/components/cards/StatsIconCard";
import VendorHeaderDropdown from "@/components/dropdown/VendorHeaderDropdown";
import HorizontalLine from "@/components/other/HorizontalLine";
import { toPriceString, toProperCase } from "@/utils/text";
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
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("");
  const [status, setStatus] = useState("");
  const [showMakeupPaymentsTotal, setShowMakeupPaymentsTotal] = useState(
    "makeup-payments-total-today"
  );
  const [makeupPaymentsTotalToday, setMakeupPaymentsTotalToday] = useState(0);
  const [makeupPaymentsTotalMonth, setMakeupPaymentsTotalMonth] = useState(0);
  const [makeupPaymentsTotalOverall, setMakeupPaymentsTotalOverall] =
    useState(0);

  const fetchStats = () => {
    setLoading(true);
    Promise.all([
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stats?key=makeup-payments-total-today`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ).then((response) => response.json()),
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stats?key=makeup-payments-total-month`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ).then((response) => response.json()),
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stats?key=makeup-payments-total-overall`,
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
        setMakeupPaymentsTotalToday(result[0]?.stats);
      }
      if (result[1]?.message === "success") {
        setMakeupPaymentsTotalMonth(result[1]?.stats);
      }
      if (result[2]?.message === "success") {
        setMakeupPaymentsTotalOverall(result[2]?.stats);
      }
      setLoading(false);
    });
  };

  const fetchList = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/payment?page=${
        page || 1
      }&limit=${itemsPerPage}${sort && `&sort=${sort}`}${
        status && `&status=${status}`
      }&paymentFor=makeup-and-beauty`,
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
        setTotalPages(response.totalPages);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    fetchList();
  }, [page]);
  useEffect(() => {
    if (page === 1) {
      fetchList();
    } else {
      setPage(1);
    }
  }, [itemsPerPage, sort, status]);

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-6 p-8">
        <div>
          <h2 className="text-2xl font-semibold">Makeup Payments</h2>
        </div>
        <div className="grid grid-cols-6 gap-6 gap-y-2">
          <div>
            <Select
              disabled={loading}
              value={showMakeupPaymentsTotal}
              onChange={(e) => {
                setShowMakeupPaymentsTotal(e.target.value);
              }}
            >
              <option value={"makeup-payments-total-today"}>Today</option>
              <option value={"makeup-payments-total-month"}>Month</option>
              <option value={"makeup-payments-total-overall"}>Overall</option>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-6 gap-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
            <p className="text-gray-800 font-medium">Total</p>
            <p className="text-4xl py-4 font-bold">
              {showMakeupPaymentsTotal === "makeup-payments-total-today" &&
                (toPriceString(makeupPaymentsTotalToday) || "0")}
              {showMakeupPaymentsTotal === "makeup-payments-total-month" &&
                (toPriceString(makeupPaymentsTotalMonth) || "0")}
              {showMakeupPaymentsTotal === "makeup-payments-total-overall" &&
                (toPriceString(makeupPaymentsTotalOverall) || "0")}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-lg">Filter by:</p>
          <div className="grid grid-cols-6 gap-6 gap-y-2">
            <div>
              <Select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
                disabled={loading}
              >
                <option value={""}>Status</option>
                {[
                  "null",
                  "created",
                  "attempted",
                  "paid",
                  "partially_paid",
                  "expired",
                  "canceled",
                ].map((item, index) => (
                  <option value={item} key={index}>
                    {toProperCase(item.split("_").join(" "))}
                  </option>
                ))}
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
                <option value={"Amount:Low-to-High"}>Amount:Low to High</option>
                <option value={"Amount:High-to-Low"}>Amount:High to Low</option>
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
                <Table.HeadCell>Client Name</Table.HeadCell>
                <Table.HeadCell>Transaction ID</Table.HeadCell>
                <Table.HeadCell>Date</Table.HeadCell>
                <Table.HeadCell>Amount</Table.HeadCell>
                <Table.HeadCell>Payment Mode</Table.HeadCell>
                <Table.HeadCell>Order ID</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Invoice</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {list?.map((item, index) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={item._id}
                  >
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      <p
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 relative"
                        target="_blank"
                      >
                        {item?.user?.name}
                      </p>
                    </Table.Cell>
                    <Table.Cell>{item?._id}</Table.Cell>
                    <Table.Cell>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>{toPriceString(item.amount / 100)}</Table.Cell>
                    <Table.Cell>{toProperCase(item?.paymentMethod)}</Table.Cell>
                    <Table.Cell>{item?.order?._id}</Table.Cell>
                    <Table.Cell>{toProperCase(item.status)}</Table.Cell>
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
