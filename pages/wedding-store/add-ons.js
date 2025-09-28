import { uploadFile } from "@/utils/file";
import {
  Button,
  FileInput,
  Label,
  Select,
  Table,
  TextInput,
} from "flowbite-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { MdDelete, MdEditDocument, MdOpenInNew } from "react-icons/md";

export default function AddOns({ message, setMessage }) {
  const [loading, setLoading] = useState(false);
  const [addOns, setAddOns] = useState([]);
  const [imageFile, setImageFile] = useState("");
  const [units, setUnits] = useState([]);
  const [platformInfo, setPlatformInfo] = useState({
    price: 0,
    image: "",
    imageFile: "",
    edit: false,
  });
  const [flooringInfo, setFlooringInfo] = useState({
    flooringList: [],
    imageFile: "",
    editIndex: -1,
    edit: false,
    add: false,
    addFlooring: { title: "", image: "", price: 0 },
  });
  const platformImageRef = useRef();
  const flooringImageRef = useRef();
  const [addNewAddOn, setAddNewAddOn] = useState({
    display: false,
    name: "",
    unit: "",
    price: 0,
    image: "",
    subAddOns: [],
  });
  const [editAddOn, setEditAddOn] = useState({
    display: false,
    name: "",
    unit: "",
    price: 0,
    image: "",
    subAddOns: [],
    _id: "",
  });
  const fetchPlatformInfo = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/config?code=platform`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setPlatformInfo({
          price: 0,
          image: "",
          imageFile: "",
          edit: false,
          ...response?.data,
        });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchFlooringInfo = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/config?code=flooring`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setFlooringInfo({
          flooringList: [],
          imageFile: "",
          editIndex: -1,
          edit: false,
          add: false,
          addFlooring: { title: "", image: "", price: 0 },
          ...response?.data,
        });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
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
  const addAddOn = async () => {
    if (addNewAddOn.name) {
      setLoading(true);
      let tempData = addNewAddOn;
      if (imageFile) {
        tempData.image = await uploadFile({
          file: imageFile,
          path: "decor-images/add-ons",
          id: `${new Date().getTime()}-add-ons-${tempData.name
            .substring(0, 10)
            .replace(/[^a-zA-Z0-9]/g, "-")}`,
        });
      }
      tempData.subAddOns = tempData.subAddOns?.map((i) => ({
        name: i.name,
        price: i.price,
        image: i.image,
      }));
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/add-on`, {
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
              text: "AddOn added Successfully!",
              status: "success",
              display: true,
            });
            setImageFile("");
            setAddNewAddOn({
              display: false,
              name: "",
              unit: "",
              price: 0,
              image: "",
              subAddOns: [],
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
  const updateAddOn = async () => {
    if (editAddOn.name) {
      setLoading(true);
      let tempData = editAddOn;
      if (imageFile) {
        tempData.image = await uploadFile({
          file: imageFile,
          path: "decor-images/add-ons",
          id: `${new Date().getTime()}-add-ons-${tempData.name
            .substring(0, 10)
            .replace(/[^a-zA-Z0-9]/g, "-")}`,
        });
      }
      tempData.subAddOns = tempData.subAddOns?.map((i) => ({
        name: i.name,
        price: i.price,
        image: i.image,
      }));
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/add-on/${editAddOn._id}`, {
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
              text: "AddOn updated Successfully!",
              status: "success",
              display: true,
            });
            setImageFile("");
            setEditAddOn({
              display: false,
              name: "",
              unit: "",
              price: 0,
              image: "",
              subAddOns: [],
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
  const updatePlatformInfo = async () => {
    if (platformInfo.price) {
      setLoading(true);
      let tempImage = "";
      if (platformInfo.imageFile) {
        tempImage = await uploadFile({
          file: platformInfo.imageFile,
          path: "decor-images/add-ons",
          id: `${new Date().getTime()}-add-ons-platform`,
        });
      }
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/config`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          code: "platform",
          data: {
            price: platformInfo.price,
            image: tempImage || platformInfo.image,
          },
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Platform Info updated Successfully!",
              status: "success",
              display: true,
            });
            platformImageRef.current.value = null;
            fetchPlatformInfo();
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
  const updateFlooringInfo = async () => {
    if (flooringInfo.edit || flooringInfo.add) {
      setLoading(true);
      let tempImage = "";
      if (flooringInfo.imageFile) {
        tempImage = await uploadFile({
          file: flooringInfo.imageFile,
          path: "decor-images/add-ons",
          id: `${new Date().getTime()}-add-ons-flooring-${
            flooringInfo.edit
              ? flooringInfo.flooringList[flooringInfo.editIndex]?.title
              : flooringInfo.addFlooring.title
          }`,
        });
      }
      let tempList = flooringInfo.flooringList;
      if (flooringInfo.edit && tempImage) {
        tempList[flooringInfo.editIndex].image = tempImage;
      } else if (flooringInfo.add) {
        tempList = [
          ...tempList,
          { ...flooringInfo.addFlooring, image: tempImage || "" },
        ];
      }
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/config`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          code: "flooring",
          data: {
            flooringList: tempList,
          },
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Flooring Info updated Successfully!",
              status: "success",
              display: true,
            });
            // flooringImageRef?.current?.value = null;
            fetchFlooringInfo();
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
  const removeFlooring = async (index) => {
    if (index) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/config`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          code: "flooring",
          data: {
            flooringList: flooringInfo.flooringList.filter(
              (_, i) => index !== i
            ),
          },
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Flooring removed Successfully!",
              status: "success",
              display: true,
            });
            fetchFlooringInfo();
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
  const deleteAddOn = (_id) => {
    if (_id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/add-on/${_id}`, {
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
              text: "AddOn deleted added Successfully!",
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
    fetchAddOns();
    fetchUnits();
    fetchPlatformInfo();
    fetchFlooringInfo();
  }, []);
  return (
    <div className="p-8 w-full flex flex-col gap-6">
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-4">
          <p className="text-xl font-medium col-span-3">Add-Ons</p>
          <Button
            color="light"
            onClick={() => {
              setImageFile("");
              setAddNewAddOn({
                display: true,
                name: "",
                unit: "",
                price: 0,
                image: "",
                subAddOns: [],
              });
            }}
            disabled={loading || addNewAddOn.display || editAddOn.display}
          >
            <BsPlus size={16} /> Add New
          </Button>
        </div>
        {addNewAddOn.display && (
          <div className="grid grid-cols-3 gap-4">
            <div className="">
              <Label value="Name" />
              <TextInput
                placeholder="Name"
                value={addNewAddOn.name}
                disabled={loading}
                onChange={(e) => {
                  setAddNewAddOn({
                    ...addNewAddOn,
                    name: e.target.value,
                  });
                }}
              />
            </div>
            <div className="">
              <Label value="Price" />
              <TextInput
                type="number"
                placeholder="Price"
                value={addNewAddOn.price}
                disabled={loading}
                onChange={(e) => {
                  setAddNewAddOn({
                    ...addNewAddOn,
                    price: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <Label value="Unit" />
              <Select
                value={addNewAddOn.unit}
                disabled={loading}
                onChange={(e) => {
                  setAddNewAddOn({
                    ...addNewAddOn,
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
            <div className="">
              <Label value="Add Picture" />
              <FileInput
                // ref={addNewEventMandatoryQuestionImageRef}
                disabled={loading}
                onChange={(e) => {
                  setImageFile(e.target.files[0]);
                }}
              />
            </div>
            <div className="place-self-end w-full ">
              <Button
                color="light"
                onClick={() => {
                  setAddNewAddOn({
                    ...addNewAddOn,
                    subAddOns: [
                      ...addNewAddOn.subAddOns,
                      { name: "", price: "", image: "" },
                    ],
                  });
                }}
                disabled={loading}
              >
                <BsPlus size={16} /> Add New Sub Add-On
              </Button>
            </div>
            <div className="place-self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  addAddOn();
                }}
                disabled={loading || !addNewAddOn.name}
                className="grow"
              >
                Add AddOn
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setImageFile("");
                  setAddNewAddOn({
                    display: false,
                    name: "",
                    unit: "",
                    price: 0,
                    image: "",
                    subAddOns: [],
                  });
                }}
                disabled={loading}
              >
                <MdDelete size={24} />
              </Button>
            </div>
            {addNewAddOn.subAddOns.length > 0 && (
              <div className="col-span-3 flex flex-col gap-2  ">
                <Label className="text-base" value="Sub Add-Ons" />
                <div className="grid grid-cols-4 gap-4">
                  <Label value="Name" />
                  <Label value="Price" />
                  <Label value="Image" />
                </div>
                {addNewAddOn.subAddOns?.map((item, index) => (
                  <div
                    className="grid grid-cols-4 gap-4 items-center"
                    key={index}
                  >
                    <TextInput
                      placeholder="Name"
                      value={item.name}
                      disabled={loading}
                      onChange={(e) => {
                        setAddNewAddOn({
                          ...addNewAddOn,
                          subAddOns: addNewAddOn.subAddOns.map((vItem, i) =>
                            i === index
                              ? { ...item, name: e.target.value }
                              : vItem
                          ),
                        });
                      }}
                    />
                    <TextInput
                      type="Number"
                      placeholder="Price"
                      value={item.price}
                      disabled={loading}
                      onChange={(e) => {
                        setAddNewAddOn({
                          ...addNewAddOn,
                          subAddOns: addNewAddOn.subAddOns.map((vItem, i) =>
                            i === index
                              ? { ...item, price: e.target.value }
                              : vItem
                          ),
                        });
                      }}
                    />
                    <div className="flex flex-row gap-2 col-span-2 items-center">
                      <FileInput
                        // ref={addNewEventMandatoryQuestionImageRef}
                        disabled={loading}
                        onChange={(e) => {
                          setAddNewAddOn({
                            ...addNewAddOn,
                            subAddOns: addNewAddOn.subAddOns.map((vItem, i) =>
                              i === index
                                ? { ...item, imageFile: e.target.files[0] }
                                : vItem
                            ),
                          });
                        }}
                      />
                      {item.imageFile && (
                        <Button
                          disabled={loading}
                          color="gray"
                          onClick={async () => {
                            setLoading(true);
                            let tempImage = await uploadFile({
                              file: item.imageFile,
                              path: "decor-images/add-ons",
                              id: `${new Date().getTime()}-add-ons-${item.name
                                .substring(0, 10)
                                .replace(/[^a-zA-Z0-9]/g, "-")}`,
                            });
                            setAddNewAddOn({
                              ...addNewAddOn,
                              subAddOns: addNewAddOn.subAddOns.map((vItem, i) =>
                                i === index
                                  ? {
                                      ...item,
                                      image: tempImage,
                                      imageFile: null,
                                    }
                                  : vItem
                              ),
                            });
                            setLoading(false);
                          }}
                        >
                          Upload Image
                        </Button>
                      )}
                      {item.image && (
                        <Link href={item.image} target="_blank">
                          <MdOpenInNew size={24} />
                        </Link>
                      )}
                      <MdDelete
                        cursor={"pointer"}
                        className="hover:text-blue-500"
                        size={24}
                        onClick={() => {
                          setAddNewAddOn({
                            ...addNewAddOn,
                            subAddOns: addNewAddOn.subAddOns.filter(
                              (vItem, i) => i !== index
                            ),
                          });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {editAddOn.display && (
          <div className="grid grid-cols-3 gap-4">
            <div className="">
              <Label value="Name" />
              <TextInput
                placeholder="Name"
                value={editAddOn.name}
                disabled={loading}
                onChange={(e) => {
                  setEditAddOn({
                    ...editAddOn,
                    name: e.target.value,
                  });
                }}
              />
            </div>
            <div className="">
              <Label value="Price" />
              <TextInput
                type="number"
                placeholder="Price"
                value={editAddOn.price}
                disabled={loading}
                onChange={(e) => {
                  setEditAddOn({
                    ...editAddOn,
                    price: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <Label value="Unit" />
              <Select
                value={editAddOn.unit}
                disabled={loading}
                onChange={(e) => {
                  setEditAddOn({
                    ...editAddOn,
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
            <div className="">
              <Label value="Add Picture" />
              <FileInput
                // ref={addNewEventMandatoryQuestionImageRef}
                disabled={loading}
                onChange={(e) => {
                  setImageFile(e.target.files[0]);
                }}
              />
            </div>
            <div className="place-self-end w-full ">
              <Button
                color="light"
                onClick={() => {
                  setEditAddOn({
                    ...editAddOn,
                    subAddOns: [
                      ...editAddOn.subAddOns,
                      { name: "", price: "", image: "" },
                    ],
                  });
                }}
                disabled={loading}
              >
                <BsPlus size={16} /> Add New Sub Add-On
              </Button>
            </div>
            <div className="place self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  updateAddOn();
                }}
                disabled={loading || !editAddOn.name}
                className="grow"
              >
                Edit AddOn
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setImageFile("");
                  setEditAddOn({
                    display: false,
                    name: "",
                    unit: "",
                    price: 0,
                    image: "",
                    subAddOns: [],
                    _id: "",
                  });
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
            {editAddOn.subAddOns.length > 0 && (
              <div className="col-span-3 flex flex-col gap-2  ">
                <Label className="text-base" value="Sub Add-Ons" />
                <div className="grid grid-cols-4 gap-4">
                  <Label value="Name" />
                  <Label value="Price" />
                  <Label value="Image" />
                </div>
                {editAddOn.subAddOns?.map((item, index) => (
                  <div
                    className="grid grid-cols-4 gap-4 items-center"
                    key={index}
                  >
                    <TextInput
                      placeholder="Name"
                      value={item.name}
                      disabled={loading}
                      onChange={(e) => {
                        setEditAddOn({
                          ...editAddOn,
                          subAddOns: editAddOn.subAddOns.map((vItem, i) =>
                            i === index
                              ? { ...item, name: e.target.value }
                              : vItem
                          ),
                        });
                      }}
                    />
                    <TextInput
                      type="Number"
                      placeholder="Price"
                      value={item.price}
                      disabled={loading}
                      onChange={(e) => {
                        setEditAddOn({
                          ...editAddOn,
                          subAddOns: editAddOn.subAddOns.map((vItem, i) =>
                            i === index
                              ? { ...item, price: e.target.value }
                              : vItem
                          ),
                        });
                      }}
                    />
                    <div className="flex flex-row gap-2 col-span-2 items-center">
                      <FileInput
                        // ref={addNewEventMandatoryQuestionImageRef}
                        disabled={loading}
                        onChange={(e) => {
                          setEditAddOn({
                            ...editAddOn,
                            subAddOns: editAddOn.subAddOns.map((vItem, i) =>
                              i === index
                                ? { ...item, imageFile: e.target.files[0] }
                                : vItem
                            ),
                          });
                        }}
                      />
                      {item.imageFile && (
                        <Button
                          disabled={loading}
                          color="gray"
                          onClick={async () => {
                            setLoading(true);
                            let tempImage = await uploadFile({
                              file: item.imageFile,
                              path: "decor-images/add-ons",
                              id: `${new Date().getTime()}-add-ons-${item.name
                                .substring(0, 10)
                                .replace(/[^a-zA-Z0-9]/g, "-")}`,
                            });
                            setEditAddOn({
                              ...editAddOn,
                              subAddOns: editAddOn.subAddOns.map((vItem, i) =>
                                i === index
                                  ? {
                                      ...item,
                                      image: tempImage,
                                      imageFile: null,
                                    }
                                  : vItem
                              ),
                            });
                            setLoading(false);
                          }}
                        >
                          Upload Image
                        </Button>
                      )}
                      {item.image && (
                        <Link href={item.image} target="_blank">
                          <MdOpenInNew size={24} />
                        </Link>
                      )}
                      <MdDelete
                        cursor={"pointer"}
                        className="hover:text-blue-500"
                        size={24}
                        onClick={() => {
                          setEditAddOn({
                            ...editAddOn,
                            subAddOns: editAddOn.subAddOns.filter(
                              (vItem, i) => i !== index
                            ),
                          });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <Table hoverable className="width-full overflow-x-auto">
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Price/Unit</Table.HeadCell>
            <Table.HeadCell>Sub AddOns</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {addOns?.map((item, index) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800 font-medium"
                key={index}
              >
                <Table.Cell className="flex flex-col gap-2 justify-start">
                  {item.name}
                  {item.image && (
                    <div className="flex justify-start">
                      <img
                        src={item.image}
                        className="h-24 w-auto object-contain"
                        alt="Item Image"
                      />
                    </div>
                  )}
                </Table.Cell>
                <Table.Cell>
                  {item.price}/{item.unit}
                </Table.Cell>
                <Table.Cell>
                  {item.subAddOns?.map((rec, i) => (
                    <div key={i} className="block">
                      {rec.name}: {rec.price}
                      {rec.image && (
                        <div className="block flex justify-start">
                          <img
                            src={rec.image}
                            className="h-24 w-auto object-contain"
                            alt="Item Image"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </Table.Cell>
                <Table.Cell className="flex gap-2">
                  {!loading && !editAddOn.display && (
                    <MdEditDocument
                      size={24}
                      cursor={"pointer"}
                      className="hover:text-blue-700"
                      onClick={() => {
                        if (!loading) {
                          setEditAddOn({
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
                          deleteAddOn(item._id);
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
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full flex flex-col gap-4">
        <p className="text-xl font-medium">Platform Add-On</p>
        <div className="grid grid-cols-4 gap-4 items-center">
          <Label value="Price (Rate, INR):" />
          <TextInput
            type="number"
            placeholder="Price"
            value={platformInfo.price}
            disabled={loading || !platformInfo.edit}
            // readOnly={!platformInfo.edit}
            onChange={(e) => {
              setPlatformInfo({
                ...platformInfo,
                price: e.target.value,
              });
            }}
          />
        </div>
        <div className="grid grid-cols-4 gap-4 items-center">
          <Label value="Image:" />
          <FileInput
            ref={platformImageRef}
            disabled={loading || !platformInfo.edit}
            onChange={(e) => {
              setPlatformInfo({
                ...platformInfo,
                imageFile: e.target.files[0],
              });
            }}
          />
          {platformInfo.image && (
            <div className="block flex justify-start w-full">
              <img
                src={platformInfo.image}
                className="h-24 w-auto object-contain"
                alt="Platform Image"
              />
            </div>
          )}
        </div>
        <div className="grid grid-cols-4 gap-4 items-center">
          <Button
            onClick={() => {
              if (platformInfo.edit) {
                updatePlatformInfo();
              } else {
                setPlatformInfo({ ...platformInfo, edit: true });
              }
            }}
            color={platformInfo.edit ? "success" : "gray"}
            disabled={loading}
          >
            {platformInfo.edit ? "Update" : "Edit Info"}
          </Button>
          {platformInfo.edit && (
            <Button
              onClick={() => {
                platformImageRef.current.value = null;
                setPlatformInfo({ ...platformInfo, edit: false });
                fetchPlatformInfo();
              }}
              color={"failure"}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-4 items-center">
          <p className="text-xl font-medium col-span-3">Flooring Add-On</p>
          <Button
            color="gray"
            disabled={loading}
            onClick={() => {
              setFlooringInfo({
                ...flooringInfo,
                add: true,
                addFlooring: { title: "", price: 0, image: "" },
                imageFile: "",
              });
            }}
          >
            <BsPlus size={16} />
            Add New
          </Button>
        </div>
        {flooringInfo.add && (
          <div className="grid grid-cols-4 gap-4 items-end">
            <div>
              <Label value="Title/Name:" />
              <TextInput
                placeholder="Title/Name"
                value={flooringInfo.addFlooring.title}
                disabled={loading}
                onChange={(e) => {
                  setFlooringInfo({
                    ...flooringInfo,
                    addFlooring: {
                      ...flooringInfo.addFlooring,
                      title: e.target.value,
                    },
                  });
                }}
              />
            </div>
            <div>
              <Label value="Price (Rate, INR):" />
              <TextInput
                type="number"
                placeholder="Price"
                value={flooringInfo.addFlooring.price}
                disabled={loading}
                onChange={(e) => {
                  setFlooringInfo({
                    ...flooringInfo,
                    addFlooring: {
                      ...flooringInfo.addFlooring,
                      price: e.target.value,
                    },
                  });
                }}
              />
            </div>
            <div>
              <Label value="Image:" />
              <FileInput
                ref={flooringImageRef}
                disabled={loading}
                onChange={(e) => {
                  setFlooringInfo({
                    ...flooringInfo,
                    imageFile: e.target.files[0],
                  });
                }}
              />
            </div>
            <div className="flex flex-row gap-3 items-center">
              <Button
                onClick={() => {
                  updateFlooringInfo();
                }}
                color={"success"}
                disabled={loading}
              >
                Add Flooring
              </Button>
              <Button
                onClick={() => {
                  // flooringImageRef?.current?.value = null;
                  setFlooringInfo({
                    ...flooringInfo,
                    add: false,
                    addFlooring: { title: "", price: 0, image: "" },
                    imageFile: "",
                  });
                }}
                color={"failure"}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        {flooringInfo.edit && (
          <div className="grid grid-cols-4 gap-4 items-end">
            <div>
              <Label value="Title/Name:" />
              <TextInput
                placeholder="Title/Name"
                value={flooringInfo.flooringList[flooringInfo.editIndex].title}
                disabled={loading}
                onChange={(e) => {
                  let tempList = flooringInfo.flooringList;
                  tempList[flooringInfo.editIndex].title = e.target.value;
                  setFlooringInfo({
                    ...flooringInfo,
                    flooringList: tempList,
                  });
                }}
              />
            </div>
            <div>
              <Label value="Price (Rate, INR):" />
              <TextInput
                type="number"
                placeholder="Price"
                value={flooringInfo.flooringList[flooringInfo.editIndex].price}
                disabled={loading}
                onChange={(e) => {
                  let tempList = flooringInfo.flooringList;
                  tempList[flooringInfo.editIndex].price = e.target.value;
                  setFlooringInfo({
                    ...flooringInfo,
                    flooringList: tempList,
                  });
                }}
              />
            </div>
            <div>
              <Label value="Image:" />
              <FileInput
                ref={flooringImageRef}
                disabled={loading}
                onChange={(e) => {
                  setFlooringInfo({
                    ...flooringInfo,
                    imageFile: e.target.files[0],
                  });
                }}
              />
            </div>
            <div className="flex flex-row gap-3 items-center">
              <Button
                onClick={() => {
                  updateFlooringInfo();
                }}
                color={"success"}
                disabled={loading}
              >
                Update Flooring
              </Button>
              <Button
                onClick={() => {
                  // flooringImageRef?.current?.value = null;
                  setFlooringInfo({
                    ...flooringInfo,
                    edit: false,
                    editIndex: -1,
                    imageFile: "",
                  });
                }}
                color={"failure"}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        <Table hoverable className="width-full overflow-x-auto">
          <Table.Head>
            <Table.HeadCell>Name/Title</Table.HeadCell>
            <Table.HeadCell>Price</Table.HeadCell>
            <Table.HeadCell>Image</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {flooringInfo.flooringList?.map((item, index) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800 font-medium"
                key={index}
              >
                <Table.Cell>{item.title}</Table.Cell>
                <Table.Cell>{item.price}</Table.Cell>
                <Table.Cell>
                  {item.image && (
                    <div className="flex justify-start">
                      <img
                        src={item.image}
                        className="h-24 w-auto object-contain"
                        alt="Item Image"
                      />
                    </div>
                  )}
                </Table.Cell>
                <Table.Cell className="flex gap-2">
                  <MdEditDocument
                    size={24}
                    cursor={
                      loading || flooringInfo.add || flooringInfo.edit
                        ? "not-allowed"
                        : "pointer"
                    }
                    className={
                      loading || flooringInfo.add || flooringInfo.edit
                        ? "text-gray-200"
                        : "hover:text-blue-700"
                    }
                    onClick={() => {
                      if (!(loading || flooringInfo.add || flooringInfo.edit)) {
                        setFlooringInfo({
                          ...flooringInfo,
                          edit: true,
                          editIndex: index,
                          imageFile: "",
                        });
                        // flooringImageRef?.current?.value = null;
                      }
                    }}
                  />
                  <MdDelete
                    size={24}
                    cursor={
                      loading || flooringInfo.add || flooringInfo.edit
                        ? "not-allowed"
                        : "pointer"
                    }
                    className={
                      loading || flooringInfo.add || flooringInfo.edit
                        ? "text-gray-200"
                        : "hover:text-blue-700"
                    }
                    onClick={() => {
                      if (!(loading || flooringInfo.add || flooringInfo.edit)) {
                        removeFlooring(index);
                      }
                    }}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
