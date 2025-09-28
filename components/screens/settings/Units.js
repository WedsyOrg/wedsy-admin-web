import { Button, Label, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { MdDelete, MdEditDocument } from "react-icons/md";

export default function Units({
  message,
  setMessage,
  loading,
  setLoading,
  display,
}) {
  const [units, setUnits] = useState([]);
  const [addNewUnit, setAddNewUnit] = useState({
    display: false,
    title: "",
  });
  const [editUnit, setEditUnit] = useState({
    display: false,
    title: "",
    _id: "",
  });
  const fetchUnits = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/unit`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setUnits(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addUnit = async () => {
    if (addNewUnit.title) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/unit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: addNewUnit.title,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Unit added Successfully!",
              status: "success",
              display: true,
            });
            setAddNewUnit({
              display: false,
              title: "",
            });
            fetchUnits();
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
  const updateUnit = async () => {
    if (editUnit.title) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/unit/${editUnit._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: editUnit.title,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Unit updated Successfully!",
              status: "success",
              display: true,
            });
            setEditUnit({
              display: false,
              title: "",

              _id: "",
            });
            fetchUnits();
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
  const deleteUnit = (_id) => {
    if (_id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/unit/${_id}`, {
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
              text: "Unit deleted added Successfully!",
              status: "success",
              display: true,
            });
            fetchUnits();
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
    if (display === "Units") {
      fetchUnits();
    }
  }, [display]);
  return (
    <>
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-4">
          <p className="text-xl font-medium col-span-3">Units</p>
          <Button
            color="light"
            onClick={() => {
              setAddNewUnit({
                display: true,
                title: "",
              });
            }}
            disabled={loading || addNewUnit.display || editUnit.display}
          >
            <BsPlus size={16} /> Add New
          </Button>
        </div>
        {addNewUnit.display && (
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label value="Title" />
              <TextInput
                placeholder="Title"
                value={addNewUnit.title}
                disabled={loading}
                onChange={(e) => {
                  setAddNewUnit({
                    ...addNewUnit,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div className="place-self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  addUnit();
                }}
                disabled={loading || !addNewUnit.title}
                className="grow"
              >
                Add Unit
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setAddNewUnit({
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
        {editUnit.display && (
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label value="Title" />
              <TextInput
                placeholder="Title"
                value={editUnit.title}
                disabled={loading}
                onChange={(e) => {
                  setEditUnit({
                    ...editUnit,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div className="place-self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  updateUnit();
                }}
                disabled={loading || !editUnit.title}
                className="grow"
              >
                Edit Unit
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setEditUnit({
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
            <Table.HeadCell>Unit</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {units?.map((item, index) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800 font-medium"
                key={index}
              >
                <Table.Cell>{item.title}</Table.Cell>
                <Table.Cell className="flex gap-2">
                  {!loading && !editUnit.display && (
                    <MdEditDocument
                      size={24}
                      cursor={"pointer"}
                      className="hover:text-blue-700"
                      onClick={() => {
                        if (!loading) {
                          setEditUnit({
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
                          deleteUnit(item._id);
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
