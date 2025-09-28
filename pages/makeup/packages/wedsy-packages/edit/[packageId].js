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
  const [wedsyPackage, setWedsyPackage] = useState({
    name: "",
    category: "",
    people: "",
    time: "",
    details: "",
    image: "",
    process: [],
    operations: { assign: "", gender: "", category: "", number: "" },
    price: 0,
  });
  const [wedsyPackageCategory, setWedsyPackageCategory] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const imageRef = useRef();

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
        if (response?._id) {
          setWedsyPackage(response);
        } else {
          router.push("makeup/packages/wedsy-packages");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const fetchWedsyPackageCategory = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/wedsy-package-category`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setWedsyPackageCategory(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const updateWedsyPackage = async () => {
    if (wedsyPackage.name && wedsyPackage.category) {
      setLoading(true);
      let tempImage = wedsyPackage.image;
      if (imageFile) {
        tempImage = await uploadFile({
          file: imageFile,
          path: "wedsy-package",
          id: `${new Date().getTime()}-${wedsyPackage.name
            .substring(0, 10)
            .replace(/[^a-zA-Z0-9]/g, "-")}`,
        });
      }
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/wedsy-package/${packageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...wedsyPackage,
          image: tempImage,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Wedsy Package Category added Successfully!",
              status: "success",
              display: true,
            });
            router.push(`/makeup/packages/wedsy-packages/view/${packageId}`);
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
    } else {
      alert("Fill all the required fields.");
    }
  };

  useEffect(() => {
    if (packageId) {
      fetchWedsyPackageCategory();
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
              onChange={(e) => {
                setWedsyPackage({ ...wedsyPackage, name: e.target.value });
              }}
            />
          </div>
          <div>
            <Label value="Category" />
            <Select
              value={wedsyPackage.category}
              onChange={(e) => {
                setWedsyPackage({ ...wedsyPackage, category: e.target.value });
              }}
            >
              <option value={""}>Select Category</option>
              {wedsyPackageCategory?.map((item, index) => (
                <option value={item.title} key={index}>
                  {item.title}
                </option>
              ))}
            </Select>
          </div>
          <div className="col-span-2" />
          <div>
            <Label value="People" />
            <TextInput
              placeholder="People"
              disabled={loading}
              value={wedsyPackage.people}
              onChange={(e) => {
                setWedsyPackage({ ...wedsyPackage, people: e.target.value });
              }}
            />
          </div>
          <div>
            <Label value="Time" />
            <TextInput
              placeholder="Time"
              disabled={loading}
              value={wedsyPackage.time}
              onChange={(e) => {
                setWedsyPackage({ ...wedsyPackage, time: e.target.value });
              }}
            />
          </div>
          <div className="col-span-2" />
          <div>
            <Label value="Details" />
            <Textarea
              rows={3}
              placeholder="Details"
              disabled={loading}
              value={wedsyPackage.details}
              onChange={(e) => {
                setWedsyPackage({ ...wedsyPackage, details: e.target.value });
              }}
            />
          </div>
          <div>
            <Label value="Upload Photo" />
            <FileInput
              ref={imageRef}
              disabled={loading}
              onChange={(e) => {
                setImageFile(e.target.files[0]);
              }}
            />
          </div>
          {wedsyPackage.image && <img src={wedsyPackage.image} />}
        </div>
        <HorizontalLine />
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Process</h2>
          <div>
            <Button
              color="dark"
              onClick={() => {
                setWedsyPackage({
                  ...wedsyPackage,
                  process: [
                    ...wedsyPackage.process,
                    { topic: "", description: "" },
                  ],
                });
              }}
              disabled={loading}
            >
              <BsPlus size={16} /> Add Process
            </Button>
          </div>
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
                    onChange={(e) => {
                      setWedsyPackage({
                        ...wedsyPackage,
                        process: wedsyPackage?.process?.map((rec, recIndex) =>
                          recIndex === index
                            ? { ...rec, topic: e.target.value }
                            : rec
                        ),
                      });
                    }}
                  />
                  <Label value="Description" />
                  <Textarea
                    rows={3}
                    placeholder="Description"
                    disabled={loading}
                    value={item.description}
                    onChange={(e) => {
                      setWedsyPackage({
                        ...wedsyPackage,
                        process: wedsyPackage?.process?.map((rec, recIndex) =>
                          recIndex === index
                            ? { ...rec, description: e.target.value }
                            : rec
                        ),
                      });
                    }}
                  />
                </div>
                <div>
                  <MdDelete
                    size={24}
                    cursor={"pointer"}
                    className="my-6"
                    onClick={() => {
                      setWedsyPackage({
                        ...wedsyPackage,
                        process: wedsyPackage?.process?.filter(
                          (rec, recIndex) => recIndex !== index
                        ),
                      });
                    }}
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
              value={wedsyPackage.operations.assign}
              onChange={(e) => {
                setWedsyPackage({
                  ...wedsyPackage,
                  operations: {
                    ...wedsyPackage.operations,
                    assign: e.target.value,
                  },
                });
              }}
            />
          </div>
          <div className="">
            <Label value="Gender" />
            <TextInput
              placeholder="Gender"
              disabled={loading}
              value={wedsyPackage.operations.gender}
              onChange={(e) => {
                setWedsyPackage({
                  ...wedsyPackage,
                  operations: {
                    ...wedsyPackage.operations,
                    gender: e.target.value,
                  },
                });
              }}
            />
          </div>
          <div className="">
            <Label value="Category/Class" />
            <TextInput
              placeholder="Category/Class"
              disabled={loading}
              value={wedsyPackage.operations.category}
              onChange={(e) => {
                setWedsyPackage({
                  ...wedsyPackage,
                  operations: {
                    ...wedsyPackage.operations,
                    category: e.target.value,
                  },
                });
              }}
            />
          </div>
          <div className="">
            <Label value="Number" />
            <TextInput
              placeholder="Number"
              disabled={loading}
              value={wedsyPackage.operations.number}
              onChange={(e) => {
                setWedsyPackage({
                  ...wedsyPackage,
                  operations: {
                    ...wedsyPackage.operations,
                    number: e.target.value,
                  },
                });
              }}
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
              onChange={(e) => {
                setWedsyPackage({ ...wedsyPackage, price: e.target.value });
              }}
            />
          </div>
        </div>
        <HorizontalLine />
        <div className="grid grid-cols-5">
          <div className="col-span-2" />
          <Button
            color="success"
            disabled={loading || !wedsyPackage.name || !wedsyPackage.category}
            onClick={() => {
              updateWedsyPackage();
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </>
  );
}
