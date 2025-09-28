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

export default function Order({ message, setMessage }) {
  const router = useRouter();
  const { orderId } = router.query;
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState({});
  const fetchOrder = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setOrder(response);
        setNotes(response.notes);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);
  return (
    <>
      <div className="flex flex-col gap-6 p-8">
        <div className="grid grid-cols-4 gap-4 items-end">
          <p className="text-xl font-medium col-span-3">Order Details</p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <p className="text-xl font-medium col-span-4">Customer Details</p>
          <div>
            <Label value="Name" />
            <TextInput readOnly placeholder="Name" value={order?.user?.name} />
          </div>
          <div>
            <Label value="Number" />
            <TextInput
              readOnly
              placeholder="Number"
              value={order?.user?.phone}
            />
          </div>
          <div>
            <Label value="Email" />
            <TextInput
              readOnly
              placeholder="Email"
              value={order?.user?.email}
            />
          </div>
          <div />
          <div>
            <Label value="Source" />
            <TextInput
              readOnly
              placeholder="Bidding/Personal/Package"
              value={order?.source}
            />
          </div>
          <div className="col-span-3" />
          <p className="mt-3 text-xl font-medium col-span-4">Vendor Details</p>
          <div>
            <Label value="Name" />
            <TextInput
              readOnly
              placeholder="Name"
              value={order?.vendor?.name}
            />
          </div>
          <div>
            <Label value="Number" />
            <TextInput
              readOnly
              placeholder="Number"
              value={order?.vendor?.phone}
            />
          </div>
          <div>
            <Label value="Email" />
            <TextInput
              readOnly
              placeholder="Email"
              value={order?.vendor?.email}
            />
          </div>
          <div />
          <p className="mt-3 text-xl font-medium col-span-4">
            {order?.source?.replace("-", " ")} Details
          </p>
          <div>
            <Label value="Booking Date & Time" />
            <TextInput
              readOnly
              placeholder=""
              type="datetime-local"
              value={
                order?.createdAt
                  ? new Date(order.createdAt).toISOString().slice(0, 16)
                  : ""
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-6 gap-4">
          <div>
            <Label value="Date" />
            <TextInput readOnly placeholder="" type="date" />
          </div>
          <div>
            <Label value="Time" />
            <TextInput readOnly placeholder="" type="time" />
          </div>
          <div>
            <Label value="Venue" />
            <TextInput readOnly placeholder="Venue" />
          </div>
          <div className="col-span-3" />
          <div>
            <Label value="No. of People" />
            <TextInput readOnly placeholder="No. of People" />
          </div>
          <div>
            <Label value="Makeup Style" />
            <TextInput readOnly placeholder="Makeup Style" />
          </div>
          <div>
            <Label value="Add Ons" />
            <TextInput readOnly placeholder="Add Ons" />
          </div>
          <div>
            <Label value="Preferred Look" />
            <TextInput readOnly placeholder="Preferred Look" />
          </div>
          <div className="col-span-2" />
          <div className="col-span-2">
            <Label value="Additional Comments" />
            <TextInput readOnly placeholder="Additional Comments" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <Label value="Price" />
            <TextInput
              readOnly
              placeholder="Price"
              value={order?.amount?.total}
            />
          </div>
        </div>
        <div className="max-w-fit">
          <Table hoverable className="">
            <Table.Head>
              <Table.HeadCell>Summary</Table.HeadCell>
              <Table.HeadCell>Cost</Table.HeadCell>
              <Table.HeadCell className="sr-only">Invoice</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>Total Value</Table.Cell>
                <Table.Cell className="text-rose-900 font-medium">
                  {order?.amount?.total}
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>Amount Received by Wedsy</Table.Cell>
                <Table.Cell className="text-rose-900 font-medium">
                  {order?.amount?.receivedByWedsy}
                </Table.Cell>
                <Table.Cell className="underline">Invoice</Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>Amount Received by Vendor</Table.Cell>
                <Table.Cell className="text-rose-900 font-medium">
                  {order?.amount?.receivedByVendor}
                </Table.Cell>
                <Table.Cell className="underline">Invoice</Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>Payable to Wedsy</Table.Cell>
                <Table.Cell className="text-rose-900 font-medium">
                {order?.amount?.payableToWedsy}
                </Table.Cell>
                <Table.Cell className="underline">Invoice</Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>Payable to Vendor</Table.Cell>
                <Table.Cell className="text-rose-900 font-medium">
                {order?.amount?.payableToVendor}
                </Table.Cell>
                <Table.Cell className="underline">Invoice</Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>Transaction Details</Table.Cell>
                <Table.Cell className="text-rose-900 font-medium">
                  UPI
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </div>
    </>
  );
}
