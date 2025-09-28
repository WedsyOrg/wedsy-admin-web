import {
  MdDelete,
  MdEditDocument,
  MdOpenInNew,
  MdPayments,
  MdRemoveRedEye,
} from "react-icons/md";
import { BsPlus, BsSearch } from "react-icons/bs";
import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Pagination,
  Select,
  Spinner,
  Table,
  TextInput,
} from "flowbite-react";
import { toProperCase } from "@/utils/text";
import Link from "next/link";
import { HiCurrencyRupee } from "react-icons/hi";

export default function Decor({ user }) {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("");
  const [status, setStatus] = useState("");
  const [stats, setStats] = useState({
    totalAmount: 0,
    amountPaid: 0,
    amountDue: 0,
  });
  const fetchList = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/payment?page=${
        page || 1
      }&limit=${itemsPerPage}${sort && `&sort=${sort}`}${
        status && `&status=${status}`
      }&paymentFor=event`,
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
        const { totalAmount, amountPaid, amountDue } = response;
        setLoading(false);
        setList(response.list);
        setTotalPages(response.totalPages);
        setStats({ totalAmount, amountPaid, amountDue });
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
  return (
    <>
      <div className="p-8 flex flex-col gap-6 relative">
        {loading && (
          <div className="absolute left-1/2 grid place-content-center h-screen z-50 -translate-x-1/2">
            <Spinner size="xl" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-lg">Filter by:</p>
          <div className="flex flex-row gap-6">
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
            <Button
              color="dark"
              onClick={() => {
                setStatus("");
                setSort("");
                setItemsPerPage(10);
              }}
              disabled={loading}
            >
              Reset
            </Button>
          </div>
        </div>
        {/* Payment Stats */}
        <div className="bg-white rounded-3xl shadow-lg p-6 flex flex-row gap-2">
          <div className="border-2 rounded-full p-3">
            <MdPayments size={48} />
          </div>
          <div className="flex flex-row flex-grow text-center">
            <div className="flex flex-col gap-1 mx-auto">
              <p className="">Total Amount</p>
              <p className="text-4xl font-bold">
                {!loading && "₹" + stats.totalAmount / 100}
              </p>
            </div>
            <div className="w-[2px] h-full bg-zinc-100" />
            <div className="flex flex-col gap-1 mx-auto text-green-500">
              <p className="">Amount Received</p>
              <p className="text-4xl font-bold">
                {!loading && "₹" + stats.amountPaid / 100}
              </p>
            </div>
            <div className="w-[2px] h-full bg-zinc-100" />
            <div className="flex flex-col gap-1 mx-auto text-red-500">
              <p className="">Amount Due</p>
              <p className="text-4xl font-bold ">
                {!loading && "₹" + stats.amountDue / 100}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl flex-col flex gap-3 shadow-xl">
          <div className="flex flex-row justify-between items-center pt-4 px-12">
            <div className="flex flex-col">
              <p className="text-lg font-medium">All Payments</p>
            </div>
            <div className="flex flex-row gap-4">
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
                <Table.HeadCell>User Name</Table.HeadCell>
                <Table.HeadCell>Event</Table.HeadCell>
                <Table.HeadCell>Amount</Table.HeadCell>
                <Table.HeadCell>Paid</Table.HeadCell>
                <Table.HeadCell>Due</Table.HeadCell>
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
                      {item.user.name}
                    </Table.Cell>
                    <Table.Cell>
                      {item.event.name}/
                      {
                        item.event.eventDays.find(
                          (rec) => rec._id == item.eventDay
                        )?.name
                      }
                    </Table.Cell>
                    <Table.Cell className="font-medium">
                      ₹{item.amount / 100}
                    </Table.Cell>
                    <Table.Cell className="text-green-500 font-medium">
                      ₹{item.amountPaid / 100}
                    </Table.Cell>
                    <Table.Cell className="text-red-500 font-medium">
                      ₹{item.amountDue / 100}
                    </Table.Cell>
                    <Table.Cell>
                      {toProperCase(item.status.split("_").join(" "))}
                    </Table.Cell>
                    <Table.Cell>
                      {item.status === "paid" && (
                        <Link
                          href={`/payments/${item._id}/invoice`}
                          className="text-black font-medium hover:text-blue-500"
                          target="_blank"
                        >
                          Invoice
                        </Link>
                      )}
                    </Table.Cell>
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
