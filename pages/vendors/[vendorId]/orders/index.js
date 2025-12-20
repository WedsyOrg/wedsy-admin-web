import NotificationCard from "@/components/cards/NotificationCard";
import StatsCard from "@/components/cards/StatsCard";
import StatsIconCard from "@/components/cards/StatsIconCard";
import VendorLastActiveCard from "@/components/cards/VendorLastActiveCard";
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
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("");
  const [dateFilter, setDateFilter] = useState(["", ""]);
  const [sourceFilter, setSourceFilter] = useState(""); // "Personal Lead" | "Personal-Package" | "Wedsy-Package" | "Bidding"
  const [ordersList, setOrdersList] = useState([]);
  const [personalLeadsList, setPersonalLeadsList] = useState([]);
  const [addNewNote, setAddNewNote] = useState({
    text: "",
    display: false,
  });
  const [addNewTask, setAddNewTask] = useState({
    task: "",
    deadline: "",
    display: false,
  });
  const [displayTasksHistory, setDisplayTasksHistory] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const fetchTasks = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/task?category=Vendor&referenceId=${vendorId}`,
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
        setLoading(false);
        setTasks(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchTags = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/tag`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setTags(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addTask = async () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        task: addNewTask.task,
        deadline: addNewTask.deadline,
        category: "Vendor",
        referenceId: vendorId,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          setMessage({
            text: "Task added Successfully!",
            status: "success",
            display: true,
          });
          setAddNewTask({
            ...addNewTask,
            task: "",
            deadline: "",
            display: false,
          });
          fetchTasks();
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addNote = async () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/${vendorId}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        text: addNewNote.text,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          setMessage({
            text: "Note added Successfully!",
            status: "success",
            display: true,
          });
          setAddNewNote({
            ...addNewNote,
            text: "",
            display: false,
          });
          fetchVendor();
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
        setNotes(response.notes);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const fetchOrders = () => {
    if (!vendorId) return;
    setLoading(true);
    const qp = (k, v) =>
      v !== undefined && v !== null && String(v).length > 0
        ? `&${k}=${encodeURIComponent(String(v))}`
        : "";

    // Personal Lead is not an Order row (it comes from vendor-personal-lead)
    if (sourceFilter === "Personal Lead") {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/vendor-personal-lead?vendorId=${encodeURIComponent(
          String(vendorId)
        )}`,
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
          setPersonalLeadsList(Array.isArray(resp) ? resp : []);
          setOrdersList([]);
          setTotalPages(1);
          setLoading(false);
        })
        .catch((e) => {
          console.error("Error fetching personal leads:", e);
          setPersonalLeadsList([]);
          setOrdersList([]);
          setTotalPages(1);
          setLoading(false);
        });
      return;
    }

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/order?vendorId=${encodeURIComponent(
        String(vendorId)
      )}${qp("page", page)}${qp("limit", itemsPerPage)}${qp(
        "sourceFilter",
        sourceFilter
      )}${qp("search", search)}${qp("sort", sort)}${
        dateFilter[0]
          ? dateFilter[1]
            ? `&startDate=${encodeURIComponent(
                String(dateFilter[0])
              )}&endDate=${encodeURIComponent(String(dateFilter[1]))}`
            : `&registrationDate=${encodeURIComponent(String(dateFilter[0]))}`
          : ""
      }`,
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
        setOrdersList(resp?.list || []);
        setPersonalLeadsList([]);
        setTotalPages(resp?.totalPages || 1);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Error fetching orders:", e);
        setOrdersList([]);
        setPersonalLeadsList([]);
        setTotalPages(1);
        setLoading(false);
      });
  };
  const fetchNotifications = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/notification?category=Vendor&vendor=${vendorId}`,
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
        setLoading(false);
        setNotifications(response.list);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updateProfileVerified = (status) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor/${vendorId}?updateKey=profileVerified`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ profileVerified: status }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          alert("Updated Profile Verified Status Successfully");
          fetchVendor();
        } else {
          alert("Error, try again");
        }
      })
      .catch((error) => {
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
  const updateTag = async (tag) => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/${vendorId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        tag,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          setMessage({
            text: "Tag updated Successfully!",
            status: "success",
            display: true,
          });
          fetchVendor();
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    if (vendorId) {
      fetchVendor();
      fetchNotifications();
      fetchTasks();
      fetchTags();
      fetchOrders();
    }
  }, [vendorId]);
  useEffect(() => {
    if (!vendorId) return;
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, itemsPerPage, search, sort, sourceFilter, dateFilter?.[0], dateFilter?.[1]]);
  return (
    <>
      <div className="flex flex-col gap-6 p-8">
        <div className="grid grid-cols-4 gap-4 items-end">
          <p className="text-xl font-medium col-span-3">{vendor.name}</p>
          <VendorHeaderDropdown display={"Orders"} vendorId={vendorId} />
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
          <div>
            <Button
              color={vendor?.profileVerified ? "success" : "failure"}
              onClick={() => {
                updateProfileVerified(!vendor?.profileVerified);
              }}
            >
              {vendor?.profileVerified ? "VERIFIED" : "NOT VERIFIED"}
            </Button>
          </div>
          <div>
            <Label value="Tag" />
            <Select
              value={vendor.tag}
              onChange={(e) => {
                updateTag(e.target.value);
              }}
            >
              <option value="">Select Tag</option>
              {vendor.tag && <option value={vendor.tag}>{vendor.tag}</option>}
              {tags
                .filter((i) => i !== vendor.tag)
                .map((item, index) => (
                  <option value={item.title} key={index}>
                    {item.title}
                  </option>
                ))}
            </Select>
          </div>
          <VendorLastActiveCard vendorId={vendorId} />
        </div>
        <HorizontalLine />
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
            <p className="text-gray-800 font-medium">Total Revenue</p>
            <p className="text-4xl font-bold">₹198k</p>
            {/* --StatsPending-- */}
            <p className="flex flex-row gap-1 items-center">
              <BsArrowUp color="#00AC4F" size={18} />
              <span className="text-green-600 font-medium">38%</span>
              <span className="font-medium">this month</span>
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
            <p className="text-gray-800 font-medium">Avg. Monthly Revenue</p>
            <p className="text-4xl py-4 font-bold text-rose-900">₹23k</p>
            {/* --StatsPending-- */}
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
            <p className="text-gray-800 font-medium">Last Monthly Revenue</p>
            <p className="text-4xl py-4 font-bold text-rose-900">₹15k</p>
            {/* --StatsPending-- */}
          </div>
        </div>
        <HorizontalLine />
        <p className="text-lg font-medium">Orders</p>
        <div className="grid grid-cols-5 gap-4">
          <Select>
            <option>Today</option>
          </Select>
        </div>
        <div className="grid grid-cols-6 gap-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
            <p className="text-gray-800 font-medium">Packages</p>
            <p className="text-4xl py-4 font-bold">0</p>
            {/* --StatsPending-- */}
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
            <p className="text-gray-800 font-medium">Bids</p>
            <p className="text-4xl py-4 font-bold">0</p>
            {/* --StatsPending-- */}
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
            <p className="text-gray-800 font-medium">Personal</p>
            <p className="text-4xl py-4 font-bold">0</p>
            {/* --StatsPending-- */}
          </div>
        </div>
        <HorizontalLine />
        <p className="text-lg font-medium">Business</p>
        <div className="grid grid-cols-5 gap-4">
          <Select>
            <option>Today</option>
          </Select>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <StatsCard title={"Packages"} value={"0"} subtitle={"0"} />
          {/* --StatsPending-- */}
          <StatsCard title={"Bids"} value={"0"} subtitle={"0"} />
          {/* --StatsPending-- */}
          <StatsCard title={"Personal"} value={"0"} subtitle={"0"} />
          {/* --StatsPending-- */}
        </div>
        <HorizontalLine />
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-lg">Filter by:</p>
          <div className="grid grid-cols-6 gap-6 gap-y-2">
            <div>
              <Select
                disabled={loading}
                value={sourceFilter}
                onChange={(e) => {
                  setSourceFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value={""}>Select Source</option>
                <option value={"Personal Lead"}>Personal Lead</option>
                <option value={"Personal-Package"}>Personal Package</option>
                <option value={"Wedsy-Package"}>Wedsy Package</option>
                <option value={"Bidding"}>Bidding</option>
              </Select>
            </div>
            <div className="col-span-2">
              <div className="grid grid-cols-2 gap-2">
                <TextInput
                  type="date"
                  value={dateFilter[0]}
                  onChange={(e) => {
                    setDateFilter([e.target.value, dateFilter[1]]);
                    setPage(1);
                  }}
                  disabled={loading}
                />
                <TextInput
                  type="date"
                  value={dateFilter[1]}
                  onChange={(e) => {
                    setDateFilter([dateFilter[0], e.target.value]);
                    setPage(1);
                  }}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
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
                <Table.HeadCell>Customer Name</Table.HeadCell>
                <Table.HeadCell>Phone Number</Table.HeadCell>
                <Table.HeadCell>Event Day</Table.HeadCell>
                <Table.HeadCell>No.of Events</Table.HeadCell>
                <Table.HeadCell>Source</Table.HeadCell>
                <Table.HeadCell>Price</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {(sourceFilter === "Personal Lead" ? personalLeadsList : ordersList)?.map(
                  (item, index) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={item._id || index}
                  >
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {sourceFilter === "Personal Lead" ? (
                        <a
                          className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 relative"
                          href={`/vendors/${vendorId}/personal-leads/${item._id}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {item?.name || "-"}
                        </a>
                      ) : (
                        <span>{item?.user?.name || "-"}</span>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {sourceFilter === "Personal Lead"
                        ? item?.phone || "-"
                        : item?.user?.phone || "-"}
                    </Table.Cell>
                    <Table.Cell>
                      {sourceFilter === "Personal Lead"
                        ? item?.eventInfo?.[0]?.date || "-"
                        : item?.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "-"}
                    </Table.Cell>
                    <Table.Cell>
                      {sourceFilter === "Personal Lead"
                        ? item?.eventInfo?.length || 0
                        : item?.source || "-"}
                    </Table.Cell>
                    <Table.Cell>
                      {sourceFilter === "Personal Lead"
                        ? "Personal Lead"
                        : item?.source || "-"}
                    </Table.Cell>
                    <Table.Cell>{item?.amount?.total ?? 0}</Table.Cell>
                  </Table.Row>
                  )
                )}
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
