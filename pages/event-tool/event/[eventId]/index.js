import ImageCard from "@/components/cards/ImageCard";
import { uploadFile } from "@/utils/file";
import { resizeImageFile } from "@/utils/imageResize";
import { loadGoogleMaps } from "@/utils/loadGoogleMaps";
import { processMobileNumber } from "@/utils/phoneNumber";
import { toPriceString } from "@/utils/text";
import {
  Badge,
  Button,
  FileInput,
  Label,
  Modal,
  Select,
  Table,
  TextInput,
  Textarea,
  ToggleSwitch,
} from "flowbite-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { CgNotes } from "react-icons/cg";
import {
  BsChevronDown,
  BsChevronUp,
  BsPlus,
  BsPlusSlashMinus,
} from "react-icons/bs";
import {
  MdRefresh,
  MdDelete,
  MdEdit,
  MdDone,
  MdOutlineImage,
  MdDownload,
  MdLink,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdContentCopy,
  MdCheckCircleOutline,
} from "react-icons/md";

export default function Event({ message, setMessage }) {
  const router = useRouter();
  const { eventId } = router.query;
  // Event Tool View: default -> admin, other -> ops
  const [eventToolView, setEventToolView] = useState("admin");
  const [copied, setCopied] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState("");
  const [eventDayNotes, setEventDayNotes] = useState("");
  const [event, setEvent] = useState({});
  const [eventDay, setEventDay] = useState({});
  const [eventPlanner, setEventPlanner] = useState("");
  const [editEventPlanner, setEditEventPlanner] = useState(false);
  const [eventDayId, setEventDayId] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [colorList, setColorList] = useState([]);
  const [quantityList, setQuantityList] = useState([]);
  const [customItems, setCustomItems] = useState([]);
  const [mandatoryItems, setMandatoryItems] = useState([]);
  const [addDecorItem, setAddDecorItem] = useState({
    display: false,
    decor: "",
    platform: false,
    dimensions: { length: 0, breadth: 0, height: 0 },
    price: 0,
    flooring: "",
    category: "",
    variant: "",
    productVariant: "",
    quantity: 1,
    unit: "",
    productId: "",
    decorItem: {},
    searchQuery: "",
    decorList: [],
    platformRate: 0,
    flooringRate: 0,
    decorPrice: 0,
  });
  const ADD_PRODUCT_DRAFT_KEY =
    eventId && eventDayId
      ? `event-tool:add-product-draft:${eventId}:${eventDayId}`
      : null;
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editEventInfo, setEditEventInfo] = useState({
    edit: false,
    name: "",
    community: "",
  });
  const [editEventDayInfo, setEditEventDayInfo] = useState({
    edit: false,
    name: "",
    date: "",
    venue: "",
    eventSpace: "",
    location: { place_id: "", formatted_address: "", geometry: { lat: 0, lng: 0 } },
    time: "",
    eventDay: "",
  });
  const [addEventDay, setAddEventDay] = useState({
    add: false,
    name: "",
    date: "",
    venue: "",
    eventSpace: "",
    location: { place_id: "", formatted_address: "", geometry: { lat: 0, lng: 0 } },
    time: "",
  });
  const eventVenueInputRef = useRef(null);
  const [notes, setNotes] = useState({
    open: false,
    edit: false,
    decor_id: "",
    package_id: "",
    admin_notes: "",
    user_notes: "",
    notes: [],
  });
  const [editDecorSetupLocationImage, setEditDecorSetupLocationImage] =
    useState({
      open: false,
      decor_id: "",
      setupLocationImage: "",
      setupLocationImageFile: null,
    });
  const [editAddOns, setEditAddOns] = useState({
    open: false,
    edit: false,
    decor_id: "",
    package_id: "",
    addOns: [],
  });
  const [editAddOnNotes, setEditAddOnNotes] = useState({
    open: false,
    index: -1,
  });
  const [customItemImageUpload, setCustomItemImageUpload] = useState({
    display: false,
    itemIndex: -1,
    imageFile: "",
  });
  const [
    customItemSetupLocationImageUpload,
    setCustomItemSetupLocationImageUpload,
  ] = useState({
    display: false,
    itemIndex: -1,
    imageFile: "",
  });
  const [cashPayment, setCashPayment] = useState({
    amount: 0,
    display: false,
    method: "cash",
  });
  const customItemImageRef = useRef();
  const [editCustomItemsTitle, setEditCustomItemsTitle] = useState({
    display: false,
    customItemsTitle: "",
  });
  const [platformPrice, setPlatformPrice] = useState({ price: 0, image: "" });
  const [flooringPrice, setFlooringPrice] = useState([]);
  const [manageEventAccess, setManageEventAccess] = useState({
    display: false,
    eventAccess: [],
    addNewEventAccess: null,
  });
  const [tasks, setTasks] = useState([]);
  const [addNewTask, setAddNewTask] = useState({
    task: "",
    deadline: "",
    display: false,
  });
  const [displayTasksHistory, setDisplayTasksHistory] = useState(false);
  const [eventLostInfo, setEventLostInfo] = useState({
    display: false,
    responsesList: [],
    response: "",
  });
  const [eventNotes, setEventNotes] = useState("");
  const [editDecorIncluded, setEditDecorIncluded] = useState({
    decor_id: "",
    included: "",
  });
  const [editDecorDimensions, setEditDecorDimensions] = useState({
    decor_id: "",
    length: 0,
    breadth: 0,
    height: 0,
  });

  // Export UI (Download list)
  const [downloadWithPrice, setDownloadWithPrice] = useState(true);

  // Lead/User header info (matches design: Phone no., Email, Lead source, Lead status, Role)
  const [leadHeader, setLeadHeader] = useState({
    phone: "",
    email: "",
    source: "",
    status: "",
    role: "User",
  });

  const computeLeadStatusForEvent = ({ enquiry, eventObj }) => {
    if (enquiry?.isLost || eventObj?.status?.lost) return "Lost";
    // Use eventDate if present (server sets it), otherwise fall back to first event day date
    const candidateDate =
      eventObj?.eventDate ||
      eventObj?.eventDays?.[0]?.date ||
      eventObj?.date ||
      null;
    if (!candidateDate) return "New";
    const d = new Date(candidateDate);
    if (Number.isNaN(d.getTime())) return "New";
    const now = new Date();
    const diffDays = (d - now) / (1000 * 60 * 60 * 24);
    const diffWeeks = diffDays / 7;
    if (diffWeeks <= 8) return "Hot";
    if (diffWeeks <= 20) return "Warm";
    return "New";
  };

  const fetchLeadHeaderByPhone = ({ phone, eventObj }) => {
    if (!phone) return;
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/enquiry?search=${encodeURIComponent(
        phone
      )}&page=1&limit=1`,
      {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const enquiry = data?.list?.[0] || null;
        const status = computeLeadStatusForEvent({ enquiry, eventObj });
        setLeadHeader((prev) => ({
          ...prev,
          source: enquiry?.source || prev.source || "",
          status,
        }));
      })
      .catch(() => {
        // If enquiry fetch fails, keep user details and fall back to status derived from event only
        const status = computeLeadStatusForEvent({ enquiry: null, eventObj });
        setLeadHeader((prev) => ({ ...prev, status: prev.status || status }));
      });
  };

  const buildExportRows = ({ includePrice }) => {
    const days =
      eventDayId && eventDay?._id
        ? [eventDay]
        : Array.isArray(event?.eventDays)
        ? event.eventDays
        : [];

    const rows = [];
    days.forEach((day) => {
      const dayLabel = day?.name ? `(${day.name})` : "";

      (day?.decorItems || []).forEach((it) => {
        rows.push({
          day: dayLabel,
          type: "Decor",
          name: `${it?.decor?.name || ""} ${it?.productVariant || ""}`.trim(),
          qty: it?.quantity ?? 1,
          price: includePrice ? (it?.price ?? 0) : undefined,
        });
      });

      (day?.packages || []).forEach((pkg) => {
        rows.push({
          day: dayLabel,
          type: "Package",
          name: pkg?.package?.name || "",
          qty: 1,
          price: includePrice ? (pkg?.price ?? 0) : undefined,
        });
      });

      (day?.customItems || []).forEach((ci) => {
        rows.push({
          day: dayLabel,
          type: day?.customItemsTitle || "Add-Ons",
          name: ci?.name || "",
          qty: ci?.quantity ?? 1,
          price: includePrice ? (ci?.price ?? 0) : undefined,
        });
      });

      (day?.mandatoryItems || []).forEach((mi) => {
        rows.push({
          day: dayLabel,
          type: "Mandatory",
          name: mi?.description || mi?.title || "",
          qty: mi?.itemRequired ? 1 : 0,
          price: includePrice ? (mi?.price ?? 0) : undefined,
        });
      });
    });

    return rows;
  };

  const downloadBlob = ({ blob, filename }) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleDownloadExcel = () => {
    const includePrice = downloadWithPrice;
    const rows = buildExportRows({ includePrice });
    const headers = includePrice
      ? ["Event Day", "Type", "Item", "Qty", "Price"]
      : ["Event Day", "Type", "Item", "Qty"];
    const csvEscape = (v) => {
      const s = String(v ?? "");
      if (s.includes('"') || s.includes(",") || s.includes("\n")) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };
    const lines = [
      headers.join(","),
      ...rows.map((r) => {
        const base = [r.day, r.type, r.name, r.qty];
        if (includePrice) base.push(r.price);
        return base.map(csvEscape).join(",");
      }),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const suffix = includePrice ? "with-price" : "without-price";
    downloadBlob({
      blob,
      filename: `event-${eventId || "export"}-${suffix}.csv`,
    });
  };

  const handleDownloadPdf = () => {
    const includePrice = downloadWithPrice;
    const rows = buildExportRows({ includePrice });
    const title = `Event ${event?.name || eventId || ""} - ${
      includePrice ? "With price" : "Without price"
    }`;

    const tableHead = includePrice
      ? `<tr><th>Event Day</th><th>Type</th><th>Item</th><th>Qty</th><th>Price</th></tr>`
      : `<tr><th>Event Day</th><th>Type</th><th>Item</th><th>Qty</th></tr>`;

    const tableRows = rows
      .map((r) => {
        const cells = includePrice
          ? `<td>${r.day}</td><td>${r.type}</td><td>${r.name}</td><td>${r.qty}</td><td>${r.price ?? ""}</td>`
          : `<td>${r.day}</td><td>${r.type}</td><td>${r.name}</td><td>${r.qty}</td>`;
        return `<tr>${cells}</tr>`;
      })
      .join("");

    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 24px; }
      h1 { font-size: 16px; margin: 0 0 12px; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top; }
      th { background: #f3f4f6; }
    </style>
  </head>
  <body>
    <h1>${title}</h1>
    <table>
      <thead>${tableHead}</thead>
      <tbody>${tableRows}</tbody>
    </table>
    <script>
      window.onload = function () { window.print(); };
    </script>
  </body>
</html>`;

    const w = window.open("", "_blank");
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  };
  const fetchCategoryList = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setCategoryList(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchQuantityList = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/quantity`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setQuantityList(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchColorList = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/color`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setColorList(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const UpdateDecorIncluded = () => {
    setLoading(true);
    if (editDecorIncluded.decor_id) {
      let tempIncluded = editDecorIncluded.included
        .split("\n")
        .map((i) => i.trim())
        .filter((i) => i);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/decor/${eventDayId}/included`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            decor_id: editDecorIncluded.decor_id,
            included: tempIncluded,
          }),
        }
      )
        .then((response) => (response.ok ? response.json() : null))
        .then((response) => {
          if (response.message === "success") {
            setLoading(false);
            fetchEvent();
            setEditDecorIncluded({
              decor_id: "",
              included: "",
            });
            setMessage({
              text: "Included updated Successfully!",
              status: "success",
              display: true,
            });
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    } else {
      setLoading(false);
    }
  };
  const UpdateDecorSetupLocationImage = async () => {
    setLoading(true);
    if (editDecorSetupLocationImage.decor_id) {
      const resized = await resizeImageFile(
        editDecorSetupLocationImage.setupLocationImageFile,
        { maxWidth: 1600, maxHeight: 1600, quality: 0.82 }
      );
      let tempImage = await uploadFile({
        file: resized,
        path: "event-tool/setup-location-image",
        id: `${new Date().getTime()}-${eventId}-${
          editDecorSetupLocationImage.decor_id
        }`,
      });
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/decor/${eventDayId}/setup-location-image`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            decor_id: editDecorSetupLocationImage.decor_id,
            setupLocationImage: tempImage,
          }),
        }
      )
        .then((response) => (response.ok ? response.json() : null))
        .then((response) => {
          if (response.message === "success") {
            setLoading(false);
            fetchEvent();
            setEditDecorSetupLocationImage({
              open: false,
              decor_id: "",
              setupLocationImage: "",
              setupLocationImageFile: null,
            });
            setMessage({
              text: "Setup Location Image updated Successfully!",
              status: "success",
              display: true,
            });
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    } else {
      setLoading(false);
    }
  };
  const updateEventNotes = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        eventNotes,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          fetchEvent();
          setMessage({
            text: "Event notes updated Successfully!",
            status: "success",
            display: true,
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchEventLostResponses = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event-lost-response`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setEventLostInfo({
          ...eventLostInfo,
          display: true,
          responsesList: response,
        });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const markEventLost = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/lost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        lostResponse: eventLostInfo.response,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          fetchEvent();
          setEventLostInfo({
            ...eventLostInfo,
            display: false,
            responsesList: [],
            response: "",
          });
          setMessage({
            text: "Event marked as lost Successfully!",
            status: "success",
            display: true,
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchTasks = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/task?category=Event&referenceId=${eventId}`,
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
        category: "Event",
        referenceId: eventId,
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
  const fetchPlatformInfo = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/config?code=platform`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setPlatformPrice({
          image: "",
          ...response?.data,
          price: parseInt(response?.data?.price),
        });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchFlooringInfo = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/config?code=flooring`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setFlooringPrice(
          response?.data?.flooringList?.map((i) => ({
            ...i,
            price: parseInt(i.price),
          })) || []
        );
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchEvent = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}?populate=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setEvent(response);
        setLeadHeader({
          phone: response?.user?.phone || "",
          email: response?.user?.email || "",
          source: "",
          status: computeLeadStatusForEvent({ enquiry: null, eventObj: response }),
          role: "User",
        });
        fetchLeadHeaderByPhone({ phone: response?.user?.phone, eventObj: response });
        setEventPlanner(response?.eventPlanner || " ");
        setManageEventAccess({
          ...manageEventAccess,
          eventAccess: response.eventAccess || [],
          addNewEventAccess: null,
        });
        setEventNotes(response.eventNotes);
        setDiscount(response?.amount?.discount || 0);
        if (eventDayId && response._id) {
          let tempEventDay = response?.eventDays?.find(
            (item) => item._id === eventDayId
          );
          if (tempEventDay._id) {
            setEventDay(tempEventDay);
            setEventDayNotes(tempEventDay?.notes || "");
            setCustomItems(tempEventDay.customItems || []);
            setMandatoryItems(tempEventDay.mandatoryItems || []);
          } else {
            setEventDayId("");
            setCustomItems([]);
            setMandatoryItems([]);
          }
        } else {
          setEventDay({});
          setCustomItems([]);
          setMandatoryItems([]);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchEventMandatoryQuestions = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event-mandatory-question`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setMandatoryItems(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addEventAccess = async () => {
    setLoading(true);
    if (await processMobileNumber(manageEventAccess.addNewEventAccess)) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/event-access`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            phone: await processMobileNumber(
              manageEventAccess.addNewEventAccess
            ),
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.message === "success") {
            setLoading(false);
            setMessage({
              text: "Event access updated Successfully!",
              status: "success",
              display: true,
            });
            setManageEventAccess({
              ...manageEventAccess,
              display: false,
              addNewEventAccess: null,
            });
            fetchEvent();
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    } else {
      alert("Enter a valid phone number.");
      setLoading(false);
    }
  };
  const removeEventAccess = (phone) => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/event-access`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        phone,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          setMessage({
            text: "Event access updated Successfully!",
            status: "success",
            display: true,
          });
          setManageEventAccess({
            ...manageEventAccess,
            display: false,
          });
          fetchEvent();
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updateEvent = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: editEventInfo.name,
        community: editEventInfo.community,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          fetchEvent();
          setMessage({
            text: "Event updated Successfully!",
            status: "success",
            display: true,
          });
          setEditEventInfo({
            edit: false,
            name: "",
            community: "",
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updateEventPlanner = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/event-planner`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        eventPlanner,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          fetchEvent();
          setEditEventPlanner(false);
          setMessage({
            text: "Event updated Successfully!",
            status: "success",
            display: true,
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const shuffleEventDay = (tempEventDayId, direction) => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/shuffle-eventDay`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          eventDayId: tempEventDayId,
          direction,
        }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          fetchEvent();
          setMessage({
            text: "Event updated Successfully!",
            status: "success",
            display: true,
          });
        } else {
          alert(response.error);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updateEventDayNotes = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/notes/${eventDayId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          notes: eventDayNotes,
        }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          setEventDayNotes("");
          fetchEvent();
          setMessage({
            text: "Event day updated Successfully!",
            status: "success",
            display: true,
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updateEventDay = () => {
    if (editEventDayInfo.eventDay) {
      setLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/eventDay/${editEventDayInfo.eventDay}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: editEventDayInfo.name,
            date: editEventDayInfo.date,
            time: editEventDayInfo.time,
            venue: editEventDayInfo.venue,
            eventSpace: editEventDayInfo.eventSpace,
            location: editEventDayInfo.location,
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.message === "success") {
            setLoading(false);
            fetchEvent();
            setMessage({
              text: "Event day updated Successfully!",
              status: "success",
              display: true,
            });
            setEditEventDayInfo({
              edit: false,
              name: "",
              date: "",
              venue: "",
              eventSpace: "",
              location: { place_id: "", formatted_address: "", geometry: { lat: 0, lng: 0 } },
              time: "",
              eventDay: "",
            });
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  };
  const deleteEventDay = (tempEventDayId) => {
    if (tempEventDayId) {
      setLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/eventDay/${tempEventDayId}`,
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
          if (response.message === "success") {
            setLoading(false);
            fetchEvent();
            setMessage({
              text: "Event day deleted Successfully!",
              status: "success",
              display: true,
            });
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  };
  const addNewEventDay = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/eventDay/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: addEventDay.name,
        date: addEventDay.date,
        time: addEventDay.time,
        venue: addEventDay.venue,
        eventSpace: addEventDay.eventSpace,
        location: addEventDay.location,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          fetchEvent();
          setMessage({
            text: "Event day added Successfully!",
            status: "success",
            display: true,
          });
          setAddEventDay({
            add: false,
            name: "",
            date: "",
            venue: "",
            eventSpace: "",
            location: { place_id: "", formatted_address: "", geometry: { lat: 0, lng: 0 } },
            time: "",
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const finalizeEvent = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/finalize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          fetchEvent();
          setMessage({
            text: "Event finalized Successfully!",
            status: "success",
            display: true,
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const approveEvent = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        discount,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          fetchEvent();
          setMessage({
            text: "Event approved Successfully!",
            status: "success",
            display: true,
          });
          setDiscount(0);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const removeEventApproval = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/approve`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          fetchEvent();
          setMessage({
            text: "Event approval removed Successfully!",
            status: "failure",
            display: true,
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const removeEventFinalize = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/finalize`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          fetchEvent();
          setMessage({
            text: "Event finalization removed Successfully!",
            status: "failure",
            display: true,
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const approveEventDay = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/approve/${eventDayId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          fetchEvent();
          setMessage({
            text: "Event day approved Successfully!",
            status: "success",
            display: true,
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const removeEventDayApproval = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/approve/${eventDayId}`,
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
        if (response.message === "success") {
          setLoading(false);
          fetchEvent();
          setMessage({
            text: "Event day approval removed Successfully!",
            status: "failure",
            display: true,
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updateCustomItems = () => {
    if (eventDayId) {
      setLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/custom-items/${eventDayId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            customItems,
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.message === "success") {
            setLoading(false);
            fetchEvent();
            setMessage({
              text: "Custom Items updated Successfully!",
              status: "success",
              display: true,
            });
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  };
  const updateMandatoryItems = () => {
    if (eventDayId) {
      setLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/mandatory-items/${eventDayId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            mandatoryItems,
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.message === "success") {
            setLoading(false);
            fetchEvent();
            setMessage({
              text: "Mandatory Items updated Successfully!",
              status: "success",
              display: true,
            });
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  };
  const fetchDecorList = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/decor?searchFor=decorId&decorId=${addDecorItem?.productId}&limit=5`,
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
        setAddDecorItem({
          ...addDecorItem,
          decorList: response.list,
          decor: "",
          decorItem: "",
          flooringRate: 0,
          platformRate: 0,
          decorPrice: 0,
        });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const AddDecorItemToEvent = ({}) => {
    setLoading(true);
    const pathwayMultiplier =
      addDecorItem?.decorItem?.category === "Pathway" ? addDecorItem.quantity : 1;
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/decor/${eventDayId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          decor: addDecorItem.decor,
          platform: addDecorItem.platform,
          flooring: addDecorItem.flooring,
          dimensions: addDecorItem.dimensions,
          price:
            addDecorItem.quantity *
              (addDecorItem.decorItem?.productTypes?.find(
                (i) => i.name === addDecorItem.variant
              )?.sellingPrice +
                (addDecorItem.productVariant
                  ? addDecorItem.decorItem?.productVariants.find(
                      (i) => i.name === addDecorItem.productVariant
                    )?.priceModifier
                  : 0)) +
            (addDecorItem.platform
              ? addDecorItem.dimensions.length *
                addDecorItem.dimensions.breadth *
                platformPrice.price *
                pathwayMultiplier
              : 0) +
            (addDecorItem.dimensions.length + addDecorItem.dimensions.height) *
              (addDecorItem.dimensions.breadth +
                addDecorItem.dimensions.height) *
              (flooringPrice.find((i) => i.title === addDecorItem.flooring)
                ?.price || 0) *
              pathwayMultiplier,
          category: addDecorItem.decorItem?.category || "",
          variant: addDecorItem.variant,
          quantity: addDecorItem.quantity,
          unit: addDecorItem.decorItem.unit,
          platformRate: addDecorItem.platform ? platformPrice?.price : 0,
          flooringRate: addDecorItem.flooring
            ? flooringPrice.find((i) => i.title === addDecorItem.flooring)
                ?.price || 0
            : 0,
          decorPrice: addDecorItem.decorItem?.productTypes?.find(
            (i) => i.name === addDecorItem.variant
          )?.sellingPrice,
          productVariant: addDecorItem.productVariant || "",
          priceModifier: addDecorItem.productVariant
            ? addDecorItem.decorItem?.productVariants.find(
                (i) => i.name === addDecorItem.productVariant
              )?.priceModifier
            : 0,
          included: addDecorItem?.decorItem?.productInfo?.included || [],
        }),
      }
    )
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          try {
            if (ADD_PRODUCT_DRAFT_KEY) {
              sessionStorage.removeItem(ADD_PRODUCT_DRAFT_KEY);
            }
          } catch (e) {}
          fetchEvent();
          setAddDecorItem({
            ...addDecorItem,
            display: false,
            decor: "",
            platform: false,
            dimensions: { length: 0, breadth: 0, height: 0 },
            price: 0,
            flooring: "",
            category: "",
            variant: "",
            quantity: 1,
            unit: "",
            productId: "",
            decorItem: {},
            searchQuery: "",
            decorList: [],
            flooringRate: 0,
            platformRate: 0,
            decorPrice: 0,
          });
          setMessage({
            text: "Item added to event Successfully!",
            status: "success",
            display: true,
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const UpdateDecorItemInEvent = ({
    decor_id,
    platform,
    platformRate,
    flooring,
    flooringRate,
    decorPrice,
    dimensions,
    quantity,
    variant,
    category,
    unit,
    addOns,
    productVariant,
    priceModifier,
  }) => {
    setLoading(true);
    const pathwayMultiplier = category === "Pathway" ? quantity : 1;
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/decor/${eventDayId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          decor_id,
          platform,
          flooring,
          dimensions,
          category,
          variant,
          quantity,
          unit,
          decorPrice,
          platformRate,
          flooringRate,
          price:
            quantity * (decorPrice + priceModifier) +
            (platform
              ? dimensions.length * dimensions.breadth * platformPrice.price
              : 0) *
              pathwayMultiplier +
            (dimensions.length + dimensions.height) *
              (dimensions.breadth + dimensions.height) *
              (flooringPrice.find((i) => i.title === flooring)?.price || 0) +
            (category === "Pathway"
              ? (dimensions.length + dimensions.height) *
                (dimensions.breadth + dimensions.height) *
                (flooringPrice.find((i) => i.title === flooring)?.price || 0) *
                (pathwayMultiplier - 1)
              : 0) +
            addOns?.reduce((accumulator, currentValue) => {
              return accumulator + currentValue.price;
            }, 0),
          productVariant,
          priceModifier,
        }),
      }
    )
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          fetchEvent();

          setMessage({
            text: "Decor Updated Successfully!",
            status: "success",
            display: true,
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const UpdateDecorItemPrimaryColorInEvent = ({ decor_id, primaryColor }) => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/decor/${eventDayId}/primary-color`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          decor_id,
          primaryColor,
        }),
      }
    )
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          fetchEvent();
          setMessage({
            text: "Decor Color Updated Successfully!",
            status: "success",
            display: true,
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const UpdateDecorItemSecondaryColorInEvent = ({
    decor_id,
    secondaryColor,
  }) => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/decor/${eventDayId}/secondary-color`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          decor_id,
          secondaryColor,
        }),
      }
    )
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          fetchEvent();
          setMessage({
            text: "Decor Color Updated Successfully!",
            status: "success",
            display: true,
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const RemoveDecorFromEvent = ({ decor_id }) => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/decor/${eventDayId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          decor: decor_id,
        }),
      }
    )
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          fetchEvent();
          setMessage({
            text: "Item removed from event Successfully!",
            status: "success",
            display: true,
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const RemovePackageFromEvent = ({ package_id }) => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/decor-package/${eventDayId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          package: package_id,
        }),
      }
    )
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          fetchEvent();
          setMessage({
            text: "Item removed from event Successfully!",
            status: "success",
            display: true,
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const UpdateNotes = async () => {
    setLoading(true);
    Promise.all(
      notes?.notes?.map(async (i, index) => {
        if (i.imageFile) {
          const resized = await resizeImageFile(i.imageFile, {
            maxWidth: 1600,
            maxHeight: 1600,
            quality: 0.82,
          });
          let tempImage = await uploadFile({
            file: resized,
            path: "event-tool/notes",
            id: `${new Date().getTime()}-${eventId}-${notes.decor_id}-${index}`,
          });
          return {
            text: i.text,
            image: tempImage,
          };
        } else {
          return {
            text: i.text,
            image: i.image,
          };
        }
      })
    )
      .then((tempResult) => {
        let tempNotes = tempResult.filter((i) => {
          return i.image || i.text;
        });
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/eventDay/${eventDayId}/notes`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              decor_id: notes.decor_id,
              package_id: notes.package_id,
              admin_notes: notes.admin_notes,
              user_notes: notes.user_notes,
              notes: tempNotes,
            }),
          }
        )
          .then((response) => (response.ok ? response.json() : null))
          .then((response) => {
            if (response.message === "success") {
              setLoading(false);
              fetchEvent();
              setNotes({
                open: false,
                edit: false,
                decor_id: "",
                package_id: "",
                admin_notes: "",
                user_notes: "",
                notes: [],
              });
              setMessage({
                text: "Notes updated Successfully!",
                status: "success",
                display: true,
              });
            }
          })
          .catch((error) => {
            console.error(
              "There was a problem with the fetch operation:",
              error
            );
          });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const UpdateAddOns = () => {
    setLoading(true);
    if (editAddOns.decor_id) {
      let tempItem = eventDay?.decorItems?.find(
        (i) => i.decor._id === editAddOns.decor_id
      );
      let tempPrice =
        (tempItem.decorPrice + tempItem.priceModifier) * tempItem.quantity +
        tempItem.dimensions.length *
          tempItem.dimensions.breadth *
          tempItem.platformRate +
        (tempItem.dimensions.length + tempItem.dimensions.height) *
          (tempItem.dimensions.breadth + tempItem.dimensions.height) *
          tempItem.flooringRate;
      let tempFinalPrice =
        tempPrice +
        editAddOns.addOns?.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.price;
        }, 0);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/decor/${eventDayId}/add-ons`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            decor_id: editAddOns.decor_id,
            addOns: editAddOns.addOns,
            price: tempFinalPrice,
          }),
        }
      )
        .then((response) => (response.ok ? response.json() : null))
        .then((response) => {
          if (response.message === "success") {
            setLoading(false);
            fetchEvent();
            setEditAddOns({
              open: false,
              edit: false,
              decor_id: "",
              package_id: "",
              addOns: [],
            });
            setMessage({
              text: "Add-Ons updated Successfully!",
              status: "success",
              display: true,
            });
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    } else {
      setLoading(false);
    }
  };
  const SendEventToClient = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          setMessage({
            text: "Event sent to Client Successfully!",
            status: "success",
            display: true,
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const SendEventBookingReminder = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/booking-reminder`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          setMessage({
            text: "Event Booking Reminder Sent Successfully!",
            status: "success",
            display: true,
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const UploadCustomImage = async () => {
    setLoading(true);
    let tempImage = await uploadFile({
      file: customItemImageUpload.imageFile,
      path: "event-tool/custom-items",
      id: `${new Date().getTime()}-${eventId}-${customItems[
        customItemImageUpload.itemIndex
      ].name
        .substring(0, 10)
        .replace(/[^a-zA-Z0-9]/g, "-")}`,
    });
    if (tempImage) {
      setCustomItems(
        customItems.map((item, index) => {
          if (index === customItemImageUpload.itemIndex) {
            return { ...item, image: tempImage };
          } else {
            return item;
          }
        })
      );
      setLoading(false);
      setMessage({
        text: "Image Uploaded Successfully!",
        status: "success",
        display: true,
      });
      setCustomItemImageUpload({
        display: false,
        itemIndex: -1,
        imageFile: "",
      });
    }
  };
  const UploadCustomSetupLocationImage = async () => {
    setLoading(true);
    let tempImage = await uploadFile({
      file: customItemSetupLocationImageUpload.imageFile,
      path: "event-tool/setup-location-image",
      id: `${new Date().getTime()}-${eventId}-${customItems[
        customItemSetupLocationImageUpload.itemIndex
      ].name
        .substring(0, 10)
        .replace(/[^a-zA-Z0-9]/g, "-")}`,
    });
    if (tempImage) {
      setCustomItems(
        customItems.map((item, index) => {
          if (index === customItemSetupLocationImageUpload.itemIndex) {
            return { ...item, setupLocationImage: tempImage };
          } else {
            return item;
          }
        })
      );
      setLoading(false);
      setMessage({
        text: "Image Uploaded Successfully!",
        status: "success",
        display: true,
      });
      setCustomItemSetupLocationImageUpload({
        display: false,
        itemIndex: -1,
        imageFile: "",
      });
    }
  };
  const CreateCashPayment = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        event: eventId,
        paymentFor: "event",
        paymentMethod: cashPayment?.method,
        amount: cashPayment?.amount,
        user: event?.user?._id,
      }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          setMessage({
            text: "Cash Payment added Successfully!",
            status: "success",
            display: true,
          });
          setCashPayment({ amount: 0, display: false, method: "cash" });
          fetchEvent();
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updateCustomItemsTitleInEventDay = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/custom-items-title/${eventDayId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          customItemsTitle: editCustomItemsTitle.customItemsTitle,
        }),
      }
    )
      .then((response) => (response.ok ? response.json() : null))
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          setMessage({
            text: "Custom Items Title Updated Successfully!",
            status: "success",
            display: true,
          });
          setEditCustomItemsTitle({ customItemsTitle: "", display: false });
          fetchEvent();
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    if (eventId) {
      fetchEvent();
      fetchTasks();
      fetchFlooringInfo();
      fetchPlatformInfo();
      fetchCategoryList();
      fetchColorList();
      fetchQuantityList();
    }
  }, [eventId]);
  useEffect(() => {
    if (eventDayId && event._id) {
      let tempEventDay = event?.eventDays?.find(
        (item) => item._id === eventDayId
      );
      if (tempEventDay._id) {
        setEventDay(tempEventDay);
        setCustomItems(tempEventDay.customItems || []);
        setMandatoryItems(tempEventDay.mandatoryItems || []);
      } else {
        setEventDayId("");
        setCustomItems([]);
        setMandatoryItems([]);
      }
    } else {
      setEventDay({});
      setCustomItems([]);
      setMandatoryItems([]);
    }
  }, [eventDayId, event._id]);
  useEffect(() => {
    if (addDecorItem?.productId && !loading) {
      fetchDecorList();
    }
  }, [addDecorItem.productId]);

  // Autosave: Add Product modal draft (session-only, minimal payload)
  useEffect(() => {
    if (!ADD_PRODUCT_DRAFT_KEY) return;
    if (!addDecorItem?.display) return;

    const t = setTimeout(() => {
      try {
        // Store ONLY minimal, serializable fields (no decorList/decorItem images)
        const draft = {
          v: 1,
          savedAt: Date.now(),
          productId: addDecorItem.productId || "",
          decor: addDecorItem.decor || "",
          variant: addDecorItem.variant || "",
          productVariant: addDecorItem.productVariant || "",
          quantity: addDecorItem.quantity || 1,
          unit: addDecorItem.unit || "",
          platform: !!addDecorItem.platform,
          flooring: addDecorItem.flooring || "",
          dimensions: addDecorItem.dimensions || {
            length: 0,
            breadth: 0,
            height: 0,
          },
        };

        const json = JSON.stringify(draft);
        // safety cap: do not store very large payloads
        if (json.length > 25_000) return;
        sessionStorage.setItem(ADD_PRODUCT_DRAFT_KEY, json);
      } catch (e) {}
    }, 400); // debounce typing

    return () => clearTimeout(t);
  }, [
    ADD_PRODUCT_DRAFT_KEY,
    addDecorItem?.display,
    addDecorItem?.productId,
    addDecorItem?.decor,
    addDecorItem?.variant,
    addDecorItem?.productVariant,
    addDecorItem?.quantity,
    addDecorItem?.unit,
    addDecorItem?.platform,
    addDecorItem?.flooring,
    addDecorItem?.dimensions?.length,
    addDecorItem?.dimensions?.breadth,
    addDecorItem?.dimensions?.height,
  ]);

  // Restore draft when opening Add Product modal (only for current event+eventDay)
  useEffect(() => {
    if (!ADD_PRODUCT_DRAFT_KEY) return;
    if (!addDecorItem?.display) return;
    // only restore if current modal is empty
    if (addDecorItem?.productId || addDecorItem?.decor) return;

    try {
      const raw = sessionStorage.getItem(ADD_PRODUCT_DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw);
      // Ignore very old drafts (24h)
      if (draft?.savedAt && Date.now() - draft.savedAt > 24 * 60 * 60 * 1000) {
        sessionStorage.removeItem(ADD_PRODUCT_DRAFT_KEY);
        return;
      }

      setAddDecorItem((prev) => ({
        ...prev,
        productId: draft?.productId || "",
        decor: draft?.decor || "",
        variant: draft?.variant || "",
        productVariant: draft?.productVariant || "",
        quantity: draft?.quantity || 1,
        unit: draft?.unit || "",
        platform: !!draft?.platform,
        flooring: draft?.flooring || "",
        dimensions: draft?.dimensions || { length: 0, breadth: 0, height: 0 },
        // Reset derived/heavy fields (will be refetched/recomputed)
        decorItem: {},
        decorList: [],
        platformRate: 0,
        flooringRate: 0,
        decorPrice: 0,
      }));
    } catch (e) {}
  }, [ADD_PRODUCT_DRAFT_KEY, addDecorItem?.display]);

  // Google Places Autocomplete for Event Day Venue (edit/add)
  useEffect(() => {
    const shouldInit = editEventDayInfo.edit || addEventDay.add;
    if (!shouldInit) return;

    const init = async () => {
      try {
        const google = await loadGoogleMaps();
        if (!google?.maps?.places || !eventVenueInputRef.current) return;

        const autocomplete = new google.maps.places.Autocomplete(
          eventVenueInputRef.current,
          { types: ["geocode"] }
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place?.geometry) return;

          const loc = {
            place_id: place.place_id || "",
            formatted_address: place.formatted_address || "",
            geometry: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
          };

          if (editEventDayInfo.edit) {
            setEditEventDayInfo((prev) => ({
              ...prev,
              venue: loc.formatted_address || prev.venue,
              location: loc,
            }));
          } else if (addEventDay.add) {
            setAddEventDay((prev) => ({
              ...prev,
              venue: loc.formatted_address || prev.venue,
              location: loc,
            }));
          }
        });
      } catch (e) {
        // ignore
      }
    };

    // slight delay so input is in DOM
    const t = setTimeout(init, 50);
    return () => clearTimeout(t);
  }, [editEventDayInfo.edit, addEventDay.add]);

  return (
    <>
      {enlargedImage && (
        <div className="fixed z-50 h-screen w-screen top-0 left-0">
          <div
            className="blur-md bg-white opacity-50 backdrop-filter-blur fixed z-50 h-screen w-screen top-0 left-0 cursor-pointer"
            onClick={() => {
              setEnlargedImage("");
            }}
          />
          <img
            src={enlargedImage}
            className="w-full h-full object-contain fixed z-50 top-0 left-0 p-16 cursor-pointer"
            onClick={() => {
              setEnlargedImage("");
            }}
          />
        </div>
      )}
      {/* Tasks Hstory Modal */}
      <Modal
        show={displayTasksHistory || false}
        size="lg"
        popup
        onClose={() => setDisplayTasksHistory(false)}
      >
        <Modal.Header>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white px-4">
            Task History for {event.name}
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
            Add New Task for {event.name}
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
      {/* Event Lost Modal */}
      <Modal
        show={eventLostInfo?.display || false}
        size="lg"
        popup
        onClose={() =>
          setEventLostInfo({
            ...eventLostInfo,
            display: false,
            response: "",
          })
        }
      >
        <Modal.Header>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white px-4">
            Mark the Event as Lost?
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            <Select
              value={eventLostInfo.response}
              disabled={loading}
              onChange={(e) => {
                setEventLostInfo({
                  ...eventLostInfo,
                  response: e.target.value,
                });
              }}
            >
              <option value="">Select Response</option>
              {eventLostInfo.responsesList?.map((item, index) => (
                <option value={item.title} key={index}>
                  {item.title}
                </option>
              ))}
            </Select>
            <TextInput
              value={eventLostInfo.response}
              disabled={loading}
              onChange={(e) => {
                setEventLostInfo({
                  ...eventLostInfo,
                  response: e.target.value,
                });
              }}
            />
            <Button
              color={"failure"}
              onClick={() => {
                markEventLost();
              }}
              disabled={loading || !eventLostInfo.response}
            >
              Mark as Lost
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      {/* Event Access Modal */}
      <Modal
        show={manageEventAccess?.display || false}
        size="lg"
        popup
        onClose={() =>
          setManageEventAccess({
            ...manageEventAccess,
            display: false,
            addNewEventAccess: null,
          })
        }
      >
        <Modal.Header>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white px-4">
            Manage Access for {event.name}
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            {event.eventAccess?.map((item, index) => (
              <div className="flex flex-row items-center gap-2" key={index}>
                <TextInput
                  value={item}
                  readOnly={true}
                  disabled={loading}
                  className="grow"
                />
                <Button
                  size={"sm"}
                  onClick={() => {
                    removeEventAccess(item);
                  }}
                  color="failure"
                >
                  <MdDelete
                    size={24}
                    cursor={"pointer"}
                    className="hover:text-blue-700"
                  />
                </Button>
              </div>
            ))}

            {![null, undefined].includes(
              manageEventAccess.addNewEventAccess
            ) && (
              <TextInput
                value={manageEventAccess.addNewEventAccess}
                disabled={loading}
                onChange={(e) => {
                  setManageEventAccess({
                    ...manageEventAccess,
                    addNewEventAccess: e.target.value,
                  });
                }}
              />
            )}
            <Button
              color={
                [null, undefined].includes(manageEventAccess.addNewEventAccess)
                  ? "gray"
                  : "success"
              }
              onClick={() => {
                if (
                  [null, undefined].includes(
                    manageEventAccess.addNewEventAccess
                  )
                ) {
                  setManageEventAccess({
                    ...manageEventAccess,
                    addNewEventAccess: "",
                  });
                } else {
                  addEventAccess();
                }
              }}
            >
              {[null, undefined].includes(
                manageEventAccess.addNewEventAccess
              ) ? (
                <>
                  <BsPlus /> Add New
                </>
              ) : (
                <>Save</>
              )}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      {/* Cash Payment Modal */}
      <Modal
        show={cashPayment?.display || false}
        size="lg"
        popup
        onClose={() =>
          setCashPayment({
            display: false,
            amount: 0,
            method: "cash",
          })
        }
      >
        <Modal.Header>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white px-4">
            Cash Payment for {event.name}
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-6">
            <div>
              <Label value="Payment Method:" />
              <Select
                value={cashPayment?.method}
                onChange={(e) => {
                  setCashPayment({
                    ...cashPayment,
                    method: e.target.value,
                  });
                }}
                disabled={loading}
              >
                <option value={"cash"}>Cash</option>
                <option value={"upi"}>UPI</option>
                <option value={"bank-transfer"}>Bank Transfer</option>
              </Select>
            </div>
            <div>
              <Label value="Enter Amount:" />
              <TextInput
                type="number"
                value={cashPayment?.amount}
                onChange={(e) => {
                  setCashPayment({
                    ...cashPayment,
                    amount: parseInt(e.target.value) || 0,
                  });
                }}
                disabled={loading}
              />
            </div>
            <Button
              color="success"
              onClick={() => {
                CreateCashPayment();
              }}
              disabled={loading}
            >
              Add Cash Payment
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      {/* Custom Items/Add-Ons Title Modal */}
      <Modal
        show={editCustomItemsTitle?.display || false}
        size="lg"
        popup
        onClose={() =>
          setEditCustomItemsTitle({
            display: false,
            customItemsTitle: 0,
          })
        }
      >
        <Modal.Header>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white px-4">
            Title for Custom Items/Add-Ons
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-6">
            <div>
              <Label value="Enter Title:" />
              <TextInput
                value={editCustomItemsTitle?.customItemsTitle}
                onChange={(e) => {
                  setEditCustomItemsTitle({
                    ...editCustomItemsTitle,
                    customItemsTitle: e.target.value,
                  });
                }}
                disabled={loading}
              />
            </div>
            <Button
              color="success"
              onClick={() => {
                updateCustomItemsTitleInEventDay();
              }}
              disabled={loading}
            >
              Update
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      {/* Notes Modal */}
      <Modal
        show={notes?.open || false}
        size="4xl"
        popup
        onClose={() =>
          setNotes({
            open: false,
            edit: false,
            event_id: "",
            eventDay: "",
            decor_id: "",
            package_id: "",
            admin_notes: "",
            user_notes: "",
            notes: [],
          })
        }
      >
        <Modal.Header>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white px-4">
            Notes
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-6">
            {notes?.notes?.map((i, index) => (
              <div className="grid grid-cols-4 gap-2" key={index}>
                <Textarea
                  rows={3}
                  value={i.text}
                  onChange={(e) => {
                    setNotes({
                      ...notes,
                      notes: notes?.notes?.map((rec, recIndex) =>
                        recIndex === index
                          ? { ...rec, text: e.target.value }
                          : rec
                      ),
                    });
                  }}
                  readOnly={!notes?.edit}
                  disabled={!notes?.edit}
                  className="col-span-2"
                />
                {i.image ? (
                  <div className="relative">
                    <Image
                      src={i.image}
                      alt="Note"
                      sizes="100%"
                      width={0}
                      height={0}
                      className="w-full h-auto cursor-pointer"
                      onClick={() => {
                        setEnlargedImage(i.image);
                      }}
                    />
                    {/* Delete image only (do not delete whole note row) */}
                    {notes?.edit && (
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-white/90 border border-gray-200 rounded-md p-1 hover:bg-white"
                        onClick={() => {
                          setNotes({
                            ...notes,
                            notes: notes?.notes?.map((rec, recIndex) =>
                              recIndex === index
                                ? { ...rec, image: "", imageFile: null }
                                : rec
                            ),
                          });
                        }}
                      >
                        <MdDelete />
                      </button>
                    )}
                  </div>
                ) : (
                  <div />
                )}
                <div className="flex flex-row gap-2 items-center">
                  <FileInput
                    disabled={loading || !notes?.edit}
                    onChange={(e) => {
                      setNotes({
                        ...notes,
                        notes: notes?.notes?.map((rec, recIndex) =>
                          recIndex === index
                            ? { ...rec, imageFile: e.target.files[0] }
                            : rec
                        ),
                      });
                    }}
                  />
                  {notes?.edit && (
                    <Button
                      color="failure"
                      onClick={() => {
                        setNotes({
                          ...notes,
                          notes: notes?.notes?.filter(
                            (rec, recIndex) => recIndex !== index
                          ),
                        });
                      }}
                    >
                      <MdDelete />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {notes?.edit && (
              <Button
                color="gray"
                onClick={() => {
                  setNotes({
                    ...notes,
                    notes: [...notes?.notes, { text: "", image: "" }],
                  });
                }}
              >
                <BsPlus />
                Add New
              </Button>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label value="Notes (For Users and Admin):" />
                <Textarea
                  rows={3}
                  value={notes?.user_notes}
                  onChange={(e) => {
                    setNotes({ ...notes, user_notes: e.target.value });
                  }}
                  readOnly={!notes?.edit}
                  disabled={!notes?.edit}
                />
              </div>
              <div>
                <Label value="Notes (For Admin Only):" />
                <Textarea
                  rows={3}
                  value={notes?.admin_notes}
                  onChange={(e) => {
                    setNotes({ ...notes, admin_notes: e.target.value });
                  }}
                  readOnly={!notes?.edit}
                  disabled={!notes?.edit}
                />
              </div>
            </div>
            <Button
              color="success"
              onClick={() => {
                if (!notes?.edit) {
                  setNotes({ ...notes, edit: true });
                } else {
                  UpdateNotes();
                }
              }}
            >
              {notes?.edit ? "Save Notes" : "Edit Notes"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      {/* Add-Ons Modal */}
      <Modal
        show={editAddOns?.open || false}
        size="4xl"
        popup
        onClose={() =>
          setEditAddOns({
            open: false,
            edit: false,
            decor_id: "",
            package_id: "",
            addOns: [],
          })
        }
      >
        <Modal.Header>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white px-4">
            Add-Ons
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-6">
            <Table hoverable className="width-full overflow-x-auto">
              <Table.Head>
                <Table.HeadCell className="w-[60%]">Item Name</Table.HeadCell>
                <Table.HeadCell className="w-[25%]">Price</Table.HeadCell>
                <Table.HeadCell className="w-[15%]">Notes</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {editAddOns?.addOns?.map((item, index) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={item._id}
                  >
                    <Table.Cell className="min-w-[420px]">
                      <TextInput
                        placeholder="Item Name"
                        value={item.name}
                        disabled={loading || event?.status?.approved}
                        className="w-full"
                        onChange={(e) => {
                          setEditAddOns({
                            ...editAddOns,
                            addOns: editAddOns?.addOns?.map((rec, recIndex) => {
                              if (recIndex === index) {
                                return { ...rec, name: e.target.value };
                              } else {
                                return rec;
                              }
                            }),
                          });
                        }}
                      />
                    </Table.Cell>
                    <Table.Cell className="flex flex-row gap-2 items-center min-w-[220px]">
                      <TextInput
                        placeholder="Price"
                        type="number"
                        value={item.price}
                        disabled={loading || event?.status?.approved}
                        className="w-[120px]"
                        onChange={(e) => {
                          setEditAddOns({
                            ...editAddOns,
                            addOns: editAddOns?.addOns?.map((rec, recIndex) => {
                              if (recIndex === index) {
                                return {
                                  ...rec,
                                  price: parseInt(e.target.value),
                                };
                              } else {
                                return rec;
                              }
                            }),
                          });
                        }}
                      />
                      <Button
                        color="gray"
                        className="px-2"
                        onClick={() => {
                          setEditAddOns({
                            ...editAddOns,
                            addOns: editAddOns?.addOns?.map((rec, recIndex) => {
                              if (recIndex === index) {
                                return {
                                  ...rec,
                                  price: rec.price * -1,
                                };
                              } else {
                                return rec;
                              }
                            }),
                          });
                        }}
                      >
                        <BsPlusSlashMinus />
                      </Button>
                      {!(loading || event?.status?.approved) && (
                        <MdDelete
                          size={24}
                          cursor={"pointer"}
                          className="hover:text-blue-700 flex-shrink-0"
                          onClick={() =>
                            setEditAddOns({
                              ...editAddOns,
                              addOns: editAddOns?.addOns?.filter(
                                (rec, recIndex) => recIndex !== index
                              ),
                            })
                          }
                        />
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        color="light"
                        className="w-full justify-center"
                        disabled={loading}
                        onClick={() => setEditAddOnNotes({ open: true, index })}
                      >
                        Notes
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <div className="flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  if (!editAddOns?.edit) {
                    setEditAddOns({ ...editAddOns, edit: true });
                  } else {
                    UpdateAddOns();
                  }
                }}
              >
                {editAddOns?.edit ? "Save Add-Ons" : "Edit Add-Ons"}
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setEditAddOns({
                    ...editAddOns,
                    addOns: [
                      ...editAddOns?.addOns,
                      { name: "", price: 0, notes: "" },
                    ],
                  });
                }}
              >
                <BsPlus /> Add New
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Add-on Notes Modal */}
      <Modal
        show={editAddOnNotes.open}
        size="lg"
        popup
        onClose={() => setEditAddOnNotes({ open: false, index: -1 })}
      >
        <Modal.Header>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white px-4">
            Add-on Notes
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            <Textarea
              rows={6}
              placeholder="Write notes for this add-on..."
              value={
                editAddOnNotes.index >= 0
                  ? editAddOns?.addOns?.[editAddOnNotes.index]?.notes || ""
                  : ""
              }
              disabled={loading || event?.status?.approved}
              onChange={(e) => {
                if (editAddOnNotes.index < 0) return;
                setEditAddOns({
                  ...editAddOns,
                  addOns: editAddOns?.addOns?.map((rec, recIndex) =>
                    recIndex === editAddOnNotes.index
                      ? { ...rec, notes: e.target.value }
                      : rec
                  ),
                });
              }}
            />
            <div className="flex gap-3 justify-end">
              <Button
                color="gray"
                onClick={() => setEditAddOnNotes({ open: false, index: -1 })}
              >
                Done
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* Decor Setup Location Image Modal */}
      <Modal
        show={editDecorSetupLocationImage?.open || false}
        size="lg"
        popup
        onClose={() =>
          setEditDecorSetupLocationImage({
            open: false,
            decor_id: "",
            setupLocationImage: "",
            setupLocationImageFile: null,
          })
        }
      >
        <Modal.Header>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white px-4">
            Setup Location Image
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-6">
            {editDecorSetupLocationImage.setupLocationImage && (
              <Image
                src={editDecorSetupLocationImage.setupLocationImage}
                alt="Decor"
                sizes="100%"
                width={0}
                height={0}
                className="w-full h-auto cursor-pointer"
                onClick={() => {
                  setEnlargedImage(
                    editDecorSetupLocationImage.setupLocationImage
                  );
                }}
              />
            )}
            <FileInput
              disabled={loading}
              onChange={(e) => {
                setEditDecorSetupLocationImage({
                  ...editDecorSetupLocationImage,
                  setupLocationImageFile: e.target.files[0],
                });
              }}
            />
            <Button
              color="success"
              onClick={() => {
                UpdateDecorSetupLocationImage();
              }}
              disabled={
                loading || !editDecorSetupLocationImage.setupLocationImageFile
              }
            >
              Update Image
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <div className="p-8 w-full">
        <div className="bg-white shadow-xl rounded-3xl p-8 w-full flex flex-col gap-4 ">
          <div className="flex flex-row items-center gap-4">
            <p className="text-xl font-medium">{event.name}</p>
            <Button
              color="light"
              className="whitespace-nowrap"
              disabled={loading}
              onClick={() => {
                navigator.clipboard
                  .writeText(`https://wedsy.in/event/${event?._id}/view`)
                  .then(
                    () => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    },
                    (err) => {
                      console.error("Failed to copy text: ", err);
                    }
                  );
              }}
            >
              {copied ? (
                <>
                  Copied <MdCheckCircleOutline className="ml-1" size={18} />
                </>
              ) : (
                <>
                  Copy Link <MdContentCopy className="ml-1" size={18} />
                </>
              )}
            </Button>
            <MdRefresh
              // className="mr-auto"
              onClick={() => {
                fetchEvent();
              }}
              cursor={"pointer"}
              size={24}
            />
            {event?.status?.completed ? (
              <Badge size="sm" color="gray">
                Completed
              </Badge>
            ) : event?.status?.paymentDone ? (
              <Badge size="sm" color="success">
                Payment Completed
              </Badge>
            ) : event?.status?.approved ? (
              <Badge size="sm" color="indigo">
                Approved
              </Badge>
            ) : event?.status?.finalized ? (
              <Badge size="sm" color="purple">
                Finalized
              </Badge>
            ) : null}
            <Button
              className="ml-auto"
              onClick={() => {
                setEventLostInfo({
                  ...eventLostInfo,
                  response: "",
                  display: true,
                });
                fetchEventLostResponses();
              }}
              color={"failure"}
              disabled={loading}
            >
              Mark as Lost
            </Button>
          </div>

          {/* NEW: Lead/User header fields (matches design) */}
          <div className="flex flex-row gap-4 w-full">
            <div className="flex-1">
              <TextInput
                placeholder="Phone no."
                value={leadHeader.phone}
                readOnly
                disabled={!leadHeader.phone}
              />
            </div>
            <div className="flex-1">
              <TextInput
                placeholder="Email"
                value={leadHeader.email}
                readOnly
                disabled={!leadHeader.email}
              />
            </div>
            <div className="flex-1">
              <TextInput
                placeholder="Lead source"
                value={leadHeader.source}
                readOnly
                disabled={!leadHeader.source}
              />
            </div>
            <div className="flex-1">
              <TextInput
                placeholder="Lead status"
                value={leadHeader.status}
                readOnly
                disabled={!leadHeader.status}
              />
            </div>
            <div className="flex-1">
              <TextInput
                placeholder="Role"
                value={leadHeader.role}
                readOnly
                disabled={!leadHeader.role}
              />
            </div>
          </div>

          <p>
            User: {event?.user?.name} [{event?.user?.phone} |{" "}
            {event?.user?.email}]
          </p>
          <p className="-pt-4 text-sm">
            Created At: {new Date(event?.createdAt).toLocaleString()}
          </p>
          <div key={event?._id} className="border-b-2 border-b-black pb-4">
            <div className="mb-2 grid grid-cols-3 gap-4 items-end">
              <div>
                <Label value="Event Name" />
                <TextInput
                  placeholder="Event Name"
                  value={editEventInfo.edit ? editEventInfo.name : event.name}
                  readOnly={!editEventInfo.edit}
                  disabled={loading}
                  onChange={(e) => {
                    setEditEventInfo({
                      ...editEventInfo,
                      name: e.target.value,
                    });
                  }}
                />
              </div>
              <div>
                <Label value="Event Community" />
                <TextInput
                  placeholder="Event Community"
                  value={
                    editEventInfo.edit
                      ? editEventInfo.community
                      : event.community
                  }
                  readOnly={!editEventInfo.edit}
                  disabled={loading}
                  onChange={(e) => {
                    setEditEventInfo({
                      ...editEventInfo,
                      community: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex gap-3 flex-wrap">
                <Button
                  className=""
                  onClick={() => {
                    if (editEventInfo.edit) {
                      updateEvent();
                    } else {
                      setEditEventInfo({
                        edit: true,
                        name: event.name,
                        community: event.community,
                      });
                    }
                  }}
                  color={editEventInfo.edit ? "success" : "dark"}
                  disabled={
                    loading ||
                    (editEventInfo.edit &&
                      (!editEventInfo.name || !editEventInfo.community))
                  }
                >
                  {editEventInfo.edit ? "Update" : "Edit"}
                </Button>
                {editEventInfo.edit && (
                  <Button
                    color="failure"
                    onClick={() => {
                      setEditEventInfo({ ...editEventInfo, edit: false });
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  color="dark"
                  onClick={() => {
                    setManageEventAccess({
                      ...manageEventAccess,
                      display: true,
                    });
                  }}
                  disabled={loading}
                >
                  Manage Access
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-4 gap-y-0 mb-6">
              <Label value="Event Planner" className="col-span-6" />
              <TextInput
                placeholder="Event Planner"
                value={eventPlanner}
                readOnly={!editEventPlanner}
                disabled={loading}
                onChange={(e) => {
                  setEventPlanner(e.target.value);
                }}
              />
              {!editEventPlanner && (
                <Button
                  onClick={() => {
                    setEditEventPlanner(true);
                  }}
                  color={"dark"}
                  disabled={loading}
                >
                  Edit
                </Button>
              )}
              {editEventPlanner && (
                <Button
                  onClick={() => {
                    updateEventPlanner();
                  }}
                  color={"success"}
                  disabled={loading || !eventPlanner}
                >
                  Update
                </Button>
              )}
              {editEventPlanner && (
                <Button
                  onClick={() => {
                    setEventPlanner(event?.eventPlanner || "");
                    setEditEventPlanner(false);
                  }}
                  color={"failure"}
                  disabled={loading}
                >
                  Cancel
                </Button>
              )}
            </div>
            <p className="font-medium text-lg">Event Days:</p>
            <div className="flex flex-col gap-4 mt-2">
              <div className="grid grid-cols-7 gap-4">
                <Label value="Event Day" />
                <Label value="Date" />
                <Label value="Time" />
                <Label value="Location (Google)" />
                <Label value="Event Space" />
              </div>
              {event?.eventDays?.map((rec, index) => (
                <div className="grid grid-cols-7 gap-4" key={rec._id}>
                  <TextInput
                    placeholder="Event Name"
                    value={
                      editEventDayInfo.edit &&
                      editEventDayInfo.eventDay === rec._id
                        ? editEventDayInfo.name
                        : rec.name
                    }
                    readOnly={
                      !(
                        editEventDayInfo.edit &&
                        editEventDayInfo.eventDay === rec._id
                      )
                    }
                    disabled={loading}
                    onChange={(e) => {
                      setEditEventDayInfo({
                        ...editEventDayInfo,
                        name: e.target.value,
                      });
                    }}
                  />
                  <TextInput
                    placeholder="Date"
                    type="date"
                    value={
                      editEventDayInfo.edit &&
                      editEventDayInfo.eventDay === rec._id
                        ? editEventDayInfo.date
                        : rec.date
                    }
                    readOnly={
                      !(
                        editEventDayInfo.edit &&
                        editEventDayInfo.eventDay === rec._id
                      )
                    }
                    disabled={loading}
                    onChange={(e) => {
                      setEditEventDayInfo({
                        ...editEventDayInfo,
                        date: e.target.value,
                      });
                    }}
                  />
                  <TextInput
                    placeholder="Time"
                    type="time"
                    value={
                      editEventDayInfo.edit &&
                      editEventDayInfo.eventDay === rec._id
                        ? editEventDayInfo.time
                        : rec.time
                    }
                    readOnly={
                      !(
                        editEventDayInfo.edit &&
                        editEventDayInfo.eventDay === rec._id
                      )
                    }
                    disabled={loading}
                    onChange={(e) => {
                      setEditEventDayInfo({
                        ...editEventDayInfo,
                        time: e.target.value,
                      });
                    }}
                  />
                  <TextInput
                    placeholder="Location (Google)"
                    value={
                      editEventDayInfo.edit &&
                      editEventDayInfo.eventDay === rec._id
                        ? editEventDayInfo.venue
                        : rec.venue
                    }
                    readOnly={
                      !(
                        editEventDayInfo.edit &&
                        editEventDayInfo.eventDay === rec._id
                      )
                    }
                    disabled={loading}
                    ref={
                      editEventDayInfo.edit && editEventDayInfo.eventDay === rec._id
                        ? eventVenueInputRef
                        : undefined
                    }
                    onChange={(e) => {
                      setEditEventDayInfo({
                        ...editEventDayInfo,
                        venue: e.target.value,
                        location: {
                          place_id: "",
                          formatted_address: e.target.value,
                          geometry: { lat: 0, lng: 0 },
                        },
                      });
                    }}
                  />
                  <TextInput
                    placeholder="Event Space (e.g., Imperia Hall)"
                    value={
                      editEventDayInfo.edit &&
                      editEventDayInfo.eventDay === rec._id
                        ? editEventDayInfo.eventSpace
                        : rec?.eventSpace || ""
                    }
                    readOnly={
                      !(
                        editEventDayInfo.edit &&
                        editEventDayInfo.eventDay === rec._id
                      )
                    }
                    disabled={loading}
                    onChange={(e) => {
                      setEditEventDayInfo({
                        ...editEventDayInfo,
                        eventSpace: e.target.value,
                      });
                    }}
                  />
                  <div className="flex col-span-2 gap-3 items-center flex-wrap">
                    {(!editEventDayInfo.edit ||
                      editEventDayInfo.eventDay !== rec._id) && (
                      <Button
                        color="dark"
                        onClick={() => {
                          setEditEventDayInfo({
                            edit: true,
                            name: rec.name,
                            date: rec.date,
                            venue: rec.venue,
                            eventSpace: rec?.eventSpace || "",
                            location:
                              rec?.location || {
                                place_id: "",
                                formatted_address: rec.venue || "",
                                geometry: { lat: 0, lng: 0 },
                              },
                            time: rec.time,
                            eventDay: rec._id,
                          });
                        }}
                        disabled={loading}
                      >
                        Edit
                      </Button>
                    )}
                    {editEventDayInfo.edit &&
                      editEventDayInfo.eventDay === rec._id && (
                        <>
                          <Button
                            color="success"
                            onClick={() => {
                              updateEventDay();
                            }}
                            disabled={
                              loading ||
                              (editEventDayInfo.edit &&
                                (!editEventDayInfo.name ||
                                  !editEventDayInfo.venue ||
                                  !editEventDayInfo.date ||
                                  !editEventDayInfo.time))
                            }
                          >
                            Update
                          </Button>
                          <Button
                            color="failure"
                            onClick={() => {
                              setEditEventDayInfo({
                                edit: false,
                                name: "",
                                date: "",
                                venue: "",
                                time: "",
                                eventDay: "",
                              });
                            }}
                            disabled={loading}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    <Button
                      color="gray"
                      className="border-2"
                      onClick={() => {
                        setEventDayId(rec._id);
                        setEventDayNotes(rec?.notes);
                      }}
                      disabled={rec._id === eventDayId || loading}
                    >
                      Manage
                    </Button>
                    {index !== 0 && (
                      <Button
                        color="gray"
                        className="border-2"
                        onClick={() => {
                          shuffleEventDay(rec._id, "up");
                        }}
                        disabled={loading}
                      >
                        <MdKeyboardArrowUp />
                      </Button>
                    )}
                    {index !== event?.eventDays?.length - 1 && (
                      <Button
                        color="gray"
                        className="border-2"
                        onClick={() => {
                          shuffleEventDay(rec._id, "down");
                        }}
                        disabled={loading}
                      >
                        <MdKeyboardArrowDown />
                      </Button>
                    )}
                    <Button
                      color="failure"
                      size={"sm"}
                      className="border-2"
                      onClick={() => {
                        if (confirm("Do you want to delete the event day?")) {
                          deleteEventDay(rec._id);
                        }
                      }}
                      disabled={loading || event?.status?.approved}
                    >
                      <MdDelete size={24} />
                    </Button>
                    {rec?.status?.completed ? (
                      <Badge size="sm" color="gray">
                        Completed
                      </Badge>
                    ) : rec?.status?.paymentDone ? (
                      <Badge size="sm" color="success">
                        Payment Completed
                      </Badge>
                    ) : rec?.status?.approved ? (
                      <Badge size="sm" color="indigo">
                        Approved
                      </Badge>
                    ) : rec?.status?.finalized ? (
                      <Badge size="sm" color="purple">
                        Finalized
                      </Badge>
                    ) : null}
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-7 gap-4">
                {addEventDay.add ? (
                  <>
                    <TextInput
                      placeholder="Event Name"
                      value={addEventDay.name}
                      disabled={loading}
                      onChange={(e) => {
                        setAddEventDay({
                          ...addEventDay,
                          name: e.target.value,
                        });
                      }}
                    />
                    <TextInput
                      placeholder="Date"
                      type="date"
                      value={addEventDay.date}
                      disabled={loading}
                      onChange={(e) => {
                        setAddEventDay({
                          ...addEventDay,
                          date: e.target.value,
                        });
                      }}
                    />
                    <TextInput
                      placeholder="Time"
                      type="time"
                      value={addEventDay.time}
                      disabled={loading}
                      onChange={(e) => {
                        setAddEventDay({
                          ...addEventDay,
                          time: e.target.value,
                        });
                      }}
                    />
                    <TextInput
                      placeholder="Location (Google)"
                      value={addEventDay.venue}
                      disabled={loading}
                      ref={eventVenueInputRef}
                      onChange={(e) => {
                        setAddEventDay({
                          ...addEventDay,
                          venue: e.target.value,
                          location: {
                            place_id: "",
                            formatted_address: e.target.value,
                            geometry: { lat: 0, lng: 0 },
                          },
                        });
                      }}
                    />
                    <TextInput
                      placeholder="Event Space (e.g., Imperia Hall)"
                      value={addEventDay.eventSpace}
                      disabled={loading}
                      onChange={(e) => {
                        setAddEventDay({
                          ...addEventDay,
                          eventSpace: e.target.value,
                        });
                      }}
                    />
                    <div className="flex col-span-2 gap-3 items-center">
                      <Button
                        color="success"
                        onClick={() => {
                          addNewEventDay();
                        }}
                        disabled={
                          loading ||
                          (addEventDay.add &&
                            (!addEventDay.name ||
                              !addEventDay.venue ||
                              !addEventDay.date ||
                              !addEventDay.time))
                        }
                      >
                        Add
                      </Button>
                      <Button
                        color="failure"
                        onClick={() => {
                          setAddEventDay({
                            add: false,
                            name: "",
                            date: "",
                            venue: "",
                            eventSpace: "",
                            location: {
                              place_id: "",
                              formatted_address: "",
                              geometry: { lat: 0, lng: 0 },
                            },
                            time: "",
                          });
                        }}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button
                    color="light"
                    onClick={() => {
                      setAddEventDay({
                        add: true,
                        name: "",
                        date: "",
                        time: "",
                        venue: "",
                        eventSpace: "",
                        location: {
                          place_id: "",
                          formatted_address: "",
                          geometry: { lat: 0, lng: 0 },
                        },
                      });
                    }}
                    disabled={loading || event?.status?.approved}
                  >
                    <BsPlus size={16} /> Add New
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="border-b-2 border-b-black pb-4">
            {/* Tasks + Notes (Admin) header row — match provided design */}
            <div className="grid grid-cols-3 gap-8 items-start">
              {/* Tasks (left) */}
              <div className="col-span-1 flex flex-col gap-4">
                <p className="text-xl font-medium">Tasks</p>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    color="light"
                    className="justify-start"
                    disabled={loading}
                    onClick={() => setDisplayTasksHistory(true)}
                  >
                    Previous Tasks
                  </Button>
                  <TextInput
                    readOnly={true}
                    value={
                      tasks.length > 0
                        ? `${new Date(tasks[tasks.length - 1]?.deadline).toLocaleDateString(
                            "en-GB"
                          )}  ${new Date(
                            tasks[tasks.length - 1]?.deadline
                          ).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`
                        : ""
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    className="!bg-[#676767] text-white hover:!bg-[#676767]/80 focus:!ring-0 focus:!ring-offset-0"
                    disabled={loading}
                    onClick={() => {
                      setAddNewTask({
                        ...addNewTask,
                        task: "",
                        deadline: "",
                        display: true,
                      });
                    }}
                  >
                    <BsPlus size={16} /> Create Task
                  </Button>
                  <Button
                    color="light"
                    outline
                    className="justify-between"
                    onClick={() => setDisplayTasksHistory(true)}
                    disabled={loading}
                  >
                    <span>View History</span>
                    <BsChevronDown size={16} />
                  </Button>
                </div>
              </div>

              {/* Notes (Admin) (right) */}
              <div className="col-span-2 flex flex-col gap-4">
                <p className="text-xl font-medium">Notes (Admin)</p>
                <div className="flex gap-4 items-center">
                  <TextInput
                    placeholder="Add notes here"
                    value={eventNotes}
                    onChange={(e) => {
                      setEventNotes(e.target.value);
                    }}
                    disabled={loading}
                    className="flex-1"
                  />
                  {/* Keep Update Notes button (required) */}
                  <Button
                    className="!bg-[#676767] text-white hover:!bg-[#676767]/80 focus:!ring-0 focus:!ring-offset-0"
                    disabled={loading}
                    onClick={() => {
                      updateEventNotes();
                    }}
                  >
                    Update Notes
                  </Button>
                </div>
              </div>
              {eventDayId && (
                <div className="grid grid-cols-1 gap-4">
                  <p className="text-xl font-medium">Event Day Notes</p>
                  <div className="flex gap-2">
                    <Textarea
                      rows={4}
                      value={eventDayNotes}
                      onChange={(e) => {
                        setEventDayNotes(e.target.value);
                      }}
                      disabled={loading}
                    />
                    <Button
                      color="dark"
                      disabled={loading}
                      onClick={() => {
                        updateEventDayNotes();
                      }}
                    >
                      Update Notes
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="border-b-2 border-b-black pb-4">
            <div className="flex flex-row items-start gap-6 flex-wrap">
              <p className="text-xl font-medium mr-auto">Event Tool</p>

              {/* View toggles */}
              <div className="flex flex-row gap-3 flex-wrap">
                {eventToolView !== "ops" && (
                  <Button
                    color="dark"
                    disabled={loading}
                    onClick={() => {
                      setEventToolView("ops");
                    }}
                  >
                    Ops View
                  </Button>
                )}
                {eventToolView !== "admin" && (
                  <Button
                    color="dark"
                    disabled={loading}
                    onClick={() => {
                      setEventToolView("admin");
                    }}
                  >
                    Admin View
                  </Button>
                )}
              </div>

              {/* Event day selector */}
              <Select
                value={eventDayId}
                onChange={(e) => {
                  setEventDayId(e.target.value);
                  setEventDayNotes(
                    event?.eventDays?.find((item) => item?._id === e.target.value)
                      ?.notes || ""
                  );
                }}
                disabled={loading}
                className="min-w-[220px]"
              >
                <option value={""}>Select Event Day</option>
                {event?.eventDays?.map((item) => (
                  <option value={item._id} key={item._id}>
                    {item.name}
                  </option>
                ))}
              </Select>

              {/* Download list widget (right side) */}
              <div className="ml-auto flex flex-col gap-3 items-end">
                <div className="flex gap-3">
                  <Button
                    color="light"
                    className={`!bg-[#B5B5B5] !text-black hover:!bg-[#B5B5B5]/80 focus:!ring-0 ${
                      downloadWithPrice ? "!opacity-100" : "!opacity-80"
                    }`}
                    onClick={() => setDownloadWithPrice(true)}
                    disabled={loading}
                  >
                    <span className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white">
                        <MdLink size={14} />
                      </span>
                      With price
                    </span>
                  </Button>
                  <Button
                    color="light"
                    className={`!bg-[#B5B5B5] !text-black hover:!bg-[#B5B5B5]/80 focus:!ring-0 ${
                      !downloadWithPrice ? "!opacity-100" : "!opacity-80"
                    }`}
                    onClick={() => setDownloadWithPrice(false)}
                    disabled={loading}
                  >
                    <span className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white">
                        <MdLink size={14} />
                      </span>
                      Without price
                    </span>
                  </Button>
                </div>

                <div className="flex gap-3 items-center">
                  <Button
                    color="light"
                    className="!bg-[#B3B3B3] !text-black hover:!bg-[#B3B3B3]/80 focus:!ring-0"
                    onClick={handleDownloadPdf}
                    disabled={loading}
                  >
                    <span className="flex items-center gap-2">
                      Download Pdf <MdDownload size={18} />
                    </span>
                  </Button>
                  <Button
                    color="light"
                    className="!bg-[#B3B3B3] !text-black hover:!bg-[#B3B3B3]/80 focus:!ring-0"
                    onClick={handleDownloadExcel}
                    disabled={loading}
                  >
                    <span className="flex items-center gap-2">
                      Download Excel <MdDownload size={18} />
                    </span>
                  </Button>
                  <Button
                    color="success"
                    className="min-w-[260px]"
                    disabled={loading}
                    onClick={() => {
                      SendEventBookingReminder();
                    }}
                  >
                    Booking reminder
                  </Button>
                </div>
              </div>
            </div>
            {eventDay._id && (
              <div className="flex flex-col pt-4 gap-4">
                <div className="grid grid-cols-4 gap-4">
                  <p className="text-lg col-span-3">
                    Decor Items ({eventDay.decorItems.length})
                  </p>
                  <Button
                    color="light"
                    onClick={() => {
                      setAddDecorItem({
                        ...addDecorItem,
                        display: true,
                        decor: "",
                        platform: false,
                        dimensions: { length: 0, breadth: 0, height: 0 },
                        price: 0,
                        flooring: "",
                        category: "",
                        variant: "",
                        quantity: 1,
                        unit: "",
                        productId: "",
                        decorItem: {},
                        searchQuery: "",
                        decorList: [],
                        flooringRate: 0,
                        platformRate: 0,
                        decorPrice: 0,
                      });
                    }}
                    disabled={
                      loading || event?.status?.approved || addDecorItem.display
                    }
                  >
                    <BsPlus size={16} /> Add New
                  </Button>
                </div>
                <Modal
                  show={addDecorItem.display}
                  size="xl"
                  onClose={() => {
                    try {
                      if (ADD_PRODUCT_DRAFT_KEY) {
                        sessionStorage.removeItem(ADD_PRODUCT_DRAFT_KEY);
                      }
                    } catch (e) {}
                    setAddDecorItem({
                      ...addDecorItem,
                      display: false,
                      decor: "",
                      platform: false,
                      dimensions: { length: 0, breadth: 0, height: 0 },
                      price: 0,
                      flooring: "",
                      category: "",
                      variant: "",
                      productVariant: "",
                      quantity: 1,
                      unit: "",
                      productId: "",
                      decorItem: {},
                      searchQuery: "",
                      decorList: [],
                      flooringRate: 0,
                      platformRate: 0,
                      decorPrice: 0,
                    });
                  }}
                  popup
                >
                  <Modal.Header />
                  <Modal.Body>
                    <div className="space-y-6">
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                        Add Product
                      </h3>
                      {!addDecorItem.decor && (
                        <div>
                          <div className="mb-2 block">
                            <Label value="Search for Product (By Product Id)" />
                          </div>
                          <TextInput
                            placeholder="Decor Id"
                            value={addDecorItem.productId}
                            onChange={(event) =>
                              setAddDecorItem({
                                ...addDecorItem,
                                productId: event.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      )}
                      {addDecorItem?.decorList?.length > 0 && (
                        <div className="flex flex-row flex-wrap gap-2">
                          {addDecorItem?.decorList?.map((item, index) => (
                            <Button
                              key={index}
                              color="gray"
                              onClick={() => {
                                setAddDecorItem({
                                  ...addDecorItem,
                                  decorItem: item,
                                  decor: item._id,
                                  decorList: [],
                                  productId: "",
                                });
                              }}
                              disabled={
                                loading || addDecorItem.productId === item._id
                              }
                            >
                              {item.productInfo.id} | {item.name}
                            </Button>
                          ))}
                        </div>
                      )}
                      {addDecorItem.decor && (
                        <div className="flex flex-col gap-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label value="Select Variant" />
                              <Select
                                value={addDecorItem.variant}
                                onChange={(e) => {
                                  setAddDecorItem({
                                    ...addDecorItem,
                                    variant: e.target.value,
                                  });
                                }}
                                disabled={loading}
                              >
                                <option value={""} disabled>
                                  Select Variant
                                </option>
                                {addDecorItem.decorItem?.productTypes?.map(
                                  (item) => (
                                    <option value={item.name} key={item.name}>
                                      {item.name} : ₹{item?.sellingPrice}
                                    </option>
                                  )
                                )}
                              </Select>
                            </div>
                            {addDecorItem.decorItem?.productVariants.length >
                              0 && (
                              <div>
                                <Label value="Select Variant" />
                                <Select
                                  value={addDecorItem.productVariant}
                                  onChange={(e) => {
                                    setAddDecorItem({
                                      ...addDecorItem,
                                      productVariant: e.target.value,
                                    });
                                  }}
                                  disabled={loading}
                                >
                                  <option value={""} disabled>
                                    Select Variant
                                  </option>
                                  {addDecorItem.decorItem?.productVariants?.map(
                                    (item) => (
                                      <option value={item.name} key={item.name}>
                                        {item.name} : {item?.priceModifier}
                                      </option>
                                    )
                                  )}
                                </Select>
                              </div>
                            )}
                            {["Stage", "Photobooth", "Mandap"].includes(
                              addDecorItem.decorItem.category
                            ) && (
                              <>
                                <div>
                                  <Label value="Select Platform" />
                                  <Select
                                    value={addDecorItem.platform ? "Yes" : "No"}
                                    onChange={(e) => {
                                      setAddDecorItem({
                                        ...addDecorItem,
                                        platform: e.target.value === "Yes",
                                      });
                                    }}
                                    disabled={loading}
                                  >
                                    <option value={""} disabled>
                                      Select Platform
                                    </option>
                                    <option value={"Yes"}>Yes</option>
                                    <option value={"No"}>No</option>
                                  </Select>
                                </div>
                                <div>
                                  <Label value="Select Flooring" />
                                  <Select
                                    value={addDecorItem.flooring}
                                    onChange={(e) => {
                                      setAddDecorItem({
                                        ...addDecorItem,
                                        flooring: e.target.value,
                                      });
                                    }}
                                    disabled={loading}
                                  >
                                    <option value={""}>Select Flooring</option>
                                    {flooringPrice.map((item) => (
                                      <option
                                        value={item.title}
                                        key={item.title}
                                      >
                                        {item.title}
                                      </option>
                                    ))}
                                  </Select>
                                </div>
                              </>
                            )}
                            {addDecorItem.decorItem.category === "Pathway" && (
                              <div>
                                <Label value="Select Quantity" />
                                <Select
                                  value={addDecorItem.quantity}
                                  onChange={(e) => {
                                    setAddDecorItem({
                                      ...addDecorItem,
                                      quantity: parseInt(e.target.value),
                                    });
                                  }}
                                >
                                  {Array.from(
                                    { length: 25 },
                                    (_, index) => index + 1
                                  ).map((value) => (
                                    <option key={value} value={value}>
                                      {value}
                                    </option>
                                  ))}
                                </Select>
                              </div>
                            )}
                          </div>
                          {(addDecorItem.platform || addDecorItem.flooring) && (
                            <>
                              <Label value="Dimensions for Platform and Flooring (in feet):" />
                              <div className="grid grid-cols-3 gap-3 gap-y-0">
                                <Label value="Length:" />
                                <Label value="Breadth:" />
                                <Label value="Height:" />
                                <TextInput
                                  type="number"
                                  placeholder="length"
                                  required
                                  value={addDecorItem?.dimensions.length}
                                  onChange={(e) => {
                                    setAddDecorItem({
                                      ...addDecorItem,
                                      dimensions: {
                                        ...addDecorItem.dimensions,
                                        length: parseFloat(e.target.value),
                                      },
                                    });
                                  }}
                                  disabled={loading}
                                />
                                <TextInput
                                  type="number"
                                  placeholder="breadth"
                                  required
                                  value={addDecorItem?.dimensions.breadth}
                                  onChange={(e) => {
                                    setAddDecorItem({
                                      ...addDecorItem,
                                      dimensions: {
                                        ...addDecorItem.dimensions,
                                        breadth: parseFloat(e.target.value),
                                      },
                                    });
                                  }}
                                  disabled={loading}
                                />
                                <TextInput
                                  type="number"
                                  placeholder="height"
                                  required
                                  value={addDecorItem?.dimensions.height}
                                  onChange={(e) => {
                                    setAddDecorItem({
                                      ...addDecorItem,
                                      dimensions: {
                                        ...addDecorItem.dimensions,
                                        height: parseFloat(e.target.value),
                                      },
                                    });
                                  }}
                                  disabled={loading}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      )}
                      <div className="w-full flex gap-3 items-center">
                        <Button
                          color="success"
                          disabled={
                            loading ||
                            !addDecorItem.decor ||
                            !addDecorItem.variant
                          }
                          onClick={AddDecorItemToEvent}
                        >
                          Add Product
                        </Button>
                        <Label
                          value={`Total Price: ${
                            (addDecorItem.variant
                              ? addDecorItem.quantity *
                                addDecorItem.decorItem?.productTypes?.find(
                                  (i) => i.name === addDecorItem.variant
                                )?.sellingPrice
                              : 0) +
                            (addDecorItem.platform
                              ? addDecorItem.dimensions.length *
                                addDecorItem.dimensions.breadth *
                                platformPrice.price *
                                (addDecorItem.decorItem?.category === "Pathway"
                                  ? addDecorItem.quantity
                                  : 1)
                              : 0) +
                            (addDecorItem.dimensions.length +
                              addDecorItem.dimensions.height) *
                              (addDecorItem.dimensions.breadth +
                                addDecorItem.dimensions.height) *
                              (flooringPrice.find(
                                (i) => i.title === addDecorItem.flooring
                              )?.price || 0) *
                              (addDecorItem.decorItem?.category === "Pathway"
                                ? addDecorItem.quantity
                                : 1)
                          }`}
                        />
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>
                <div className="flex flex-col gap-2 divide-y-2">
                  {eventDay?.decorItems
                    ?.filter(
                      (i) =>
                        categoryList?.find((r) => r.name === i.category)
                          ?.adminEventToolView === "single"
                    )
                    ?.sort(
                      (a, b) =>
                        [
                          "Nameboard",
                          "Entrance",
                          "Pathway",
                          "Photobooth",
                          "Stage",
                          "Mandap",
                        ].indexOf(a.category) -
                        [
                          "Nameboard",
                          "Entrance",
                          "Pathway",
                          "Photobooth",
                          "Stage",
                          "Mandap",
                        ].indexOf(b.category)
                    )
                    ?.map((item, index) => (
                      <>
                        <div className="grid grid-cols-2 pt-2" key={index}>
                          <div className="flex flex-col gap-3 border-r-2 pr-4 mr-3">
                            <div className="flex flex-row justify-between">
                              <div>
                                <p className="text-sm">{item.category}</p>
                                <div className="flex items-center gap-2">
                                  <p>
                                    {item?.decor?.name} –{" "}
                                    {item?.productVariant
                                      ? item?.productVariant
                                      : "Default"}{" "}
                                    [
                                    <span className="font-medium text-sm">
                                      {item?.decor?.productInfo.id}
                                    </span>
                                    ]
                                  </p>
                                  {/* Variant thumbnail (matches “Product – Variant – Variant Image”) */}
                                  <div className="relative w-10 h-10 rounded-md border border-gray-200 overflow-hidden bg-white">
                                    <Image
                                      src={
                                        item?.productVariant
                                          ? item?.decor?.productVariants?.find(
                                              (i) => i.name === item.productVariant
                                            )?.image || item.decor?.thumbnail
                                          : item.decor?.thumbnail
                                      }
                                      alt="Variant"
                                      fill
                                      className="object-contain"
                                    />
                                  </div>
                                </div>
                              </div>
                              {!eventDay.status.approved &&
                                !event.status.approved && (
                                  <MdDelete
                                    cursor={"pointer"}
                                    className={`${
                                      loading ? `text-red-400` : `text-red-600`
                                    } font-bold text-2xl`}
                                    onClick={() => {
                                      if (!loading) {
                                        if (
                                          confirm(
                                            "Do you want to delete the item from the event?"
                                          )
                                        ) {
                                          RemoveDecorFromEvent({
                                            decor_id: item.decor._id,
                                          });
                                        }
                                      }
                                    }}
                                  />
                                )}
                            </div>
                            <div className="grid grid-cols-5 gap-3">
                              <div className="relative pt-[56.25%] col-span-3">
                                <Image
                                  src={
                                    item?.productVariant
                                      ? item?.decor?.productVariants?.find(
                                          (i) => i.name === item.productVariant
                                        )?.image || item.decor?.thumbnail
                                      : item.decor?.thumbnail
                                  }
                                  alt="Decor"
                                  sizes="100%"
                                  layout={"fill"}
                                  objectFit="contain"
                                  className="rounded-xl cursor-pointer"
                                  onClick={() => {
                                    setEnlargedImage(
                                      item?.productVariant
                                        ? item?.decor?.productVariants?.find(
                                            (i) =>
                                              i.name === item.productVariant
                                          )?.image || item.decor?.thumbnail
                                        : item.decor?.thumbnail
                                    );
                                  }}
                                />
                              </div>
                              <div className="col-span-2">
                                <div className="text-sm flex justify-between mb-2">
                                  Inclusive of:
                                  {item.decor?._id ===
                                  editDecorIncluded.decor_id ? (
                                    <MdDone
                                      cursor={"pointer"}
                                      className={`${
                                        loading
                                          ? `text-green-400`
                                          : `text-green-600`
                                      } font-bold text-2xl`}
                                      onClick={() => {
                                        if (!loading) {
                                          UpdateDecorIncluded();
                                        }
                                      }}
                                    />
                                  ) : (
                                    <MdEdit
                                      cursor={"pointer"}
                                      className={`${
                                        loading
                                          ? `text-blue-400`
                                          : `text-blue-600`
                                      } font-bold text-2xl`}
                                      onClick={() => {
                                        if (!loading) {
                                          setEditDecorIncluded({
                                            ...editDecorIncluded,
                                            decor_id: item.decor?._id,
                                            included: item.included.join("\n"),
                                          });
                                        }
                                      }}
                                    />
                                  )}
                                </div>
                                <Textarea
                                  rows={4}
                                  value={
                                    item.decor?._id ===
                                    editDecorIncluded.decor_id
                                      ? editDecorIncluded.included
                                      : item.included?.join("\n")
                                  }
                                  readOnly={
                                    item.decor?._id !==
                                    editDecorIncluded.decor_id
                                  }
                                  onChange={(e) => {
                                    if (
                                      item.decor?._id ===
                                      editDecorIncluded.decor_id
                                    ) {
                                      setEditDecorIncluded({
                                        ...editDecorIncluded,
                                        included: e.target.value,
                                      });
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <Select
                                value={item.variant}
                                disabled={
                                  loading ||
                                  eventDay.status.approved ||
                                  event.status.approved
                                }
                                onChange={(e) => {
                                  let {
                                    platform,
                                    platformRate,
                                    flooring,
                                    flooringRate,
                                    dimensions,
                                    quantity,
                                    category,
                                    unit,
                                    addOns,
                                    productVariant,
                                    priceModifier,
                                  } = item;
                                  UpdateDecorItemInEvent({
                                    decor_id: item.decor?._id,
                                    platform,
                                    platformRate,
                                    flooring,
                                    flooringRate,
                                    decorPrice: item.decor?.productTypes.find(
                                      (i) => i.name === e.target.value
                                    )?.sellingPrice,
                                    dimensions,
                                    quantity,
                                    variant: e.target.value,
                                    category,
                                    unit,
                                    addOns,
                                    productVariant,
                                    priceModifier,
                                  });
                                }}
                              >
                                {!item.decor?.productTypes.find(
                                  (i) => i.name === item.variant
                                )?.name && (
                                  <option
                                    key={item.variant}
                                    value={item.variant}
                                  >
                                    {item.variant} (
                                    {toPriceString(item.decorPrice)})
                                  </option>
                                )}
                                {item.decor?.productTypes.map((variant) => (
                                  <option
                                    key={variant.name}
                                    value={variant.name}
                                  >
                                    {variant.name} (
                                    {toPriceString(variant.sellingPrice)})
                                  </option>
                                ))}
                              </Select>
                              {categoryList?.find(
                                (i) => i.name === item.category
                              )?.multipleAllowed && (
                                <div className="flex flex-row items-center gap-2">
                                  <Select
                                    value={item.quantity.toString()}
                                    disabled={
                                      loading ||
                                      eventDay.status.approved ||
                                      event.status.approved
                                    }
                                    onChange={(e) => {
                                      let {
                                        platform,
                                        platformRate,
                                        flooring,
                                        flooringRate,
                                        dimensions,
                                        category,
                                        unit,
                                        addOns,
                                        variant,
                                        decorPrice,
                                        productVariant,
                                        priceModifier,
                                      } = item;
                                      UpdateDecorItemInEvent({
                                        decor_id: item.decor?._id,
                                        platform,
                                        platformRate,
                                        flooring,
                                        flooringRate,
                                        decorPrice,
                                        dimensions,
                                        quantity: parseInt(e.target.value),
                                        variant,
                                        category,
                                        unit,
                                        addOns,
                                        productVariant,
                                        priceModifier,
                                      });
                                    }}
                                  >
                                    <option value={item.quantity}>
                                      {item.quantity}
                                    </option>
                                    {quantityList
                                      .sort(
                                        (a, b) =>
                                          parseInt(a.title) - parseInt(b.title)
                                      )
                                      .filter(
                                        (i) =>
                                          i.title !== item.quantity.toString()
                                      )
                                      .map((i) => (
                                        <option key={i.title} value={i.title}>
                                          {i.title}
                                        </option>
                                      ))}
                                  </Select>
                                  <Label
                                    value={`Quantity (Unit: ${item?.decor?.unit})`}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label value="Primary Color" />
                                <Select
                                  value={item.primaryColor}
                                  disabled={
                                    loading ||
                                    eventDay.status.approved ||
                                    event.status.approved
                                  }
                                  onChange={(e) => {
                                    UpdateDecorItemPrimaryColorInEvent({
                                      decor_id: item.decor?._id,
                                      primaryColor: e.target.value,
                                    });
                                  }}
                                >
                                  <option value={item.primaryColor}>
                                    {item.primaryColor}
                                  </option>
                                  {colorList
                                    .filter(
                                      (i) => i.title !== item.primaryColor
                                    )
                                    .map((i) => (
                                      <option key={i.title} value={i.title}>
                                        {i.title}
                                      </option>
                                    ))}
                                </Select>
                              </div>
                              <div>
                                <Label value="Secondary Color" />
                                <Select
                                  value={item.secondaryColor}
                                  disabled={
                                    loading ||
                                    eventDay.status.approved ||
                                    event.status.approved
                                  }
                                  onChange={(e) => {
                                    UpdateDecorItemSecondaryColorInEvent({
                                      decor_id: item.decor?._id,
                                      secondaryColor: e.target.value,
                                    });
                                  }}
                                >
                                  <option value={item.secondaryColor}>
                                    {item.secondaryColor}
                                  </option>
                                  {colorList
                                    .filter(
                                      (i) => i.title !== item.secondaryColor
                                    )
                                    .map((i) => (
                                      <option key={i.title} value={i.title}>
                                        {i.title}
                                      </option>
                                    ))}
                                </Select>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label value="Platform" />
                                <ToggleSwitch
                                  checked={item.platform}
                                  disabled={
                                    loading ||
                                    eventDay.status.approved ||
                                    event.status.approved
                                  }
                                  onChange={(e) => {
                                    let {
                                      flooring,
                                      flooringRate,
                                      dimensions,
                                      quantity,
                                      category,
                                      unit,
                                      addOns,
                                      variant,
                                      decorPrice,
                                      productVariant,
                                      priceModifier,
                                    } = item;
                                    UpdateDecorItemInEvent({
                                      decor_id: item.decor?._id,
                                      platform: e,
                                      platformRate: e ? platformPrice.price : 0,
                                      flooring,
                                      flooringRate,
                                      decorPrice,
                                      dimensions,
                                      quantity,
                                      variant,
                                      category,
                                      unit,
                                      addOns,
                                      productVariant,
                                      priceModifier,
                                    });
                                  }}
                                />
                              </div>
                              <div>
                                <Label value="Flooring" />
                                <Select
                                  value={item.flooring}
                                  disabled={
                                    loading ||
                                    eventDay.status.approved ||
                                    event.status.approved
                                  }
                                  onChange={(e) => {
                                    let {
                                      platform,
                                      platformRate,
                                      dimensions,
                                      quantity,
                                      category,
                                      unit,
                                      addOns,
                                      variant,
                                      decorPrice,
                                      productVariant,
                                      priceModifier,
                                    } = item;
                                    UpdateDecorItemInEvent({
                                      decor_id: item.decor?._id,
                                      platform,
                                      platformRate,
                                      flooring: e.target.value,
                                      flooringRate:
                                        e.target.value === ""
                                          ? 0
                                          : flooringPrice.find(
                                              (i) => i.title === e.target.value
                                            )?.price,
                                      decorPrice,
                                      dimensions,
                                      quantity,
                                      variant,
                                      category,
                                      unit,
                                      addOns,
                                      productVariant,
                                      priceModifier,
                                    });
                                  }}
                                >
                                  {item.flooring ? (
                                    <>
                                      <option value={item.flooring}>
                                        {item.flooring} (₹{item.flooringRate})
                                      </option>
                                      <option value={""}>
                                        Remove Flooring
                                      </option>
                                    </>
                                  ) : (
                                    <option value={""}>Select Flooring</option>
                                  )}
                                  {flooringPrice
                                    .filter((i) => i.title !== item.flooring)
                                    .map((i) => (
                                      <option key={i.title} value={i.title}>
                                        {i.title} (₹{i.price})
                                      </option>
                                    ))}
                                </Select>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                              <div>
                                <Label value="Length" />
                                <TextInput
                                  value={
                                    editDecorDimensions.decor_id ===
                                    item.decor?._id
                                      ? editDecorDimensions.length
                                      : item.dimensions.length
                                  }
                                  readOnly={
                                    editDecorDimensions.decor_id !==
                                    item.decor?._id
                                  }
                                  disabled={
                                    loading ||
                                    eventDay.status.approved ||
                                    event.status.approved
                                  }
                                  onChange={(e) => {
                                    setEditDecorDimensions({
                                      ...editDecorDimensions,
                                      length: e.target.value,
                                    });
                                  }}
                                />
                              </div>
                              <div>
                                <Label value="Breadth" />
                                <TextInput
                                  value={
                                    editDecorDimensions.decor_id ===
                                    item.decor?._id
                                      ? editDecorDimensions.breadth
                                      : item.dimensions.breadth
                                  }
                                  readOnly={
                                    editDecorDimensions.decor_id !==
                                    item.decor?._id
                                  }
                                  disabled={
                                    loading ||
                                    eventDay.status.approved ||
                                    event.status.approved
                                  }
                                  onChange={(e) => {
                                    setEditDecorDimensions({
                                      ...editDecorDimensions,
                                      breadth: e.target.value,
                                    });
                                  }}
                                />
                              </div>
                              <div>
                                <Label value="Height" />
                                <TextInput
                                  value={
                                    editDecorDimensions.decor_id ===
                                    item.decor?._id
                                      ? editDecorDimensions.height
                                      : item.dimensions.height
                                  }
                                  readOnly={
                                    editDecorDimensions.decor_id !==
                                    item.decor?._id
                                  }
                                  disabled={
                                    loading ||
                                    eventDay.status.approved ||
                                    event.status.approved
                                  }
                                  onChange={(e) => {
                                    setEditDecorDimensions({
                                      ...editDecorDimensions,
                                      height: e.target.value,
                                    });
                                  }}
                                />
                              </div>
                              <div className="mt-auto mb-2">
                                {editDecorDimensions.decor_id ===
                                item.decor?._id ? (
                                  <Button
                                    color="success"
                                    disabled={
                                      loading ||
                                      eventDay.status.approved ||
                                      event.status.approved
                                    }
                                    onClick={() => {
                                      let dimensions = {
                                        length:
                                          parseFloat(
                                            editDecorDimensions.length
                                          ) || 0,
                                        breadth:
                                          parseFloat(
                                            editDecorDimensions.breadth
                                          ) || 0,
                                        height:
                                          parseFloat(
                                            editDecorDimensions.height
                                          ) || 0,
                                      };
                                      let {
                                        platform,
                                        platformRate,
                                        flooring,
                                        flooringRate,
                                        quantity,
                                        category,
                                        unit,
                                        addOns,
                                        variant,
                                        decorPrice,
                                        productVariant,
                                        priceModifier,
                                      } = item;
                                      UpdateDecorItemInEvent({
                                        decor_id: item.decor?._id,
                                        platform,
                                        platformRate,
                                        flooring,
                                        flooringRate,
                                        decorPrice,
                                        dimensions,
                                        quantity,
                                        variant,
                                        category,
                                        unit,
                                        addOns,
                                        productVariant,
                                        priceModifier,
                                      });
                                      setEditDecorDimensions({
                                        ...editDecorDimensions,
                                        length: 0,
                                        breadth: 0,
                                        height: 0,
                                        decor_id: "",
                                      });
                                    }}
                                  >
                                    <MdDone />
                                  </Button>
                                ) : (
                                  <Button
                                    color="gray"
                                    disabled={
                                      loading ||
                                      eventDay.status.approved ||
                                      event.status.approved
                                    }
                                    onClick={() => {
                                      setEditDecorDimensions({
                                        ...editDecorDimensions,
                                        length: 0,
                                        breadth: 0,
                                        height: 0,
                                        ...item.dimensions,
                                        decor_id: item.decor?._id,
                                      });
                                    }}
                                  >
                                    <MdEdit />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col px-4 pb-1">
                            {eventToolView !== "ops" && (
                              <Table
                                hoverable
                                className="width-full overflow-x-auto"
                                key={`${index}-${item.decor._id}`}
                              >
                                <Table.Head className="divide-x">
                                  <Table.HeadCell className="p-1">
                                    Description
                                  </Table.HeadCell>
                                  <Table.HeadCell className="p-1">
                                    Price
                                  </Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="p-1">
                                      {item.category} [{item.variant}]{" "}
                                      {item.productVariant &&
                                        `[${item.productVariant}]`}
                                      {item.category === "Pathway" &&
                                        `(Qty.: ${item.quantity})`}
                                    </Table.Cell>
                                    <Table.Cell className="p-1">
                                      ₹
                                      {(item.decorPrice + item.priceModifier) *
                                        item.quantity}
                                    </Table.Cell>
                                  </Table.Row>
                                  {item.platform && (
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                      <Table.Cell className="p-1">
                                        Platform ({item.dimensions.length}*
                                        {item.dimensions.breadth}*
                                        {item.dimensions.height})
                                      </Table.Cell>
                                      <Table.Cell className="p-1">
                                        ₹
                                        {item.dimensions.length *
                                          item.dimensions.breadth *
                                          item.platformRate}
                                      </Table.Cell>
                                    </Table.Row>
                                  )}
                                  {item.flooring && (
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                      <Table.Cell className="p-1">
                                        Flooring [{item.flooring}] (
                                        {item.dimensions.length}*
                                        {item.dimensions.breadth})
                                      </Table.Cell>
                                      <Table.Cell className="p-1">
                                        ₹
                                        {(item.dimensions.length +
                                          item.dimensions.height) *
                                          (item.dimensions.breadth +
                                            item.dimensions.height) *
                                          item.flooringRate}
                                      </Table.Cell>
                                    </Table.Row>
                                  )}
                                  {item.addOns?.map((rec, recIndex) => (
                                    <Table.Row
                                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                      key={recIndex}
                                    >
                                      <Table.Cell className="p-1">
                                        {rec.name}
                                      </Table.Cell>
                                      <Table.Cell className="p-1">
                                        ₹{rec.price}
                                      </Table.Cell>
                                    </Table.Row>
                                  ))}
                                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 font-medium">
                                    <Table.Cell className="p-1">
                                      Total
                                    </Table.Cell>
                                    <Table.Cell className="p-1">
                                      ₹{item.price}
                                    </Table.Cell>
                                  </Table.Row>
                                </Table.Body>
                              </Table>
                            )}
                            <div className="flex flex-row gap-3 mt-3 flex-wrap">
                              <Button
                                color="gray"
                                onClick={() => {
                                  setEditAddOns({
                                    open: true,
                                    edit: true,
                                    decor_id: item.decor._id,
                                    package_id: "",
                                    addOns: item.addOns || [],
                                  });
                                }}
                                disabled={
                                  loading ||
                                  eventDay.status.approved ||
                                  event.status.approved
                                }
                              >
                                Edit Add-Ons
                              </Button>
                              <Button
                                className="text-rose-900 bg-white enabled:hover:bg-rose-900 hover:text-white cursor-pointer px-2 py-1.5 text-sm focus:outline-none rounded-lg border-rose-900 border"
                                disabled={loading}
                                onClick={() => {
                                  setNotes({
                                    open: true,
                                    edit: false,
                                    decor_id: item.decor._id,
                                    package_id: "",
                                    admin_notes: item.admin_notes,
                                    user_notes: item.user_notes,
                                    notes:
                                      (item?.notes?.length || 0) > 0
                                        ? item.notes
                                        : [],
                                  });
                                }}
                              >
                                View/Edit Notes
                              </Button>
                              <Button
                                color="gray"
                                onClick={() => {
                                  setEditDecorSetupLocationImage({
                                    open: true,
                                    decor_id: item.decor?._id,
                                    setupLocationImage:
                                      item.setupLocationImage || "",
                                    setupLocationImageFile: null,
                                  });
                                }}
                                disabled={
                                  loading ||
                                  eventDay.status.approved ||
                                  event.status.approved
                                }
                              >
                                Setup Location Image
                              </Button>
                            </div>
                            <div className="flex flex-col gap-3 mt-3">
                              {item.notes?.map((i, iIndex) => (
                                <div
                                  className="grid grid-cols-3 gap-2"
                                  key={iIndex}
                                >
                                  <Textarea
                                    rows={3}
                                    value={i.text}
                                    readOnly={true}
                                    className="col-span-2"
                                  />
                                  {i.image && (
                                    <Image
                                      src={i.image}
                                      alt="Decor"
                                      sizes="100%"
                                      width={0}
                                      height={0}
                                      className="w-full h-auto cursor-pointer"
                                      onClick={() => {
                                        setEnlargedImage(i.image);
                                      }}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                  {categoryList
                    ?.filter((r) => r.adminEventToolView === "group")
                    .filter(
                      (r) =>
                        eventDay?.decorItems?.filter(
                          (i) => i.category === r.name
                        ).length > 0
                    )
                    .map((rec, index) => (
                      <div className="flex flex-col gap-2" key={rec?._id}>
                        <p className="text-xl mt-4 font-medium px-4">
                          {rec.name}
                        </p>
                        <div className="grid grid-cols-6 gap-4 py-3">
                          {eventDay?.decorItems
                            ?.filter((i) => i.category === rec.name)
                            ?.map((item, index) => (
                              <>
                                <div
                                  className="flex flex-col gap-3 rounded-lg border-2 p-2"
                                  key={index}
                                >
                                  <div className="flex flex-row items-center gap-1 justify-between">
                                    <MdOutlineImage
                                      cursor={"pointer"}
                                      className={`${
                                        loading
                                          ? `text-gray-400`
                                          : `text-gray-600`
                                      } font-bold text-xl`}
                                      onClick={() => {
                                        if (
                                          !loading &&
                                          !eventDay.status.approved &&
                                          !event.status.approved
                                        ) {
                                          setEditDecorSetupLocationImage({
                                            open: true,
                                            decor_id: item.decor?._id,
                                            setupLocationImage:
                                              item.setupLocationImage || "",
                                            setupLocationImageFile: null,
                                          });
                                        }
                                      }}
                                    />
                                    <p className="text-sm mr-auto">
                                      {item?.decor?.name}{" "}
                                      {item?.productVariant || ""}
                                    </p>
                                    {!eventDay.status.approved &&
                                      !event.status.approved && (
                                        <MdDelete
                                          cursor={"pointer"}
                                          className={`${
                                            loading
                                              ? `text-red-400`
                                              : `text-red-600`
                                          } font-bold text-2xl`}
                                          onClick={() => {
                                            if (!loading) {
                                              if (
                                                confirm(
                                                  "Do you want to delete the item from the event?"
                                                )
                                              ) {
                                                RemoveDecorFromEvent({
                                                  decor_id: item.decor._id,
                                                });
                                              }
                                            }
                                          }}
                                        />
                                      )}
                                  </div>
                                  <div className="relative pt-[100%]">
                                    <Image
                                      src={
                                        item?.productVariant
                                          ? item?.decor?.productVariants?.find(
                                              (i) =>
                                                i.name === item.productVariant
                                            )?.image || item.decor?.thumbnail
                                          : item.decor?.thumbnail
                                      }
                                      alt="Decor"
                                      sizes="100%"
                                      layout={"fill"}
                                      objectFit="contain"
                                      className="rounded-xl cursor-pointer"
                                      onClick={() => {
                                        setEnlargedImage(
                                          item?.productVariant
                                            ? item?.decor?.productVariants?.find(
                                                (i) =>
                                                  i.name === item.productVariant
                                              )?.image || item.decor?.thumbnail
                                            : item.decor?.thumbnail
                                        );
                                      }}
                                    />
                                  </div>
                                  {rec?.multipleAllowed && (
                                    <div className="flex flex-row items-center gap-2">
                                      <Label value="Qt." />
                                      <Select
                                        value={item.quantity.toString()}
                                        disabled={
                                          loading ||
                                          eventDay.status.approved ||
                                          event.status.approved
                                        }
                                        sizing={"sm"}
                                        onChange={(e) => {
                                          let {
                                            platform,
                                            platformRate,
                                            flooring,
                                            flooringRate,
                                            dimensions,
                                            category,
                                            unit,
                                            addOns,
                                            variant,
                                            decorPrice,
                                            productVariant,
                                            priceModifier,
                                          } = item;
                                          UpdateDecorItemInEvent({
                                            decor_id: item.decor?._id,
                                            platform,
                                            platformRate,
                                            flooring,
                                            flooringRate,
                                            decorPrice,
                                            dimensions,
                                            quantity: parseInt(e.target.value),
                                            variant,
                                            category,
                                            unit,
                                            addOns,
                                            productVariant,
                                            priceModifier,
                                          });
                                        }}
                                      >
                                        <option value={item.quantity}>
                                          {item.quantity}
                                        </option>
                                        {quantityList
                                          .sort(
                                            (a, b) =>
                                              parseInt(a.title) -
                                              parseInt(b.title)
                                          )
                                          .filter(
                                            (i) =>
                                              i.title !==
                                              item.quantity.toString()
                                          )
                                          .map((i) => (
                                            <option
                                              key={i.title}
                                              value={i.title}
                                            >
                                              {i.title}
                                            </option>
                                          ))}
                                      </Select>
                                    </div>
                                  )}
                                  <div className="flex flex-row items-center justify-between">
                                    {eventToolView !== "ops" && (
                                      <p className="font-medium text-rose-900">
                                        {toPriceString(item.price)}
                                      </p>
                                    )}
                                    <p
                                      className="text-sm cursor-pointer underline flex gap-1 items-center"
                                      onClick={() => {
                                        if (!loading) {
                                          setNotes({
                                            open: true,
                                            edit: false,
                                            decor_id: item.decor._id,
                                            package_id: "",
                                            admin_notes: item.admin_notes,
                                            user_notes: item.user_notes,
                                            notes:
                                              (item?.notes?.length || 0) > 0
                                                ? item.notes
                                                : [],
                                          });
                                        }
                                      }}
                                    >
                                      <CgNotes />
                                      Notes
                                    </p>
                                  </div>
                                </div>
                              </>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <p className="text-lg col-span-3">
                    Packages Items ({eventDay.packages.length})
                  </p>
                  <Button
                    color="light"
                    // onClick={() => {
                    //   setCustomItems([
                    //     ...customItems,
                    //     {
                    //       name: "",
                    //       price: 0,
                    //       quantity: 1,
                    //       image: "",
                    //       includeInTotalSummary: false,
                    //     },
                    //   ]);
                    // }}
                    disabled={loading || true}
                  >
                    <BsPlus size={16} /> Add New
                  </Button>
                </div>
                <div className="px-6 flex flex-col gap-2 divide-y">
                  {eventDay?.packages?.map((item, index) => (
                    <div className="grid grid-cols-4" key={index}>
                      <div className="col-span-4">
                        <p>[Package] {item?.package?.name}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {item?.decorItems?.map((i) => (
                          <div key={i.decor._id}>
                            <Image
                              src={i.decor.image}
                              alt="Decor"
                              width={0}
                              height={0}
                              sizes="100%"
                              style={{ width: "100%", height: "auto" }}
                              className="rounded-xl cursor-pointer"
                              onClick={() => {
                                setEnlargedImage(i.decor.image);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col px-4 pb-1">
                        <button
                          className="text-rose-900 bg-white hover:bg-rose-900 hover:text-white cursor-pointer px-2 py-1.5 text-sm focus:outline-none rounded-lg border-rose-900 border"
                          disabled={loading}
                          onClick={() => {
                            setNotes({
                              open: true,
                              edit: false,
                              decor_id: "",
                              package_id: item.package._id,
                              admin_notes: item.admin_notes,
                              user_notes: item.user_notes,
                              notes: (item?.notes?.length || 0) > 0 ? item.notes : [],
                            });
                          }}
                        >
                          View Notes
                        </button>
                      </div>
                      <div className="col-span-2">
                        <Table
                          hoverable
                          className="width-full overflow-x-auto"
                          key={`${index}-p-${item.package._id}`}
                        >
                          <Table.Head>
                            <Table.HeadCell>Item</Table.HeadCell>
                            <Table.HeadCell>Price</Table.HeadCell>
                          </Table.Head>
                          <Table.Body className="divide-y">
                            {item.decorItems?.map((rec, recIndex) => (
                              <Table.Row
                                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                key={recIndex}
                              >
                                <Table.Cell>
                                  [{rec.category}|{rec?.decor?.productInfo.id}]{" "}
                                  {rec.decor.name}
                                  {rec.platform && (
                                    <p>
                                      Platform (
                                      {`${rec.dimensions.length} x ${rec.dimensions.breadth} x ${rec.dimensions.height}`}
                                      ){" "}
                                    </p>
                                  )}
                                  {rec.flooring && (
                                    <p>
                                      Flooring:
                                      {rec.flooring}
                                    </p>
                                  )}
                                </Table.Cell>
                                <Table.Cell>
                                  ₹
                                  {
                                    rec.decor.productTypes?.find(
                                      (i) => i.name === item.variant
                                    )?.sellingPrice
                                  }
                                  {rec.platform && (
                                    <p>
                                      ₹
                                      {rec.platform
                                        ? rec.dimensions.length *
                                          rec.dimensions.breadth *
                                          rec.platformRate
                                        : 0}
                                    </p>
                                  )}
                                  {rec.flooring && (
                                    <p>
                                      ₹
                                      {rec.flooring
                                        ? (rec.dimensions.length +
                                            rec.dimensions.height) *
                                          (rec.dimensions.breadth +
                                            rec.dimensions.height) *
                                          rec.flooringRate
                                        : 0}
                                    </p>
                                  )}
                                </Table.Cell>
                              </Table.Row>
                            ))}
                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 font-medium">
                              <Table.Cell>Total</Table.Cell>
                              <Table.Cell>₹{item.price}</Table.Cell>
                            </Table.Row>
                          </Table.Body>
                        </Table>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <p className="text-lg col-span-2">
                    {eventDay.customItemsTitle || "Custom Items (Add-Ons)"} (
                    {eventDay.customItems.length})
                  </p>
                  <Button
                    color="light"
                    onClick={() => {
                      setEditCustomItemsTitle({
                        ...editCustomItemsTitle,
                        display: true,
                        customItemsTitle: eventDay.customItemsTitle || "",
                      });
                    }}
                    disabled={loading || event?.status?.approved}
                  >
                    <BiEditAlt size={16} /> Edit Add-Ons Title
                  </Button>
                  <Button
                    color="light"
                    onClick={() => {
                      setCustomItems([
                        ...customItems,
                        {
                          name: "",
                          price: 0,
                          quantity: 1,
                          image: "",
                          includeInTotalSummary: false,
                        },
                      ]);
                    }}
                    disabled={loading || event?.status?.approved}
                  >
                    <BsPlus size={16} /> Add New
                  </Button>
                </div>
                <div className="width-full overflow-x-auto">
                  <Table hoverable className="width-full overflow-x-auto">
                    <Table.Head>
                      <Table.HeadCell>Item Name</Table.HeadCell>
                      <Table.HeadCell>
                        Price Modifier (Qty. & Price)
                      </Table.HeadCell>
                      <Table.HeadCell>Upload Photo</Table.HeadCell>
                      <Table.HeadCell>ES/TS</Table.HeadCell>
                      <Table.HeadCell className=""></Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      {customItems?.map((item, index) => (
                        <Table.Row
                          className="bg-white dark:border-gray-700 dark:bg-gray-800"
                          key={item._id}
                        >
                          <Table.Cell className="align-top">
                            <div className="flex flex-row gap-2 items-center">
                              <TextInput
                                placeholder="Item Name"
                                value={item.name}
                                disabled={loading || event?.status?.approved}
                                onChange={(e) => {
                                  setCustomItems(
                                    customItems.map((rec, recIndex) => {
                                      if (recIndex === index) {
                                        return { ...rec, name: e.target.value };
                                      } else {
                                        return rec;
                                      }
                                    })
                                  );
                                }}
                              />
                              <MdOutlineImage
                                cursor={"pointer"}
                                className={`${
                                  loading ? `text-gray-400` : `text-gray-600`
                                } font-bold text-3xl`}
                                onClick={() => {
                                  if (
                                    !loading &&
                                    !eventDay.status.approved &&
                                    !event.status.approved
                                  ) {
                                    setCustomItemSetupLocationImageUpload({
                                      display: true,
                                      itemIndex: index,
                                      imageFile: "",
                                    });
                                  }
                                }}
                              />
                            </div>
                          </Table.Cell>
                          <Table.Cell className="flex gap-2 flex-row">
                            <TextInput
                              placeholder="Qty"
                              type="number"
                              value={item.quantity}
                              disabled={loading || event?.status?.approved}
                              onChange={(e) => {
                                setCustomItems(
                                  customItems.map((rec, recIndex) => {
                                    if (recIndex === index) {
                                      return {
                                        ...rec,
                                        quantity: parseInt(e.target.value),
                                      };
                                    } else {
                                      return rec;
                                    }
                                  })
                                );
                              }}
                            />
                            <TextInput
                              placeholder="Price"
                              type="number"
                              value={item.price}
                              disabled={loading || event?.status?.approved}
                              onChange={(e) => {
                                setCustomItems(
                                  customItems.map((rec, recIndex) => {
                                    if (recIndex === index) {
                                      return {
                                        ...rec,
                                        price: parseInt(e.target.value),
                                      };
                                    } else {
                                      return rec;
                                    }
                                  })
                                );
                              }}
                            />
                          </Table.Cell>
                          <Table.Cell className="relative">
                            {item.image && (
                              <ImageCard
                                src={item.image}
                                className="mb-3 max-h-32 max-w-32 overflow-hidden"
                              />
                            )}
                            <Button
                              color="gray"
                              onClick={() => {
                                setCustomItemImageUpload({
                                  display: true,
                                  itemIndex: index,
                                  imageFile: "",
                                });
                              }}
                              disabled={loading || event?.status?.approved}
                            >
                              <BsPlus /> {item.image ? "Update" : "Add"}
                            </Button>
                          </Table.Cell>
                          <Table.Cell className="align-top">
                            <ToggleSwitch
                              checked={item.includeInTotalSummary || false}
                              disabled={loading || event?.status?.approved}
                              onChange={(e) => {
                                setCustomItems(
                                  customItems.map((rec, recIndex) => {
                                    if (recIndex === index) {
                                      return {
                                        ...rec,
                                        includeInTotalSummary: e,
                                      };
                                    } else {
                                      return rec;
                                    }
                                  })
                                );
                              }}
                            />
                          </Table.Cell>
                          <Table.Cell className="flex gap-2">
                            <Button
                              disabled={
                                loading ||
                                index === customItems.length - 1 ||
                                event?.status?.approved
                              }
                              color="gray"
                              onClick={() => {
                                setCustomItems([
                                  ...customItems.slice(0, index),
                                  customItems[index + 1],
                                  customItems[index],
                                  ...customItems.slice(index + 2),
                                ]);
                              }}
                            >
                              <BsChevronDown />
                            </Button>
                            <Button
                              disabled={
                                loading || index == 0 || event?.status?.approved
                              }
                              color="gray"
                              onClick={() => {
                                setCustomItems([
                                  ...customItems.slice(0, index - 1),
                                  customItems[index],
                                  customItems[index - 1],
                                  ...customItems.slice(index + 1),
                                ]);
                              }}
                            >
                              <BsChevronUp />
                            </Button>
                            <Button
                              disabled={loading || event?.status?.approved}
                              color="gray"
                              onClick={() => {
                                setCustomItems([
                                  ...customItems.slice(0, index + 1),
                                  {
                                    name: "",
                                    price: 0,
                                    quantity: 1,
                                    image: "",
                                    includeInTotalSummary: false,
                                  },
                                  ...customItems.slice(index + 1),
                                ]);
                              }}
                            >
                              <BsPlus />
                            </Button>
                            <Button
                              disabled={loading || event?.status?.approved}
                              color="gray"
                              onClick={() =>
                                setCustomItems(
                                  customItems.filter(
                                    (rec, recIndex) => recIndex !== index
                                  )
                                )
                              }
                            >
                              <MdDelete />
                            </Button>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                  <Modal
                    show={customItemImageUpload.display}
                    size="xl"
                    onClose={() => {
                      setCustomItemImageUpload({
                        display: false,
                        itemIndex: -1,
                        imageFile: "",
                      });
                    }}
                    popup
                  >
                    <Modal.Header />
                    <Modal.Body>
                      <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                          Upload Image
                        </h3>
                        <div>
                          <div className="mb-2 block">
                            <Label value="Upload Image" />
                          </div>
                          <FileInput
                            ref={customItemImageRef}
                            disabled={loading}
                            onChange={(e) => {
                              setCustomItemImageUpload({
                                ...customItemImageUpload,
                                imageFile: e.target.files[0],
                              });
                            }}
                          />
                        </div>
                        <div className="w-full flex gap-3 items-center">
                          <Button
                            color="success"
                            disabled={
                              loading || !customItemImageUpload.imageFile
                            }
                            onClick={UploadCustomImage}
                          >
                            Upload Image
                          </Button>
                        </div>
                      </div>
                    </Modal.Body>
                  </Modal>
                  <Modal
                    show={customItemSetupLocationImageUpload.display}
                    size="xl"
                    onClose={() => {
                      setCustomItemSetupLocationImageUpload({
                        display: false,
                        itemIndex: -1,
                        imageFile: "",
                      });
                    }}
                    popup
                  >
                    <Modal.Header />
                    <Modal.Body>
                      <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                          Upload Image
                        </h3>
                        <div>
                          {customItems[
                            customItemSetupLocationImageUpload.itemIndex
                          ]?.setupLocationImage && (
                            <Image
                              src={
                                customItems[
                                  customItemSetupLocationImageUpload.itemIndex
                                ]?.setupLocationImage
                              }
                              alt="Decor"
                              sizes="100%"
                              width={0}
                              height={0}
                              className="w-full h-auto cursor-pointer"
                              onClick={() => {
                                setEnlargedImage(
                                  customItems[
                                    customItemSetupLocationImageUpload.itemIndex
                                  ]?.setupLocationImage
                                );
                              }}
                            />
                          )}
                          <div className="mb-2 block">
                            <Label value="Upload Image" />
                          </div>
                          <FileInput
                            ref={customItemImageRef}
                            disabled={loading}
                            onChange={(e) => {
                              setCustomItemSetupLocationImageUpload({
                                ...customItemSetupLocationImageUpload,
                                imageFile: e.target.files[0],
                              });
                            }}
                          />
                        </div>
                        <div className="w-full flex gap-3 items-center">
                          <Button
                            color="success"
                            disabled={
                              loading ||
                              !customItemSetupLocationImageUpload.imageFile
                            }
                            onClick={UploadCustomSetupLocationImage}
                          >
                            Upload Image
                          </Button>
                        </div>
                      </div>
                    </Modal.Body>
                  </Modal>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <Button
                    color="success"
                    onClick={() => {
                      updateCustomItems();
                    }}
                    disabled={loading || event?.status?.approved}
                  >
                    Update/Save
                  </Button>
                  <Button
                    color="light"
                    onClick={() => {
                      setCustomItems([
                        ...customItems,
                        {
                          name: "",
                          price: 0,
                          quantity: 1,
                          image: "",
                          includeInTotalSummary: false,
                        },
                      ]);
                    }}
                    disabled={loading || event?.status?.approved}
                  >
                    <BsPlus size={16} /> Add New
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <p className="text-lg col-span-3">
                    Mandatory Items ({eventDay.mandatoryItems.length})
                  </p>
                  <Button
                    color="light"
                    onClick={() => {
                      fetchEventMandatoryQuestions();
                    }}
                    disabled={loading || event?.status?.approved}
                  >
                    Reset
                    <MdRefresh size={16} />
                  </Button>
                </div>
                <div className="flex flex-col gap-3">
                  {mandatoryItems?.map((item, index) => (
                    <div
                      className="rounded-xl border border-black p-4 grid grid-cols-4 gap-4"
                      key={index}
                    >
                      <div className="col-span-3 flex flex-col gap-2">
                        <Label value={item.title} />
                        <TextInput
                          placeholder="Description"
                          value={item.description}
                          disabled={loading || event?.status?.approved}
                          onChange={(e) => {
                            setMandatoryItems(
                              mandatoryItems.map((rec, recIndex) => {
                                if (recIndex === index) {
                                  return {
                                    ...rec,
                                    description: e.target.value,
                                  };
                                } else {
                                  return rec;
                                }
                              })
                            );
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-row gap-3">
                          <ToggleSwitch
                            checked={item.itemRequired}
                            disabled={loading || event?.status?.approved}
                            label="Required?"
                            onChange={(e) => {
                              setMandatoryItems(
                                mandatoryItems.map((rec, recIndex) => {
                                  if (recIndex === index) {
                                    return {
                                      ...rec,
                                      itemRequired: e,
                                    };
                                  } else {
                                    return rec;
                                  }
                                })
                              );
                            }}
                          />
                          <ToggleSwitch
                            checked={item.includeInTotalSummary || false}
                            disabled={loading || event?.status?.approved}
                            label="ES/TS?"
                            onChange={(e) => {
                              setMandatoryItems(
                                mandatoryItems.map((rec, recIndex) => {
                                  if (recIndex === index) {
                                    return {
                                      ...rec,
                                      includeInTotalSummary: e,
                                    };
                                  } else {
                                    return rec;
                                  }
                                })
                              );
                            }}
                          />
                        </div>
                        <TextInput
                          type="number"
                          placeholder="Price"
                          value={item.price}
                          disabled={loading || event?.status?.approved}
                          onChange={(e) => {
                            setMandatoryItems(
                              mandatoryItems.map((rec, recIndex) => {
                                if (recIndex === index) {
                                  return {
                                    ...rec,
                                    price: parseInt(e.target.value),
                                  };
                                } else {
                                  return rec;
                                }
                              })
                            );
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <Button
                    color="success"
                    onClick={() => {
                      updateMandatoryItems();
                    }}
                    disabled={loading || event?.status?.approved}
                  >
                    Update/Save
                  </Button>
                  <Button
                    color="light"
                    onClick={() => {
                      fetchEventMandatoryQuestions();
                    }}
                    disabled={loading || event?.status?.approved}
                  >
                    Reset
                    <MdRefresh size={16} />
                  </Button>
                </div>
                {eventToolView !== "ops" && (
                  <div className="w-full block mx-auto pt-4 mb-6 border-t border-t-black">
                    <p className="text-lg">Event Day Summary</p>
                    <Table className="border my-3">
                      <Table.Head>
                        <Table.HeadCell>
                          <span className="sr-only">#</span>
                        </Table.HeadCell>
                        <Table.HeadCell>Item</Table.HeadCell>
                        <Table.HeadCell>Price</Table.HeadCell>
                      </Table.Head>
                      <Table.Body className="divide-y">
                        {(() => {
                          // Group decor items by decor.category in the order they were added (first-seen order)
                          const order = [];
                          const totals = {};
                          (eventDay?.decorItems || []).forEach((it) => {
                            const cat =
                              it?.decor?.category || it?.category || "Other";
                            if (!Object.prototype.hasOwnProperty.call(totals, cat)) {
                              totals[cat] = 0;
                              order.push(cat);
                            }
                            totals[cat] += it?.price || 0;
                          });

                          const packagesTotal = (eventDay?.packages || []).reduce(
                            (a, c) => a + (c?.price || 0),
                            0
                          );
                          const customTotal = (eventDay?.customItems || [])
                            .filter((i) => !i.includeInTotalSummary)
                            .reduce((a, c) => a + (c?.price || 0), 0);
                          const mandatoryTotal = (eventDay?.mandatoryItems || [])
                            .filter((i) => i.itemRequired && !i.includeInTotalSummary)
                            .reduce((a, c) => a + (c?.price || 0), 0);

                          const rows = [];
                          order.forEach((cat, idx) => {
                            rows.push(
                              <Table.Row
                                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                key={`cat-${cat}`}
                              >
                                <Table.Cell>{idx + 1}</Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                  {cat}
                                </Table.Cell>
                                <Table.Cell>₹{totals[cat]}</Table.Cell>
                              </Table.Row>
                            );
                          });

                          let seq = rows.length;
                          if (packagesTotal > 0) {
                            seq += 1;
                            rows.push(
                              <Table.Row
                                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                key="packages-total"
                              >
                                <Table.Cell>{seq}</Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                  Packages
                                </Table.Cell>
                                <Table.Cell>₹{packagesTotal}</Table.Cell>
                              </Table.Row>
                            );
                          }
                          if (customTotal > 0) {
                            seq += 1;
                            rows.push(
                              <Table.Row
                                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                key="custom-total"
                              >
                                <Table.Cell>{seq}</Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                  {eventDay?.customItemsTitle || "ADD ONS"}
                                </Table.Cell>
                                <Table.Cell>₹{customTotal}</Table.Cell>
                              </Table.Row>
                            );
                          }
                          if (mandatoryTotal > 0) {
                            seq += 1;
                            rows.push(
                              <Table.Row
                                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                key="mandatory-total"
                              >
                                <Table.Cell>{seq}</Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                  Mandatory Items
                                </Table.Cell>
                                <Table.Cell>₹{mandatoryTotal}</Table.Cell>
                              </Table.Row>
                            );
                          }

                          return rows;
                        })()}
                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                          <Table.Cell />
                          <Table.Cell className="text-right whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            Total
                          </Table.Cell>
                          <Table.Cell>
                            ₹
                            {(eventDay?.decorItems || []).reduce(
                              (accumulator, currentValue) => {
                                return accumulator + (currentValue?.price || 0);
                              },
                              0
                            ) +
                              (eventDay?.packages || []).reduce(
                                (accumulator, currentValue) => {
                                  return accumulator + (currentValue?.price || 0);
                                },
                                0
                              ) +
                              (eventDay?.customItems || [])
                                .filter((i) => !i.includeInTotalSummary)
                                .reduce((accumulator, currentValue) => {
                                  return accumulator + (currentValue?.price || 0);
                                }, 0) +
                              (eventDay?.mandatoryItems || [])
                                .filter(
                                  (i) => i.itemRequired && !i.includeInTotalSummary
                                )
                                .reduce((accumulator, currentValue) => {
                                  return accumulator + (currentValue?.price || 0);
                                }, 0)}
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>
                  </div>
                )}
                <div className="flex flex-row gap-4 items-center justify-center">
                  <Button
                    color="blue"
                    onClick={() => {
                      SendEventToClient();
                    }}
                    disabled={loading}
                  >
                    Send to client
                  </Button>
                  {eventDay?.status?.finalized &&
                    !eventDay?.status?.approved && (
                      <Button
                        color="success"
                        onClick={() => {
                          approveEventDay();
                        }}
                        disabled={loading}
                      >
                        Approve Event Day
                      </Button>
                    )}
                  {eventDay?.status?.finalized &&
                    !event?.status?.approved &&
                    eventDay?.status?.approved && (
                      <Button
                        color="failure"
                        onClick={() => {
                          removeEventDayApproval();
                        }}
                        disabled={loading}
                      >
                        Remove Event Day Approval
                      </Button>
                    )}
                </div>
                <p className="text-red-500 text-center font-medium">
                  *Finalise all the events before approval
                </p>
              </div>
            )}
          </div>
          {eventToolView !== "ops" && (
            <div>
              <div className="grid grid-cols-4 gap-4">
                <p className="text-xl font-medium col-span-3">Event Summary</p>
              </div>
              <div className="w-4/5 block mx-auto mb-6">
                <Table className="border my-3">
                  <Table.Head>
                    <Table.HeadCell>
                      <span className="sr-only">#</span>
                    </Table.HeadCell>
                    <Table.HeadCell>Event Day</Table.HeadCell>
                    <Table.HeadCell>Price</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {event.eventDays?.map((item, index) => (
                      <>
                        <Table.Row
                          className="bg-white dark:border-gray-700 dark:bg-gray-800"
                          key={index}
                        >
                          <Table.Cell>{index + 1}</Table.Cell>
                          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </Table.Cell>
                          <Table.Cell>
                            ₹
                            {item?.decorItems.reduce(
                              (accumulator, currentValue) => {
                                return accumulator + currentValue.price;
                              },
                              0
                            ) +
                              item?.packages.reduce(
                                (accumulator, currentValue) => {
                                  return accumulator + currentValue.price;
                                },
                                0
                              ) +
                              item?.customItems
                                .filter((i) => !i.includeInTotalSummary)
                                .reduce((accumulator, currentValue) => {
                                  return accumulator + currentValue.price;
                                }, 0) +
                              item?.mandatoryItems
                                ?.filter(
                                  (i) =>
                                    i.itemRequired && !i.includeInTotalSummary
                                )
                                ?.reduce((accumulator, currentValue) => {
                                  return accumulator + currentValue.price;
                                }, 0)}
                          </Table.Cell>
                        </Table.Row>
                      </>
                    ))}
                    {event.eventDays?.map((tempEventDay, index) => (
                      <>
                        {tempEventDay.customItems
                          .filter((i) => i.includeInTotalSummary)
                          ?.map((item, index) => (
                            <Table.Row
                              className="bg-white dark:border-gray-700 dark:bg-gray-800"
                              key={index}
                            >
                              <Table.Cell>
                                {/* {eventDay?.decorItems.length +
                                eventDay?.packages.length +
                                1} */}
                              </Table.Cell>
                              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {item.name}
                              </Table.Cell>
                              <Table.Cell>₹{item.price}</Table.Cell>
                            </Table.Row>
                          ))}
                        {tempEventDay?.mandatoryItems
                          .filter((i) => i.itemRequired && i.includeInTotalSummary)
                          ?.map((item, index) => (
                            <Table.Row
                              className="bg-white dark:border-gray-700 dark:bg-gray-800"
                              key={index}
                            >
                              <Table.Cell>
                                {/* {eventDay?.decorItems.length +
                                eventDay?.packages.length +
                                (eventDay.customItems.length ? 1 : 0) +
                                index +
                                1} */}
                              </Table.Cell>
                              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {item.description}
                              </Table.Cell>
                              <Table.Cell>₹{item.price}</Table.Cell>
                            </Table.Row>
                          ))}
                      </>
                    ))}

                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell />
                      <Table.Cell className="text-right whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        Total
                      </Table.Cell>
                      <Table.Cell>
                        ₹
                        {event.eventDays?.reduce(
                          (masterAccumulator, masterCurrentValue) => {
                            return (
                              masterAccumulator +
                              masterCurrentValue.decorItems.reduce(
                                (accumulator, currentValue) => {
                                  return accumulator + currentValue.price;
                                },
                                0
                              ) +
                              masterCurrentValue?.packages.reduce(
                                (accumulator, currentValue) => {
                                  return accumulator + currentValue.price;
                                },
                                0
                              ) +
                              masterCurrentValue?.customItems.reduce(
                                (accumulator, currentValue) => {
                                  return accumulator + currentValue.price;
                                },
                                0
                              ) +
                              masterCurrentValue?.mandatoryItems.reduce(
                                (accumulator, currentValue) => {
                                  return accumulator + currentValue.price;
                                },
                                0
                              )
                            );
                          },
                          0
                        )}
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </div>
              <div className="w-2/3 mx-auto flex flex-col gap-3 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-right">Item Bill</div>
                  <div className="text-rose-900">{event?.amount?.preTotal}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 border-b-black border-b pb-3">
                  <div className="text-right">Coupon code discount</div>
                  <div className="text-rose-900">{event?.amount?.discount}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 font-medium">
                  <div className="text-right">Amount Payable</div>
                  <div className="text-rose-900">
                    {event?.amount?.total} INR
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label value="Event Discount" />
                  <TextInput
                    type="number"
                    placeholder="Event Discount"
                    value={discount}
                    disabled={loading || event?.status?.approved}
                    onChange={(e) => {
                      setDiscount(parseInt(e.target.value));
                    }}
                  />
                </div>
                <div>
                  <Label className="font-medium">
                    Final Approved (with Discount): <br />₹
                    {event.eventDays?.reduce(
                      (masterAccumulator, masterCurrentValue) => {
                        return (
                          masterAccumulator +
                          masterCurrentValue.decorItems.reduce(
                            (accumulator, currentValue) => {
                              return accumulator + currentValue.price;
                            },
                            0
                          ) +
                          masterCurrentValue?.packages.reduce(
                            (accumulator, currentValue) => {
                              return accumulator + currentValue.price;
                            },
                            0
                          ) +
                          masterCurrentValue?.customItems.reduce(
                            (accumulator, currentValue) => {
                              return accumulator + currentValue.price;
                            },
                            0
                          ) +
                          masterCurrentValue?.mandatoryItems.reduce(
                            (accumulator, currentValue) => {
                              return accumulator + currentValue.price;
                            },
                            0
                          )
                        );
                      },
                      0
                    ) - discount}
                  </Label>
                </div>
                {event?.status?.finalized &&
                  event?.status?.approved &&
                  !event?.status?.paymentDone && (
                    <div className="place-self-end">
                      <Button
                        onClick={() => {
                          setCashPayment({
                            amount: 0,
                            display: true,
                            method: "cash",
                          });
                        }}
                        disabled={loading}
                      >
                        Add Cash Payment
                      </Button>
                    </div>
                  )}
                <div className="col-start-4 place-self-end flex flex-col gap-2">
                  {event?.status?.finalized &&
                    !event?.status?.approved &&
                    event?.eventDays?.filter((i) => !i.status.approved)
                      .length == 0 && (
                      <Button
                        color="success"
                        onClick={() => {
                          approveEvent();
                        }}
                        disabled={loading}
                      >
                        Approve Event
                      </Button>
                    )}
                  {event?.status?.finalized && event?.status?.approved && (
                    <Button
                      color="failure"
                      onClick={() => {
                        removeEventApproval();
                      }}
                      disabled={loading}
                    >
                      Remove Event Approval
                    </Button>
                  )}
                  {event?.status?.finalized &&
                    !event?.status?.approved &&
                    event?.eventDays?.filter((i) => i.status.approved).length ==
                      0 && (
                      <Button
                        color="failure"
                        onClick={() => {
                          removeEventFinalize();
                        }}
                        disabled={loading}
                      >
                        Remove Event Finalize
                      </Button>
                    )}
                  {!event?.status?.finalized && (
                    <Button
                      color="success"
                      onClick={() => {
                        finalizeEvent();
                      }}
                      disabled={loading}
                    >
                      Finalize Event
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
