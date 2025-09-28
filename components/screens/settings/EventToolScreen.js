import SettingTextInput from "@/components/forms/SettingTextInput";
import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { BsPlus } from "react-icons/bs";

export default function EventToolScreen({
  setMessage,
  loading,
  setLoading,
  display,
}) {
  const [eventLostResponse, setEventLostResponse] = useState([]);
  const [addNewEventLostResponse, setAddNewEventLostResponse] = useState({
    display: false,
    title: "",
  });
  const [editEventLostResponse, setEditEventLostResponse] = useState({
    title: "",
    _id: "",
  });
  const [eventTypes, setEventTypes] = useState([]);
  const [addNewEventType, setAddNewEventType] = useState({
    display: false,
    title: "",
  });
  const [editEventType, setEditEventType] = useState({
    title: "",
    _id: "",
  });
  const [eventCommunity, setEventCommunity] = useState([]);
  const [addNewEventCommunity, setAddNewEventCommunity] = useState({
    display: false,
    title: "",
  });
  const [editEventCommunity, setEditEventCommunity] = useState({
    title: "",
    _id: "",
  });
  const [quantity, setQuantity] = useState([]);
  const [addNewQuantity, setAddNewQuantity] = useState({
    display: false,
    title: "",
  });
  const [editQuantity, setEditQuantity] = useState({
    title: "",
    _id: "",
  });
  const fetchQuantity = () => {
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
        setQuantity(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addQuantity = async () => {
    if (addNewQuantity.title) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/quantity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: addNewQuantity.title,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Quantity added Successfully!",
              status: "success",
              display: true,
            });
            setAddNewQuantity({
              display: false,
              title: "",
            });
            fetchQuantity();
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
  const updateQuantity = async () => {
    if (editQuantity.title) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/quantity/${editQuantity._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: editQuantity.title,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Quantity updated Successfully!",
              status: "success",
              display: true,
            });
            setEditQuantity({
              title: "",
              _id: "",
            });
            fetchQuantity();
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
  const deleteQuantity = (_id) => {
    if (_id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/quantity/${_id}`, {
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
              text: "Quantity deleted added Successfully!",
              status: "success",
              display: true,
            });
            fetchQuantity();
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
  const fetchEventCommunity = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event-community`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setEventCommunity(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addEventCommunity = async () => {
    if (addNewEventCommunity.title) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/event-community`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: addNewEventCommunity.title,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Event Community added Successfully!",
              status: "success",
              display: true,
            });
            setAddNewEventCommunity({
              display: false,
              title: "",
            });
            fetchEventCommunity();
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
  const updateEventCommunity = async () => {
    if (editEventCommunity.title) {
      setLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/event-community/${editEventCommunity._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: editEventCommunity.title,
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Event Community updated Successfully!",
              status: "success",
              display: true,
            });
            setEditEventCommunity({
              title: "",
              _id: "",
            });
            fetchEventCommunity();
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
  const deleteEventCommunity = (_id) => {
    if (_id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/event-community/${_id}`, {
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
              text: "Event Community deleted added Successfully!",
              status: "success",
              display: true,
            });
            fetchEventCommunity();
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
  const fetchEventTypes = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event-type`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setEventTypes(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addEventType = async () => {
    if (addNewEventType.title) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/event-type`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: addNewEventType.title,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Event Type added Successfully!",
              status: "success",
              display: true,
            });
            setAddNewEventType({
              display: false,
              title: "",
            });
            fetchEventTypes();
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
  const updateEventType = async () => {
    if (editEventType.title) {
      setLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/event-type/${editEventType._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: editEventType.title,
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Event Type updated Successfully!",
              status: "success",
              display: true,
            });
            setEditEventType({
              title: "",
              _id: "",
            });
            fetchEventTypes();
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
  const deleteEventType = (_id) => {
    if (_id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/event-type/${_id}`, {
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
              text: "Event Type deleted added Successfully!",
              status: "success",
              display: true,
            });
            fetchEventTypes();
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
  const fetchEventLostResponse = () => {
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
        setEventLostResponse(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addEventLostResponse = async () => {
    if (addNewEventLostResponse.title) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/event-lost-response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: addNewEventLostResponse.title,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Event Lost Response added Successfully!",
              status: "success",
              display: true,
            });
            setAddNewEventLostResponse({
              display: false,
              title: "",
            });
            fetchEventLostResponse();
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
  const updateEventLostResponse = async () => {
    if (editEventLostResponse.title) {
      setLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/event-lost-response/${editEventLostResponse._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: editEventLostResponse.title,
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Event Lost Response updated Successfully!",
              status: "success",
              display: true,
            });
            setEditEventLostResponse({
              title: "",
              _id: "",
            });
            fetchEventLostResponse();
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
  const deleteEventLostResponse = (_id) => {
    if (_id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/event-lost-response/${_id}`, {
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
              text: "Event Lost Response deleted added Successfully!",
              status: "success",
              display: true,
            });
            fetchEventLostResponse();
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
    if (display === "Event Tool") {
      fetchEventLostResponse();
      fetchEventCommunity();
      fetchEventTypes();
      fetchQuantity();
    }
  }, [display]);
  return (
    <>
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full flex flex-col gap-4">
        <p className="text-2xl font-medium">Event tool</p>
        <div className="flex flex-col gap-4 border-b-2 pb-3">
          <p className="text-xl font-medium">Community (USER)</p>
          <div className="grid grid-cols-4 gap-4">
            {eventCommunity?.map((item, index) => (
              <SettingTextInput
                key={index}
                index={index}
                placeholder={"Edit Title"}
                value={
                  editEventCommunity?._id === item._id
                    ? editEventCommunity.title
                    : item.title
                }
                onChange={(e) => {
                  if (editEventCommunity?._id === item._id) {
                    setEditEventCommunity({
                      ...editEventCommunity,
                      title: e.target.value,
                    });
                  }
                }}
                readOnly={editEventCommunity?._id !== item._id}
                loading={loading}
                onEdit={() => {
                  if (!loading) {
                    setEditEventCommunity({
                      ...item,
                    });
                  }
                }}
                onDelete={() => {
                  if (!loading) {
                    deleteEventCommunity(item._id);
                  }
                }}
                onSave={() => {
                  if (!loading && editEventCommunity.title) {
                    updateEventCommunity();
                  }
                }}
                onCancel={() => {
                  setEditEventCommunity({
                    title: "",
                    _id: "",
                  });
                }}
              />
            ))}
            {addNewEventCommunity.display ? (
              <SettingTextInput
                index={-1}
                placeholder={"Title..."}
                value={addNewEventCommunity.title}
                onChange={(e) => {
                  setAddNewEventCommunity({
                    ...addNewEventCommunity,
                    title: e.target.value,
                  });
                }}
                readOnly={false}
                loading={loading}
                onSave={() => {
                  if (!loading && addNewEventCommunity.title) {
                    addEventCommunity();
                  }
                }}
                onCancel={() => {
                  setAddNewEventCommunity({
                    display: false,
                    title: "",
                  });
                }}
              />
            ) : (
              <Button
                color="light"
                onClick={() => {
                  setAddNewEventCommunity({
                    display: true,
                    title: "",
                  });
                }}
                disabled={
                  loading ||
                  addNewEventCommunity.display ||
                  editEventCommunity._id
                }
              >
                <BsPlus size={16} /> Add New
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 border-b-2 pb-3">
          <p className="text-xl font-medium">Event Type (USER)</p>
          <div className="grid grid-cols-4 gap-4">
            {eventTypes?.map((item, index) => (
              <SettingTextInput
                key={index}
                index={index}
                placeholder={"Edit Title"}
                value={
                  editEventType?._id === item._id
                    ? editEventType.title
                    : item.title
                }
                onChange={(e) => {
                  if (editEventType?._id === item._id) {
                    setEditEventType({
                      ...editEventType,
                      title: e.target.value,
                    });
                  }
                }}
                readOnly={editEventType?._id !== item._id}
                loading={loading}
                onEdit={() => {
                  if (!loading) {
                    setEditEventType({
                      ...item,
                    });
                  }
                }}
                onDelete={() => {
                  if (!loading) {
                    deleteEventType(item._id);
                  }
                }}
                onSave={() => {
                  if (!loading && editEventType.title) {
                    updateEventType();
                  }
                }}
                onCancel={() => {
                  setEditEventType({
                    title: "",
                    _id: "",
                  });
                }}
              />
            ))}
            {addNewEventType.display ? (
              <SettingTextInput
                index={-1}
                placeholder={"Title..."}
                value={addNewEventType.title}
                onChange={(e) => {
                  setAddNewEventType({
                    ...addNewEventType,
                    title: e.target.value,
                  });
                }}
                readOnly={false}
                loading={loading}
                onSave={() => {
                  if (!loading && addNewEventType.title) {
                    addEventType();
                  }
                }}
                onCancel={() => {
                  setAddNewEventType({
                    display: false,
                    title: "",
                  });
                }}
              />
            ) : (
              <Button
                color="light"
                onClick={() => {
                  setAddNewEventType({
                    display: true,
                    title: "",
                  });
                }}
                disabled={
                  loading || addNewEventType.display || editEventType._id
                }
              >
                <BsPlus size={16} /> Add New
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 border-b-2 pb-3">
          <p className="text-xl font-medium">Event Lost (ADMIN)</p>
          <div className="grid grid-cols-4 gap-6">
            {eventLostResponse?.map((item, index) => (
              <SettingTextInput
                key={index}
                index={index}
                placeholder={"Edit Title"}
                value={
                  editEventLostResponse?._id === item._id
                    ? editEventLostResponse.title
                    : item.title
                }
                onChange={(e) => {
                  if (editEventLostResponse?._id === item._id) {
                    setEditEventLostResponse({
                      ...editEventLostResponse,
                      title: e.target.value,
                    });
                  }
                }}
                readOnly={editEventLostResponse?._id !== item._id}
                loading={loading}
                onEdit={() => {
                  if (!loading) {
                    setEditEventLostResponse({
                      ...item,
                    });
                  }
                }}
                onDelete={() => {
                  if (!loading) {
                    deleteEventLostResponse(item._id);
                  }
                }}
                onSave={() => {
                  if (!loading && editEventLostResponse.title) {
                    updateEventLostResponse();
                  }
                }}
                onCancel={() => {
                  setEditEventLostResponse({
                    title: "",
                    _id: "",
                  });
                }}
              />
            ))}
            {addNewEventLostResponse.display ? (
              <SettingTextInput
                index={-1}
                placeholder={"Title..."}
                value={addNewEventLostResponse.title}
                onChange={(e) => {
                  setAddNewEventLostResponse({
                    ...addNewEventLostResponse,
                    title: e.target.value,
                  });
                }}
                readOnly={false}
                loading={loading}
                onSave={() => {
                  if (!loading && addNewEventLostResponse.title) {
                    addEventLostResponse();
                  }
                }}
                onCancel={() => {
                  setAddNewEventLostResponse({
                    display: false,
                    title: "",
                  });
                }}
              />
            ) : (
              <Button
                color="light"
                onClick={() => {
                  setAddNewEventLostResponse({
                    display: true,
                    title: "",
                  });
                }}
                disabled={
                  loading ||
                  addNewEventLostResponse.display ||
                  editEventLostResponse._id
                }
              >
                <BsPlus size={16} /> Add New
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 border-b-2 pb-3">
          <p className="text-xl font-medium">Quantity</p>
          <div className="grid grid-cols-5 gap-4">
            {quantity?.map((item, index) => (
              <SettingTextInput
                key={index}
                index={index}
                placeholder={"Edit Title"}
                value={
                  editQuantity?._id === item._id
                    ? editQuantity.title
                    : item.title
                }
                onChange={(e) => {
                  if (editQuantity?._id === item._id) {
                    setEditQuantity({
                      ...editQuantity,
                      title: e.target.value,
                    });
                  }
                }}
                readOnly={editQuantity?._id !== item._id}
                loading={loading}
                onEdit={() => {
                  if (!loading) {
                    setEditQuantity({
                      ...item,
                    });
                  }
                }}
                onDelete={() => {
                  if (!loading) {
                    deleteQuantity(item._id);
                  }
                }}
                onSave={() => {
                  if (!loading && editQuantity.title) {
                    updateQuantity();
                  }
                }}
                onCancel={() => {
                  setEditQuantity({
                    title: "",
                    _id: "",
                  });
                }}
              />
            ))}
            {addNewQuantity.display ? (
              <SettingTextInput
                index={-1}
                placeholder={"Title..."}
                value={addNewQuantity.title}
                onChange={(e) => {
                  setAddNewQuantity({
                    ...addNewQuantity,
                    title: e.target.value,
                  });
                }}
                readOnly={false}
                loading={loading}
                onSave={() => {
                  if (!loading && addNewQuantity.title) {
                    addQuantity();
                  }
                }}
                onCancel={() => {
                  setAddNewQuantity({
                    display: false,
                    title: "",
                  });
                }}
              />
            ) : (
              <Button
                color="light"
                onClick={() => {
                  setAddNewQuantity({
                    display: true,
                    title: "",
                  });
                }}
                disabled={loading || addNewQuantity.display || editQuantity._id}
              >
                <BsPlus size={16} /> Add New
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
