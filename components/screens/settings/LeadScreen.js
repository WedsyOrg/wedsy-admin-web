import SettingTextInput from "@/components/forms/SettingTextInput";
import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { BsPlus } from "react-icons/bs";

export default function LeadScreen({
  setMessage,
  loading,
  setLoading,
  display,
}) {
  const [leadSource, setLeadSource] = useState([]);
  const [addNewLeadSource, setAddNewLeadSource] = useState({
    display: false,
    title: "",
  });
  const [editLeadSource, setEditLeadSource] = useState({
    title: "",
    _id: "",
  });
  const [leadInterest, setLeadInterest] = useState([]);
  const [addNewLeadInterest, setAddNewLeadInterest] = useState({
    display: false,
    title: "",
  });
  const [editLeadInterest, setEditLeadInterest] = useState({
    title: "",
    _id: "",
  });
  const [leadLostResponse, setLeadLostResponse] = useState([]);
  const [addNewLeadLostResponse, setAddNewLeadLostResponse] = useState({
    display: false,
    title: "",
  });
  const [editLeadLostResponse, setEditLeadLostResponse] = useState({
    title: "",
    _id: "",
  });
  const fetchLeadSource = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/lead-source`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setLeadSource(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addLeadSource = async () => {
    if (addNewLeadSource.title) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/lead-source`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: addNewLeadSource.title,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Lead Source added Successfully!",
              status: "success",
              display: true,
            });
            setAddNewLeadSource({
              display: false,
              title: "",
            });
            fetchLeadSource();
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
  const updateLeadSource = async () => {
    if (editLeadSource.title) {
      setLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lead-source/${editLeadSource._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: editLeadSource.title,
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Lead Source updated Successfully!",
              status: "success",
              display: true,
            });
            setEditLeadSource({
              title: "",

              _id: "",
            });
            fetchLeadSource();
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
  const deleteLeadSource = (_id) => {
    if (_id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/lead-source/${_id}`, {
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
              text: "Lead Source deleted added Successfully!",
              status: "success",
              display: true,
            });
            fetchLeadSource();
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
  const fetchLeadInterest = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/lead-interest`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setLeadInterest(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addLeadInterest = async () => {
    if (addNewLeadInterest.title) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/lead-interest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: addNewLeadInterest.title,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Lead Interest added Successfully!",
              status: "success",
              display: true,
            });
            setAddNewLeadInterest({
              display: false,
              title: "",
            });
            fetchLeadInterest();
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
  const updateLeadInterest = async () => {
    if (editLeadInterest.title) {
      setLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lead-interest/${editLeadInterest._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: editLeadInterest.title,
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Lead Interest updated Successfully!",
              status: "success",
              display: true,
            });
            setEditLeadInterest({
              title: "",

              _id: "",
            });
            fetchLeadInterest();
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
  const deleteLeadInterest = (_id) => {
    if (_id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/lead-interest/${_id}`, {
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
              text: "Lead Interest deleted added Successfully!",
              status: "success",
              display: true,
            });
            fetchLeadInterest();
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
  const fetchLeadLostResponse = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/lead-lost-response`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setLeadLostResponse(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addLeadLostResponse = async () => {
    if (addNewLeadLostResponse.title) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/lead-lost-response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: addNewLeadLostResponse.title,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Lead Lost Response added Successfully!",
              status: "success",
              display: true,
            });
            setAddNewLeadLostResponse({
              display: false,
              title: "",
            });
            fetchLeadLostResponse();
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
  const updateLeadLostResponse = async () => {
    if (editLeadLostResponse.title) {
      setLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lead-lost-response/${editLeadLostResponse._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: editLeadLostResponse.title,
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Lead Lost Response updated Successfully!",
              status: "success",
              display: true,
            });
            setEditLeadLostResponse({
              title: "",

              _id: "",
            });
            fetchLeadLostResponse();
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
  const deleteLeadLostResponse = (_id) => {
    if (_id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/lead-lost-response/${_id}`, {
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
              text: "Lead Lost Response deleted added Successfully!",
              status: "success",
              display: true,
            });
            fetchLeadLostResponse();
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
    if (display === "Leads") {
      fetchLeadSource();
      fetchLeadInterest();
      fetchLeadLostResponse();
    }
  }, [display]);
  return (
    <>
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full flex flex-col gap-4">
        <p className="text-2xl font-medium">Lead Information (ADMIN)</p>
        <div className="flex flex-col gap-4 border-b-2 pb-3">
          <p className="text-xl font-medium">Lead Lost Responses</p>
          <div className="grid grid-cols-4 gap-4">
            {leadLostResponse?.map((item, index) => (
              <SettingTextInput
                key={index}
                index={index}
                placeholder={"Edit Title"}
                value={
                  editLeadLostResponse?._id === item._id
                    ? editLeadLostResponse.title
                    : item.title
                }
                onChange={(e) => {
                  if (editLeadLostResponse?._id === item._id) {
                    setEditLeadLostResponse({
                      ...editLeadLostResponse,
                      title: e.target.value,
                    });
                  }
                }}
                readOnly={editLeadLostResponse?._id !== item._id}
                loading={loading}
                onEdit={() => {
                  if (!loading) {
                    setEditLeadLostResponse({
                      ...item,
                    });
                  }
                }}
                onDelete={() => {
                  if (!loading) {
                    deleteLeadLostResponse(item._id);
                  }
                }}
                onSave={() => {
                  if (!loading && editLeadSource.title) {
                    updateLeadLostResponse();
                  }
                }}
                onCancel={() => {
                  setEditLeadLostResponse({
                    title: "",
                    _id: "",
                  });
                }}
              />
            ))}
            {addNewLeadLostResponse.display ? (
              <SettingTextInput
                index={-1}
                placeholder={"Title..."}
                value={addNewLeadLostResponse.title}
                onChange={(e) => {
                  setAddNewLeadLostResponse({
                    ...addNewLeadLostResponse,
                    title: e.target.value,
                  });
                }}
                readOnly={false}
                loading={loading}
                onSave={() => {
                  if (!loading && addNewLeadLostResponse.title) {
                    addLeadLostResponse();
                  }
                }}
                onCancel={() => {
                  setAddNewLeadLostResponse({
                    display: false,
                    title: "",
                  });
                }}
              />
            ) : (
              <Button
                color="light"
                onClick={() => {
                  setAddNewLeadLostResponse({
                    display: true,
                    title: "",
                  });
                }}
                disabled={
                  loading ||
                  addNewLeadLostResponse.display ||
                  editLeadLostResponse._id
                }
              >
                <BsPlus size={16} /> Add New
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 border-b-2 pb-3">
          <p className="text-xl font-medium">Lead Interests</p>
          <div className="grid grid-cols-4 gap-4">
            {leadInterest?.map((item, index) => (
              <SettingTextInput
                key={index}
                index={index}
                placeholder={"Edit Title"}
                value={
                  editLeadInterest?._id === item._id
                    ? editLeadInterest.title
                    : item.title
                }
                onChange={(e) => {
                  if (editLeadInterest?._id === item._id) {
                    setEditLeadInterest({
                      ...editLeadInterest,
                      title: e.target.value,
                    });
                  }
                }}
                readOnly={editLeadInterest?._id !== item._id}
                loading={loading}
                onEdit={() => {
                  if (!loading) {
                    setEditLeadInterest({
                      ...item,
                    });
                  }
                }}
                onDelete={() => {
                  if (!loading) {
                    deleteLeadInterest(item._id);
                  }
                }}
                onSave={() => {
                  if (!loading && editLeadInterest.title) {
                    updateLeadInterest();
                  }
                }}
                onCancel={() => {
                  setEditLeadInterest({
                    title: "",
                    _id: "",
                  });
                }}
              />
            ))}
            {addNewLeadInterest.display ? (
              <SettingTextInput
                index={-1}
                placeholder={"Title..."}
                value={addNewLeadInterest.title}
                onChange={(e) => {
                  setAddNewLeadInterest({
                    ...addNewLeadInterest,
                    title: e.target.value,
                  });
                }}
                readOnly={false}
                loading={loading}
                onSave={() => {
                  if (!loading && addNewLeadInterest.title) {
                    addLeadInterest();
                  }
                }}
                onCancel={() => {
                  setAddNewLeadInterest({
                    display: false,
                    title: "",
                  });
                }}
              />
            ) : (
              <Button
                color="light"
                onClick={() => {
                  setAddNewLeadInterest({
                    display: true,
                    title: "",
                  });
                }}
                disabled={
                  loading || addNewLeadInterest.display || editLeadInterest._id
                }
              >
                <BsPlus size={16} /> Add New
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 border-b-2 pb-3">
          <p className="text-xl font-medium">Lead Sources</p>
          <div className="grid grid-cols-4 gap-6">
            {leadSource?.map((item, index) => (
              <SettingTextInput
                key={index}
                index={index}
                placeholder={"Edit Title"}
                value={
                  editLeadSource?._id === item._id
                    ? editLeadSource.title
                    : item.title
                }
                onChange={(e) => {
                  if (editLeadSource?._id === item._id) {
                    setEditLeadSource({
                      ...editLeadSource,
                      title: e.target.value,
                    });
                  }
                }}
                readOnly={editLeadSource?._id !== item._id}
                loading={loading}
                onEdit={() => {
                  if (!loading) {
                    setEditLeadSource({
                      ...item,
                    });
                  }
                }}
                onDelete={() => {
                  if (!loading) {
                    deleteLeadSource(item._id);
                  }
                }}
                onSave={() => {
                  if (!loading && editLeadSource.title) {
                    updateLeadSource();
                  }
                }}
                onCancel={() => {
                  setEditLeadSource({
                    title: "",
                    _id: "",
                  });
                }}
              />
            ))}
            {addNewLeadSource.display ? (
              <SettingTextInput
                index={-1}
                placeholder={"Title..."}
                value={addNewLeadSource.title}
                onChange={(e) => {
                  setAddNewLeadSource({
                    ...addNewLeadSource,
                    title: e.target.value,
                  });
                }}
                readOnly={false}
                loading={loading}
                onSave={() => {
                  if (!loading && addNewLeadSource.title) {
                    addLeadSource();
                  }
                }}
                onCancel={() => {
                  setAddNewLeadSource({
                    display: false,
                    title: "",
                  });
                }}
              />
            ) : (
              <Button
                color="light"
                onClick={() => {
                  setAddNewLeadSource({
                    display: true,
                    title: "",
                  });
                }}
                disabled={
                  loading || addNewLeadSource.display || editLeadSource._id
                }
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
