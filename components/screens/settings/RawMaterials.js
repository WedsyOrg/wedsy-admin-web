import { Button, Label, Select, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { MdDelete, MdEditDocument } from "react-icons/md";

export default function RawMaterials({
  message,
  setMessage,
  loading,
  setLoading,
  display,
}) {
  const [units, setUnits] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [addNewRawMaterial, setAddNewRawMaterial] = useState({
    display: false,
    name: "",
    unit: "",
    price: 0,
  });
  const [editRawMaterial, setEditRawMaterial] = useState({
    display: false,
    name: "",
    unit: "",
    price: 0,
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
  const fetchRawMaterials = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/raw-material`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setRawMaterials(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addRawMaterial = async () => {
    if (
      addNewRawMaterial.name &&
      addNewRawMaterial.unit &&
      addNewRawMaterial.price
    ) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/raw-material`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: addNewRawMaterial.name,
          unit: addNewRawMaterial.unit,
          price: addNewRawMaterial.price,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Raw Material added Successfully!",
              status: "success",
              display: true,
            });
            setAddNewRawMaterial({
              display: false,
              name: "",
              unit: "",
              price: 0,
            });
            fetchRawMaterials();
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
  const updateRawMaterial = async () => {
    if (editRawMaterial.name && editRawMaterial.unit && editRawMaterial.price) {
      setLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/raw-material/${editRawMaterial._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: editRawMaterial.name,
            unit: editRawMaterial.unit,
            price: editRawMaterial.price,
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Raw Material updated Successfully!",
              status: "success",
              display: true,
            });
            setEditRawMaterial({
              display: false,
              name: "",
              unit: "",
              price: 0,
              _id: "",
            });
            fetchRawMaterials();
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
  const deleteRawMaterial = (_id) => {
    if (_id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/raw-material/${_id}`, {
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
              text: "Raw Material deleted added Successfully!",
              status: "success",
              display: true,
            });
            fetchRawMaterials();
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
    if (display === "Raw-Materials") {
      fetchRawMaterials();
      fetchUnits();
    }
  }, [display]);
  return (
    <>
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-4">
          <p className="text-xl font-medium col-span-3">Raw Materials</p>
          <Button
            color="light"
            onClick={() => {
              setAddNewRawMaterial({
                display: true,
                name: "",
                unit: "",
                price: 0,
              });
            }}
            disabled={
              loading || addNewRawMaterial.display || editRawMaterial.display
            }
          >
            <BsPlus size={16} /> Add New
          </Button>
        </div>
        {addNewRawMaterial.display && (
          <div className="grid grid-cols-4 gap-4">
            <div className="">
              <Label value="Name" />
              <TextInput
                placeholder="Name"
                value={addNewRawMaterial.name}
                disabled={loading}
                onChange={(e) => {
                  setAddNewRawMaterial({
                    ...addNewRawMaterial,
                    name: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <Label value="Unit" />
              <Select
                value={addNewRawMaterial.unit}
                disabled={loading}
                onChange={(e) => {
                  setAddNewRawMaterial({
                    ...addNewRawMaterial,
                    unit: e.target.value,
                  });
                }}
              >
                <option value={""}>Select Option</option>
                {units?.map((item) => (
                  <option value={item.title} key={item._id}>
                    {item.title}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label value="Price" />
              <TextInput
                type="number"
                placeholder="Price"
                value={addNewRawMaterial.price}
                disabled={loading}
                onChange={(e) => {
                  setAddNewRawMaterial({
                    ...addNewRawMaterial,
                    price: parseInt(e.target.value) || 0,
                  });
                }}
              />
            </div>
            <div className="place-self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  addRawMaterial();
                }}
                disabled={
                  loading ||
                  !addNewRawMaterial.name ||
                  !addNewRawMaterial.unit ||
                  !addNewRawMaterial.price
                }
                className="grow"
              >
                Add Raw Material
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setAddNewRawMaterial({
                    display: false,
                    name: "",
                    unit: "",
                    price: 0,
                  });
                }}
                disabled={loading}
              >
                <MdDelete size={24} />
              </Button>
            </div>
          </div>
        )}
        {editRawMaterial.display && (
          <div className="grid grid-cols-4 gap-4">
            <div className="">
              <Label value="Name" />
              <TextInput
                placeholder="Name"
                value={editRawMaterial.name}
                disabled={loading}
                onChange={(e) => {
                  setEditRawMaterial({
                    ...editRawMaterial,
                    name: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <Label value="Unit" />
              <Select
                value={editRawMaterial.unit}
                disabled={loading}
                onChange={(e) => {
                  setEditRawMaterial({
                    ...editRawMaterial,
                    unit: e.target.value,
                  });
                }}
              >
                <option value={""}>Select Option</option>
                {units?.map((item) => (
                  <option value={item.title} key={item._id}>
                    {item.title}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label value="Price" />
              <TextInput
                placeholder="Price"
                value={editRawMaterial.price}
                disabled={loading}
                onChange={(e) => {
                  setEditRawMaterial({
                    ...editRawMaterial,
                    price: parseInt(e.target.value) || 0,
                  });
                }}
              />
            </div>
            <div className="place-self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  updateRawMaterial();
                }}
                disabled={
                  loading ||
                  !editRawMaterial.name ||
                  !editRawMaterial.unit ||
                  !editRawMaterial.price
                }
                className="grow"
              >
                Edit Raw Material
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setEditRawMaterial({
                    display: false,
                    name: "",
                    unit: "",
                    price: 0,
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
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Unit</Table.HeadCell>
            <Table.HeadCell>Price</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {rawMaterials?.map((item, index) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800 font-medium"
                key={index}
              >
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.unit}</Table.Cell>
                <Table.Cell>{item.price}</Table.Cell>
                <Table.Cell className="flex gap-2">
                  {!loading && !editRawMaterial.display && (
                    <MdEditDocument
                      size={24}
                      cursor={"pointer"}
                      className="hover:text-blue-700"
                      onClick={() => {
                        if (!loading) {
                          setEditRawMaterial({
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
                          deleteRawMaterial(item._id);
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
