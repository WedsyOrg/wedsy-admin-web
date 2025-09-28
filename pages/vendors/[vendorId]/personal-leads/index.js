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
import { MdCancel, MdOpenInNew } from "react-icons/md";

export default function Vendor({ message, setMessage }) {
  const router = useRouter();
  const { vendorId } = router.query;
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState({});
  const [personalLeads, setPersonalLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const fetchPersonalLeads = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor-personal-lead?vendorId=${vendorId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          router.push("/login");
          return;
        } else {
          return response.json();
        }
      })
      .then((response) => {
        if (response) {
          setLoading(false);
          setPersonalLeads(response);
        }
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
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
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
      fetchPersonalLeads();
    }
  }, [vendorId]);
  return (
    <>
      <div className="flex flex-col gap-6 p-8">
        <div className="grid grid-cols-4 gap-4 items-end">
          <p className="text-xl font-medium col-span-3">{vendor.name}</p>
          <VendorHeaderDropdown
            display={"Personal Leads"}
            vendorId={vendorId}
          />
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
          <VendorLastActiveCard vendorId={vendorId} />
          <div className="grow bg-white rounded-lg border py-3 px-6 text-center flex flex-row gap-2 justify-center">
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
          <div className="grow bg-white rounded-lg border py-3 px-6 text-center flex flex-row gap-2 justify-center">
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
          <div className="grow bg-white rounded-lg border py-3 px-6 text-center flex flex-row gap-2 justify-center">
            <span>Packages visibility</span>
            <ToggleSwitch
              sizing="sm"
              checked={vendor.packageStatus}
              disabled={loading || !vendor.profileVerified}
              onChange={(e) => {
                updatePackageStatus(e);
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-6 gap-4">
          <StatsCard
            title={"Total Leads"}
            value={String(personalLeads.length)}
          />
          <StatsCard
            title={"Total Earnings"}
            value={toPriceString(
              personalLeads.reduce((sum, item) => sum + item.payment.total, 0)
            )}
          />
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
                <option value={"Newest"}>Newest</option>
                <option value={"Older"}>Older</option>
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
                <Table.HeadCell>Notes</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {personalLeads
                  ?.filter((i) =>
                    search
                      ? i.name.toLowerCase().includes(search.toLowerCase())
                      : true
                  )
                  ?.sort((a, b) => {
                    if (sort === "Newest") {
                      return new Date(b.createdAt) - new Date(a.createdAt);
                    } else if (sort === "Oldest") {
                      return new Date(a.createdAt) - new Date(b.createdAt);
                    } else {
                      return 0;
                    }
                  })
                  ?.map((item, index) => (
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
                          {item.name}
                        </a>
                      </Table.Cell>
                      <Table.Cell>{item.phone}</Table.Cell>
                      <Table.Cell>{item.eventInfo[0]?.date}</Table.Cell>
                      <Table.Cell>{item.eventInfo.length}</Table.Cell>
                      <Table.Cell>{item.admin_notes}</Table.Cell>
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
