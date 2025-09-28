import { Button, Label, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { MdDelete, MdEditDocument } from "react-icons/md";

export default function ColorScreen({
  message,
  setMessage,
  loading,
  setLoading,
  display,
}) {
  const [color, setColor] = useState([]);
  const [addNewColor, setAddNewColor] = useState({
    display: false,
    title: "",
  });
  const [editColor, setEditColor] = useState({
    display: false,
    title: "",
    _id: "",
  });
  const fetchColor = () => {
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
        setColor(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addColor = async () => {
    if (addNewColor.title) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/color`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: addNewColor.title,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Color added Successfully!",
              status: "success",
              display: true,
            });
            setAddNewColor({
              display: false,
              title: "",
            });
            fetchColor();
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
  const updateColor = async () => {
    if (editColor.title) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/color/${editColor._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: editColor.title,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Color updated Successfully!",
              status: "success",
              display: true,
            });
            setEditColor({
              display: false,
              title: "",
              _id: "",
            });
            fetchColor();
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
  const deleteColor = (_id) => {
    if (_id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/color/${_id}`, {
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
              text: "Color deleted added Successfully!",
              status: "success",
              display: true,
            });
            fetchColor();
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
    if (display === "Color") {
      fetchColor();
    }
  }, [display]);
  return (
    <>
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-4">
          <p className="text-xl font-medium col-span-3">Color</p>
          <Button
            color="light"
            onClick={() => {
              setAddNewColor({
                display: true,
                title: "",
              });
            }}
            disabled={loading || addNewColor.display || editColor.display}
          >
            <BsPlus size={16} /> Add New
          </Button>
        </div>
        {addNewColor.display && (
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label value="Title" />
              <TextInput
                placeholder="Title"
                value={addNewColor.title}
                disabled={loading}
                onChange={(e) => {
                  setAddNewColor({
                    ...addNewColor,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div className="place-self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  addColor();
                }}
                disabled={loading || !addNewColor.title}
                className="grow"
              >
                Add Color
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setAddNewColor({
                    display: false,
                    title: "",
                  });
                }}
                disabled={loading}
              >
                <MdDelete size={24} />
              </Button>
            </div>
          </div>
        )}
        {editColor.display && (
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label value="Title" />
              <TextInput
                placeholder="Title"
                value={editColor.title}
                disabled={loading}
                onChange={(e) => {
                  setEditColor({
                    ...editColor,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div className="place-self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  updateColor();
                }}
                disabled={loading || !editColor.title}
                className="grow"
              >
                Edit Color
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setEditColor({
                    display: false,
                    title: "",

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
        <Table hoverable className="width-full overflow-x-auto">
          <Table.Head>
            <Table.HeadCell>Color</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {color?.map((item, index) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800 font-medium"
                key={index}
              >
                <Table.Cell>{item.title}</Table.Cell>
                <Table.Cell className="flex gap-2">
                  {!loading && !editColor.display && (
                    <MdEditDocument
                      size={24}
                      cursor={"pointer"}
                      className="hover:text-blue-700"
                      onClick={() => {
                        if (!loading) {
                          setEditColor({
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
                      className="hover:text-blue-700"
                      onClick={() => {
                        if (!loading) {
                          deleteColor(item._id);
                        }
                      }}
                    />
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </>
  );
}
