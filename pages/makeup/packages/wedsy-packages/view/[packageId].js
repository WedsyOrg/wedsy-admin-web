import NotificationCard from "@/components/cards/NotificationCard";
import StatsCard from "@/components/cards/StatsCard";
import StatsIconCard from "@/components/cards/StatsIconCard";
import VendorHeaderDropdown from "@/components/dropdown/VendorHeaderDropdown";
import SettingTextInput from "@/components/forms/SettingTextInput";
import HorizontalLine from "@/components/other/HorizontalLine";
import { images } from "@/next.config";
import { uploadFile } from "@/utils/file";
import {
  Button,
  Checkbox,
  FileInput,
  Label,
  Modal,
  Pagination,
  Select,
  Table,
  Textarea,
  TextInput,
  ToggleSwitch,
  Tooltip,
} from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BiPlus, BiRupee } from "react-icons/bi";
import { BsArrowUp, BsPlus, BsSearch } from "react-icons/bs";
import { MdArrowBack, MdDelete, MdOpenInNew } from "react-icons/md";

export default function Vendor({ message, setMessage }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { packageId } = router.query;
  const [wedsyPackage, setWedsyPackage] = useState({});

  const fetchWedsyPackage = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/wedsy-package/${packageId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setWedsyPackage(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const deleteWedsyPackage = () => {
    if (packageId) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/wedsy-package/${packageId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Wedsy Package deleted added Successfully!",
              status: "success",
              display: true,
            });
            router.push("/makeup/packages/wedsy-packages");
          } else {
            alert("There was a error try again.");
            setLoading(false);
          }
        })
        .catch((error) => {
          alert("There was a error try again.");
          setLoading(false);
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  };
  useEffect(() => {
    if (packageId) {
      fetchWedsyPackage();
    }
  }, []);

  return (
    <>
      <div className="flex flex-col gap-6 p-8">
        <div>
          <h2 className="text-2xl font-semibold flex flex-row gap-2 items-center">
            <MdArrowBack
              cursor={"pointer"}
              onClick={() => {
                router.back();
              }}
            />
            Add Wedsy Packages
          </h2>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <Label value="Package Name" />
            <TextInput
              placeholder="Package Name"
              disabled={loading}
              value={wedsyPackage.name}
              readOnly={true}
            />
          </div>
          <div>
            <Label value="Category" />
            <TextInput value={wedsyPackage.category} readOnly={true} />
          </div>
          <div className="col-span-1" />
          <div>
            <Label value="Created On" />
            <TextInput
              value={new Date(wedsyPackage.createdAt).toLocaleString()}
              readOnly={true}
            />
          </div>
          <div>
            <Label value="People" />
            <TextInput
              placeholder="People"
              disabled={loading}
              value={wedsyPackage.people}
              readOnly={true}
            />
          </div>
          <div>
            <Label value="Time" />
            <TextInput
              placeholder="Time"
              disabled={loading}
              value={wedsyPackage.time}
              readOnly={true}
            />
          </div>
          <div className="col-span-1" />
          <div className="flex flex-row gap-4 items-center">
            <Button
              color="failure"
              onClick={() => {
                deleteWedsyPackage();
              }}
              disabled={loading}
              className="grow"
            >
              Delete Package
            </Button>
            <Button
              color="dark"
              onClick={() => {
                router.push(`/makeup/packages/wedsy-packages/edit/${packageId}`);
              }}
              disabled={loading}
              className="grow"
            >
              Edit Package
            </Button>
          </div>
          <div>
            <Label value="Details" />
            <Textarea
              rows={3}
              placeholder="Details"
              disabled={loading}
              value={wedsyPackage.details}
              readOnly={true}
            />
          </div>
          <div>
            <Label value="Upload Photo" />
            <img src={wedsyPackage?.image} />
          </div>
        </div>
        <HorizontalLine />
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Process</h2>
          <ol start={"1"} className="flex flex-col gap-4">
            {wedsyPackage?.process?.map((item, index) => (
              <li className="flex flex-row gap-4" key={index}>
                <p className="py-2 font-lg font-medium">{index + 1}</p>
                <div className="w-1/2">
                  <Label value="Topic" />
                  <TextInput
                    placeholder="Topic"
                    disabled={loading}
                    value={item.topic}
                    readOnly={true}
                  />
                  <Label value="Description" />
                  <Textarea
                    rows={3}
                    placeholder="Description"
                    disabled={loading}
                    value={item.description}
                    readOnly={true}
                  />
                </div>
                <div>
                  <MdDelete
                    size={24}
                    cursor={"pointer"}
                    className="my-6"
                    readOnly={true}
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>
        <HorizontalLine />
        <div className="grid grid-cols-4 gap-4">
          <h2 className="col-span-4 text-2xl font-semibold">Operations</h2>
          <div className="">
            <Label value="Assign" />
            <TextInput
              placeholder="Assign"
              disabled={loading}
              value={wedsyPackage?.operations?.assign}
              readOnly={true}
            />
          </div>
          <div className="">
            <Label value="Gender" />
            <TextInput
              placeholder="Gender"
              disabled={loading}
              value={wedsyPackage?.operations?.gender}
              readOnly={true}
            />
          </div>
          <div className="">
            <Label value="Category/Class" />
            <TextInput
              placeholder="Category/Class"
              disabled={loading}
              value={wedsyPackage?.operations?.category}
              readOnly={true}
            />
          </div>
          <div className="">
            <Label value="Number" />
            <TextInput
              placeholder="Number"
              disabled={loading}
              value={wedsyPackage?.operations?.number}
              readOnly={true}
            />
          </div>
        </div>
        <HorizontalLine />
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Pricing</h2>
          <div className="w-1/4">
            <Label value="Price" />
            <TextInput
              placeholder="Price"
              disabled={loading}
              value={wedsyPackage.price}
              readOnly={true}
            />
          </div>
        </div>
      </div>
    </>
  );
}
