import {
  Button,
  FileInput,
  Label,
  Select,
  Table,
  TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { MdDelete, MdEditDocument } from "react-icons/md";

export default function ProductType({ message, setMessage }) {
  const [loading, setLoading] = useState(false);
  const [productType, setProductType] = useState([]);
  const [addNewProductType, setAddNewProductType] = useState({
    display: false,
    title: "",
    info: "",
  });
  const [editProductType, setEditProductType] = useState({
    display: false,
    title: "",
    info: "",
    _id: "",
  });
  const fetchProductType = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-type`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setProductType(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addProductType = async () => {
    if (addNewProductType.title) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-type`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(addNewProductType),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Price Type added Successfully!",
              status: "success",
              display: true,
            });
            setAddNewProductType({
              display: false,
              title: "",
              info: "",
            });
            fetchProductType();
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
  const updateProductType = async () => {
    if (editProductType.title) {
      setLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product-type/${editProductType._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(editProductType),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Price Type updated Successfully!",
              status: "success",
              display: true,
            });
            setEditProductType({
              display: false,
              title: "",
              info: "",
              _id: "",
            });
            fetchProductType();
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
  const deleteProductType = (_id) => {
    if (_id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-type/${_id}`, {
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
              text: "Price Type deleted added Successfully!",
              status: "success",
              display: true,
            });
            fetchProductType();
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
    fetchProductType();
  }, []);
  return (
    <div className="p-8 w-full">
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-4">
          <p className="text-xl font-medium col-span-3">
            Price Type(Product Type)
          </p>
          <Button
            color="light"
            onClick={() => {
              setAddNewProductType({
                display: true,
                title: "",
                info: "",
              });
            }}
            disabled={
              loading || addNewProductType.display || editProductType.display
            }
          >
            <BsPlus size={16} /> Add New
          </Button>
        </div>
        {addNewProductType.display && (
          <div className="grid grid-cols-3 gap-4">
            <div className="">
              <Label value="Title" />
              <TextInput
                placeholder="Title"
                value={addNewProductType.title}
                disabled={loading}
                onChange={(e) => {
                  setAddNewProductType({
                    ...addNewProductType,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div className="">
              <Label value="Info" />
              <TextInput
                placeholder="Info"
                value={addNewProductType.info}
                disabled={loading}
                onChange={(e) => {
                  setAddNewProductType({
                    ...addNewProductType,
                    info: e.target.value,
                  });
                }}
              />
            </div>
            <div className="place-self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  addProductType();
                }}
                disabled={loading || !addNewProductType.title}
                className="grow"
              >
                Add Price Type
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setAddNewProductType({
                    display: false,
                    title: "",
                    info: "",
                  });
                }}
                disabled={loading}
              >
                <MdDelete size={24} />
              </Button>
            </div>
          </div>
        )}
        {editProductType.display && (
          <div className="grid grid-cols-3 gap-4">
            <div className="">
              <Label value="Title" />
              <TextInput
                placeholder="Title"
                value={editProductType.title}
                disabled={loading}
                onChange={(e) => {
                  setEditProductType({
                    ...editProductType,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div className="">
              <Label value="Info" />
              <TextInput
                placeholder="Info"
                value={editProductType.info}
                disabled={loading}
                onChange={(e) => {
                  setEditProductType({
                    ...editProductType,
                    info: e.target.value,
                  });
                }}
              />
            </div>
            <div className="place self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  updateProductType();
                }}
                disabled={loading || !editProductType.title}
                className="grow"
              >
                Edit Price Type
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setEditProductType({
                    display: false,
                    title: "",
                    info: "",
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
            <Table.HeadCell>Title</Table.HeadCell>
            <Table.HeadCell>Info</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {productType?.map((item, index) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800 font-medium"
                key={index}
              >
                <Table.Cell>{item.title}</Table.Cell>
                <Table.Cell>{item.info}</Table.Cell>
                <Table.Cell className="flex gap-2">
                  {!loading && !editProductType.display && (
                    <MdEditDocument
                      size={24}
                      cursor={"pointer"}
                      className="hover:text-blue-700"
                      onClick={() => {
                        if (!loading) {
                          setEditProductType({
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
                          deleteProductType(item._id);
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
    </div>
  );
}
