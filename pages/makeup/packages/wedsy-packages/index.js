import NotificationCard from "@/components/cards/NotificationCard";
import StatsCard from "@/components/cards/StatsCard";
import StatsIconCard from "@/components/cards/StatsIconCard";
import VendorHeaderDropdown from "@/components/dropdown/VendorHeaderDropdown";
import SettingTextInput from "@/components/forms/SettingTextInput";
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
import { MdArrowBack, MdOpenInNew } from "react-icons/md";

export default function Vendor({ message, setMessage }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("");
  const [wedsyPackages, setWedsyPackages] = useState([]);
  const [wedsyPackageCategory, setWedsyPackageCategory] = useState([]);
  const [addNewWedsyPackageCategory, setAddNewWedsyPackageCategory] = useState({
    display: false,
    title: "",
  });
  const [editWedsyPackageCategory, setEditWedsyPackageCategory] = useState({
    title: "",
    _id: "",
  });

  const fetchWedsyPackage = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/wedsy-package`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setWedsyPackages(response);
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
  const addWedsyPackageCategory = async () => {
    if (addNewWedsyPackageCategory.title) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/wedsy-package-category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: addNewWedsyPackageCategory.title,
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
            setAddNewWedsyPackageCategory({
              display: false,
              title: "",
            });
            fetchWedsyPackageCategory();
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
  const updateWedsyPackageCategory = async () => {
    if (editWedsyPackageCategory.title) {
      setLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wedsy-package-category/${editWedsyPackageCategory._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: editWedsyPackageCategory.title,
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Wedsy Package Category updated Successfully!",
              status: "success",
              display: true,
            });
            setEditWedsyPackageCategory({
              title: "",

              _id: "",
            });
            fetchWedsyPackageCategory();
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
  const deleteWedsyPackageCategory = (_id) => {
    if (_id) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wedsy-package-category/${_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Wedsy Package Category deleted added Successfully!",
              status: "success",
              display: true,
            });
            fetchWedsyPackageCategory();
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
    fetchWedsyPackageCategory();
    fetchWedsyPackage();
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
            Wedsy Packages
          </h2>
        </div>
        <HorizontalLine />
        <div className="grid grid-cols-5 gap-4">
          <h2 className="text-2xl font-semibold col-span-5">Categories</h2>
          {wedsyPackageCategory?.map((item, index) => (
            <SettingTextInput
              key={index}
              index={index}
              placeholder={"Edit Title"}
              value={
                editWedsyPackageCategory?._id === item._id
                  ? editWedsyPackageCategory.title
                  : item.title
              }
              onChange={(e) => {
                if (editWedsyPackageCategory?._id === item._id) {
                  setEditWedsyPackageCategory({
                    ...editWedsyPackageCategory,
                    title: e.target.value,
                  });
                }
              }}
              readOnly={editWedsyPackageCategory?._id !== item._id}
              loading={loading}
              onEdit={() => {
                if (!loading) {
                  setEditWedsyPackageCategory({
                    ...item,
                  });
                }
              }}
              onDelete={() => {
                if (!loading) {
                  deleteWedsyPackageCategory(item._id);
                }
              }}
              onSave={() => {
                if (!loading && editWedsyPackageCategory.title) {
                  updateWedsyPackageCategory();
                }
              }}
              onCancel={() => {
                setEditWedsyPackageCategory({
                  title: "",
                  _id: "",
                });
              }}
              showDropdown={false}
            />
          ))}
          {addNewWedsyPackageCategory.display && (
            <SettingTextInput
              index={-1}
              placeholder={"Title..."}
              value={addNewWedsyPackageCategory.title}
              onChange={(e) => {
                setAddNewWedsyPackageCategory({
                  ...addNewWedsyPackageCategory,
                  title: e.target.value,
                });
              }}
              readOnly={false}
              loading={loading}
              onSave={() => {
                if (!loading && addNewWedsyPackageCategory.title) {
                  addWedsyPackageCategory();
                }
              }}
              onCancel={() => {
                setAddNewWedsyPackageCategory({
                  display: false,
                  title: "",
                });
              }}
            />
          )}
          {!addNewWedsyPackageCategory.display && (
            <Button
              color="dark"
              onClick={() => {
                setAddNewWedsyPackageCategory({
                  display: true,
                  title: "",
                });
              }}
              disabled={
                loading ||
                addNewWedsyPackageCategory.display ||
                editWedsyPackageCategory._id
              }
            >
              <BsPlus size={16} /> Add Package Category
            </Button>
          )}
        </div>
        <HorizontalLine />
        <div className="grid grid-cols-5 gap-4">
          <h2 className="text-2xl font-semibold col-span-5">Packages</h2>
          <Link href="/makeup/packages/wedsy-packages/create">
            <Button
              color="dark"
              disabled={loading}
            >
              <BsPlus size={16} /> Add Package
            </Button>
          </Link>
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
                <option value={"Orders (Highest to Lowest)"}>
                  Orders (Highest to Lowest)
                </option>
                <option value={"Orders (Lowest to Highest)"}>
                  Orders (Lowest to Highest)
                </option>
                <option value={"Newest (Registration)"}>
                  Newest (Registration)
                </option>
                <option value={"Older (Registration)"}>
                  Older (Registration)
                </option>
                <option value={"Alphabetical Order"}>Alphabetical Order</option>
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
                <Table.HeadCell>Package Name</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Price</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {wedsyPackages?.map((item, index) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={item._id}
                  >
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      <a
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 relative"
                        href={`/makeup/packages/wedsy-packages/view/${item._id}`}
                        target="_blank"
                      >
                        {item.name}
                      </a>
                    </Table.Cell>
                    <Table.Cell>{item.category}</Table.Cell>
                    <Table.Cell>{item.price}</Table.Cell>
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
              totalPages={Math.ceil(wedsyPackages.length / itemsPerPage)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
