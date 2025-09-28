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
  const { vendorId, leadId } = router.query;
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState({});
  const [personalLead, setPersonalLead] = useState([]);
  const [adminNotes, setAdminNotes] = useState("");
  const updateAdminNotes = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor-personal-lead/${leadId}/admin-notes`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ admin_notes: adminNotes }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          setMessage({
            text: "Admin Notes updated Successfully!",
            status: "success",
            display: true,
          });
          fetchPersonalLead();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchPersonalLead = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor-personal-lead/${leadId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
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
          setPersonalLead(response);
          setAdminNotes(response.admin_notes);
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
      fetchPersonalLead();
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
        <HorizontalLine />
        <div className="grid grid-cols-4 gap-4">
          <div>
            <Label value="Name" />
            <TextInput readOnly={true} value={personalLead.name} />
          </div>
          <div>
            <Label value="Phone" />
            <TextInput readOnly={true} value={personalLead.phone} />
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {personalLead?.eventInfo?.map((item, index) => (
            <>
              <div>
                <Label value="Event Date" />
                <TextInput readOnly={true} value={item.date} />
              </div>
              <div>
                <Label value="Event Time" />
                <TextInput readOnly={true} value={item.time} />
              </div>
              <div className="col-span-3" />
            </>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label value="Notes" />
            <TextInput readOnly={true} value={personalLead?.notes} />
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {personalLead?.tasks?.map((item, index) => (
            <>
              <div>
                <Label value="Task Date" />
                <TextInput readOnly={true} value={item.date} />
              </div>
              <div>
                <Label value="Task Time" />
                <TextInput readOnly={true} value={item.time} />
              </div>
              <div className="col-span-2">
                <Label value="Task" />
                <TextInput readOnly={true} value={item.task} />
              </div>
              <div className="col-span-1" />
            </>
          ))}
        </div>
        <HorizontalLine />
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <Label value="Admin Notes" />
            <TextInput
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
            />
          </div>
          <div className="self-end">
            <Button
              color="success"
              onClick={() => {
                updateAdminNotes();
              }}
              className="w-full"
            >
              Save
            </Button>
          </div>
        </div>
        <HorizontalLine />
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-2">
            <Label value="Total Amount" />
            <TextInput readOnly={true} value={personalLead?.payment?.total} />
          </div>
          <div className="col-span-3" />
          {personalLead?.payment?.transactions?.map((item, index) => (
            <>
              <div>
                <Label value="Amount" />
                <TextInput readOnly={true} value={item.amount} />
              </div>
              <div>
                <Label value="Method" />
                <TextInput readOnly={true} value={item.method} />
              </div>
              <div className="col-span-3" />
            </>
          ))}
        </div>
      </div>
    </>
  );
}
