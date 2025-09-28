import SettingTextInput from "@/components/forms/SettingTextInput";
import { Button, Checkbox, Label } from "flowbite-react";
import { useEffect, useState } from "react";
import { BsPlus } from "react-icons/bs";

export default function WebsiteSetting({
  setMessage,
  loading,
  setLoading,
  display,
}) {
  const [tag, setTag] = useState([]);
  const [speciality, setSpeciality] = useState([]);
  const [preferredLook, setPreferredLook] = useState([]);
  const [makeupStyle, setMakeupStyle] = useState([]);
  const [addOns, setAddOns] = useState([]);
  const [addNewTag, setAddNewTag] = useState({
    display: false,
    title: "",
  });
  const [addNewSpeciality, setAddNewSpeciality] = useState({
    display: false,
    title: "",
  });
  const [addNewPreferredLook, setAddNewPreferredLook] = useState({
    display: false,
    title: "",
  });
  const [addNewMakeupStyle, setAddNewMakeupStyle] = useState({
    display: false,
    title: "",
  });
  const [addNewAddOns, setAddNewAddOns] = useState({
    display: false,
    title: "",
  });
  const [editTag, setEditTag] = useState({
    title: "",
    _id: "",
  });
  const [editSpeciality, setEditSpeciality] = useState({
    title: "",
    _id: "",
  });
  const [editPreferredLook, setEditPreferredLook] = useState({
    title: "",
    _id: "",
  });
  const [editMakeupStyle, setEditMakeupStyle] = useState({
    title: "",
    _id: "",
  });
  const [editAddOns, setEditAddOns] = useState({
    title: "",
    _id: "",
  });

  const fetchTag = () => {
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
        setTag(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchSpeciality = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor-speciality`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setSpeciality(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchPreferredLook = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor-preferred-look`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setPreferredLook(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchMakeupStyle = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor-makeup-style`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setMakeupStyle(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchAddOns = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor-add-ons`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setAddOns(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addTag = async () => {
    if (addNewTag.title) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/tag`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: addNewTag.title,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Tag added Successfully!",
              status: "success",
              display: true,
            });
            setAddNewTag({
              display: false,
              title: "",
            });
            fetchTag();
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
  const addSpeciality = async () => {
    if (addNewSpeciality.title) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor-speciality`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: addNewSpeciality.title,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Speciality added Successfully!",
              status: "success",
              display: true,
            });
            setAddNewSpeciality({
              display: false,
              title: "",
            });
            fetchSpeciality();
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
  const addPreferredLook = async () => {
    if (addNewPreferredLook.title) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor-preferred-look`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: addNewPreferredLook.title,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Preferred Look added Successfully!",
              status: "success",
              display: true,
            });
            setAddNewPreferredLook({
              display: false,
              title: "",
            });
            fetchPreferredLook();
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
  const addMakeupStyle = async () => {
    if (addNewMakeupStyle.title) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor-makeup-style`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: addNewMakeupStyle.title,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Makeup Style added Successfully!",
              status: "success",
              display: true,
            });
            setAddNewMakeupStyle({
              display: false,
              title: "",
            });
            fetchMakeupStyle();
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
  const addAddOns = async () => {
    if (addNewAddOns.title) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor-add-ons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: addNewAddOns.title,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "AddOns added Successfully!",
              status: "success",
              display: true,
            });
            setAddNewAddOns({
              display: false,
              title: "",
            });
            fetchAddOns();
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
  const updateTag = async () => {
    if (editTag.title) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/tag/${editTag._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: editTag.title,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Tag updated Successfully!",
              status: "success",
              display: true,
            });
            setEditTag({
              title: "",
              _id: "",
            });
            fetchTag();
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
  const updateSpeciality = async () => {
    if (editSpeciality.title) {
      setLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/vendor-speciality/${editSpeciality._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: editSpeciality.title,
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Speciality updated Successfully!",
              status: "success",
              display: true,
            });
            setEditSpeciality({
              title: "",
              _id: "",
            });
            fetchSpeciality();
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
  const updatePreferredLook = async () => {
    if (editPreferredLook.title) {
      setLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/vendor-preferred-look/${editPreferredLook._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: editPreferredLook.title,
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Preferred Look updated Successfully!",
              status: "success",
              display: true,
            });
            setEditPreferredLook({
              title: "",
              _id: "",
            });
            fetchPreferredLook();
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
  const updateMakeupStyle = async () => {
    if (editMakeupStyle.title) {
      setLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/vendor-makeup-style/${editMakeupStyle._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: editMakeupStyle.title,
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Makeup Style updated Successfully!",
              status: "success",
              display: true,
            });
            setEditMakeupStyle({
              title: "",
              _id: "",
            });
            fetchMakeupStyle();
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
  const updateAddOns = async () => {
    if (editAddOns.title) {
      setLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/vendor-add-ons/${editAddOns._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: editAddOns.title,
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "AddOns updated Successfully!",
              status: "success",
              display: true,
            });
            setEditAddOns({
              title: "",
              _id: "",
            });
            fetchAddOns();
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
  const updateMakeupStyleAddPreferredLook = async (_id, preferredLook) => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor-makeup-style/${_id}/preferred-look`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          preferredLook,
        }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message !== "error") {
          setLoading(false);
          setMessage({
            text: "Makeup Style updated Successfully!",
            status: "success",
            display: true,
          });
          fetchMakeupStyle();
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
  };
  const updateMakeupStyleRemovePreferredLook = async (_id, preferredLook) => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor-makeup-style/${_id}/preferred-look`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          preferredLook,
        }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message !== "error") {
          setLoading(false);
          setMessage({
            text: "Makeup Style updated Successfully!",
            status: "success",
            display: true,
          });
          fetchMakeupStyle();
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
  };
  const updateAddOnsAddMakeupStyle = async (_id, makeupStyle) => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor-add-ons/${_id}/makeup-style`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          makeupStyle,
        }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message !== "error") {
          setLoading(false);
          setMessage({
            text: "AddOns updated Successfully!",
            status: "success",
            display: true,
          });
          fetchAddOns();
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
  };
  const updateAddOnsRemoveMakeupStyle = async (_id, makeupStyle) => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor-add-ons/${_id}/makeup-style`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          makeupStyle,
        }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message !== "error") {
          setLoading(false);
          setMessage({
            text: "AddOns updated Successfully!",
            status: "success",
            display: true,
          });
          fetchAddOns();
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
  };
  const deleteTag = (_id) => {
    if (_id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/tag/${_id}`, {
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
              text: "Tag deleted added Successfully!",
              status: "success",
              display: true,
            });
            fetchTag();
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
  const deleteSpeciality = (_id) => {
    if (_id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor-speciality/${_id}`, {
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
              text: "Speciality deleted added Successfully!",
              status: "success",
              display: true,
            });
            fetchSpeciality();
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
  const deletePreferredLook = (_id) => {
    if (_id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor-preferred-look/${_id}`, {
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
              text: "Preferred Look deleted added Successfully!",
              status: "success",
              display: true,
            });
            fetchPreferredLook();
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
  const deleteMakeupStyle = (_id) => {
    if (_id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor-makeup-style/${_id}`, {
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
              text: "Makeup Style deleted added Successfully!",
              status: "success",
              display: true,
            });
            fetchMakeupStyle();
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
  const deleteAddOns = (_id) => {
    if (_id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor-add-ons/${_id}`, {
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
              text: "AddOns deleted added Successfully!",
              status: "success",
              display: true,
            });
            fetchAddOns();
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
    if (display === "Website Settings") {
      fetchTag();
      fetchSpeciality();
      fetchPreferredLook();
      fetchMakeupStyle();
      fetchAddOns();
    }
  }, [display]);
  return (
    <>
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full flex flex-col gap-4">
        <p className="text-2xl font-medium">Website Settings</p>
        <div className="flex flex-col gap-4 border-b-2 pb-3">
          <p className="text-xl font-medium">Makeup Style</p>
          <div className="grid grid-cols-4 gap-6">
            {makeupStyle?.map((item, index) => (
              <SettingTextInput
                key={index}
                index={index}
                placeholder={"Edit Title"}
                value={
                  editMakeupStyle?._id === item._id
                    ? editMakeupStyle.title
                    : item.title
                }
                onChange={(e) => {
                  if (editMakeupStyle?._id === item._id) {
                    setEditMakeupStyle({
                      ...editMakeupStyle,
                      title: e.target.value,
                    });
                  }
                }}
                readOnly={editMakeupStyle?._id !== item._id}
                loading={loading}
                onEdit={() => {
                  if (!loading) {
                    setEditMakeupStyle({
                      ...item,
                    });
                  }
                }}
                onDelete={() => {
                  if (!loading) {
                    deleteMakeupStyle(item._id);
                  }
                }}
                onSave={() => {
                  if (!loading && editMakeupStyle.title) {
                    updateMakeupStyle();
                  }
                }}
                onCancel={() => {
                  setEditMakeupStyle({
                    title: "",
                    _id: "",
                  });
                }}
                showDropdown={true}
                dropdownItems={preferredLook.map((rec) => (
                  <>
                    <Checkbox
                      checked={item.preferredLook.includes(rec.title)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateMakeupStyleAddPreferredLook(
                            item._id,
                            rec.title
                          );
                        } else {
                          updateMakeupStyleRemovePreferredLook(
                            item._id,
                            rec.title
                          );
                        }
                      }}
                      disabled={loading}
                    />
                    <Label className="ml-2" value={rec.title} />
                  </>
                ))}
              />
            ))}
            {addNewMakeupStyle.display ? (
              <SettingTextInput
                index={-1}
                placeholder={"Title..."}
                value={addNewMakeupStyle.title}
                onChange={(e) => {
                  setAddNewMakeupStyle({
                    ...addNewMakeupStyle,
                    title: e.target.value,
                  });
                }}
                readOnly={false}
                loading={loading}
                onSave={() => {
                  if (!loading && addNewMakeupStyle.title) {
                    addMakeupStyle();
                  }
                }}
                onCancel={() => {
                  setAddNewMakeupStyle({
                    display: false,
                    title: "",
                  });
                }}
              />
            ) : (
              <Button
                color="light"
                onClick={() => {
                  setAddNewMakeupStyle({
                    display: true,
                    title: "",
                  });
                }}
                disabled={
                  loading || addNewMakeupStyle.display || editMakeupStyle._id
                }
              >
                <BsPlus size={16} /> Add New
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 border-b-2 pb-3">
          <p className="text-xl font-medium">Preferred Look</p>
          <div className="grid grid-cols-4 gap-6">
            {preferredLook?.map((item, index) => (
              <SettingTextInput
                key={index}
                index={index}
                placeholder={"Edit Title"}
                value={
                  editPreferredLook?._id === item._id
                    ? editPreferredLook.title
                    : item.title
                }
                onChange={(e) => {
                  if (editPreferredLook?._id === item._id) {
                    setEditPreferredLook({
                      ...editPreferredLook,
                      title: e.target.value,
                    });
                  }
                }}
                readOnly={editPreferredLook?._id !== item._id}
                loading={loading}
                onEdit={() => {
                  if (!loading) {
                    setEditPreferredLook({
                      ...item,
                    });
                  }
                }}
                onDelete={() => {
                  if (!loading) {
                    deletePreferredLook(item._id);
                  }
                }}
                onSave={() => {
                  if (!loading && editPreferredLook.title) {
                    updatePreferredLook();
                  }
                }}
                onCancel={() => {
                  setEditPreferredLook({
                    title: "",
                    _id: "",
                  });
                }}
              />
            ))}
            {addNewPreferredLook.display ? (
              <SettingTextInput
                index={-1}
                placeholder={"Title..."}
                value={addNewPreferredLook.title}
                onChange={(e) => {
                  setAddNewPreferredLook({
                    ...addNewPreferredLook,
                    title: e.target.value,
                  });
                }}
                readOnly={false}
                loading={loading}
                onSave={() => {
                  if (!loading && addNewPreferredLook.title) {
                    addPreferredLook();
                  }
                }}
                onCancel={() => {
                  setAddNewPreferredLook({
                    display: false,
                    title: "",
                  });
                }}
              />
            ) : (
              <Button
                color="light"
                onClick={() => {
                  setAddNewPreferredLook({
                    display: true,
                    title: "",
                  });
                }}
                disabled={
                  loading ||
                  addNewPreferredLook.display ||
                  editPreferredLook._id
                }
              >
                <BsPlus size={16} /> Add New
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 border-b-2 pb-3">
          <p className="text-xl font-medium">Add Ons</p>
          <div className="grid grid-cols-4 gap-6">
            {addOns?.map((item, index) => (
              <SettingTextInput
                key={index}
                index={index}
                placeholder={"Edit Title"}
                value={
                  editAddOns?._id === item._id ? editAddOns.title : item.title
                }
                onChange={(e) => {
                  if (editAddOns?._id === item._id) {
                    setEditAddOns({
                      ...editAddOns,
                      title: e.target.value,
                    });
                  }
                }}
                readOnly={editAddOns?._id !== item._id}
                loading={loading}
                onEdit={() => {
                  if (!loading) {
                    setEditAddOns({
                      ...item,
                    });
                  }
                }}
                onDelete={() => {
                  if (!loading) {
                    deleteAddOns(item._id);
                  }
                }}
                onSave={() => {
                  if (!loading && editAddOns.title) {
                    updateAddOns();
                  }
                }}
                onCancel={() => {
                  setEditAddOns({
                    title: "",
                    _id: "",
                  });
                }}
                showDropdown={true}
                dropdownItems={makeupStyle.map((rec) => (
                  <>
                    <Checkbox
                      checked={item.makeupStyle.includes(rec.title)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateAddOnsAddMakeupStyle(item._id, rec.title);
                        } else {
                          updateAddOnsRemoveMakeupStyle(item._id, rec.title);
                        }
                      }}
                      disabled={loading}
                    />
                    <Label className="ml-2" value={rec.title} />
                  </>
                ))}
              />
            ))}
            {addNewAddOns.display ? (
              <SettingTextInput
                index={-1}
                placeholder={"Title..."}
                value={addNewAddOns.title}
                onChange={(e) => {
                  setAddNewAddOns({
                    ...addNewAddOns,
                    title: e.target.value,
                  });
                }}
                readOnly={false}
                loading={loading}
                onSave={() => {
                  if (!loading && addNewAddOns.title) {
                    addAddOns();
                  }
                }}
                onCancel={() => {
                  setAddNewAddOns({
                    display: false,
                    title: "",
                  });
                }}
              />
            ) : (
              <Button
                color="light"
                onClick={() => {
                  setAddNewAddOns({
                    display: true,
                    title: "",
                  });
                }}
                disabled={loading || addNewAddOns.display || editAddOns._id}
              >
                <BsPlus size={16} /> Add New
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 border-b-2 pb-3">
          <p className="text-xl font-medium">Tags</p>
          <div className="grid grid-cols-4 gap-6">
            {tag?.map((item, index) => (
              <SettingTextInput
                key={index}
                index={index}
                placeholder={"Edit Title"}
                value={editTag?._id === item._id ? editTag.title : item.title}
                onChange={(e) => {
                  if (editTag?._id === item._id) {
                    setEditTag({
                      ...editTag,
                      title: e.target.value,
                    });
                  }
                }}
                readOnly={editTag?._id !== item._id}
                loading={loading}
                onEdit={() => {
                  if (!loading) {
                    setEditTag({
                      ...item,
                    });
                  }
                }}
                onDelete={() => {
                  if (!loading) {
                    deleteTag(item._id);
                  }
                }}
                onSave={() => {
                  if (!loading && editTag.title) {
                    updateTag();
                  }
                }}
                onCancel={() => {
                  setEditTag({
                    title: "",
                    _id: "",
                  });
                }}
              />
            ))}
            {addNewTag.display ? (
              <SettingTextInput
                index={-1}
                placeholder={"Title..."}
                value={addNewTag.title}
                onChange={(e) => {
                  setAddNewTag({
                    ...addNewTag,
                    title: e.target.value,
                  });
                }}
                readOnly={false}
                loading={loading}
                onSave={() => {
                  if (!loading && addNewTag.title) {
                    addTag();
                  }
                }}
                onCancel={() => {
                  setAddNewTag({
                    display: false,
                    title: "",
                  });
                }}
              />
            ) : (
              <Button
                color="light"
                onClick={() => {
                  setAddNewTag({
                    display: true,
                    title: "",
                  });
                }}
                disabled={loading || addNewTag.display || editTag._id}
              >
                <BsPlus size={16} /> Add New
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 border-b-2 pb-3">
          <p className="text-xl font-medium">Speciality</p>
          <div className="grid grid-cols-4 gap-6">
            {speciality?.map((item, index) => (
              <SettingTextInput
                key={index}
                index={index}
                placeholder={"Edit Title"}
                value={
                  editSpeciality?._id === item._id
                    ? editSpeciality.title
                    : item.title
                }
                onChange={(e) => {
                  if (editSpeciality?._id === item._id) {
                    setEditSpeciality({
                      ...editSpeciality,
                      title: e.target.value,
                    });
                  }
                }}
                readOnly={editSpeciality?._id !== item._id}
                loading={loading}
                onEdit={() => {
                  if (!loading) {
                    setEditSpeciality({
                      ...item,
                    });
                  }
                }}
                onDelete={() => {
                  if (!loading) {
                    deleteSpeciality(item._id);
                  }
                }}
                onSave={() => {
                  if (!loading && editSpeciality.title) {
                    updateSpeciality();
                  }
                }}
                onCancel={() => {
                  setEditSpeciality({
                    title: "",
                    _id: "",
                  });
                }}
              />
            ))}
            {addNewSpeciality.display ? (
              <SettingTextInput
                index={-1}
                placeholder={"Title..."}
                value={addNewSpeciality.title}
                onChange={(e) => {
                  setAddNewSpeciality({
                    ...addNewSpeciality,
                    title: e.target.value,
                  });
                }}
                readOnly={false}
                loading={loading}
                onSave={() => {
                  if (!loading && addNewSpeciality.title) {
                    addSpeciality();
                  }
                }}
                onCancel={() => {
                  setAddNewSpeciality({
                    display: false,
                    title: "",
                  });
                }}
              />
            ) : (
              <Button
                color="light"
                onClick={() => {
                  setAddNewSpeciality({
                    display: true,
                    title: "",
                  });
                }}
                disabled={
                  loading || addNewSpeciality.display || editSpeciality._id
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
