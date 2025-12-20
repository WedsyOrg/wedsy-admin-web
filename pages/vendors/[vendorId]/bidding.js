import NotificationCard from "@/components/cards/NotificationCard";
import StatsCard from "@/components/cards/StatsCard";
import StatsIconCard from "@/components/cards/StatsIconCard";
import VendorLastActiveCard from "@/components/cards/VendorLastActiveCard";
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
import { BiPlus, BiRupee } from "react-icons/bi";
import { BsArrowUp, BsPlus, BsPlusCircle, BsSearch } from "react-icons/bs";
import { MdArrowRightAlt, MdCancel, MdOpenInNew } from "react-icons/md";

export default function Vendor({ message, setMessage }) {
  const router = useRouter();
  const { vendorId } = router.query;
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState({});
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [dateRange, setDateRange] = useState(["", ""]); // [startDate, endDate]
  const [confirmedFilter, setConfirmedFilter] = useState("");
  const [chatInitiatedFilter, setChatInitiatedFilter] = useState("");
  const [list, setList] = useState([]);
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

  const fetchBiddingList = () => {
    if (!vendorId) return;
    setLoading(true);
    const qp = (k, v) =>
      v !== undefined && v !== null && String(v).length > 0
        ? `&${k}=${encodeURIComponent(String(v))}`
        : "";
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/bidding?vendorId=${encodeURIComponent(
        String(vendorId)
      )}${qp("search", search)}${qp("sort", sort)}${qp(
        "confirmed",
        confirmedFilter
      )}${qp("chatInitiated", chatInitiatedFilter)}${qp(
        "startDate",
        dateRange[0]
      )}${qp("endDate", dateRange[1])}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((r) => r.json())
      .then((resp) => {
        if (resp?.message === "success") {
          setList(resp?.list || []);
        } else {
          setList([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bidding list:", err);
        setList([]);
        setLoading(false);
      });
  };
  const updateProfileVisibility = (status) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor/${vendorId}?updateKey=profileVisibility`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ profileVisibility: status }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          alert("Updated Profile Visibility Status Successfully");
          fetchVendor();
        } else {
          alert("Error, try again");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updatePackageStatus = (status) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor/${vendorId}?updateKey=packageStatus`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ packageStatus: status }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          alert("Updated Package Status Successfully");
          fetchVendor();
        } else {
          alert("Error, try again");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updateBiddingStatus = (status) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor/${vendorId}?updateKey=biddingStatus`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ biddingStatus: status }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          alert("Updated Bidding Status Successfully");
          fetchVendor();
        } else {
          alert("Error, try again");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    if (vendorId) {
      fetchVendor();
      fetchBiddingList();
    }
  }, [vendorId]);

  useEffect(() => {
    if (!vendorId) return;
    fetchBiddingList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sort, confirmedFilter, chatInitiatedFilter, dateRange?.[0], dateRange?.[1]]);
  return (
    <>
      <div className="flex flex-col gap-6 p-8">
        <div className="grid grid-cols-4 gap-4 items-end">
          <p className="text-xl font-medium col-span-3">{vendor.name}</p>
          <VendorHeaderDropdown display={"Bidding"} vendorId={vendorId} />
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

          <div className="bg-white rounded-lg border py-3 px-6 text-center flex flex-row gap-2 justify-center">
            <span>Profile visibility</span>
            <ToggleSwitch
              sizing="sm"
              checked={vendor.profileVisibility}
              disabled={loading || !vendor.profileVerified}
              onChange={(e) => {
                updateProfileVisibility(e);
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-6 gap-4">
          <StatsCard title={"Bids Received"} value={"50"} />
          <StatsCard title={"Bids Sent"} value={"20"} />
          <StatsCard title={"Bids Confirmed"} value={"10"} />
          <StatsCard title={"In Negotiation"} value={"10"} />
          <div />
          <div className="flex flex-col gap-2 justify-between py-3">
            <div className="bg-white rounded-lg border py-2 px-6 text-center flex flex-row gap-2 justify-between items-center">
              <span>Bidding visibility</span>
              <ToggleSwitch
                sizing="sm"
                checked={vendor.biddingStatus}
                disabled={loading || !vendor.profileVerified}
                onChange={(e) => {
                  updateBiddingStatus(e);
                }}
              />
            </div>
            <VendorLastActiveCard vendorId={vendorId} />
          </div>
        </div>
        <div className="grid grid-cols-6 gap-4">
          <p className="text-lg font-medium col-span-6">Filter by</p>
          <div className="col-span-1">
            <Label value="Event Date" />
            <div className="grid grid-cols-1 gap-2">
              <TextInput
                type="date"
                value={dateRange[0]}
                disabled={loading}
                onChange={(e) => setDateRange([e.target.value, dateRange[1]])}
              />
            </div>
          </div>
          <div>
            <Label value="Confirmed Bids" />
            <Select
              value={confirmedFilter}
              disabled={loading}
              onChange={(e) => setConfirmedFilter(e.target.value)}
            >
              <option value={""}>All</option>
              <option value={"Yes"}>Yes</option>
              <option value={"No"}>No</option>
            </Select>
          </div>
          <div>
            <Label value="Chats Initiated" />
            <Select
              value={chatInitiatedFilter}
              disabled={loading}
              onChange={(e) => setChatInitiatedFilter(e.target.value)}
            >
              <option value={""}>All</option>
              <option value={"Yes"}>Yes</option>
              <option value={"No"}>No</option>
            </Select>
          </div>
        </div>
        <div className="bg-white rounded-3xl flex-col flex gap-3 shadow-xl">
          <div className="flex flex-row justify-between items-center pt-4 px-12">
            <div className="flex flex-col">
              <p className="text-lg font-medium">Bids</p>
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
                <option value={"Newest"}>Newest</option>
                <option value={"Oldest"}>Oldest</option>
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
                <Table.HeadCell>Best Bid</Table.HeadCell>
                <Table.HeadCell>Bid Sent</Table.HeadCell>
                <Table.HeadCell>Chats</Table.HeadCell>
                <Table.HeadCell>
                  <MdArrowRightAlt className="sr-only" />
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {list?.map((item, index) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={item._id}
                  >
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      <a
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 relative"
                        href={`/vendors/${vendorId}/personal-leads/${item._id}`}
                        target="_blank"
                      >
                        {item?.customer?.name || "-"}
                      </a>
                    </Table.Cell>
                    <Table.Cell>{item?.customer?.phone || "-"}</Table.Cell>
                    <Table.Cell>{item?.eventDay || "-"}</Table.Cell>
                    <Table.Cell>{item?.eventsCount || 0}</Table.Cell>
                    <Table.Cell>{item?.bestBid || 0}</Table.Cell>
                    <Table.Cell>{item?.bidSent ? "Yes" : "No"}</Table.Cell>
                    <Table.Cell>{item?.chatInitiated ? "Yes" : "No"}</Table.Cell>
                    <Table.Cell>
                      {item?.chatId ? (
                        <a
                          className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 relative"
                          href={`/chats/${item.chatId}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open
                        </a>
                      ) : (
                        <MdArrowRightAlt className="sr-only" />
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
