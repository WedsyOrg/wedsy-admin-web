import { uploadFile } from "@/utils/file";
import { toProperCase } from "@/utils/text";
import {
  Button,
  FileInput,
  Label,
  Select,
  Table,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { MdDelete, MdEditDocument } from "react-icons/md";

export default function Categories({ message, setMessage }) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [addOns, setAddOns] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [imageFiles, setImageFiles] = useState({
    squareImage: "",
    portaitImage: "",
    landscapeImage: "",
  });
  const [addNewCategory, setAddNewCategory] = useState({
    display: false,
    name: "",
    order: -1,
    status: false,
    platformAllowed: false,
    flooringAllowed: false,
    multipleAllowed: false,
    images: { squareImage: "", portaitImage: "", landscapeImage: "" },
    attributes: [],
    addOns: [],
    productTypes: [],
    adminEventToolView: "",
    websiteView: "",
  });
  const [editCategory, setEditCategory] = useState({
    display: false,
    name: "",
    order: -1,
    status: false,
    platformAllowed: false,
    flooringAllowed: false,
    multipleAllowed: false,
    images: { squareImage: "", portaitImage: "", landscapeImage: "" },
    attributes: [],
    addOns: [],
    productTypes: [],
    adminEventToolView: "",
    websiteView: "",
    _id: "",
  });
  const fetchAddOns = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/add-on`, {
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
  const fetchProductTypes = () => {
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
        setProductTypes(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
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
        setLoading(false);
        setAttributes(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchCategories = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setCategories(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addCategory = async () => {
    if (addNewCategory.name) {
      setLoading(true);
      let tempData = addNewCategory;
      if (imageFiles.squareImage) {
        tempData.images.squareImage = await uploadFile({
          file: imageFiles.squareImage,
          path: "decor-images/categories",
          id: `${new Date().getTime()}-squareImage-${tempData.name
            .substring(0, 10)
            .replace(/[^a-zA-Z0-9]/g, "-")}`,
        });
      }
      if (imageFiles.landscapeImage) {
        tempData.images.landscapeImage = await uploadFile({
          file: imageFiles.landscapeImage,
          path: "decor-images/categories",
          id: `${new Date().getTime()}-landscapeImage-${tempData.name
            .substring(0, 10)
            .replace(/[^a-zA-Z0-9]/g, "-")}`,
        });
      }
      if (imageFiles.portaitImage) {
        tempData.images.portaitImage = await uploadFile({
          file: imageFiles.portaitImage,
          path: "decor-images/categories",
          id: `${new Date().getTime()}-portaitImage-${tempData.name
            .substring(0, 10)
            .replace(/[^a-zA-Z0-9]/g, "-")}`,
        });
      }
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(tempData),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Category added Successfully!",
              status: "success",
              display: true,
            });
            setImageFiles({
              squareImage: "",
              portaitImage: "",
              landscapeImage: "",
            });
            setAddNewCategory({
              display: false,
              name: "",
              order: -1,
              status: false,
              platformAllowed: false,
              flooringAllowed: false,
              multipleAllowed: false,
              images: { squareImage: "", portaitImage: "", landscapeImage: "" },
              attributes: [],
              addOns: [],
              productTypes: [],
              adminEventToolView: "",
              websiteView: "",
            });
            fetchCategories();
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
  const updateCategory = async () => {
    if (editCategory.name) {
      setLoading(true);
      let tempData = editCategory;
      if (imageFiles.squareImage) {
        tempData.images.squareImage = await uploadFile({
          file: imageFiles.squareImage,
          path: "decor-images/categories",
          id: `${new Date().getTime()}-squareImage-${tempData.name
            .substring(0, 10)
            .replace(/[^a-zA-Z0-9]/g, "-")}`,
        });
      }
      if (imageFiles.landscapeImage) {
        tempData.images.landscapeImage = await uploadFile({
          file: imageFiles.landscapeImage,
          path: "decor-images/categories",
          id: `${new Date().getTime()}-landscapeImage-${tempData.name
            .substring(0, 10)
            .replace(/[^a-zA-Z0-9]/g, "-")}`,
        });
      }
      if (imageFiles.portaitImage) {
        tempData.images.portaitImage = await uploadFile({
          file: imageFiles.portaitImage,
          path: "decor-images/categories",
          id: `${new Date().getTime()}-portaitImage-${tempData.name
            .substring(0, 10)
            .replace(/[^a-zA-Z0-9]/g, "-")}`,
        });
      }
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/${editCategory._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(tempData),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Category updated Successfully!",
              status: "success",
              display: true,
            });
            setImageFiles({
              squareImage: "",
              portaitImage: "",
              landscapeImage: "",
            });
            setEditCategory({
              display: false,
              name: "",
              order: -1,
              status: false,
              platformAllowed: false,
              flooringAllowed: false,
              multipleAllowed: false,
              images: { squareImage: "", portaitImage: "", landscapeImage: "" },
              attributes: [],
              addOns: [],
              productTypes: [],
              adminEventToolView: "",
              websiteView: "",
              _id: "",
            });
            fetchCategories();
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
  const deleteCategory = (_id) => {
    if (_id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/${_id}`, {
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
              text: "Category deleted added Successfully!",
              status: "success",
              display: true,
            });
            fetchCategories();
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
    fetchCategories();
    fetchAddOns();
    fetchAttributes();
    fetchProductTypes();
  }, []);
  return (
    <div className="p-8 w-full">
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-4">
          <p className="text-xl font-medium col-span-3">Categories</p>
          <Button
            color="light"
            onClick={() => {
              setImageFiles({
                squareImage: "",
                portaitImage: "",
                landscapeImage: "",
              });
              setAddNewCategory({
                display: true,
                name: "",
                order: -1,
                status: false,
                platformAllowed: false,
                flooringAllowed: false,
                multipleAllowed: false,
                images: {
                  squareImage: "",
                  portaitImage: "",
                  landscapeImage: "",
                },
                attributes: [],
                addOns: [],
                productTypes: [],
                adminEventToolView: "",
                websiteView: "",
              });
            }}
            disabled={loading || addNewCategory.display || editCategory.display}
          >
            <BsPlus size={16} /> Add New
          </Button>
        </div>
        {addNewCategory.display && (
          <div className="grid grid-cols-3 gap-4">
            <div className="">
              <Label value="Name" />
              <TextInput
                placeholder="Name"
                value={addNewCategory.name}
                disabled={loading}
                onChange={(e) => {
                  setAddNewCategory({
                    ...addNewCategory,
                    name: e.target.value,
                  });
                }}
              />
            </div>
            <div className="flex flex-row gap-3">
              <div className="">
                <Label value="Order" />
                <TextInput
                  type="number"
                  placeholder="Order"
                  value={addNewCategory.order}
                  disabled={loading}
                  onChange={(e) => {
                    setAddNewCategory({
                      ...addNewCategory,
                      order: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="">
                <Label value="Status" />
                <ToggleSwitch
                  checked={addNewCategory.status}
                  disabled={loading}
                  onChange={(e) => {
                    setAddNewCategory({
                      ...addNewCategory,
                      status: e,
                    });
                  }}
                />
              </div>
            </div>
            <div className="place-self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  addCategory();
                }}
                disabled={loading || !addNewCategory.name}
                className="grow"
              >
                Add Category
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setImageFiles({
                    squareImage: "",
                    portaitImage: "",
                    landscapeImage: "",
                  });
                  setAddNewCategory({
                    display: false,
                    name: "",
                    order: -1,
                    status: false,
                    platformAllowed: false,
                    flooringAllowed: false,
                    multipleAllowed: false,
                    images: {
                      squareImage: "",
                      portaitImage: "",
                      landscapeImage: "",
                    },
                    attributes: [],
                    addOns: [],
                    productTypes: [],
                    adminEventToolView: "",
                    websiteView: "",
                  });
                }}
                disabled={loading}
              >
                <MdDelete size={24} />
              </Button>
            </div>
            <div className="">
              <Label value="Square Image" />
              <FileInput
                disabled={loading}
                onChange={(e) => {
                  setImageFiles({
                    ...imageFiles,
                    squareImage: e.target.files[0],
                  });
                }}
              />
            </div>
            <div className="">
              <Label value="Landscape Image" />
              <FileInput
                disabled={loading}
                onChange={(e) => {
                  setImageFiles({
                    ...imageFiles,
                    landscapeImage: e.target.files[0],
                  });
                }}
              />
            </div>
            <div className="">
              <Label value="Potrait Image" />
              <FileInput
                disabled={loading}
                onChange={(e) => {
                  setImageFiles({
                    ...imageFiles,
                    portaitImage: e.target.files[0],
                  });
                }}
              />
            </div>
            <div className="flex gap-3 flex-row items-center">
              <Label value="Platform Allowed?:" />
              <ToggleSwitch
                checked={addNewCategory.platformAllowed}
                disabled={loading}
                onChange={(e) => {
                  setAddNewCategory({
                    ...addNewCategory,
                    platformAllowed: e,
                  });
                }}
              />
            </div>
            <div className="flex gap-3 flex-row items-center">
              <Label value="Flooring Allowed?:" />
              <ToggleSwitch
                checked={addNewCategory.flooringAllowed}
                disabled={loading}
                onChange={(e) => {
                  setAddNewCategory({
                    ...addNewCategory,
                    flooringAllowed: e,
                  });
                }}
              />
            </div>
            <div className="flex gap-3 flex-row items-center">
              <Label value="Multiple Allowed?:" />
              <ToggleSwitch
                checked={addNewCategory.multipleAllowed}
                disabled={loading}
                onChange={(e) => {
                  setAddNewCategory({
                    ...addNewCategory,
                    multipleAllowed: e,
                  });
                }}
              />
            </div>
            <div className="">
              <Label value="Admin Event Tool View:" />
              <Select
                value={addNewCategory.adminEventToolView}
                disabled={loading}
                onChange={(e) => {
                  setAddNewCategory({
                    ...addNewCategory,
                    adminEventToolView: e.target.value,
                  });
                }}
              >
                <option value={""}>Select View</option>
                <option value={"single"}>Single View</option>
                <option value={"group"}>Group View</option>
              </Select>
            </div>
            <div className="">
              <Label value="Website View:" />
              <Select
                value={addNewCategory.websiteView}
                disabled={loading}
                onChange={(e) => {
                  setAddNewCategory({
                    ...addNewCategory,
                    websiteView: e.target.value,
                  });
                }}
              >
                <option value={""}>Select View</option>
                <option value={"single"}>Single View</option>
                <option value={"multiple"}>Multiple View</option>
              </Select>
            </div>
            <div className="col-span-3 flex flex-col gap-3 border-t border-t-black py-2">
              <Label value="Select Attributes" />
              <div className="flex flex-row gap-2 flex-wrap">
                {attributes.map((item, index) => (
                  <Button
                    color={
                      addNewCategory.attributes.includes(item.name)
                        ? "success"
                        : "gray"
                    }
                    key={index}
                    className=""
                    onClick={() => {
                      if (addNewCategory.attributes.includes(item.name)) {
                        setAddNewCategory({
                          ...addNewCategory,
                          attributes: addNewCategory.attributes.filter(
                            (i) => i !== item.name
                          ),
                        });
                      } else {
                        setAddNewCategory({
                          ...addNewCategory,
                          attributes: [...addNewCategory.attributes, item.name],
                        });
                      }
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className="col-span-3 flex flex-col gap-3 border-t border-t-black py-2">
              <Label value="Select Add Ons" />
              <div className="flex flex-row gap-2 flex-wrap">
                {addOns.map((item, index) => (
                  <Button
                    color={
                      addNewCategory.addOns.includes(item.name)
                        ? "success"
                        : "gray"
                    }
                    key={index}
                    className=""
                    onClick={() => {
                      if (addNewCategory.addOns.includes(item.name)) {
                        setAddNewCategory({
                          ...addNewCategory,
                          addOns: addNewCategory.addOns.filter(
                            (i) => i !== item.name
                          ),
                        });
                      } else {
                        setAddNewCategory({
                          ...addNewCategory,
                          addOns: [...addNewCategory.addOns, item.name],
                        });
                      }
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className="col-span-3 flex flex-col gap-3 border-t border-t-black py-2">
              <Label value="Select Price Type(Product Type)" />
              <div className="flex flex-row gap-2 flex-wrap">
                {productTypes.map((item, index) => (
                  <Button
                    color={
                      addNewCategory.productTypes.includes(item.title)
                        ? "success"
                        : "gray"
                    }
                    key={index}
                    className=""
                    onClick={() => {
                      if (addNewCategory.productTypes.includes(item.title)) {
                        setAddNewCategory({
                          ...addNewCategory,
                          productTypes: addNewCategory.productTypes.filter(
                            (i) => i !== item.title
                          ),
                        });
                      } else {
                        setAddNewCategory({
                          ...addNewCategory,
                          productTypes: [
                            ...addNewCategory.productTypes,
                            item.title,
                          ],
                        });
                      }
                    }}
                  >
                    {item.title}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
        {editCategory.display && (
          <div className="grid grid-cols-3 gap-4">
            <div className="">
              <Label value="Name" />
              <TextInput
                placeholder="Name"
                value={editCategory.name}
                disabled={loading}
                onChange={(e) => {
                  setEditCategory({
                    ...editCategory,
                    name: e.target.value,
                  });
                }}
              />
            </div>
            <div className="flex flex-row gap-3">
              <div className="">
                <Label value="Order" />
                <TextInput
                  type="number"
                  placeholder="Order"
                  value={editCategory.order}
                  disabled={loading}
                  onChange={(e) => {
                    setEditCategory({
                      ...editCategory,
                      order: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="">
                <Label value="Status" />
                <ToggleSwitch
                  checked={editCategory.status}
                  disabled={loading}
                  onChange={(e) => {
                    setEditCategory({
                      ...editCategory,
                      status: e,
                    });
                  }}
                />
              </div>
            </div>
            <div className="place self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  updateCategory();
                }}
                disabled={loading || !editCategory.name}
                className="grow"
              >
                Edit Category
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setImageFiles({
                    squareImage: "",
                    portaitImage: "",
                    landscapeImage: "",
                  });
                  setEditCategory({
                    display: false,
                    name: "",
                    order: -1,
                    status: false,
                    platformAllowed: false,
                    flooringAllowed: false,
                    multipleAllowed: false,
                    images: {
                      squareImage: "",
                      portaitImage: "",
                      landscapeImage: "",
                    },
                    attributes: [],
                    addOns: [],
                    productTypes: [],
                    adminEventToolView: "",
                    websiteView: "",
                    _id: "",
                  });
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
            <div className="">
              <Label value="Square Image" />
              <FileInput
                disabled={loading}
                onChange={(e) => {
                  setImageFiles({
                    ...imageFiles,
                    squareImage: e.target.files[0],
                  });
                }}
              />
            </div>
            <div className="">
              <Label value="Landscape Image" />
              <FileInput
                disabled={loading}
                onChange={(e) => {
                  setImageFiles({
                    ...imageFiles,
                    landscapeImage: e.target.files[0],
                  });
                }}
              />
            </div>
            <div className="">
              <Label value="Potrait Image" />
              <FileInput
                disabled={loading}
                onChange={(e) => {
                  setImageFiles({
                    ...imageFiles,
                    portaitImage: e.target.files[0],
                  });
                }}
              />
            </div>
            <div className="flex gap-3 flex-row items-center">
              <Label value="Platform Allowed?:" />
              <ToggleSwitch
                checked={editCategory.platformAllowed}
                disabled={loading}
                onChange={(e) => {
                  setEditCategory({
                    ...editCategory,
                    platformAllowed: e,
                  });
                }}
              />
            </div>
            <div className="flex gap-3 flex-row items-center">
              <Label value="Flooring Allowed?:" />
              <ToggleSwitch
                checked={editCategory.flooringAllowed}
                disabled={loading}
                onChange={(e) => {
                  setEditCategory({
                    ...editCategory,
                    flooringAllowed: e,
                  });
                }}
              />
            </div>
            <div className="flex gap-3 flex-row items-center">
              <Label value="Multiple Allowed?:" />
              <ToggleSwitch
                checked={editCategory.multipleAllowed}
                disabled={loading}
                onChange={(e) => {
                  setEditCategory({
                    ...editCategory,
                    multipleAllowed: e,
                  });
                }}
              />
            </div>
            <div className="">
              <Label value="Admin Event Tool View:" />
              <Select
                value={editCategory.adminEventToolView}
                disabled={loading}
                onChange={(e) => {
                  setEditCategory({
                    ...editCategory,
                    adminEventToolView: e.target.value,
                  });
                }}
              >
                <option value={""}>Select View</option>
                <option value={"single"}>Single View</option>
                <option value={"group"}>Group View</option>
              </Select>
            </div>
            <div className="">
              <Label value="Website View:" />
              <Select
                value={editCategory.websiteView}
                disabled={loading}
                onChange={(e) => {
                  setEditCategory({
                    ...editCategory,
                    websiteView: e.target.value,
                  });
                }}
              >
                <option value={""}>Select View</option>
                <option value={"single"}>Single View</option>
                <option value={"multiple"}>Multiple View</option>
              </Select>
            </div>
            <div className="col-span-3 flex flex-col gap-3 border-t border-t-black py-2">
              <Label value="Select Attributes" />
              <div className="flex flex-row gap-2 flex-wrap">
                {attributes.map((item, index) => (
                  <Button
                    color={
                      editCategory.attributes.includes(item.name)
                        ? "success"
                        : "gray"
                    }
                    key={index}
                    className=""
                    onClick={() => {
                      if (editCategory.attributes.includes(item.name)) {
                        setEditCategory({
                          ...editCategory,
                          attributes: editCategory.attributes.filter(
                            (i) => i !== item.name
                          ),
                        });
                      } else {
                        setEditCategory({
                          ...editCategory,
                          attributes: [...editCategory.attributes, item.name],
                        });
                      }
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className="col-span-3 flex flex-col gap-3 border-t border-t-black py-2">
              <Label value="Select Add Ons" />
              <div className="flex flex-row gap-2 flex-wrap">
                {addOns.map((item, index) => (
                  <Button
                    color={
                      editCategory.addOns.includes(item.name)
                        ? "success"
                        : "gray"
                    }
                    key={index}
                    className=""
                    onClick={() => {
                      if (editCategory.addOns.includes(item.name)) {
                        setEditCategory({
                          ...editCategory,
                          addOns: editCategory.addOns.filter(
                            (i) => i !== item.name
                          ),
                        });
                      } else {
                        setEditCategory({
                          ...editCategory,
                          addOns: [...editCategory.addOns, item.name],
                        });
                      }
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className="col-span-3 flex flex-col gap-3 border-t border-t-black py-2">
              <Label value="Select Price Type(Product Type)" />
              <div className="flex flex-row gap-2 flex-wrap">
                {productTypes.map((item, index) => (
                  <Button
                    color={
                      editCategory.productTypes.includes(item.title)
                        ? "success"
                        : "gray"
                    }
                    key={index}
                    className=""
                    onClick={() => {
                      if (editCategory.productTypes.includes(item.title)) {
                        setEditCategory({
                          ...editCategory,
                          productTypes: editCategory.productTypes.filter(
                            (i) => i !== item.title
                          ),
                        });
                      } else {
                        setEditCategory({
                          ...editCategory,
                          productTypes: [
                            ...editCategory.productTypes,
                            item.title,
                          ],
                        });
                      }
                    }}
                  >
                    {item.title}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
        <Table hoverable className="width-full overflow-x-auto">
          <Table.Head>
            <Table.HeadCell>Images</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Info</Table.HeadCell>
            <Table.HeadCell>Order</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {categories?.map((item, index) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800 font-medium"
                key={index}
              >
                <Table.Cell className="flex flex-row gap-2">
                  {item.images.squareImage && (
                    <img
                      src={item.images.squareImage}
                      className="h-24 w-24 object-cover rounded-md"
                    />
                  )}
                  {item.images.landscapeImage && (
                    <img
                      src={item.images.landscapeImage}
                      className="h-24 w-24 object-cover rounded-md"
                    />
                  )}
                  {item.images.portaitImage && (
                    <img
                      src={item.images.portaitImage}
                      className="h-24 w-24 object-cover rounded-md"
                    />
                  )}
                </Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>
                  Attributes: {item.attributes.join(`, `)}
                  <br />
                  AddOns: {item.addOns.join(`, `)}
                  <br />
                  Price Types(Product Types): {item.productTypes.join(`, `)}
                  <br />
                  {[
                    item.platformAllowed ? "Platform Allowed" : "",
                    item.flooringAllowed ? "Flooring Allowed" : "",
                    item.multipleAllowed ? "Multiple Allowed" : "",
                  ]
                    .filter((i) => i)
                    .join(", ")}
                  <br />
                  Admin Event Tool View: {toProperCase(item.adminEventToolView)}
                  <br />
                  Website View: {toProperCase(item.websiteView)}
                </Table.Cell>
                <Table.Cell>
                  {item.order >= 0 ? item.order.toString() : ""}
                </Table.Cell>
                <Table.Cell className="flex gap-2">
                  {!loading && !editCategory.display && (
                    <MdEditDocument
                      size={24}
                      cursor={"pointer"}
                      className="hover:text-blue-700"
                      onClick={() => {
                        if (!loading) {
                          setEditCategory({
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
                          deleteCategory(item._id);
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
