import { toProperCase } from "@/utils/text";
import {
  Badge,
  Button,
  Checkbox,
  Label,
  Modal,
  Select,
  Table,
  TextInput,
  Textarea,
} from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  BsArrowDownLeft,
  BsArrowUp,
  BsChevronDown,
  BsChevronUp,
  BsPlus,
  BsSearch,
} from "react-icons/bs";
import {
  MdRemoveRedEye,
  MdOutlineRemoveRedEye,
  MdDelete,
  MdEdit,
  MdDone,
  MdClose,
} from "react-icons/md";
import { MdPayments } from "react-icons/md";
// NEW (lead details header): icon used for the "block user" action, matching the given design
import { CircleAlert } from "lucide-react";

// STATIC: Base interest options shown as chips in the Interests section.
// Custom interests added by the user are merged with this list at runtime.
const BASE_INTEREST_OPTIONS = [
  "Venue",
  "Decor",
  "Catering",
  "Makeup",
  "Photography",
  "DJ",
  "Mehendi",
  "Gift Packing",
  "Choreographer",
  "Car rental",
  "Cake",
];

// Event share (client view link) relationship options
const RELATIONSHIP_OPTIONS = [
  "Friend",
  "Brother",
  "Sister",
  "Father",
  "Mother",
  "Partner",
  "Other",
];

export default function Leads({ message, setMessage }) {
  const router = useRouter();
  const { leadId } = router.query;
  const [display, setDisplay] = useState("Account Status");
  const [lead, setLead] = useState({});
  const [conversation, setConversation] = useState("");
  const [noteDateTime, setNoteDateTime] = useState("");
  // Notes editing (Previous Notes): per-note drafts keyed by noteId so inputs are immediately editable
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [noteEdits, setNoteEdits] = useState({}); // { [noteId]: { text, dateTime, originalText, originalDateTime } }
  const [notes, setNotes] = useState("");
  const [callSchedule, setCallSchedule] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayPayment, setDisplayPayment] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [updatedName, setUpdatedName] = useState(null);
  const [newEvent, setNewEvent] = useState({
    name: "",
    community: "",
    display: false,
    eventDay: "",
    date: "",
    time: "",
    venue: "",
  });
  const [editEventInfo, setEditEventInfo] = useState({
    eventId: "",
    edit: false,
    name: "",
    community: "",
  });
  const [editEventDayInfo, setEditEventDayInfo] = useState({
    eventId: "",
    edit: false,
    name: "",
    date: "",
    venue: "",
    time: "",
    eventDay: "",
  });
  const [addEventDay, setAddEventDay] = useState({
    eventId: "",
    add: false,
    name: "",
    date: "",
    venue: "",
    time: "",
  });
  // Lead status (New / Hot / Warm / Closed / Lost) derived from the existing API response
  const [leadStatus, setLeadStatus] = useState("");

  // Share links (no-login view access via token) - keyed by eventId
  const [eventSharesByEventId, setEventSharesByEventId] = useState({}); // { [eventId]: Array<EventShare> }
  const [shareDraftByEventId, setShareDraftByEventId] = useState({}); // { [eventId]: { name, phone, email, relationship } }
  const [shareLoadingByEventId, setShareLoadingByEventId] = useState({}); // { [eventId]: boolean }
  const [shareTargetEventId, setShareTargetEventId] = useState("");
  // NEW: Follow ups / Tasks state for this lead.
  // Backed by the existing Task model (category + referenceId) on the server.
  const [followUps, setFollowUps] = useState([]); // category = "Lead-FollowUp", referenceId = leadId
  const [leadTasks, setLeadTasks] = useState([]); // category = "Lead-Task", referenceId = leadId
  const [newFollowUpText, setNewFollowUpText] = useState("");
  const [newFollowUpDateTime, setNewFollowUpDateTime] = useState("");
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskDateTime, setNewTaskDateTime] = useState("");
  // NEW: selection + UI state for follow up / task history + modals
  const [selectedFollowUpId, setSelectedFollowUpId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [followUpHistoryOpen, setFollowUpHistoryOpen] = useState(false);
  const [taskHistoryOpen, setTaskHistoryOpen] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  // NEW: Interests section state (chips below Follow ups / Tasks)
  // Persisted on the lead under additionalInfo.interests as an array of strings.
  const [interests, setInterests] = useState([]);
  const [customInterest, setCustomInterest] = useState("");
  const [showCustomInterestInput, setShowCustomInterestInput] = useState(false);
  // NEW: local UI state for the mid-page summary boxes (Status / Decor / Makeup / Client budget)
  // These values are always computed from / persisted to the backend; no existing fields are changed.
  const [storeAccess, setStoreAccess] = useState(false);
  const [biddingStatus, setBiddingStatus] = useState("No Bid");
  const [wedsyPackageStatus, setWedsyPackageStatus] = useState("No Activity");
  const [vendorPackageStatus, setVendorPackageStatus] =
    useState("No Activity");
  const [clientBudget, setClientBudget] = useState("");
  const [clientBudgetNotes, setClientBudgetNotes] = useState("");
  // Controls the Edit / Update flow for client budget inputs (read-only until "Edit" is clicked)
  const [budgetEditMode, setBudgetEditMode] = useState(false);

  const computeLeadStatus = (tempLead) => {
    if (!tempLead) return "";

    if (tempLead.isLost) return "Lost";

    if (
      tempLead.paymentStats &&
      typeof tempLead.paymentStats.amountDue === "number" &&
      tempLead.paymentStats.amountDue === 0 &&
      tempLead.paymentStats.totalAmount > 0
    ) {
      return "Closed";
    }

    const events = tempLead.events || [];
    let earliestDate = null;
    events.forEach((evt) => {
      (evt.eventDays || []).forEach((day) => {
        if (day.date) {
          const d = new Date(day.date);
          if (!isNaN(d.getTime())) {
            if (!earliestDate || d < earliestDate) {
              earliestDate = d;
            }
          }
        }
      });
    });

    if (earliestDate) {
      const now = new Date();
      const diffDays = (earliestDate - now) / (1000 * 60 * 60 * 24);
      const diffWeeks = diffDays / 7;
      if (diffWeeks <= 8) return "Hot";
      if (diffWeeks <= 20) return "Warm";
    }

    return "New";
  };
  const fetchLead = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiry/${leadId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setLead(response);
        setNotes(response.updates.notes);
        setCallSchedule(response.updates.callSchedule);
        // Drive the lead-status text box from existing lead + payment information
        setLeadStatus(computeLeadStatus(response));
        // Store Access comes from additionalInfo.storeAccess (boolean)
        setStoreAccess(
          response.additionalInfo &&
            response.additionalInfo.storeAccess === true
        );
        // Makeup report boxes come from statusSummary, added in the enriched /enquiry/:id API
        setBiddingStatus(
          response.statusSummary?.bidding ? response.statusSummary.bidding : "No Bid"
        );
        setWedsyPackageStatus(
          response.statusSummary?.wedsyPackage
            ? response.statusSummary.wedsyPackage
            : "No Activity"
        );
        setVendorPackageStatus(
          response.statusSummary?.vendorPackage
            ? response.statusSummary.vendorPackage
            : "No Activity"
        );
        // Client approx budget (number) and notes are persisted in additionalInfo.*
        setClientBudget(
          response.additionalInfo?.clientBudget !== undefined &&
            response.additionalInfo?.clientBudget !== null
            ? String(response.additionalInfo.clientBudget)
            : ""
        );
        setClientBudgetNotes(
          response.additionalInfo?.clientBudgetNotes || ""
        );
        // NEW: hydrate interests chip selection from additionalInfo.interests (if present)
        if (
          Array.isArray(response.additionalInfo?.interests) &&
          response.additionalInfo.interests.length > 0
        ) {
          setInterests(response.additionalInfo.interests);
        } else {
          setInterests([]);
        }
        setUpdatedName(null);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  // For <input type="datetime-local" /> value: "YYYY-MM-DDTHH:mm"
  const formatDateTimeLocal = (d) => {
    const pad2 = (n) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad2(d.getMonth() + 1);
    const dd = pad2(d.getDate());
    const hh = pad2(d.getHours());
    const min = pad2(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

  const parseDateTimeLocal = (value) => {
    if (!value || typeof value !== "string") return null;
    // Expected: YYYY-MM-DDTHH:mm
    const m = value.match(
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/
    );
    if (!m) return null;
    const yyyy = parseInt(m[1], 10);
    const mm = parseInt(m[2], 10);
    const dd = parseInt(m[3], 10);
    const hh = parseInt(m[4], 10);
    const min = parseInt(m[5], 10);
    const d = new Date(yyyy, mm - 1, dd, hh, min, 0, 0);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  // Initialize editable note Date/Time once (so user edits aren't overwritten each render)
  useEffect(() => {
    if (!noteDateTime) {
      setNoteDateTime(formatDateTimeLocal(new Date()));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const createUser = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiry/${leadId}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          fetchLead();
          setMessage({
            text: "User Created Successfully!",
            status: "success",
            display: true,
          });
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const getShareDraft = (eventId) => {
    return (
      shareDraftByEventId?.[eventId] || {
        name: "",
        phone: "",
        email: "",
        relationship: "",
      }
    );
  };

  const fetchEventShares = (eventId) => {
    if (!eventId) return;
    setShareLoadingByEventId((p) => ({ ...p, [eventId]: true }));
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/share`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => r.json())
      .then((resp) => {
        setEventSharesByEventId((p) => ({ ...p, [eventId]: resp?.list || [] }));
      })
      .catch(() => {})
      .finally(() => {
        setShareLoadingByEventId((p) => ({ ...p, [eventId]: false }));
      });
  };

  const createEventShare = (eventId) => {
    if (!eventId) return;
    const draft = getShareDraft(eventId);
    if (!draft.phone) return;
    setShareLoadingByEventId((p) => ({ ...p, [eventId]: true }));
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/share`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(draft),
    })
      .then((r) => r.json())
      .then((resp) => {
        if (resp?.message === "success") {
          // Clear draft
          setShareDraftByEventId((p) => ({
            ...p,
            [eventId]: { name: "", phone: "", email: "", relationship: "" },
          }));
          fetchEventShares(eventId);
          if (resp?.shareLink) {
            navigator.clipboard?.writeText(resp.shareLink).catch(() => {});
            setMessage({
              text: "Share link created & copied!",
              status: "success",
              display: true,
            });
          } else {
            setMessage({
              text: "Share created!",
              status: "success",
              display: true,
            });
          }
        } else {
          setMessage({
            text: "Failed to create share",
            status: "failure",
            display: true,
          });
        }
      })
      .catch(() => {
        setMessage({
          text: "Failed to create share",
          status: "failure",
          display: true,
        });
      })
      .finally(() => {
        setShareLoadingByEventId((p) => ({ ...p, [eventId]: false }));
      });
  };

  const revokeEventShare = (eventId, shareId) => {
    if (!eventId || !shareId) return;
    setShareLoadingByEventId((p) => ({ ...p, [eventId]: true }));
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/share/${shareId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => r.json())
      .then((resp) => {
        if (resp?.message === "success") {
          fetchEventShares(eventId);
          setMessage({
            text: "Share revoked",
            status: "success",
            display: true,
          });
        }
      })
      .catch(() => {})
      .finally(() => {
        setShareLoadingByEventId((p) => ({ ...p, [eventId]: false }));
      });
  };

  const copyEventShareLink = (eventId, shareId) => {
    if (!eventId || !shareId) return;
    setShareLoadingByEventId((p) => ({ ...p, [eventId]: true }));
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/${eventId}/share/${shareId}/rotate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((r) => r.json())
      .then((resp) => {
        if (resp?.message === "success" && resp?.shareLink) {
          navigator.clipboard?.writeText(resp.shareLink).catch(() => {});
          setMessage({
            text: "Share link copied!",
            status: "success",
            display: true,
          });
        }
      })
      .catch(() => {})
      .finally(() => {
        setShareLoadingByEventId((p) => ({ ...p, [eventId]: false }));
      });
  };
  // Create a new note (top input)
  const createNote = () => {
    setLoading(true);
    const parsedDate = parseDateTimeLocal(noteDateTime) || new Date();
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/enquiry/${leadId}/conversations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          conversation,
          createdAt: parsedDate.toISOString(),
        }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          fetchLead();
          setConversation("");
          setNoteDateTime(formatDateTimeLocal(new Date()));
          // After creating a note, clear any previous-note edit state
          setActiveNoteId(null);
          setNoteEdits({});
          setMessage({
            text: "Note added Successfully!",
            status: "success",
            display: true,
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  // Update an existing note (selected row)
  const updateSelectedNote = () => {
    if (!activeNoteId) return;
    const draft = noteEdits[activeNoteId];
    if (!draft) return;
    setLoading(true);
    const parsedDate = parseDateTimeLocal(draft.dateTime) || new Date();
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/enquiry/${leadId}/conversations/${activeNoteId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          text: draft.text,
          createdAt: parsedDate.toISOString(),
        }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          fetchLead();
          // After update, clear edit mode so Update disables again (matches requested flow)
          setActiveNoteId(null);
          setNoteEdits({});
          setMessage({
            text: "Note updated Successfully!",
            status: "success",
            display: true,
          });
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setLoading(false);
      });
  };

  const deleteNoteById = (noteId) => {
    if (!leadId || !noteId || loading) return;
    if (!confirm("Delete this note?")) return;

    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/enquiry/${leadId}/conversations/${noteId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((r) => r.json())
      .then((resp) => {
        setLoading(false);
        if (resp?.message === "success") {
          // If the deleted note was selected for editing, clear selection
          setActiveNoteId((prev) => (prev === noteId ? null : prev));
          setNoteEdits((prev) => {
            const next = { ...prev };
            delete next[noteId];
            return next;
          });
          fetchLead();
          setMessage({
            text: "Note deleted successfully!",
            status: "success",
            display: true,
          });
        } else {
          setMessage({
            text: "Failed to delete note.",
            status: "failure",
            display: true,
          });
        }
      })
      .catch((err) => {
        console.error("Delete note error:", err);
        setLoading(false);
        setMessage({
          text: "Error while deleting note.",
          status: "failure",
          display: true,
        });
      });
  };

  const isNoteDirty = (() => {
    if (!activeNoteId) return false;
    const d = noteEdits[activeNoteId];
    if (!d) return false;
    return d.text !== d.originalText || d.dateTime !== d.originalDateTime;
  })();
  const updateNotes = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiry/${leadId}/notes`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ notes }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          fetchLead();
          setMessage({
            text: "Notes updated Successfully!",
            status: "success",
            display: true,
          });
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updateName = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiry/${leadId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name: updatedName }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          fetchLead();
          setMessage({
            text: "Name updated Successfully!",
            status: "success",
            display: true,
          });
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updateCallSchedule = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiry/${leadId}/call`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ callSchedule }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          fetchLead();
          setMessage({
            text: "Call Scheduled Successfully!",
            status: "success",
            display: true,
          });
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const markInterested = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiry`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ action: "MarkInterested", leadIds: [lead?._id] }),
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          setMessage({
            text: "Marked Lead as Interested!",
            status: "success",
            display: true,
          });
        }
        fetchLead();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const markLost = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiry`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ action: "MarkLost", leadIds: [lead?._id] }),
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          setMessage({
            text: "Marked Lead as Lost!",
            status: "success",
            display: true,
          });
        }
        fetchLead();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const deleteLead = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiry`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ leadIds: [lead?._id] }),
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          setMessage({
            text: "Lead deleted as successfully!",
            status: "success",
            display: true,
          });
          router.push("/leads");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchTransactions = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/${displayPayment}/transactions`,
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
        setTransactions(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const createEvent = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: newEvent.name,
        community: newEvent.community,
        eventDay: newEvent.eventDay,
        date: newEvent.date,
        time: newEvent.time,
        venue: newEvent.venue,
        user: lead.user?._id,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          fetchLead();
          setMessage({
            text: "Event created Successfully!",
            status: "success",
            display: true,
          });
          setNewEvent({
            name: "",
            community: "",
            display: false,
            eventDay: "",
            date: "",
            time: "",
            venue: "",
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updateEvent = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${editEventInfo.eventId}`, {
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
          fetchLead();
          setMessage({
            text: "Event updated Successfully!",
            status: "success",
            display: true,
          });
          setEditEventInfo({
            eventId: "",
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
  const updateEventDay = () => {
    if (editEventDayInfo.eventDay && editEventDayInfo.eventId) {
      setLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/event/${editEventDayInfo.eventId}/eventDay/${editEventDayInfo.eventDay}`,
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
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.message === "success") {
            setLoading(false);
            fetchLead();
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
              time: "",
              eventDay: "",
              eventId: "",
            });
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  };
  const deleteEventDay = (tempEventId, tempEventDayId) => {
    if (tempEventDayId) {
      setLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/event/${tempEventId}/eventDay/${tempEventDayId}`,
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
            fetchLead();
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
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/${addEventDay?.eventId}/eventDay/`,
      {
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
        }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          fetchLead();
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
            time: "",
            eventId: "",
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const handleBlockUser = () => {
    if (loading || !lead?.user?._id) return;
    if (
      !confirm(
        "Are you sure you want to block this user? They may not be able to log in."
      )
    ) {
      return;
    }
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/user/block`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ userId: lead.user._id, blocked: true }),
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          setMessage({
            text: "User blocked successfully!",
            status: "success",
            display: true,
          });
        } else {
          setMessage({
            text: "Failed to block user.",
            status: "failure",
            display: true,
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setLoading(false);
        setMessage({
          text: "Error while blocking user.",
          status: "failure",
          display: true,
        });
      });
  };

  // Helper to PATCH `additionalInfo` fields on a lead without touching any existing behaviour.
  // Used only by the new Status / Decor / Makeup / Client budget UI on this page.
  const updateAdditionalInfo = (updates) => {
    if (!leadId) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiry/${leadId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ additionalInfoUpdates: updates }),
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          fetchLead();
          setMessage({
            text: "Updated successfully!",
            status: "success",
            display: true,
          });
        } else {
          setMessage({
            text: "Failed to update details.",
            status: "failure",
            display: true,
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setLoading(false);
        setMessage({
          text: "Error while updating details.",
          status: "failure",
          display: true,
        });
      });
  };

  const handleToggleStoreAccess = () => {
    const next = !storeAccess;
    setStoreAccess(next);
    updateAdditionalInfo({ storeAccess: next });
  };

  const handleUpdateBudget = () => {
    const numericBudget =
      clientBudget && !isNaN(Number(clientBudget))
        ? Number(clientBudget)
        : 0;
    updateAdditionalInfo({
      clientBudget: numericBudget,
      clientBudgetNotes,
    });
    setBudgetEditMode(false);
  };

  // NEW: Toggle a single interest in/out of the selected list.
  const toggleInterest = (label) => {
    setInterests((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  // NEW: Persist selected interests to backend via additionalInfo.interests.
  const handleSaveInterests = () => {
    updateAdditionalInfo({ interests });
  };

  // Placeholder: send greeting message (UI only for now)
  const handleSendGreeting = () => {
    if (loading) return;
    setMessage({
      text: "Greeting message sent (placeholder).",
      status: "success",
      display: true,
    });
  };

  // NEW: Fetch all follow ups and tasks for this lead using the existing /task API.
  // We distinguish them by Task.category and tie them to the lead via referenceId = leadId.
  const fetchLeadTasksAndFollowUps = () => {
    if (!leadId) return;

    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/task`;
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    // Fetch follow ups and tasks in parallel without touching the global loading flag
    Promise.all([
      fetch(`${baseUrl}?category=Lead-FollowUp&referenceId=${leadId}`, {
        method: "GET",
        headers,
      })
        .then((res) => res.json())
        .catch((error) => {
          console.error("Error fetching follow ups:", error);
          return [];
        }),
      fetch(`${baseUrl}?category=Lead-Task&referenceId=${leadId}`, {
        method: "GET",
        headers,
      })
        .then((res) => res.json())
        .catch((error) => {
          console.error("Error fetching tasks:", error);
          return [];
        }),
    ])
      .then(([followUpsResponse, tasksResponse]) => {
        // Guard against unexpected responses to avoid breaking the page
        const sortedFollowUps = Array.isArray(followUpsResponse)
          ? [...followUpsResponse].sort(
              (a, b) => new Date(b.deadline) - new Date(a.deadline)
            )
          : [];
        const sortedTasks = Array.isArray(tasksResponse)
          ? [...tasksResponse].sort(
              (a, b) => new Date(b.deadline) - new Date(a.deadline)
            )
          : [];

        setFollowUps(sortedFollowUps);
        setLeadTasks(sortedTasks);

        // Default selection to the most recent item in each list
        setSelectedFollowUpId(sortedFollowUps[0]?._id || null);
        setSelectedTaskId(sortedTasks[0]?._id || null);
      })
      .catch((error) => {
        console.error("Error in fetchLeadTasksAndFollowUps:", error);
      });
  };

  // NEW: Create a follow up entry (category="Lead-FollowUp") for this lead.
  const handleCreateFollowUp = () => {
    if (!newFollowUpText || !newFollowUpDateTime || !leadId) return;

    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        category: "Lead-FollowUp",
        task: newFollowUpText,
        deadline: newFollowUpDateTime, // Mongoose will parse this into a Date
        referenceId: leadId,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          setNewFollowUpText("");
          setNewFollowUpDateTime("");
          fetchLeadTasksAndFollowUps();
          setMessage({
            text: "Follow up created successfully!",
            status: "success",
            display: true,
          });
        } else {
          setMessage({
            text: "Failed to create follow up.",
            status: "failure",
            display: true,
          });
        }
      })
      .catch((error) => {
        console.error("Error creating follow up:", error);
        setLoading(false);
        setMessage({
          text: "Error while creating follow up.",
          status: "failure",
          display: true,
        });
      });
  };

  // NEW: Create a task entry (category="Lead-Task") for this lead.
  const handleCreateLeadTask = () => {
    if (!newTaskText || !newTaskDateTime || !leadId) return;

    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        category: "Lead-Task",
        task: newTaskText,
        deadline: newTaskDateTime,
        referenceId: leadId,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          setNewTaskText("");
          setNewTaskDateTime("");
          fetchLeadTasksAndFollowUps();
          setMessage({
            text: "Task created successfully!",
            status: "success",
            display: true,
          });
        } else {
          setMessage({
            text: "Failed to create task.",
            status: "failure",
            display: true,
          });
        }
      })
      .catch((error) => {
        console.error("Error creating task:", error);
        setLoading(false);
        setMessage({
          text: "Error while creating task.",
          status: "failure",
          display: true,
        });
      });
  };

  // NEW: Mark either a follow up or a task as completed using the existing /task/:id/complete API.
  const handleCompleteTaskItem = (taskId, type) => {
    if (!taskId) return;

    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/${taskId}/complete`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          fetchLeadTasksAndFollowUps();
          setMessage({
            text: `${type} marked as completed!`,
            status: "success",
            display: true,
          });
        } else {
          setMessage({
            text: `Failed to complete ${type.toLowerCase()}.`,
            status: "failure",
            display: true,
          });
        }
      })
      .catch((error) => {
        console.error("Error completing task item:", error);
        setLoading(false);
        setMessage({
          text: `Error while completing ${type.toLowerCase()}.`,
          status: "failure",
          display: true,
        });
      });
  };

  useEffect(() => {
    if (leadId) {
      fetchLead();
      // NEW: also load follow ups and tasks for this lead
      fetchLeadTasksAndFollowUps();
    }
  }, [leadId]);

  // Prefetch share list for all events when opening the Event Tool tab
  useEffect(() => {
    if (display !== "Event Tool") return;
    if (!lead?.events || lead.events.length === 0) return;
    // Default share target event to first event (or keep previous if still valid)
    setShareTargetEventId((prev) => {
      if (prev && lead.events.some((e) => String(e?._id) === String(prev))) return prev;
      return lead.events?.[0]?._id || "";
    });
    lead.events.forEach((ev) => {
      const eventId = ev?._id;
      if (!eventId) return;
      if (eventSharesByEventId?.[eventId]) return;
      fetchEventShares(eventId);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [display, lead?.events]);
  useEffect(() => {
    setTransactions([]);
    if (displayPayment) {
      fetchTransactions();
    }
  }, [displayPayment]);

  // Derived selections for displaying "Previous Follow up notes" / "Previous Tasks"
  const selectedFollowUp =
    followUps.find((item) => item._id === selectedFollowUpId) || null;
  const selectedTask =
    leadTasks.find((item) => item._id === selectedTaskId) || null;

  let selectedFollowUpNote = "";
  let selectedFollowUpDate = "";
  let selectedFollowUpTime = "";
  if (selectedFollowUp) {
    selectedFollowUpNote = selectedFollowUp.task || "";
    if (selectedFollowUp.deadline) {
      const d = new Date(selectedFollowUp.deadline);
      if (!isNaN(d.getTime())) {
        const day = `${d.getDate()}`.padStart(2, "0");
        const month = `${d.getMonth() + 1}`.padStart(2, "0");
        const year = d.getFullYear();
        selectedFollowUpDate = `${day}-${month}-${year}`;
        const hours = `${d.getHours()}`.padStart(2, "0");
        const minutes = `${d.getMinutes()}`.padStart(2, "0");
        selectedFollowUpTime = `${hours}:${minutes}`;
      }
    }
  }

  let selectedTaskNote = "";
  let selectedTaskDate = "";
  let selectedTaskTime = "";
  if (selectedTask) {
    selectedTaskNote = selectedTask.task || "";
    if (selectedTask.deadline) {
      const d = new Date(selectedTask.deadline);
      if (!isNaN(d.getTime())) {
        const day = `${d.getDate()}`.padStart(2, "0");
        const month = `${d.getMonth() + 1}`.padStart(2, "0");
        const year = d.getFullYear();
        selectedTaskDate = `${day}-${month}-${year}`;
        const hours = `${d.getHours()}`.padStart(2, "0");
        const minutes = `${d.getMinutes()}`.padStart(2, "0");
        selectedTaskTime = `${hours}:${minutes}`;
      }
    }
  }

  return (
    <>
      {/* NEW: Modal to create a Follow up for this lead */}
      <Modal
        show={showFollowUpModal}
        size="md"
        popup
        onClose={() => {
          setShowFollowUpModal(false);
          setNewFollowUpText("");
          setNewFollowUpDateTime("");
        }}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-4">
            <p className="text-lg font-semibold">Create Follow up</p>
            <TextInput
              placeholder="Follow up note"
              value={newFollowUpText}
              onChange={(e) => setNewFollowUpText(e.target.value)}
              disabled={loading}
            />
            <TextInput
              type="datetime-local"
              value={newFollowUpDateTime}
              onChange={(e) => setNewFollowUpDateTime(e.target.value)}
              disabled={loading}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button
                color="light"
                onClick={() => {
                  setShowFollowUpModal(false);
                  setNewFollowUpText("");
                  setNewFollowUpDateTime("");
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                color="success"
                onClick={() => {
                  handleCreateFollowUp();
                  setShowFollowUpModal(false);
                }}
                disabled={
                  loading || !newFollowUpText || !newFollowUpDateTime
                }
              >
                Save Follow up
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* NEW: Modal to create a Task for this lead */}
      <Modal
        show={showTaskModal}
        size="md"
        popup
        onClose={() => {
          setShowTaskModal(false);
          setNewTaskText("");
          setNewTaskDateTime("");
        }}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-4">
            <p className="text-lg font-semibold">Create Task</p>
            <TextInput
              placeholder="Task"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              disabled={loading}
            />
            <TextInput
              type="datetime-local"
              value={newTaskDateTime}
              onChange={(e) => setNewTaskDateTime(e.target.value)}
              disabled={loading}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button
                color="light"
                onClick={() => {
                  setShowTaskModal(false);
                  setNewTaskText("");
                  setNewTaskDateTime("");
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                color="success"
                onClick={() => {
                  handleCreateLeadTask();
                  setShowTaskModal(false);
                }}
                disabled={loading || !newTaskText || !newTaskDateTime}
              >
                Save Task
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <div className="p-8 w-full">
        <div className="bg-white shadow-xl rounded-3xl p-8 w-full flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between">
            <p className="text-xl font-medium flex flex-row items-center gap-2">
              {updatedName === null ? (
                <>{lead.name} </>
              ) : (
                <TextInput
                  value={updatedName}
                  onChange={(e) => {
                    setUpdatedName(e.target.value);
                  }}
                  disabled={loading}
                />
              )}
              {updatedName === null ? (
                <MdEdit
                  onClick={() => {
                    setUpdatedName(lead.name);
                  }}
                  cursor={"pointer"}
                  disabled={loading}
                />
              ) : (
                <>
                  <MdDone
                    color="green"
                    onClick={() => {
                      updateName();
                    }}
                    cursor={"pointer"}
                    disabled={loading || !updatedName}
                  />
                  <MdClose
                    color="red"
                    onClick={() => {
                      setUpdatedName(null);
                    }}
                    cursor={"pointer"}
                    disabled={loading}
                  />
                </>
              )}
              <button
                type="button"
                className="ml-2 p-1 hover:bg-red-50 rounded-full"
                onClick={handleBlockUser}
                disabled={loading || !lead.userCreated}
                title="Block user"
              >
                <CircleAlert size={18} />
              </button>
            </p>
            <div className="flex flex-row gap-3 items-center">
              <Button
                color="success"
                onClick={handleSendGreeting}
                disabled={loading}
              >
                Send Greeting Message
              </Button>
              <Select
                value={display}
                onChange={(e) => {
                  setDisplay(e.target.value);
                }}
                disabled={loading}
              >
                <option value={"Account Status"}>Account Status</option>
                <option value={"Event Tool"} disabled={!lead.userCreated}>
                  Event Tool
                </option>
                {/* <option value={"Track History"}>Track History</option> */}
                <option value={"Payment Status"} disabled={!lead.userCreated}>
                  Payment Status
                </option>
              </Select>
            </div>
          </div>
          {!loading && display === "Account Status" && (
            <>
              <div className="flex flex-row gap-4 -mt-2">
                <TextInput
                  // placeholder="Date"
                  value={
                    lead.createdAt
                      ? `${new Date(
                          lead?.createdAt
                        ).toLocaleDateString()} ${new Date(
                          lead?.createdAt
                        ).toLocaleTimeString(navigator.language, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`
                      : ""
                  }
                  // type="date"
                  readOnly={true}
                  disabled={!lead.createdAt}
                />
                <TextInput
                  placeholder="Phone Number"
                  value={lead.phone}
                  readOnly={true}
                  disabled={!lead.phone}
                />
                <TextInput
                  placeholder="Email"
                  value={lead.email}
                  readOnly={true}
                  disabled={!lead.email}
                />
                <TextInput
                  placeholder="Lead Source"
                  value={lead.source}
                  readOnly={true}
                  disabled={!lead.source}
                />
                <TextInput
                  placeholder="Lead Status"
                  value={leadStatus}
                  readOnly={true}
                  disabled={!leadStatus}
                />
              </div>
              {/*
                NEW mid-section layout (four columns):
                1) Status Report (Store Access / Lead activity)
                2) Decor Report (Onboarding, Event created, Payment status)
                3) Makeup Report (Bidding / Wedsy package / Vendor package)
                4) Client approx budget (budget + notes with Edit / Update actions)
                Existing badges and follow-up sections below are left untouched.
              */}
              <div className="mt-4 grid grid-cols-4 gap-6">
                {/* Status Report: matches the red/green Store Access pills from design */}
                <div className="flex flex-col gap-3">
                  <p className="font-medium">Status Report</p>
                  <button
                    type="button"
                    onClick={handleToggleStoreAccess}
                    disabled={loading}
                    className={`rounded-full px-6 py-2 text-sm border ${
                      storeAccess
                        ? "border-green-500 text-green-500 bg-white"
                        : "border-red-500 text-red-500 bg-white"
                    }`}
                  >
                    {storeAccess ? "Store Access: Access" : "Store Access: No access"}
                  </button>
                  <div className="rounded-full px-6 py-2 text-sm border border-gray-200 bg-white text-gray-800">
                    Lead activity
                  </div>
                </div>

                {/* Decor Report: all data derived from existing userCreated / events / paymentStats */}
                <div className="flex flex-col gap-3">
                  <p className="font-medium">Decor Report</p>
                  {/* Onboarding status */}
                  <div
                    className={`rounded-full px-6 py-2 text-sm border ${
                      lead.userCreated
                        ? "border-green-500 text-green-500 bg-white"
                        : "border-red-500 text-red-500 bg-white"
                    }`}
                  >
                    Onboarding Status
                  </div>
                  {/* Event created / not created */}
                  <div
                    className={`rounded-full px-6 py-2 text-sm border ${
                      lead.events?.length > 0
                        ? "border-green-500 text-green-500 bg-white"
                        : "border-red-500 text-red-500 bg-white"
                    }`}
                  >
                    {lead.events?.length > 0 ? "Event created" : "Event not created"}
                  </div>
                  {/* Payment status */}
                  {(() => {
                    let label = "Not paid";
                    let color = "border-red-500 text-red-500";
                    const stats = lead.paymentStats;
                    if (stats && typeof stats.totalAmount === "number") {
                      if (stats.amountPaid >= stats.totalAmount && stats.totalAmount > 0) {
                        label = "Paid";
                        color = "border-green-500 text-green-500";
                      } else if (stats.amountPaid > 0) {
                        label = "Partial paid";
                        color = "border-orange-500 text-orange-500";
                      }
                    }
                    return (
                      <div
                        className={`rounded-full px-6 py-2 text-sm border bg-white ${color}`}
                      >
                        {`Payment status: ${label}`}
                      </div>
                    );
                  })()}
                </div>

                {/* Makeup Report: statuses come from backend statusSummary (bidding / package) */}
                <div className="flex flex-col gap-3">
                  <p className="font-medium">Makeup Report</p>
                  {/* Bidding */}
                  {(() => {
                    let color = "border-gray-300 text-gray-500";
                    if (biddingStatus === "Bid in Progress") {
                      color = "border-orange-500 text-orange-500";
                    } else if (biddingStatus === "Booked") {
                      color = "border-green-500 text-green-500";
                    }
                    return (
                      <div
                        className={`rounded-full px-6 py-2 text-sm border bg-white ${color}`}
                      >
                        Bidding:{" "}
                        {biddingStatus === "No Bid"
                          ? "No Bid"
                          : biddingStatus === "Bid in Progress"
                          ? "Bid in Progress"
                          : "Booked"}
                      </div>
                    );
                  })()}
                  {/* Wedsy package */}
                  {(() => {
                    let color = "border-gray-300 text-gray-500";
                    if (wedsyPackageStatus === "Booked") {
                      color = "border-green-500 text-green-500";
                    }
                    return (
                      <div
                        className={`rounded-full px-6 py-2 text-sm border bg-white ${color}`}
                      >
                        Wedsy package:{" "}
                        {wedsyPackageStatus === "Booked"
                          ? "Booked"
                          : "No Activity"}
                      </div>
                    );
                  })()}
                  {/* Vendor package */}
                  {(() => {
                    let color = "border-gray-300 text-gray-500";
                    if (vendorPackageStatus === "Booked") {
                      color = "border-green-500 text-green-500";
                    }
                    return (
                      <div
                        className={`rounded-full px-6 py-2 text-sm border bg-white ${color}`}
                      >
                        Vendor package:{" "}
                        {vendorPackageStatus === "Booked"
                          ? "Booked"
                          : "No Activity"}
                      </div>
                    );
                  })()}
                </div>

                {/* Client approx budget: numeric budget + free-text notes */}
                <div className="flex flex-col gap-3">
                  <p className="font-medium">Client approx budget</p>
                  <TextInput
                    type="number"
                    placeholder="Enter budget"
                    value={clientBudget}
                    readOnly={!budgetEditMode}
                    onChange={(e) => setClientBudget(e.target.value)}
                  />
                  <Textarea
                    rows={2}
                    placeholder="Notes"
                    value={clientBudgetNotes}
                    readOnly={!budgetEditMode}
                    onChange={(e) => setClientBudgetNotes(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <Button
                      color="warning"
                      onClick={() => setBudgetEditMode(true)}
                      disabled={loading}
                    >
                      Edit
                    </Button>
                    <Button
                      color="success"
                      onClick={handleUpdateBudget}
                      disabled={loading || !budgetEditMode}
                    >
                      Update!
                    </Button>
                  </div>
                </div>
              </div>

              {/* NEW: Follow ups + Tasks section for this lead, matching the design layout */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Follow ups column */}
                <div className="flex flex-col gap-3">
                  <p className="font-medium">Follow ups</p>

                  {/* Previous Follow up note (read-only, shows latest/selected history) */}
                  <TextInput
                    placeholder="Previous Follow up notes"
                    value={selectedFollowUpNote}
                    readOnly
                    disabled={!selectedFollowUp}
                  />

                  {/* Previous Follow up date + time (read-only) */}
                  <div className="flex flex-row gap-3">
                    <TextInput
                      placeholder="Date"
                      value={selectedFollowUpDate}
                      readOnly
                      disabled={!selectedFollowUpDate}
                    />
                    <TextInput
                      placeholder="Time"
                      value={selectedFollowUpTime}
                      readOnly
                      disabled={!selectedFollowUpTime}
                    />
                  </div>

                  {/* Actions: Create Follow up + View History */}
                  <div className="flex flex-row gap-3 items-center">
                    <Button
                      color="gray"
                      onClick={() => {
                        setShowFollowUpModal(true);
                        setNewFollowUpText("");
                        setNewFollowUpDateTime("");
                      }}
                      disabled={loading}
                      className="px-6"
                    >
                      + Create follow up
                    </Button>

                    <div className="relative">
                      <Button
                        color="light"
                        onClick={() =>
                          setFollowUpHistoryOpen((prev) => !prev)
                        }
                        disabled={loading || followUps.length === 0}
                        className="px-6 flex items-center gap-2"
                      >
                        View History
                        <BsChevronDown
                          className={`transition-transform ${
                            followUpHistoryOpen ? "rotate-180" : ""
                          }`}
                          size={16}
                        />
                      </Button>

                      {followUpHistoryOpen && (
                        <div className="absolute z-20 mt-2 w-80 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-lg">
                          {followUps.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-gray-400">
                              No follow up history
                            </div>
                          ) : (
                            followUps.map((item) => {
                              const d = item.deadline
                                ? new Date(item.deadline)
                                : null;
                              const dateStr =
                                d && !isNaN(d.getTime())
                                  ? `${`${d.getDate()}`.padStart(
                                      2,
                                      "0"
                                    )}-${`${d.getMonth() + 1}`.padStart(
                                      2,
                                      "0"
                                    )}-${d.getFullYear()}`
                                  : "-";
                              const timeStr =
                                d && !isNaN(d.getTime())
                                  ? `${`${d.getHours()}`.padStart(
                                      2,
                                      "0"
                                    )}:${`${d.getMinutes()}`.padStart(2, "0")}`
                                  : "";
                              return (
                                <button
                                  key={item._id}
                                  type="button"
                                  className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${
                                    item._id === selectedFollowUpId
                                      ? "bg-gray-50"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    setSelectedFollowUpId(item._id);
                                    setFollowUpHistoryOpen(false);
                                  }}
                                >
                                  <p className="font-medium text-gray-800 line-clamp-1">
                                    {item.task}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {dateStr} {timeStr}
                                  </p>
                                </button>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Tasks column */}
                <div className="flex flex-col gap-3">
                  <p className="font-medium">Tasks</p>

                  {/* Previous Task (read-only, shows latest/selected history) */}
                  <TextInput
                    placeholder="Previous Tasks"
                    value={selectedTaskNote}
                    readOnly
                    disabled={!selectedTask}
                  />

                  {/* Previous Task date + time (read-only) */}
                  <div className="flex flex-row gap-3">
                    <TextInput
                      placeholder="Date"
                      value={selectedTaskDate}
                      readOnly
                      disabled={!selectedTaskDate}
                    />
                    <TextInput
                      placeholder="Time"
                      value={selectedTaskTime}
                      readOnly
                      disabled={!selectedTaskTime}
                    />
                  </div>

                  {/* Actions: Create Task + View History */}
                  <div className="flex flex-row gap-3 items-center">
                    <Button
                      color="gray"
                      onClick={() => {
                        setShowTaskModal(true);
                        setNewTaskText("");
                        setNewTaskDateTime("");
                      }}
                      disabled={loading}
                      className="px-6"
                    >
                      + Create Task
                    </Button>

                    <div className="relative">
                      <Button
                        color="light"
                        onClick={() => setTaskHistoryOpen((prev) => !prev)}
                        disabled={loading || leadTasks.length === 0}
                        className="px-6 flex items-center gap-2"
                      >
                        View History
                        <BsChevronDown
                          className={`transition-transform ${
                            taskHistoryOpen ? "rotate-180" : ""
                          }`}
                          size={16}
                        />
                      </Button>

                      {taskHistoryOpen && (
                        <div className="absolute z-20 mt-2 w-80 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-lg">
                          {leadTasks.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-gray-400">
                              No task history
                            </div>
                          ) : (
                            leadTasks.map((item) => {
                              const d = item.deadline
                                ? new Date(item.deadline)
                                : null;
                              const dateStr =
                                d && !isNaN(d.getTime())
                                  ? `${`${d.getDate()}`.padStart(
                                      2,
                                      "0"
                                    )}-${`${d.getMonth() + 1}`.padStart(
                                      2,
                                      "0"
                                    )}-${d.getFullYear()}`
                                  : "-";
                              const timeStr =
                                d && !isNaN(d.getTime())
                                  ? `${`${d.getHours()}`.padStart(
                                      2,
                                      "0"
                                    )}:${`${d.getMinutes()}`.padStart(2, "0")}`
                                  : "";
                              return (
                                <button
                                  key={item._id}
                                  type="button"
                                  className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${
                                    item._id === selectedTaskId
                                      ? "bg-gray-50"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    setSelectedTaskId(item._id);
                                    setTaskHistoryOpen(false);
                                  }}
                                >
                                  <p className="font-medium text-gray-800 line-clamp-1">
                                    {item.task}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {dateStr} {timeStr}
                                  </p>
                                </button>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* NEW: Interests section – selectable chips matching the provided design */}
              <div className="mt-10 flex flex-col gap-4">
                <p className="font-medium">Interests</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    ...BASE_INTEREST_OPTIONS,
                    // Ensure any custom interests that are not part of the base list
                    // are still visible as chips.
                    ...interests.filter(
                      (label) => !BASE_INTEREST_OPTIONS.includes(label)
                    ),
                  ].map((label) => {
                    const selected = interests.includes(label);
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => toggleInterest(label)}
                        className={`px-6 py-2 rounded-full border text-sm transition-colors ${
                          selected
                            ? "bg-[#920036] text-white border-[#920036]"
                            : "bg-white text-gray-800 border-gray-300"
                        }`}
                        disabled={loading}
                      >
                        {label}
                      </button>
                    );
                  })}

                  {/* Custom interest chip */}
                  {showCustomInterestInput ? (
                    <div className="flex flex-row items-center gap-2">
                      <TextInput
                        placeholder="Type Custom interest"
                        value={customInterest}
                        onChange={(e) => setCustomInterest(e.target.value)}
                        disabled={loading}
                      />
                      <Button
                        color="success"
                        size="xs"
                        onClick={() => {
                          const trimmed = customInterest.trim();
                          if (trimmed) {
                            toggleInterest(trimmed);
                          }
                          setCustomInterest("");
                          setShowCustomInterestInput(false);
                        }}
                        disabled={loading || !customInterest.trim()}
                      >
                        Add
                      </Button>
                      <Button
                        color="light"
                        size="xs"
                        onClick={() => {
                          setCustomInterest("");
                          setShowCustomInterestInput(false);
                        }}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowCustomInterestInput(true)}
                      className="px-6 py-2 rounded-full border text-sm bg-white text-gray-800 border-gray-400"
                      disabled={loading}
                    >
                      + Type Custom interest
                    </button>
                  )}
                </div>

                <div className="mt-2">
                  <Button
                    color="success"
                    className="px-8 bg-green-600 hover:bg-green-700"
                    onClick={handleSaveInterests}
                    disabled={loading}
                  >
                    Save
                  </Button>
                </div>
              </div>

              {/* Existing action buttons (Create User / Mark Interested / Mark Lost / Delete Lead) */}
              <div className="flex flex-row gap-4 mt-8 mb-8">
                {!lead.userCreated && (
                  <Button
                    color={"dark"}
                    outline
                    onClick={() => {
                      createUser();
                    }}
                    disabled={loading}
                  >
                    Create User
                  </Button>
                )}
                {!lead.isInterested && (
                  <Button
                    color={"dark"}
                    outline
                    onClick={() => {
                      markInterested();
                    }}
                    disabled={loading}
                  >
                    Mark Interested
                  </Button>
                )}
                {!lead.isLost && (
                  <Button
                    color={"dark"}
                    outline
                    onClick={() => {
                      markLost();
                    }}
                    disabled={loading}
                  >
                    Mark Lost
                  </Button>
                )}
                <Button
                  color={"dark"}
                  outline
                  onClick={() => {
                    if (confirm("Do you want to delete the Lead?")) {
                      deleteLead();
                    }
                  }}
                  disabled={loading}
                >
                  Delete Lead
                </Button>
              </div>
              {lead.userCreated && (
                <>
                  <p>Event details</p>
                  {lead.events?.map((item, index) => (
                    <div key={item._id}>
                      <div className="flex flex-row gap-4 items-center">
                        <p className="w-4">{index + 1}.</p>
                        <Label value="Event Name" />
                        <TextInput
                          placeholder="Event Name"
                          value={item.name}
                          readOnly={true}
                        />
                        <Label value="Event Community" />
                        <TextInput
                          placeholder="Event Community"
                          value={item.community}
                          readOnly={true}
                        />
                      </div>
                      <div className="flex flex-row gap-4 items-center mt-2">
                        <p className="w-4" />
                        <div className="flex flex-col justify-around gap-2">
                          <Label value="Event Day" className="my-auto py-2.5" />
                          <Label value="Date" className="my-auto py-2.5" />
                          <Label value="Venue" className="my-auto py-2.5" />
                        </div>
                        {item.eventDays.map((rec, index) => (
                          <div className="flex flex-col gap-2" key={rec._id}>
                            <TextInput
                              placeholder="Event Day"
                              value={rec.name}
                              readOnly={true}
                            />
                            <TextInput
                              placeholder="Date"
                              value={
                                new Date(rec?.date).toISOString().split("T")[0]
                              }
                              type="date"
                              readOnly={true}
                              disabled={!lead.createdAt}
                            />
                            <TextInput
                              placeholder="Event Venue"
                              value={rec.venue}
                              readOnly={true}
                            />
                          </div>
                        ))}
                        <Button color="light">
                          <BsPlus size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </>
              )}
              <div className="w-full">
                <div className="text-lg font-semibold mb-4">Notes</div>

                <div className="flex items-center gap-4 mb-5">
                  <button
                    type="button"
                    disabled={loading || !conversation}
                    onClick={createNote}
                    className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
                  >
                    <BsPlus size={16} />
                    Create Note
                  </button>

                  <button
                    type="button"
                    disabled={loading || !isNoteDirty}
                    onClick={updateSelectedNote}
                    className="inline-flex items-center rounded-lg bg-green-600 px-8 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    Update!
                  </button>
                </div>

                <div className="border-b border-gray-200 mb-6" />

                <div className="grid grid-cols-12 gap-6 items-start mb-8">
                  <div className="col-span-12 md:col-span-9">
                    <input
                      value={conversation}
                      onChange={(e) => setConversation(e.target.value)}
                      placeholder="This is notes"
                      className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 shadow-sm focus:border-gray-300 focus:ring-0"
                    />
                  </div>
                  <div className="col-span-12 md:col-span-3">
                    <input
                      type="datetime-local"
                      value={noteDateTime}
                      onChange={(e) => setNoteDateTime(e.target.value)}
                      className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-600 shadow-sm focus:border-gray-300 focus:ring-0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-6 items-center mb-3">
                  <div className="col-span-12 md:col-span-9 text-sm font-semibold text-gray-900">
                    Previous Notes
                  </div>
                  <div className="col-span-12 md:col-span-3 text-sm font-semibold text-gray-900">
                    Date/Time
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {lead.updates?.conversations?.length > 0 ? (
                    [...(lead.updates.conversations || [])].reverse().map((item, index) => {
                      // Backward compatibility: item can be string (old) or object (new)
                      const noteId =
                        typeof item === "object" && item?._id ? String(item._id) : null;
                      const noteText = typeof item === "string" ? item : item?.text || "";
                      const noteDate =
                        typeof item === "object" && item?.createdAt
                          ? new Date(item.createdAt)
                          : new Date();
                      const noteDateTimeStr = formatDateTimeLocal(noteDate);

                      const isActive = activeNoteId && noteId && activeNoteId === noteId;
                      const draft = noteId ? noteEdits[noteId] : null;
                      const displayText = draft ? draft.text : noteText;
                      const displayDateTime = draft ? draft.dateTime : noteDateTimeStr;

                      return (
                        <div
                          key={noteId || index}
                          className={`grid grid-cols-12 gap-6 items-start ${noteId ? "cursor-pointer" : ""}`}
                        >
                          <div className="col-span-12 md:col-span-9">
                            <input
                              value={displayText}
                              disabled={loading}
                              onFocus={() => {
                                if (!noteId) return;
                                setActiveNoteId(noteId);
                                setNoteEdits((prev) => {
                                  if (prev[noteId]) return prev;
                                  return {
                                    ...prev,
                                    [noteId]: {
                                      text: noteText,
                                      dateTime: noteDateTimeStr,
                                      originalText: noteText,
                                      originalDateTime: noteDateTimeStr,
                                    },
                                  };
                                });
                              }}
                              onChange={(e) => {
                                if (!noteId) return;
                                setActiveNoteId(noteId);
                                const nextText = e.target.value;
                                setNoteEdits((prev) => {
                                  const existing = prev[noteId] || {
                                    text: noteText,
                                    dateTime: noteDateTimeStr,
                                    originalText: noteText,
                                    originalDateTime: noteDateTimeStr,
                                  };
                                  return {
                                    ...prev,
                                    [noteId]: {
                                      ...existing,
                                      text: nextText,
                                    },
                                  };
                                });
                              }}
                              className={`w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 shadow-sm ${isActive ? "ring-1 ring-green-200" : ""}`}
                            />
                          </div>
                          <div className="col-span-12 md:col-span-3 flex items-center gap-3">
                            <input
                              type="datetime-local"
                              value={displayDateTime}
                              disabled={loading}
                              onFocus={() => {
                                if (!noteId) return;
                                setActiveNoteId(noteId);
                                setNoteEdits((prev) => {
                                  if (prev[noteId]) return prev;
                                  return {
                                    ...prev,
                                    [noteId]: {
                                      text: noteText,
                                      dateTime: noteDateTimeStr,
                                      originalText: noteText,
                                      originalDateTime: noteDateTimeStr,
                                    },
                                  };
                                });
                              }}
                              onChange={(e) => {
                                if (!noteId) return;
                                setActiveNoteId(noteId);
                                const nextDt = e.target.value;
                                setNoteEdits((prev) => {
                                  const existing = prev[noteId] || {
                                    text: noteText,
                                    dateTime: noteDateTimeStr,
                                    originalText: noteText,
                                    originalDateTime: noteDateTimeStr,
                                  };
                                  return {
                                    ...prev,
                                    [noteId]: {
                                      ...existing,
                                      dateTime: nextDt,
                                    },
                                  };
                                });
                              }}
                              className={`flex-1 w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-600 shadow-sm ${isActive ? "ring-1 ring-green-200" : ""}`}
                            />
                            {noteId && (
                              <button
                                type="button"
                                title="Delete note"
                                disabled={loading}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  deleteNoteById(noteId);
                                }}
                                className="p-2 rounded-lg hover:bg-red-50 disabled:opacity-50"
                              >
                                <MdDelete className="text-red-600" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-sm text-gray-500">No previous notes</div>
                  )}
                </div>
              </div>
            </>
          )}
          {!loading && display === "Event Tool" && (
            <>
              {lead.events.length === 0 && (
                <>
                  <div className="flex flex-col gap-3">
                    {!newEvent.display && (
                      <div className="grid grid-cols-3 gap-4">
                        <Button
                          color="success"
                          onClick={() => {
                            setNewEvent({
                              ...newEvent,
                              name: "",
                              community: "",
                              eventDay: "",
                              date: "",
                              time: "",
                              venue: "",
                              display: true,
                            });
                          }}
                        >
                          Create New Event
                        </Button>
                      </div>
                    )}
                    {newEvent.display && (
                      <div className="mb-6 grid grid-cols-3 gap-4 items-end">
                        <div>
                          <Label value="Event Name" />
                          <TextInput
                            placeholder="Event Name"
                            value={newEvent.name}
                            disabled={loading}
                            onChange={(e) => {
                              setNewEvent({
                                ...newEvent,
                                name: e.target.value,
                              });
                            }}
                          />
                        </div>
                        <div>
                          <Label value="Event Community" />
                          <TextInput
                            placeholder="Event Community"
                            value={newEvent.community}
                            disabled={loading}
                            onChange={(e) => {
                              setNewEvent({
                                ...newEvent,
                                community: e.target.value,
                              });
                            }}
                          />
                        </div>
                        <div>
                          <Label value="Event Day" />
                          <TextInput
                            placeholder="Event Name"
                            value={newEvent.eventDay}
                            disabled={loading}
                            onChange={(e) => {
                              setNewEvent({
                                ...newEvent,
                                eventDay: e.target.value,
                              });
                            }}
                          />
                        </div>
                        <div>
                          <Label value="Date" />
                          <TextInput
                            placeholder="Date"
                            type="date"
                            value={newEvent.date}
                            disabled={loading}
                            onChange={(e) => {
                              setNewEvent({
                                ...newEvent,
                                date: e.target.value,
                              });
                            }}
                          />
                        </div>
                        <div>
                          <Label value="Time" />
                          <TextInput
                            placeholder="Time"
                            type="time"
                            value={newEvent.time}
                            disabled={loading}
                            onChange={(e) => {
                              setNewEvent({
                                ...newEvent,
                                time: e.target.value,
                              });
                            }}
                          />
                        </div>
                        <div>
                          <Label value="Venue" />
                          <TextInput
                            placeholder="Event Venue"
                            value={newEvent.venue}
                            disabled={loading}
                            onChange={(e) => {
                              setNewEvent({
                                ...newEvent,
                                venue: e.target.value,
                              });
                            }}
                          />
                        </div>
                        <div className="flex gap-3 flex-wrap">
                          <Button
                            className=""
                            onClick={() => {
                              createEvent();
                            }}
                            color="success"
                            disabled={
                              loading ||
                              !newEvent.name ||
                              !newEvent.community ||
                              !newEvent.date ||
                              !newEvent.eventDay ||
                              !newEvent.time ||
                              !newEvent.venue
                            }
                          >
                            Create Event
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
              {lead.events.length > 0 && (
                <>
                {/* Lead/User header fields (matches design) */}
                <div className="flex flex-row gap-4 w-full mb-4">
                    <div className="flex-1">
                      <TextInput
                        placeholder="Phone no."
                        value={lead.phone || ""}
                        readOnly
                        disabled={!lead.phone}
                      />
                    </div>
                    <div className="flex-1">
                      <TextInput
                        placeholder="Email"
                        value={lead.email || ""}
                        readOnly
                        disabled={!lead.email}
                      />
                    </div>
                    <div className="flex-1">
                      <TextInput
                        placeholder="Lead source"
                        value={lead.source || ""}
                        readOnly
                        disabled={!lead.source}
                      />
                    </div>
                    <div className="flex-1">
                      <TextInput
                        placeholder="Lead status"
                        value={leadStatus || ""}
                        readOnly
                        disabled={!leadStatus}
                      />
                    </div>
                    <div className="flex-1">
                      <TextInput
                        placeholder="Role"
                        value={lead.userCreated ? "User" : ""}
                        readOnly
                        disabled={!lead.userCreated}
                      />
                    </div>
                  </div>

                  {/* Shared with (share-link + metadata, like screenshot) */}
                  <div className="flex flex-col gap-3 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="text-sm font-medium text-gray-700">
                            Shared with
                          </div>
                          {lead?.events?.length > 1 && (
                            <div className="w-64">
                              <Select
                                value={shareTargetEventId || ""}
                                disabled={loading || !shareTargetEventId}
                                onChange={(e) => setShareTargetEventId(e.target.value)}
                              >
                                {(lead.events || []).map((ev) => (
                                  <option key={ev?._id} value={ev?._id}>
                                    {ev?.name || "Event"}
                                  </option>
                                ))}
                              </Select>
                            </div>
                          )}
                          <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-12 md:col-span-3">
                              <TextInput
                                placeholder="Name"
                                value={getShareDraft(shareTargetEventId).name}
                                disabled={loading || !shareTargetEventId || shareLoadingByEventId?.[shareTargetEventId]}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setShareDraftByEventId((p) => ({
                                    ...p,
                                    [shareTargetEventId]: { ...getShareDraft(shareTargetEventId), name: v },
                                  }));
                                }}
                              />
                            </div>
                            <div className="col-span-12 md:col-span-3">
                              <TextInput
                                placeholder="Phone no."
                                value={getShareDraft(shareTargetEventId).phone}
                                disabled={loading || !shareTargetEventId || shareLoadingByEventId?.[shareTargetEventId]}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setShareDraftByEventId((p) => ({
                                    ...p,
                                    [shareTargetEventId]: { ...getShareDraft(shareTargetEventId), phone: v },
                                  }));
                                }}
                              />
                            </div>
                            <div className="col-span-12 md:col-span-3">
                              <TextInput
                                placeholder="email"
                                value={getShareDraft(shareTargetEventId).email}
                                disabled={loading || !shareTargetEventId || shareLoadingByEventId?.[shareTargetEventId]}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setShareDraftByEventId((p) => ({
                                    ...p,
                                    [shareTargetEventId]: { ...getShareDraft(shareTargetEventId), email: v },
                                  }));
                                }}
                              />
                            </div>
                            <div className="col-span-12 md:col-span-3">
                              <Select
                                value={getShareDraft(shareTargetEventId).relationship}
                                disabled={loading || !shareTargetEventId || shareLoadingByEventId?.[shareTargetEventId]}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setShareDraftByEventId((p) => ({
                                    ...p,
                                    [shareTargetEventId]: {
                                      ...getShareDraft(shareTargetEventId),
                                      relationship: v,
                                    },
                                  }));
                                }}
                              >
                                <option value="">Relationship</option>
                                {RELATIONSHIP_OPTIONS.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </Select>
                            </div>
                          </div>
                          <Button
                            color="light"
                            onClick={() => createEventShare(shareTargetEventId)}
                            disabled={
                              loading ||
                              !shareTargetEventId ||
                              shareLoadingByEventId?.[shareTargetEventId] ||
                              !getShareDraft(shareTargetEventId).phone
                            }
                          >
                            Add phone no
                          </Button>
                        </div>

                         {(eventSharesByEventId?.[shareTargetEventId] || []).length > 0 && (
                          <div className="w-full overflow-x-auto">
                            <Table>
                              <Table.Head>
                                <Table.HeadCell>Name</Table.HeadCell>
                                <Table.HeadCell>Phone</Table.HeadCell>
                                <Table.HeadCell>Email</Table.HeadCell>
                                <Table.HeadCell>Relationship</Table.HeadCell>
                                <Table.HeadCell>Link</Table.HeadCell>
                                <Table.HeadCell>Action</Table.HeadCell>
                              </Table.Head>
                              <Table.Body className="divide-y">
                                 {(eventSharesByEventId?.[shareTargetEventId] || []).map((s) => (
                                  <Table.Row key={s._id}>
                                    <Table.Cell>{s.name || "-"}</Table.Cell>
                                    <Table.Cell>{s.phone || "-"}</Table.Cell>
                                    <Table.Cell>{s.email || "-"}</Table.Cell>
                                    <Table.Cell>{s.relationship || "-"}</Table.Cell>
                                    <Table.Cell>
                                      <Button
                                        color="light"
                                        size="xs"
                                         onClick={() => copyEventShareLink(shareTargetEventId, s._id)}
                                         disabled={loading || shareLoadingByEventId?.[shareTargetEventId]}
                                      >
                                        Copy link
                                      </Button>
                                    </Table.Cell>
                                    <Table.Cell>
                                      <Button
                                        color="failure"
                                        size="xs"
                                         onClick={() => revokeEventShare(shareTargetEventId, s._id)}
                                         disabled={loading || shareLoadingByEventId?.[shareTargetEventId]}
                                      >
                                        Remove
                                      </Button>
                                    </Table.Cell>
                                  </Table.Row>
                                ))}
                              </Table.Body>
                            </Table>
                          </div>
                        )}
                      </div>
                  
                  <p>Event Details</p>
                  
                  {lead.events?.map((item, index) => (
                    <div
                      key={item?._id}
                      className="border-b-2 border-b-black pb-4"
                    >
                      <div className="mb-6 grid grid-cols-3 gap-4 items-end">
                        <div>
                          <Label value="Event Name" />
                          <TextInput
                            placeholder="Event Name"
                            value={
                              editEventInfo.edit &&
                              item._id === editEventInfo.eventId
                                ? editEventInfo.name
                                : item.name
                            }
                            readOnly={
                              !(
                                editEventInfo.edit &&
                                item._id === editEventInfo.eventId
                              )
                            }
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
                              editEventInfo.edit &&
                              item._id === editEventInfo.eventId
                                ? editEventInfo.community
                                : item.community
                            }
                            readOnly={
                              !(
                                editEventInfo.edit &&
                                item._id === editEventInfo.eventId
                              )
                            }
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
                              if (
                                editEventInfo.edit &&
                                item._id === editEventInfo.eventId
                              ) {
                                updateEvent();
                              } else {
                                setEditEventInfo({
                                  eventId: item._id,
                                  edit: true,
                                  name: item.name,
                                  community: item.community,
                                });
                              }
                            }}
                            color={
                              editEventInfo.edit &&
                              item._id === editEventInfo.eventId
                                ? "success"
                                : "dark"
                            }
                            disabled={
                              loading ||
                              (editEventInfo.edit &&
                                item._id === editEventInfo.eventId &&
                                (!editEventInfo.name ||
                                  !editEventInfo.community))
                            }
                          >
                            {editEventInfo.edit &&
                            item._id === editEventInfo.eventId
                              ? "Update"
                              : "Edit"}
                          </Button>
                          {editEventInfo.edit &&
                            item._id === editEventInfo.eventId && (
                              <Button
                                color="failure"
                                onClick={() => {
                                  setEditEventInfo({
                                    ...editEventInfo,
                                    eventId: "",
                                    name: "",
                                    community: "",
                                    edit: false,
                                  });
                                }}
                                disabled={loading}
                              >
                                Cancel
                              </Button>
                            )}{" "}
                          <Link href={`/event-tool/event/${item._id}`}>
                            <Button color="gray">Manage Event</Button>
                          </Link>
                          {item?.status?.completed ? (
                            <Badge size="sm" color="gray">
                              Completed
                            </Badge>
                          ) : item?.status?.paymentDone ? (
                            <Badge size="sm" color="success">
                              Payment Completed
                            </Badge>
                          ) : item?.status?.approved ? (
                            <Badge size="sm" color="indigo">
                              Approved
                            </Badge>
                          ) : item?.status?.finalized ? (
                            <Badge size="sm" color="purple">
                              Finalized
                            </Badge>
                          ) : null}
                        </div>
                      </div>

                      

                      <div className="flex flex-col gap-4 mt-2">
                        <div className="grid grid-cols-6 gap-4">
                          <Label value="Event Day" />
                          <Label value="Date" />
                          <Label value="Time" />
                          <Label value="Venue" />
                        </div>
                        {item?.eventDays?.map((rec, index) => (
                          <div className="grid grid-cols-6 gap-4" key={rec._id}>
                            <TextInput
                              placeholder="Event Name"
                              value={
                                editEventDayInfo.edit &&
                                item._id === editEventDayInfo.eventId &&
                                editEventDayInfo.eventDay === rec._id
                                  ? editEventDayInfo.name
                                  : rec.name
                              }
                              readOnly={
                                !(
                                  editEventDayInfo.edit &&
                                  item._id === editEventDayInfo.eventId &&
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
                                item._id === editEventDayInfo.eventId &&
                                editEventDayInfo.eventDay === rec._id
                                  ? editEventDayInfo.date
                                  : rec.date
                              }
                              readOnly={
                                !(
                                  editEventDayInfo.edit &&
                                  item._id === editEventDayInfo.eventId &&
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
                                item._id === editEventDayInfo.eventId &&
                                editEventDayInfo.eventDay === rec._id
                                  ? editEventDayInfo.time
                                  : rec.time
                              }
                              readOnly={
                                !(
                                  editEventDayInfo.edit &&
                                  item._id === editEventDayInfo.eventId &&
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
                              placeholder="Event Venue"
                              value={
                                editEventDayInfo.edit &&
                                item._id === editEventDayInfo.eventId &&
                                editEventDayInfo.eventDay === rec._id
                                  ? editEventDayInfo.venue
                                  : rec.venue
                              }
                              readOnly={
                                !(
                                  editEventDayInfo.edit &&
                                  item._id === editEventDayInfo.eventId &&
                                  editEventDayInfo.eventDay === rec._id
                                )
                              }
                              disabled={loading}
                              onChange={(e) => {
                                setEditEventDayInfo({
                                  ...editEventDayInfo,
                                  venue: e.target.value,
                                });
                              }}
                            />
                            <div className="flex col-span-2 gap-3 items-center flex-wrap">
                              {(!editEventDayInfo.edit ||
                                editEventDayInfo.eventDay !== rec._id ||
                                item._id !== editEventDayInfo.eventId) && (
                                <Button
                                  color="dark"
                                  onClick={() => {
                                    setEditEventDayInfo({
                                      edit: true,
                                      name: rec.name,
                                      date: rec.date,
                                      venue: rec.venue,
                                      time: rec.time,
                                      eventDay: rec._id,
                                      eventId: item._id,
                                    });
                                  }}
                                  disabled={loading}
                                >
                                  Edit
                                </Button>
                              )}
                              {editEventDayInfo.edit &&
                                item._id === editEventDayInfo.eventId &&
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
                                          item._id ===
                                            editEventDayInfo.eventId &&
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
                                          eventId: "",
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
                                color="failure"
                                className="border-2"
                                onClick={() => {
                                  if (
                                    confirm(
                                      "Do you want to delete the event day?"
                                    )
                                  ) {
                                    deleteEventDay(item._id, rec._id);
                                  }
                                }}
                                disabled={loading || item?.status?.approved}
                              >
                                <MdDelete />
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
                        <div className="grid grid-cols-6 gap-4">
                          {addEventDay.add &&
                          item._id === addEventDay.eventId ? (
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
                                placeholder="Event Venue"
                                value={addEventDay.venue}
                                disabled={loading}
                                onChange={(e) => {
                                  setAddEventDay({
                                    ...addEventDay,
                                    venue: e.target.value,
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
                                      item._id === addEventDay.eventId &&
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
                                      eventId: "",
                                      add: false,
                                      name: "",
                                      date: "",
                                      venue: "",
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
                                  eventId: item._id,
                                  add: true,
                                  name: "",
                                  date: "",
                                  time: "",
                                  venue: "",
                                });
                              }}
                              disabled={loading || item?.status?.approved}
                            >
                              <BsPlus size={16} /> Add New
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    // <div key={item._id}>
                    //   <div className="flex flex-row gap-4 items-center">
                    //     <p className="w-4">{index + 1}.</p>
                    //     <Label value="Event Name" />
                    //     <TextInput
                    //       placeholder="Event Name"
                    //       value={item.name}
                    //       readOnly={true}
                    //     />
                    //     <Label value="Event Community" />
                    //     <TextInput
                    //       placeholder="Event Community"
                    //       value={item.community}
                    //       readOnly={true}
                    //     />
                    // <Link href={`/event-tool/event/${item._id}`}>
                    //   <Button color="gray">Manage Event</Button>
                    // </Link>
                    //   </div>
                    //   <div className="flex flex-row gap-4 items-center mt-2">
                    //     <p className="w-4" />
                    //     <div className="flex flex-col justify-around gap-2">
                    //       <Label value="Event Day" className="my-auto py-2.5" />
                    //       <Label value="Date" className="my-auto py-2.5" />
                    //       <Label value="Venue" className="my-auto py-2.5" />
                    //     </div>
                    //     {item.eventDays.map((rec, index) => (
                    //       <div className="flex flex-col gap-2" key={rec._id}>
                    //         <TextInput
                    //           placeholder="Event Day"
                    //           value={rec.name}
                    //           readOnly={true}
                    //         />
                    //         <TextInput
                    //           placeholder="Date"
                    //           value={
                    //             new Date(rec?.date).toISOString().split("T")[0]
                    //           }
                    //           type="date"
                    //           readOnly={true}
                    //           disabled={!lead.createdAt}
                    //         />
                    //         <TextInput
                    //           placeholder="Event Venue"
                    //           value={rec.venue}
                    //           readOnly={true}
                    //         />
                    //       </div>
                    //     ))}
                    //     <Button color="light">
                    //       <BsPlus size={16} />
                    //     </Button>
                    //   </div>
                    // </div>
                  ))}
                </>
              )}
            </>
          )}
          {!loading && display === "Payment Status" && (
            <>
              {/* Payment Stats */}
              <div className="bg-white rounded-3xl shadow-lg p-6 flex flex-row gap-2">
                <div className="border-2 rounded-full p-3">
                  <MdPayments size={48} />
                </div>
                <div className="flex flex-row flex-grow text-center">
                  <div className="flex flex-col gap-1 mx-auto">
                    <p className="">Total Amount</p>
                    <p className="text-4xl font-bold">
                      {!loading && "₹" + lead.paymentStats.totalAmount}
                    </p>
                  </div>
                  <div className="w-[2px] h-full bg-zinc-100" />
                  <div className="flex flex-col gap-1 mx-auto text-green-500">
                    <p className="">Amount Received</p>
                    <p className="text-4xl font-bold">
                      {!loading && "₹" + lead.paymentStats.amountPaid}
                    </p>
                  </div>
                  <div className="w-[2px] h-full bg-zinc-100" />
                  <div className="flex flex-col gap-1 mx-auto text-red-500">
                    <p className="">Amount Due</p>
                    <p className="text-4xl font-bold ">
                      {!loading && "₹" + lead.paymentStats.amountDue}
                    </p>
                  </div>
                </div>
              </div>
              <div className="width-full overflow-x-auto">
                <Table hoverable className="width-full overflow-x-auto">
                  <Table.Head>
                    <Table.HeadCell className="p-4">
                      <Checkbox className="sr-only" />
                    </Table.HeadCell>
                    <Table.HeadCell>Event Name</Table.HeadCell>
                    <Table.HeadCell>Amount</Table.HeadCell>
                    <Table.HeadCell>Paid</Table.HeadCell>
                    <Table.HeadCell>Due</Table.HeadCell>
                    <Table.HeadCell>Status</Table.HeadCell>
                    <Table.HeadCell>Payment Mode</Table.HeadCell>
                    <Table.HeadCell className="p-4">
                      <Checkbox className="sr-only" />
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {lead.payments?.map((item, index) => (
                      <Table.Row
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        key={item._id}
                      >
                        <Table.Cell>{index + 1}</Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {item.event.name}
                        </Table.Cell>
                        <Table.Cell className="font-medium">
                          ₹{item.amount / 100}
                        </Table.Cell>
                        <Table.Cell className="text-green-500 font-medium">
                          ₹{item.amountPaid / 100}
                        </Table.Cell>
                        <Table.Cell className="text-red-500 font-medium">
                          ₹{item.amountDue / 100}
                        </Table.Cell>
                        <Table.Cell>
                          {toProperCase(item.status.split("_").join(" "))}
                        </Table.Cell>
                        <Table.Cell>
                          {toProperCase(
                            ["cash", "upi", "bank-transfer"].includes(
                              item?.paymentMethod
                            )
                              ? item.paymentMethod?.replace("-", " ")
                              : item?.transactions[0]?.method
                                  ?.split("_")
                                  .join(" ") || ""
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          {!["cash", "upi", "bank-transfer"].includes(
                            item?.paymentMethod
                          ) ? (
                            displayPayment === item.razporPayId ? (
                              <MdRemoveRedEye
                                color="blue"
                                onClick={() => {
                                  setDisplayPayment("");
                                }}
                              />
                            ) : (
                              <MdOutlineRemoveRedEye
                                cursor={"pointer"}
                                onClick={() => {
                                  setDisplayPayment(item.razporPayId);
                                }}
                              />
                            )
                          ) : null}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
              {transactions.length > 0 && (
                <>
                  <p>Transactions and Payment Info:</p>
                  <div className="width-full overflow-x-auto">
                    <Table hoverable className="width-full overflow-x-auto">
                      <Table.Head>
                        <Table.HeadCell className="p-4">
                          <Checkbox className="sr-only" />
                        </Table.HeadCell>
                        <Table.HeadCell>Date</Table.HeadCell>
                        <Table.HeadCell>Payment Mtehod</Table.HeadCell>
                        <Table.HeadCell>Amount</Table.HeadCell>
                        <Table.HeadCell>Status</Table.HeadCell>
                      </Table.Head>
                      <Table.Body className="divide-y">
                        {transactions
                          .sort((a, b) => b.created_at - a.created_at)
                          ?.map((item, index) => (
                            <Table.Row
                              className="bg-white dark:border-gray-700 dark:bg-gray-800"
                              key={item._id}
                            >
                              <Table.Cell>{index + 1}</Table.Cell>
                              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {new Date(
                                  item.created_at * 1000
                                ).toLocaleString()}
                              </Table.Cell>
                              <Table.Cell>
                                {toProperCase(item.method.split("_").join(" "))}
                              </Table.Cell>
                              <Table.Cell className="font-medium">
                                ₹{item.amount / 100}
                              </Table.Cell>
                              <Table.Cell>
                                {toProperCase(item.status.split("_").join(" "))}
                              </Table.Cell>
                            </Table.Row>
                          ))}
                      </Table.Body>
                    </Table>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
