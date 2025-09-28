import { Button, Label, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { MdDelete, MdEditDocument } from "react-icons/md";

export default function Attributes({ message, setMessage }) {
  const [loading, setLoading] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const [addNewAttribute, setAddNewAttribute] = useState({
    display: false,
    name: "",
  });
  const [editAttribute, setEditAttribute] = useState({
    display: false,
    name: "",
    _id: "",
  });
  const [addNewValue, setAddNewValue] = useState({
    display: false,
    value: "",
    _id: "",
  });
  const [selectedAttribute, setSelectedAttribute] = useState({ _id: "" });
  const fetchAttributes = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/attribute`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        let temp = response.find((item) => item._id == selectedAttribute._id);
        if (temp?._id) {
          setSelectedAttribute(temp);
        } else {
          setSelectedAttribute({ _id: "" });
        }
        setLoading(false);
        setAttributes(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addAttribute = async () => {
    if (addNewAttribute.name) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/attribute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: addNewAttribute.name,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Attribute added Successfully!",
              status: "success",
              display: true,
            });
            setAddNewAttribute({
              display: false,
              name: "",
            });
            fetchAttributes();
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
  const updateAttribute = async () => {
    if (editAttribute.name) {
      setLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/attribute/${editAttribute._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: editAttribute.name,
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Attribute updated Successfully!",
              status: "success",
              display: true,
            });
            setEditAttribute({
              display: false,
              name: "",
              _id: "",
            });
            fetchAttributes();
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
  const addAttributeItem = async () => {
    if (addNewValue.value) {
      setLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/attribute/${addNewValue._id}/add`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            item: addNewValue.value,
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Attribute updated Successfully!",
              status: "success",
              display: true,
            });
            setAddNewValue({
              display: false,
              value: "",
              _id: "",
            });
            fetchAttributes();
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
  const removeAttributeItem = async (_id, item) => {
    if (_id && item) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/attribute/${_id}/remove`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          item,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Attribute updated Successfully!",
              status: "success",
              display: true,
            });
            fetchAttributes();
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
  const deleteAttribute = (_id) => {
    if (_id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/attribute/${_id}`, {
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
              text: "Attribute deleted added Successfully!",
              status: "success",
              display: true,
            });
            fetchAttributes();
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
    fetchAttributes();
  }, []);
  return (
    <div className="p-8 w-full">
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-4">
          <p className="text-xl font-medium col-span-3">Attributes</p>
          <Button
            color="light"
            onClick={() => {
              setAddNewAttribute({
                display: true,
                name: "",
              });
            }}
            disabled={
              loading || addNewAttribute.display || editAttribute.display
            }
          >
            <BsPlus size={16} /> Add New
          </Button>
        </div>
        {addNewAttribute.display && (
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label value="Name" />
              <TextInput
                placeholder="Name"
                value={addNewAttribute.name}
                disabled={loading}
                onChange={(e) => {
                  setAddNewAttribute({
                    ...addNewAttribute,
                    name: e.target.value,
                  });
                }}
              />
            </div>
            <div className="place-self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  addAttribute();
                }}
                disabled={loading || !addNewAttribute.name}
                className="grow"
              >
                Add Attribute
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setAddNewAttribute({
                    display: false,
                    name: "",
                  });
                }}
                disabled={loading}
              >
                <MdDelete size={24} />
              </Button>
            </div>
          </div>
        )}
        {editAttribute.display && (
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label value="Name" />
              <TextInput
                placeholder="Name"
                value={editAttribute.name}
                disabled={loading}
                onChange={(e) => {
                  setEditAttribute({
                    ...editAttribute,
                    name: e.target.value,
                  });
                }}
              />
            </div>
            <div className="place self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  updateAttribute();
                }}
                disabled={loading || !editAttribute.name}
                className="grow"
              >
                Edit Attribute
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setEditAttribute({
                    display: false,
                    name: "",

                    _id: "",
                  });
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        <div className="grid grid-cols-4">
          <div className="flex flex-col">
            {attributes.map((item) => (
              <div
                className={`flex flex-row gap-2 pr-2 items-center border ${
                  selectedAttribute._id === item._id ? "bg-blue-100" : ""
                } cursor-pointer hover:bg-blue-200`}
                key={item._id}
                onClick={() => {
                  setSelectedAttribute(item);
                }}
              >
                <span
                  className={`w-2 mr-2 h-full ${
                    selectedAttribute._id === item._id ? "bg-blue-500" : ""
                  }`}
                />
                <span className="py-2 mr-auto">{item.name}</span>
                {!loading && !editAttribute.display && (
                  <MdEditDocument
                    size={24}
                    cursor={"pointer"}
                    className="text-gray-500 hover:text-blue-700"
                    onClick={() => {
                      if (!loading) {
                        setEditAttribute({
                          ...item,
                          display: true,
                        });
                      }
                    }}
                  />
                )}
                {!loading && (
                  <MdDelete
                    size={24}
                    cursor={"pointer"}
                    className="text-gray-500 hover:text-blue-700"
                    onClick={() => {
                      if (!loading) {
                        deleteAttribute(item._id);
                      }
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          {selectedAttribute._id && (
            <div className="col-span-3 p-4 bg-blue-100 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label value="Attribute" />
                  <TextInput value={selectedAttribute.name} readOnly={true} />
                </div>
              </div>
              <div className="grid grid-cols-2  gap-2 items-end">
                <div className="flex flex-col gap-2">
                  <Label value="Attribute Values" />
                  {addNewValue.display &&
                  addNewValue._id === selectedAttribute._id ? (
                    <TextInput
                      placeholder="Value"
                      value={addNewValue.value}
                      disabled={loading}
                      onChange={(e) => {
                        setAddNewValue({
                          ...addNewValue,
                          value: e.target.value,
                        });
                      }}
                    />
                  ) : (
                    <Button
                      color="light"
                      onClick={() => {
                        setAddNewValue({
                          display: true,
                          value: "",
                          _id: selectedAttribute._id,
                        });
                      }}
                      disabled={loading}
                    >
                      <BsPlus size={16} /> Add New
                    </Button>
                  )}
                </div>
                {addNewValue.display &&
                  addNewValue._id === selectedAttribute._id && (
                    <div className="place self-end w-full flex flex-row gap-3">
                      <Button
                        color="success"
                        onClick={() => {
                          addAttributeItem();
                        }}
                        disabled={loading || !addNewValue.value}
                        className="grow"
                      >
                        Add Value
                      </Button>
                      <Button
                        color="failure"
                        onClick={() => {
                          setAddNewValue({
                            display: false,
                            value: "",
                            _id: "",
                          });
                        }}
                        disabled={loading}
                      >
                        <MdDelete size={24} />
                      </Button>
                    </div>
                  )}
              </div>
              <div className="flex flex-col gap-2">
                {selectedAttribute?.list?.map((rec, recIndex) => (
                  <div
                    className="grid grid-cols-2 gap-2 items-center"
                    key={recIndex}
                  >
                    <TextInput value={rec} readOnly={true} />
                    <MdDelete
                      size={24}
                      cursor={"pointer"}
                      className="text-gray-500 hover:text-blue-700"
                      onClick={() => {
                        if (!loading) {
                          removeAttributeItem(selectedAttribute._id, rec);
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
