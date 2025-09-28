import {
  MdDelete,
  MdEditDocument,
  MdOpenInNew,
  MdPayments,
  MdRemoveRedEye,
  MdSearch,
} from "react-icons/md";
import { BsPlus, BsSearch } from "react-icons/bs";
import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Modal,
  Pagination,
  Select,
  Spinner,
  Table,
  TextInput,
} from "flowbite-react";
import { toPriceString, toProperCase } from "@/utils/text";
import Link from "next/link";
import { HiCurrencyRupee } from "react-icons/hi";

export default function Decor({ user }) {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [orders, setOrders] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState("");
  const [stats, setStats] = useState({
    totalAmount: 0,
    amountPaid: 0,
    amountDue: 0,
  });
  const [viewOrder, setViewOrder] = useState("");
  const fetchList = () => {
    setLoading(true);
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/settlements/transfer`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((response) => response.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((response) => response.json()),
    ])
      .then((response) => {
        let [settlementsResponse, ordersResponse] = response;
        ordersResponse = ordersResponse.filter(
          (item) =>
            item?.status?.finalized &&
            item.source !== "Bidding" &&
            (item?.source === "Personal-Package"
              ? new Date().toLocaleDateString() >=
                new Date(
                  item?.vendorPersonalPackageBooking?.date
                )?.toLocaleDateString()
              : item?.source === "Wedsy-Package"
              ? new Date().toLocaleDateString() >=
                new Date(item?.wedsyPackageBooking?.date)?.toLocaleDateString()
              : false) &&
            item?.amount?.due <= 0
        );
        setOrders(ordersResponse);
        setSettlements(settlementsResponse);
        let total = Math.ceil(ordersResponse.length / itemsPerPage);
        setTotalPages(total);
        if (page > total) {
          setPage(1);
        }
        const { totalAmount, amountPaid, amountDue } = ordersResponse.reduce(
          (acc, order) => {
            acc.totalAmount += order.amount?.payableToVendor;
            acc.amountPaid += order.amount?.receivedByVendor;
            acc.amountDue +=
              order.amount?.payableToVendor - order.amount?.receivedByVendor;
            return acc;
          },
          { totalAmount: 0, amountPaid: 0, amountDue: 0 }
        );
        setStats({ totalAmount, amountPaid, amountDue });
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const CompleteOrder = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/${viewOrder}/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          alert("Order Completed Successfully");
        }
        fetchList();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const SettleOrder = (order) => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/settlements/transfer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        vendor: order?.vendor?._id,
        order: order?._id,
        amount: order?.amount?.payableToVendor,
        vendorRazorPayId: order?.vendor?.razorPay_accountId,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          alert("Settlement Completed Successfully");
        }
        fetchList();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    fetchList();
  }, [page]);
  useEffect(() => {
    let ordersResponse = orders?.filter(
      (order) =>
        (source ? order?.source === source : true) &&
        (status
          ? (status === "Order not Completed" && !order?.status?.completed) ||
            (status === "Settlement Pending" &&
              order?.status?.completed &&
              order?.amount?.payableToVendor -
                order?.amount?.receivedByVendor !==
                0) ||
            (status === "Order Settled" &&
              order?.status?.completed &&
              order?.amount?.payableToVendor -
                order?.amount?.receivedByVendor ===
                0)
          : true) &&
        (search
          ? order?.vendor?.name.toLowerCase().includes(search.toLowerCase()) ||
            order?.user?.name.toLowerCase().includes(search.toLowerCase())
          : true)
    );
    let total = Math.ceil(ordersResponse.length / itemsPerPage);
    setTotalPages(total);
    if (page > total) {
      setPage(1);
    }
  }, [itemsPerPage, sort, status, search, source]);
  return (
    <>
      <Modal dismissible show={viewOrder} onClose={() => setViewOrder("")}>
        <Modal.Header>View Order</Modal.Header>
        <Modal.Body>
          {orders
            ?.filter((item) => item?._id === viewOrder)
            ?.map((item, index) => (
              <div className="space-y-2" key={index}>
                <div>
                  <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    Vendor:{" "}
                    <span className="font-semibold">{item?.vendor?.name}</span>
                  </p>
                  <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    User:{" "}
                    <span className="font-semibold">{item?.user?.name}</span>
                  </p>
                  <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    Source:{" "}
                    <span className="font-semibold">{item?.source}</span>
                  </p>
                </div>
                <div>
                  <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    Total Amount:{" "}
                    <span className="font-semibold">
                      {toPriceString(item?.amount?.total) || "0"}
                    </span>
                  </p>
                  <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    Amount Paid:{" "}
                    <span className="font-semibold">
                      {toPriceString(item?.amount?.paid) || "0"}
                    </span>
                  </p>
                  <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    Amount Due:{" "}
                    <span className="font-semibold">
                      {toPriceString(item?.amount?.due) || "0"}
                    </span>
                  </p>
                  <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    Payable to Wedsy:{" "}
                    <span className="font-semibold">
                      {toPriceString(item?.amount?.payableToWedsy) || "0"}
                    </span>
                  </p>
                  <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    Payable to Vendor:{" "}
                    <span className="font-semibold">
                      {toPriceString(item?.amount?.payableToVendor) || "0"}
                    </span>
                  </p>
                  <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    Received by Wedsy:{" "}
                    <span className="font-semibold">
                      {toPriceString(item?.amount?.receivedByWedsy) || "0"}
                    </span>
                  </p>
                  <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    Received by Vendor:{" "}
                    <span className="font-semibold">
                      {toPriceString(item?.amount?.receivedByVendor) || "0"}
                    </span>
                  </p>
                  <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    Taxes:{" "}
                    <span className="font-semibold">
                      {toPriceString(item?.amount?.cgst + item?.amount?.sgst) ||
                        "0"}
                    </span>
                  </p>
                </div>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  Settlement Transaction Id:{" "}
                  <span className="font-semibold">
                    {
                      settlements?.find((rec) => rec?.order === item?._id)
                        ?.razporPayId
                    }
                  </span>
                </p>
              </div>
            ))}
        </Modal.Body>
        <Modal.Footer>
          <Link
            href={`/orders/${viewOrder}`}
            target="_blank"
            className="mr-auto"
          >
            <Button color="light">View Order</Button>
          </Link>
          {orders
            ?.filter((item) => item?._id === viewOrder)
            ?.map((item, index) => (
              <>
                {!item?.status?.completed && (
                  <Button onClick={() => CompleteOrder()} color="success">
                    Mark Completed
                  </Button>
                )}
                {item?.status?.completed &&
                  item?.amount?.payableToVendor -
                    item?.amount?.receivedByVendor !==
                    0 && (
                    <Button color="dark" onClick={() => SettleOrder(item)}>
                      Settle Vendor Payment
                    </Button>
                  )}
              </>
            ))}
        </Modal.Footer>
      </Modal>
      <div className="p-8 flex flex-col gap-6 relative">
        {loading && (
          <div className="absolute left-1/2 grid place-content-center h-screen z-50 -translate-x-1/2">
            <Spinner size="xl" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-lg">Filter by:</p>
          <div className="flex flex-row gap-6">
            {/* <Select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
              }}
              disabled={loading}
            >
              <option value={""}>Sort By:</option>
              <option value={"Amount:Low-to-High"}>Amount:Low to High</option>
              <option value={"Amount:High-to-Low"}>Amount:High to Low</option>
            </Select> */}
            <Select
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
              }}
              disabled={loading}
            >
              <option value={""}>Source</option>
              <option value={"Personal-Package"}>Personal Packages</option>
              <option value={"Wedsy-Package"}>Wedsy Packages</option>
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
                "Order Settled",
                "Settlement Pending",
                "Order not Completed",
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
                setSearch("");
                setSource("");
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
              <p className="">Total Settlement</p>
              <p className="text-4xl font-bold">
                {!loading && (toPriceString(stats.totalAmount) || "0")}
              </p>
            </div>
            <div className="w-[2px] h-full bg-zinc-100" />
            <div className="flex flex-col gap-1 mx-auto text-green-500">
              <p className="">Settlement Completed</p>
              <p className="text-4xl font-bold">
                {!loading && (toPriceString(stats.amountPaid) || "0")}
              </p>
            </div>
            <div className="w-[2px] h-full bg-zinc-100" />
            <div className="flex flex-col gap-1 mx-auto text-red-500">
              <p className="">Settlement Due</p>
              <p className="text-4xl font-bold ">
                {!loading && (toPriceString(stats.amountDue) || "0")}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl flex-col flex gap-3 shadow-xl">
          <div className="flex flex-row justify-between items-center pt-4 px-12">
            <div className="flex flex-col">
              <p className="text-lg font-medium">All Orders</p>
            </div>
            <div className="flex flex-row gap-4">
              <TextInput
                icon={MdSearch}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
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
                <Table.HeadCell>Event Date</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Vendor Name</Table.HeadCell>
                <Table.HeadCell>User Name</Table.HeadCell>
                <Table.HeadCell>Source</Table.HeadCell>
                <Table.HeadCell>Total Amount</Table.HeadCell>
                <Table.HeadCell>Payable to Wedsy</Table.HeadCell>
                <Table.HeadCell>Payable to Vendor</Table.HeadCell>
                <Table.HeadCell>Paid to Vendor</Table.HeadCell>
                <Table.HeadCell></Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {orders
                  .filter(
                    (order) =>
                      (source ? order?.source === source : true) &&
                      (status
                        ? (status === "Order not Completed" &&
                            !order?.status?.completed) ||
                          (status === "Settlement Pending" &&
                            order?.status?.completed &&
                            order?.amount?.payableToVendor -
                              order?.amount?.receivedByVendor !==
                              0) ||
                          (status === "Order Settled" &&
                            order?.status?.completed &&
                            order?.amount?.payableToVendor -
                              order?.amount?.receivedByVendor ===
                              0)
                        : true) &&
                      (search
                        ? order?.vendor?.name
                            .toLowerCase()
                            .includes(search.toLowerCase()) ||
                          order?.user?.name
                            .toLowerCase()
                            .includes(search.toLowerCase())
                        : true)
                  )
                  ?.filter(
                    (_, i) =>
                      i >= (page - 1) * itemsPerPage && i < page * itemsPerPage
                  )

                  ?.map((item, index) => (
                    <Table.Row
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      key={item._id}
                    >
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell className="font-medium">
                        {item?.source === "Wedsy-Package" &&
                          new Date(
                            item?.wedsyPackageBooking?.date
                          )?.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        {item?.source === "Personal-Package" &&
                          new Date(
                            item?.vendorPersonalPackageBooking?.date
                          )?.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                      </Table.Cell>
                      <Table.Cell className="font-medium">
                        {item?.status?.completed &&
                          item?.amount?.payableToVendor -
                            item?.amount?.receivedByVendor ===
                            0 &&
                          "Order Settled"}
                        {item?.status?.completed &&
                          item?.amount?.payableToVendor -
                            item?.amount?.receivedByVendor !==
                            0 &&
                          "Settlement Pending"}
                        {!item?.status?.completed && "Order not Completed"}
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {item?.vendor?.name}
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {item?.user?.name}
                      </Table.Cell>
                      <Table.Cell>{item?.source}</Table.Cell>
                      <Table.Cell className="font-medium">
                        {toPriceString(item.amount.total) || "0"}
                      </Table.Cell>
                      <Table.Cell className="font-medium">
                        {toPriceString(item.amount.payableToWedsy) || "0"}
                      </Table.Cell>
                      <Table.Cell className="font-medium">
                        {toPriceString(item.amount.payableToVendor) || "0"}
                      </Table.Cell>
                      <Table.Cell className="font-medium">
                        {toPriceString(item.amount.receivedByVendor) || "0"}
                      </Table.Cell>
                      <Table.Cell className="font-medium">
                        <MdRemoveRedEye
                          size={24}
                          cursor={"pointer"}
                          className="flex-shrink-0"
                          onClick={() => {
                            setViewOrder(item?._id);
                          }}
                        />
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
