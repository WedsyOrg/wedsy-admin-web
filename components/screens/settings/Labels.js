import { Button, Label, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { MdDelete, MdEditDocument } from "react-icons/md";

export default function Labels({
  message,
  setMessage,
  loading,
  setLoading,
  display,
}) {
  const [labels, setLabels] = useState([]);
  const [addNewLabel, setAddNewLabel] = useState({
    display: false,
    title: "",
    color: "",
  });
  const [editLabel, setEditLabel] = useState({
    display: false,
    title: "",
    color: "",
    _id: "",
  });
  const fetchLabels = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/label`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setLabels(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addLabel = async () => {
    if (addNewLabel.title && addNewLabel.color) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/label`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: addNewLabel.title,
          color: addNewLabel.color,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Label added Successfully!",
              status: "success",
              display: true,
            });
            setAddNewLabel({
              display: false,
              title: "",
              color: "",
            });
            fetchLabels();
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
  const updateLabel = async () => {
    if (editLabel.title && editLabel.color) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/label/${editLabel._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: editLabel.title,
          color: editLabel.color,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Label updated Successfully!",
              status: "success",
              display: true,
            });
            setEditLabel({
              display: false,
              title: "",
              color: "",
              _id: "",
            });
            fetchLabels();
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
  const deleteLabel = (_id) => {
    if (_id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/label/${_id}`, {
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
              text: "Label deleted added Successfully!",
              status: "success",
              display: true,
            });
            fetchLabels();
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
    if (display === "Labels") {
      fetchLabels();
    }
  }, [display]);
  return (
    <>
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-4">
          <p className="text-xl font-medium col-span-3">Labels</p>
          <Button
            color="light"
            onClick={() => {
              setAddNewLabel({
                display: true,
                title: "",
                color: "",
              });
            }}
            disabled={loading || addNewLabel.display || editLabel.display}
          >
            <BsPlus size={16} /> Add New
          </Button>
        </div>
        {addNewLabel.display && (
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <Label value="Label" />
              <TextInput
                placeholder="Label"
                value={addNewLabel.title}
                disabled={loading}
                onChange={(e) => {
                  setAddNewLabel({
                    ...addNewLabel,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <Label value="Color" />
              <TextInput
                placeholder="Color (Hex Code)"
                value={addNewLabel.color}
                disabled={loading}
                onChange={(e) => {
                  setAddNewLabel({
                    ...addNewLabel,
                    color: e.target.value,
                  });
                }}
              />
            </div>
            <div className="place-self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  addLabel();
                }}
                disabled={loading || !addNewLabel.title || !addNewLabel.color}
                className="grow"
              >
                Add Label
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setAddNewLabel({
                    display: false,
                    title: "",
                    color: "",
                  });
                }}
                disabled={loading}
              >
                <MdDelete size={24} />
              </Button>
            </div>
          </div>
        )}
        {editLabel.display && (
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <Label value="Label" />
              <TextInput
                placeholder="Label"
                value={editLabel.title}
                disabled={loading}
                onChange={(e) => {
                  setEditLabel({
                    ...editLabel,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <Label value="Color" />
              <TextInput
                placeholder="Color (Hex Code)"
                value={editLabel.color}
                disabled={loading}
                onChange={(e) => {
                  setEditLabel({
                    ...editLabel,
                    color: e.target.value,
                  });
                }}
              />
            </div>
            <div className="place-self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  updateLabel();
                }}
                disabled={loading || !editLabel.title || !editLabel.color}
                className="grow"
              >
                Edit Label
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setEditLabel({
                    display: false,
                    title: "",
                    color: "",
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
            <Table.HeadCell>Label</Table.HeadCell>
            <Table.HeadCell>Color</Table.HeadCell>{" "}
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {labels?.map((item, index) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800 font-medium"
                key={index}
              >
                <Table.Cell>{item.title}</Table.Cell>
                <Table.Cell>{item.color}</Table.Cell>
                <Table.Cell className="flex gap-2">
                  {!loading && !editLabel.display && (
                    <MdEditDocument
                      size={24}
                      cursor={"pointer"}
                      className="hover:text-blue-700"
                      onClick={() => {
                        if (!loading) {
                          setEditLabel({
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
                          deleteLabel(item._id);
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
