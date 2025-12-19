import NotificationCard from "@/components/cards/NotificationCard";
import StatsCard from "@/components/cards/StatsCard";
import StatsIconCard from "@/components/cards/StatsIconCard";
import VendorLastActiveCard from "@/components/cards/VendorLastActiveCard";
import VendorHeaderDropdown from "@/components/dropdown/VendorHeaderDropdown";
import HorizontalLine from "@/components/other/HorizontalLine";
import {
  Button,
  Label,
  Modal,
  Select,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiPlus, BiRupee } from "react-icons/bi";
import { BsArrowUp, BsPlus } from "react-icons/bs";
import { MdOpenInNew } from "react-icons/md";

export default function Vendor({ message, setMessage }) {
  const router = useRouter();
  const { vendorId } = router.query;
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState({});
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
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
  const [orderStats, setOrderStats] = useState("today");
  const [businessStats, setBusinessStats] = useState([]);
  const [selectedBusinessMonth, setSelectedBusinessMonth] = useState("");
  const [orderDayStats, setOrderDayStats] = useState({
    wedsyPackages: 0,
    personalPackages: 0,
    bidding: 0,
  });
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
  const fetchStats = () => {
    setLoading(true);
    Promise.all([
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stats?key=vendor-business-monthly&vendor=${vendorId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ).then((response) => response.json()),
    ]).then((result) => {
      if (result[0]?.message === "success") {
        setBusinessStats(result[0]?.stats);
        setSelectedBusinessMonth(result[0]?.stats?.[0]?.month || "");
      }
      setLoading(false);
    });
  };

  const fetchOrderDayStats = () => {
    if (!vendorId) return;
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stats?key=vendor-orders-day&vendor=${vendorId}&day=${orderStats}`,
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
          setOrderDayStats({
            wedsyPackages: resp?.stats?.wedsyPackages || 0,
            personalPackages: resp?.stats?.personalPackages || 0,
            bidding: resp?.stats?.bidding || 0,
          });
        } else {
          setOrderDayStats({ wedsyPackages: 0, personalPackages: 0, bidding: 0 });
        }
      })
      .catch(() => {
        setOrderDayStats({ wedsyPackages: 0, personalPackages: 0, bidding: 0 });
      });
  };
  useEffect(() => {
    if (vendorId) {
      fetchVendor();
      fetchNotifications();
      fetchTasks();
      fetchTags();
      fetchStats();
    }
  }, [vendorId]);

  useEffect(() => {
    if (vendorId) {
      fetchOrderDayStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId, orderStats]);
  return (
    <>
      {/* Tasks Hstory Modal */}
      <Modal
        show={displayTasksHistory || false}
        size="lg"
        popup
        onClose={() => setDisplayTasksHistory(false)}
      >
        <Modal.Header>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white px-4">
            Task History for {vendor.name}
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            {tasks.map((item, index) => (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <TextInput readOnly={true} value={item.task} />
                  <TextInput
                    type="datetime-local"
                    readOnly={true}
                    value={new Date(item.deadline)
                      .toLocaleString("sv-SE", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      .replace(" ", "T")}
                  />
                </div>
              </>
            ))}
          </div>
        </Modal.Body>
      </Modal>
      {/* Add Task Modal */}
      <Modal
        show={addNewTask?.display || false}
        size="lg"
        popup
        onClose={() =>
          setAddNewTask({
            ...addNewTask,
            display: false,
          })
        }
      >
        <Modal.Header>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white px-4">
            Add New Task for {vendor.name}
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            <TextInput
              value={addNewTask.task}
              disabled={loading}
              onChange={(e) => {
                setAddNewTask({
                  ...addNewTask,
                  task: e.target.value,
                });
              }}
            />
            <TextInput
              type="datetime-local"
              value={addNewTask.deadline}
              disabled={loading}
              onChange={(e) => {
                setAddNewTask({
                  ...addNewTask,
                  deadline: e.target.value,
                });
                console.log(e.target.value);
              }}
            />
            <Button
              color={"gray"}
              onClick={() => {
                addTask();
              }}
              disabled={loading || !addNewTask.task || !addNewTask.deadline}
            >
              <BsPlus /> Create Task
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      {/* Add Notes Modal */}
      <Modal
        show={addNewNote?.display || false}
        size="lg"
        popup
        onClose={() =>
          setAddNewNote({
            ...addNewNote,
            display: false,
          })
        }
      >
        <Modal.Header>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white px-4">
            Add New Note for {vendor.name}
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            <TextInput
              value={addNewNote.text}
              disabled={loading}
              onChange={(e) => {
                setAddNewNote({
                  ...addNewNote,
                  text: e.target.value,
                });
              }}
            />
            <Button
              color={"gray"}
              onClick={() => {
                addNote();
              }}
              disabled={loading || !addNewNote.text}
            >
              <BsPlus /> Add Note
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <div className="flex flex-col gap-6 p-8">
        <div className="grid grid-cols-4 gap-4 items-end">
          <p className="text-xl font-medium col-span-3">{vendor.name}</p>
          <VendorHeaderDropdown display={"Dashboard"} vendorId={vendorId} />
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
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label value="Bank Name" />
            <TextInput
              value={vendor?.accountDetails?.bankName || ""}
              readOnly={true}
            />
          </div>
          <div>
            <Label value="Account Number" />
            <TextInput
              value={vendor?.accountDetails?.accountNumber || ""}
              readOnly={true}
            />
          </div>
          <div>
            <Label value="IFSC Code" />
            <TextInput
              value={vendor?.accountDetails?.ifscCode || ""}
              readOnly={true}
            />
          </div>
        </div>
        <HorizontalLine />
        <div className="grid grid-cols-3 gap-6">
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
        <div className="grid grid-cols-5 gap-4">
          {(() => {
            const total = (businessStats || []).reduce((acc, i) => {
              return (
                acc +
                (Number(i?.wedsyPackagesAmount || 0) +
                  Number(i?.personalPackagesAmount || 0) +
                  Number(i?.biddingAmount || 0))
              );
            }, 0);
            const months = (businessStats || []).length || 0;
            const avg = months ? Math.round(total / months) : 0;
            const lastMonthObj =
              (businessStats || []).length > 0
                ? businessStats[(businessStats || []).length - 1]
                : null;
            const last =
              (Number(lastMonthObj?.wedsyPackagesAmount || 0) +
                Number(lastMonthObj?.personalPackagesAmount || 0) +
                Number(lastMonthObj?.biddingAmount || 0)) ||
              0;
            return (
              <>
                <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
                  <p className="text-gray-800 font-medium">Total Revenue</p>
                  <p className="text-4xl font-bold">{Math.round(total)}</p>
                  <p className="flex flex-row gap-1 items-center">
                    <BsArrowUp color="#00AC4F" size={18} />
                    <span className="text-green-600 font-medium">0%</span>
                    <span className="font-medium">this month</span>
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
                  <p className="text-gray-800 font-medium">
                    Avg. Monthly Revenue
                  </p>
                  <p className="text-4xl py-4 font-bold text-rose-900">
                    {Math.round(avg)}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
                  <p className="text-gray-800 font-medium">Last Monthly Revenue</p>
                  <p className="text-4xl py-4 font-bold text-rose-900">
                    {Math.round(last)}
                  </p>
                </div>
              </>
            );
          })()}
        </div>
        <HorizontalLine />
        <p className="text-lg font-medium">Orders</p>
        <div className="grid grid-cols-5 gap-4">
          <Select
            value={orderStats}
            onChange={(e) => {
              setOrderStats(e.target.value);
            }}
          >
            <option value={"today"}>Today</option>
            <option value={"tomorrow"}>Tomorrow</option>
          </Select>
        </div>
        <div className="grid grid-cols-6 gap-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
            <p className="text-gray-800 font-medium">Packages</p>
            <p className="text-4xl py-4 font-bold">
              {orderDayStats?.wedsyPackages || 0}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
            <p className="text-gray-800 font-medium">Bids</p>
            <p className="text-4xl py-4 font-bold">
              {orderDayStats?.bidding || 0}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
            <p className="text-gray-800 font-medium">Personal</p>
            <p className="text-4xl py-4 font-bold">
              {orderDayStats?.personalPackages || 0}
            </p>
          </div>
        </div>
        <HorizontalLine />
        <p className="text-lg font-medium">Total Bidding Information</p>
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-2 bg-white rounded-2xl shadow-lg p-6 flex flex-row gap-4 items-center justify-evenly">
            <div className="bg-gradient-to-b from-emerald-100 to-green-50 rounded-full p-3">
              <BiRupee size={64} color="#00AC4F" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-400 font-medium">Total Sales</p>
              {/* --StatsPending-- */}
              <p className="text-4xl font-bold">0</p>
              <p className="flex flex-row gap-1 items-center">
                <BsArrowUp color="#00AC4F" size={18} />
                <span className="text-green-600 font-medium">0%</span>
                <span className="font-medium">this month</span>
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
            <p className="text-gray-800 font-medium">Bids Received</p>
            {/* --StatsPending-- */}
            <p className="text-4xl py-4 font-bold">0</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
            <p className="text-gray-800 font-medium">Bids Sent</p>
            {/* --StatsPending-- */}
            <p className="text-4xl py-4 font-bold">0</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
            <p className="text-gray-800 font-medium">Bids Confirmed</p>
            {/* --StatsPending-- */}
            <p className="text-4xl py-4 font-bold">0</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
            <p className="text-gray-800 font-medium">In Negotiation</p>
            {/* --StatsPending-- */}
            <p className="text-4xl py-4 font-bold">0</p>
          </div>
        </div>
        <HorizontalLine />
        <p className="text-lg font-medium">Wedsy Packages Information</p>
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-2 bg-white rounded-2xl shadow-lg p-6 flex flex-row gap-4 items-center justify-evenly">
            <div className="bg-gradient-to-b from-emerald-100 to-green-50 rounded-full p-3">
              <BiRupee size={64} color="#00AC4F" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-400 font-medium">Total Sales</p>
              {/* --StatsPending-- */}
              <p className="text-4xl font-bold">0</p>
              <p className="flex flex-row gap-1 items-center">
                <BsArrowUp color="#00AC4F" size={18} />
                <span className="text-green-600 font-medium">0%</span>
                <span className="font-medium">this month</span>
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
            <p className="text-gray-800 font-medium">Packages Received</p>
            {/* --StatsPending-- */}
            <p className="text-4xl py-4 font-bold">0</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
            <p className="text-gray-800 font-medium">Packages Accepted</p>
            {/* --StatsPending-- */}
            <p className="text-4xl py-4 font-bold">0</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
            <p className="text-gray-800 font-medium">Packages Completed</p>
            {/* --StatsPending-- */}
            <p className="text-4xl py-4 font-bold">0</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
            <p className="text-gray-800 font-medium">Packages Declined</p>
            {/* --StatsPending-- */}
            <p className="text-4xl py-4 font-bold">0</p>
          </div>
        </div>
        <HorizontalLine />
        <p className="text-lg font-medium">Personal Packages Information</p>
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-2 bg-white rounded-2xl shadow-lg p-6 flex flex-row gap-4 items-center justify-evenly">
            <div className="bg-gradient-to-b from-emerald-100 to-green-50 rounded-full p-3">
              <BiRupee size={64} color="#00AC4F" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-400 font-medium">Total Sales</p>
              {/* --StatsPending-- */}
              <p className="text-4xl font-bold">0</p>
              <p className="flex flex-row gap-1 items-center">
                <BsArrowUp color="#00AC4F" size={18} />
                <span className="text-green-600 font-medium">0%</span>
                <span className="font-medium">this month</span>
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
            <p className="text-gray-800 font-medium">Packages Received</p>
            {/* --StatsPending-- */}
            <p className="text-4xl py-4 font-bold">0</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
            <p className="text-gray-800 font-medium">Packages Accepted</p>
            {/* --StatsPending-- */}
            <p className="text-4xl py-4 font-bold">0</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
            <p className="text-gray-800 font-medium">Packages Completed</p>
            {/* --StatsPending-- */}
            <p className="text-4xl py-4 font-bold">0</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center">
            <p className="text-gray-800 font-medium">Packages Declined</p>
            {/* --StatsPending-- */}
            <p className="text-4xl py-4 font-bold">0</p>
          </div>
        </div>
        <HorizontalLine />
        <p className="text-lg font-medium">Total Personal Leads Information</p>
        <div className="grid grid-cols-6 gap-4">
          {/* --StatsPending-- */}
          <StatsIconCard title={"Total Sales"} value={"0"} />
          <StatsCard title={"Total Leads"} value={"0"} />
          {/* --StatsPending-- */}
          <StatsCard title={"Total Event Days"} value={"0"} />
          {/* --StatsPending-- */}
        </div>
        <HorizontalLine />
        <p className="text-lg font-medium">Business</p>
        <div className="grid grid-cols-5 gap-4">
          <Select
            value={selectedBusinessMonth}
            onChange={(e) => setSelectedBusinessMonth(e.target.value)}
          >
            {businessStats?.map((i) => (
              <option value={i.month} key={i._id}>
                {i.month}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {/* --StatsPending-- */}
          <StatsCard
            title={"Packages"}
            value={
              businessStats?.find((i) => i.month === selectedBusinessMonth)
                ?.wedsyPackagesAmount
            }
            subtitle={
              businessStats?.find((i) => i.month === selectedBusinessMonth)
                ?.wedsyPackagesCount
            }
          />
          {/* --StatsPending-- */}
          <StatsCard
            title={"Bids"}
            value={
              businessStats?.find((i) => i.month === selectedBusinessMonth)
                ?.personalPackagesAmount
            }
            subtitle={
              businessStats?.find((i) => i.month === selectedBusinessMonth)
                ?.personalPackagesCount
            }
          />
          {/* --StatsPending-- */}
          <StatsCard
            title={"Personal"}
            value={
              businessStats?.find((i) => i.month === selectedBusinessMonth)
                ?.biddingAmount
            }
            subtitle={
              businessStats?.find((i) => i.month === selectedBusinessMonth)
                ?.biddingCount
            }
          />
        </div>
        <HorizontalLine />
        <p className="text-lg font-medium">Ongoing chats</p>
        <div className="grid grid-cols-6 gap-4">
          {/* --StatsPending-- */}
          <StatsCard title={"Total Chats"} value={"0"} />
          {/* --StatsPending-- */}
          <StatsCard title={"Bidding Chats"} value={"0"} />
          {/* --StatsPending-- */}
          <StatsCard title={"Package Chats"} value={"0"} />
        </div>
        <HorizontalLine />
        <p className="text-lg font-medium">Tasks</p>
        <div className="grid grid-cols-5 gap-4">
          {tasks.length > 0 && (
            <>
              <TextInput
                value={tasks[tasks.length - 1]?.task}
                readOnly
                className="col-span-4"
              />
              <TextInput
                type="datetime-local"
                value={
                  tasks.length > 0
                    ? new Date(tasks[tasks.length - 1]?.deadline)
                        .toLocaleString("sv-SE", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        .replace(" ", "T")
                    : ""
                }
                readOnly
              />
            </>
          )}
          <Button
            color="dark"
            onClick={() => {
              setAddNewTask({
                ...addNewTask,
                task: "",
                deadline: "",
                display: true,
              });
            }}
          >
            <BiPlus className="mr-2" size={24} /> Create Task
          </Button>
          <Button color="light" onClick={() => setDisplayTasksHistory(true)}>
            View History
          </Button>
        </div>
        <HorizontalLine />
        <p className="text-lg font-medium">Notes</p>
        <div className="grid grid-cols-5 gap-4">
          <Button
            color="dark"
            onClick={() => {
              setAddNewNote({
                ...addNewNote,
                text: "",
                display: true,
              });
            }}
          >
            <BiPlus className="mr-2" size={24} /> Create Note
          </Button>
          <Button color="success">Update</Button>
          <div className="col-span-3" />
          <p className="font-medium col-span-4">Previous Notes</p>
          <p className="font-medium">Date/Time</p>
          {notes
            ?.map((item, index) => (
              <>
                <TextInput value={item.text} readOnly className="col-span-4" />
                <TextInput
                  type="datetime-local"
                  readOnly
                  value={new Date(item.createdAt)
                    .toLocaleString("sv-SE", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    .replace(" ", "T")}
                />
              </>
            ))
            ?.reverse()}
        </div>
        <HorizontalLine />
        <NotificationCard
          link={`/vendors/${vendorId}/notifications`}
          list={notifications}
        />
      </div>
    </>
  );
}
