import { Button, Label, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { MdDelete, MdEditDocument } from "react-icons/md";

export default function VendorCategory({
  message,
  setMessage,
  loading,
  setLoading,
  display,
}) {
  const [vendorcategory, setVendorCategory] = useState([]);
  const [addNewVendorCategory, setAddNewVendorCategory] = useState({
    display: false,
    title: "",
  });
  const [editVendorCategory, setEditVendorCategory] = useState({
    display: false,
    title: "",
    _id: "",
  });
  const fetchVendorCategory = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor-category`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setVendorCategory(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addVendorCategory = async () => {
    if (addNewVendorCategory.title) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor-category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: addNewVendorCategory.title,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Vendor Category added Successfully!",
              status: "success",
              display: true,
            });
            setAddNewVendorCategory({
              display: false,
              title: "",
            });
            fetchVendorCategory();
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
  const updateVendorCategory = async () => {
    if (editVendorCategory.title) {
      setLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/vendor-category/${editVendorCategory._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: editVendorCategory.title,
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Vendor Category updated Successfully!",
              status: "success",
              display: true,
            });
            setEditVendorCategory({
              display: false,
              title: "",

              _id: "",
            });
            fetchVendorCategory();
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
  const deleteVendorCategory = (_id) => {
    if (_id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor-category/${_id}`, {
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
              text: "Vendor Category deleted added Successfully!",
              status: "success",
              display: true,
            });
            fetchVendorCategory();
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
    if (display === "Vendor Category") {
      fetchVendorCategory();
    }
  }, [display]);
  return (
    <>
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-4">
          <p className="text-xl font-medium col-span-3">Vendor Category</p>
          <Button
            color="light"
            onClick={() => {
              setAddNewVendorCategory({
                display: true,
                title: "",
              });
            }}
            disabled={
              loading ||
              addNewVendorCategory.display ||
              editVendorCategory.display
            }
          >
            <BsPlus size={16} /> Add New
          </Button>
        </div>
        {addNewVendorCategory.display && (
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label value="Title" />
              <TextInput
                placeholder="Title"
                value={addNewVendorCategory.title}
                disabled={loading}
                onChange={(e) => {
                  setAddNewVendorCategory({
                    ...addNewVendorCategory,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div className="place-self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  addVendorCategory();
                }}
                disabled={loading || !addNewVendorCategory.title}
                className="grow"
              >
                Add Vendor Category
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setAddNewVendorCategory({
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
        {editVendorCategory.display && (
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label value="Title" />
              <TextInput
                placeholder="Title"
                value={editVendorCategory.title}
                disabled={loading}
                onChange={(e) => {
                  setEditVendorCategory({
                    ...editVendorCategory,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div className="place-self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  updateVendorCategory();
                }}
                disabled={loading || !editVendorCategory.title}
                className="grow"
              >
                Edit Vendor Category
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setEditVendorCategory({
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
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {vendorcategory?.map((item, index) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800 font-medium"
                key={index}
              >
                <Table.Cell>{item.title}</Table.Cell>
                <Table.Cell className="flex gap-2">
                  {!loading && !editVendorCategory.display && (
                    <MdEditDocument
                      size={24}
                      cursor={"pointer"}
                      className="hover:text-blue-700"
                      onClick={() => {
                        if (!loading) {
                          setEditVendorCategory({
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
                          deleteVendorCategory(item._id);
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
