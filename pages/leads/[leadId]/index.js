import { toProperCase } from "@/utils/text";
import {
  Badge,
  Button,
  Checkbox,
  Label,
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

export default function Leads({ message, setMessage }) {
  const router = useRouter();
  const { leadId } = router.query;
  const [display, setDisplay] = useState("Account Status");
  const [lead, setLead] = useState({});
  const [conversation, setConversation] = useState("");
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
        setUpdatedName(null);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
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
  const addConversation = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/enquiry/${leadId}/conversations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ conversation }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          fetchLead();
          setConversation("");
          setMessage({
            text: "Conversation added Successfully!",
            status: "success",
            display: true,
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
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
  useEffect(() => {
    if (leadId) {
      fetchLead();
    }
  }, [leadId]);
  useEffect(() => {
    setTransactions([]);
    if (displayPayment) {
      fetchTransactions();
    }
  }, [displayPayment]);

  return (
    <>
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
            </p>
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
              </div>
              <p>Status Report</p>
              <div className="flex flex-row gap-4 -mt-2">
                <Badge color={lead.verified ? "success" : "failure"}>
                  {lead.verified ? "Verified" : "Not Verified"}
                </Badge>
                {lead.isInterested && (
                  <Badge color={"success"}>Interested</Badge>
                )}
                {lead.isLost && <Badge color={"failure"}>Lost</Badge>}
                <Badge color={lead.userCreated ? "success" : "failure"}>
                  {lead.userCreated ? "Website Login" : "No Website Login"}
                </Badge>
                <Badge
                  color={
                    lead.userCreated
                      ? lead.events.length > 0
                        ? "success"
                        : "failure"
                      : "failure"
                  }
                >
                  {lead.userCreated
                    ? lead.events.length > 0
                      ? "Event Created"
                      : "Event Not Created"
                    : "Event Not Created"}
                </Badge>
                <Badge color={"failure"}>Payment Not Done</Badge>
              </div>
              <div className="flex flex-row gap-4 -mt-2">
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
              <p>Client updates</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-3">
                  {lead.updates?.conversations?.map((item, index) => (
                    <Textarea
                      rows={2}
                      value={item}
                      key={index}
                      readOnly
                      disabled
                      className="disabled:opacity-100"
                    />
                  ))}
                  <Textarea
                    rows={3}
                    value={conversation}
                    onChange={(e) => {
                      setConversation(e.target.value);
                    }}
                    placeholder="Add Notes"
                  />
                  <Button
                    color="success"
                    disabled={!conversation}
                    onClick={addConversation}
                  >
                    Update Conversation
                  </Button>
                </div>
                <div className="flex flex-col gap-3">
                  <Textarea
                    rows={5}
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                    }}
                    placeholder="Add Notes"
                  />
                  <Button
                    color="success"
                    disabled={!notes}
                    onClick={updateNotes}
                  >
                    Update Notes
                  </Button>
                </div>
                <div className="flex flex-col gap-3">
                  <p>Schedule Next Call</p>
                  <TextInput
                    type="datetime-local"
                    value={
                      callSchedule
                        ? new Date(
                            new Date(callSchedule).getTime() +
                              new Date().getTimezoneOffset() * -60 * 1000
                          )
                            .toISOString()
                            .slice(0, 16)
                        : ""
                    }
                    onChange={(e) => {
                      setCallSchedule(e.target.value);
                    }}
                    placeholder="Call Schedule"
                  />
                  <Button
                    color="success"
                    disabled={!callSchedule}
                    onClick={updateCallSchedule}
                  >
                    Update Schedule
                  </Button>
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
