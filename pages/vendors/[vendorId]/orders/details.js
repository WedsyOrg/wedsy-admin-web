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
  const { vendorId } = router.query;
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState({});
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
        setNotes(response.notes);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    if (vendorId) {
      fetchVendor();
    }
  }, [vendorId]);
  return (
    <>
      <div className="flex flex-col gap-6 p-8">
        <div className="grid grid-cols-4 gap-4 items-end">
          <p className="text-xl font-medium col-span-3">Order Details</p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <Label value="Name" />
            <TextInput readOnly placeholder="Name" />
          </div>
          <div>
            <Label value="Number" />
            <TextInput readOnly placeholder="Number" />
          </div>
          <div>
            <Label value="Email" />
            <TextInput readOnly placeholder="Email" />
          </div>
          <div />
          <div>
            <Label value="Source" />
            <TextInput readOnly placeholder="Bidding/Personal/Package" />
          </div>
          <div>
            <Label value="Booking Date & Time" />
            <TextInput readOnly placeholder="" type="datetime-local" />
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
            <TextInput readOnly placeholder="Price" value={"12,500"} />
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
                  12500
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>Amount Received by Wedsy</Table.Cell>
                <Table.Cell className="text-rose-900 font-medium">
                  2500
                </Table.Cell>
                <Table.Cell className="underline">Invoice</Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>Amount Received by Vendor</Table.Cell>
                <Table.Cell className="text-rose-900 font-medium">
                  10000
                </Table.Cell>
                <Table.Cell className="underline">Invoice</Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>Payable to Wedsy</Table.Cell>
                <Table.Cell className="text-rose-900 font-medium">
                  2500
                </Table.Cell>
                <Table.Cell className="underline">Invoice</Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>Payable to Vendor</Table.Cell>
                <Table.Cell className="text-rose-900 font-medium">
                  10000
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
