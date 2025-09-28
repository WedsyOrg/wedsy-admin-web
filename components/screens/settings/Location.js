import { Button, Label, Select, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { BsPlus } from "react-icons/bs";
import {
  MdAddBox,
  MdDelete,
  MdEditDocument,
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";

export default function Location({
  message,
  setMessage,
  loading,
  setLoading,
  display,
}) {
  const [expanded, setExpanded] = useState([]);
  const [locations, setLocations] = useState([]);
  const [list, setList] = useState([]);
  const [addNewLocation, setAddNewLocation] = useState({
    display: false,
    title: "",
    locationType: "",
    parent: "",
  });
  const [editLocation, setEditLocation] = useState({
    display: false,
    title: "",
    locationType: "",
    parent: "",
    _id: "",
  });
  const fetchLocations = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/location`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setList(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addLocation = async () => {
    if (addNewLocation.title) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/location`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: addNewLocation.title,
          locationType: addNewLocation.locationType,
          parent: addNewLocation.parent,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Location added Successfully!",
              status: "success",
              display: true,
            });
            setAddNewLocation({
              display: false,
              title: "",
              locationType: "",
              parent: "",
            });
            fetchLocations();
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
  const updateLocation = async () => {
    if (editLocation.title) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/location/${editLocation._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: editLocation.title,
          locationType: editLocation.locationType,
          parent: editLocation.parent,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Location updated Successfully!",
              status: "success",
              display: true,
            });
            setEditLocation({
              display: false,
              title: "",
              locationType: "",
              parent: "",
              _id: "",
            });
            fetchLocations();
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
  const deleteLocation = (_id) => {
    if (_id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/location/${_id}`, {
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
              text: "Location deleted added Successfully!",
              status: "success",
              display: true,
            });
            fetchLocations();
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
    if (list.length > 0) {
      let states = list.filter((i) => i.locationType === "State");
      let cities = list.filter((i) => i.locationType === "City");
      let areas = list.filter((i) => i.locationType === "Area");
      let pincodes = list.filter((i) => i.locationType === "Pincode");
      Promise.all(
        states.map((i) => {
          return new Promise((resolve, reject) => {
            let tempCities = cities.filter((j) => j.parent == i._id);
            Promise.all(
              tempCities.map((j) => {
                return new Promise((resolve1, reject1) => {
                  let tempAreas = areas.filter((k) => k.parent == j._id);
                  Promise.all(
                    tempAreas.map((k) => {
                      return new Promise((resolve2, reject1) => {
                        let tempPincodes = pincodes.filter(
                          (l) => l.parent == k._id
                        );
                        resolve2({ ...k, pincodes: tempPincodes });
                      });
                    })
                  ).then((result) => resolve1({ ...j, areas: result }));
                });
              })
            ).then((result) => resolve({ ...i, cities: result }));
          });
        })
      ).then((result) => setLocations(result));
    }
  }, [list]);
  useEffect(() => {
    if (display === "Location") {
      fetchLocations();
    }
  }, [display]);
  return (
    <>
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-4">
          <p className="text-xl font-medium col-span-3">Location</p>
          <Button
            color="light"
            onClick={() => {
              setAddNewLocation({
                display: true,
                title: "",
                locationType: "State",
                parent: "",
              });
            }}
            disabled={loading || addNewLocation.display || editLocation.display}
          >
            <BsPlus size={16} /> Add New State
          </Button>
        </div>
        {addNewLocation.display && (
          <div className="grid grid-cols-3 gap-4">
            <div className="">
              <Label value="Title" />
              <TextInput
                placeholder="Title"
                value={addNewLocation.title}
                disabled={loading}
                onChange={(e) => {
                  setAddNewLocation({
                    ...addNewLocation,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div className="">
              <Label value="Location Type" />
              <Select
                value={addNewLocation.locationType}
                disabled={loading || !addNewLocation.parent || true}
                onChange={(e) => {
                  setAddNewLocation({
                    ...addNewLocation,
                    locationType: e.target.value,
                  });
                }}
              >
                <option value={"State"}>State</option>
                <option value={"City"}>City</option>
                <option value={"Area"}>Area</option>
                <option value={"Pincode"}>Pincode</option>
              </Select>
            </div>
            <div className="place-self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  addLocation();
                }}
                disabled={
                  loading ||
                  !addNewLocation.title ||
                  !addNewLocation.locationType
                }
                className="grow"
              >
                Add Location
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setAddNewLocation({
                    display: false,
                    title: "",
                    locationType: "",
                    parent: "",
                  });
                }}
                disabled={loading}
              >
                <MdDelete size={24} />
              </Button>
            </div>
          </div>
        )}
        {editLocation.display && (
          <div className="grid grid-cols-3 gap-4">
            <div className="">
              <Label value="Title" />
              <TextInput
                placeholder="Title"
                value={editLocation.title}
                disabled={loading}
                onChange={(e) => {
                  setEditLocation({
                    ...editLocation,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div className="">
              <Label value="Location Type" />
              <Select
                value={editLocation.locationType}
                disabled={loading || !editLocation.parent || true}
                onChange={(e) => {
                  setEditLocation({
                    ...editLocation,
                    locationType: e.target.value,
                  });
                }}
              >
                <option value={"State"}>State</option>
                <option value={"City"}>City</option>
                <option value={"Area"}>Area</option>
                <option value={"Pincode"}>Pincode</option>
              </Select>
            </div>
            <div className="place-self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  updateLocation();
                }}
                disabled={
                  loading || !editLocation.title || !editLocation.locationType
                }
                className="grow"
              >
                Edit Location
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setEditLocation({
                    display: false,
                    title: "",
                    locationType: "",
                    parent: "",
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
            <Table.HeadCell>Location</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="">
            {locations?.map((item, index) => (
              <>
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800 font-medium border-t-2"
                  key={item._id}
                >
                  <Table.Cell>
                    <div className="flex flex-row items-center gap-2">
                      {expanded.includes(item._id) ? (
                        <MdOutlineKeyboardArrowDown
                          size={24}
                          cursor={"pointer"}
                          onClick={() => {
                            setExpanded(
                              expanded.filter((id) => id !== item._id)
                            );
                          }}
                        />
                      ) : (
                        <MdOutlineKeyboardArrowRight
                          size={24}
                          cursor={"pointer"}
                          onClick={() => {
                            setExpanded((prev) => [...prev, item._id]);
                          }}
                        />
                      )}
                      {item.title}
                      <span className="text-xs">(State)</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="flex gap-2">
                    {!loading &&
                      !editLocation.display &&
                      !addNewLocation.display && (
                        <MdAddBox
                          size={24}
                          cursor={"pointer"}
                          className="hover:text-blue-700"
                          onClick={() => {
                            if (!loading) {
                              setAddNewLocation({
                                display: true,
                                title: "",
                                locationType: "City",
                                parent: item._id,
                              });
                            }
                          }}
                        />
                      )}
                    {!loading &&
                      !addNewLocation.display &&
                      !editLocation.display && (
                        <MdEditDocument
                          size={24}
                          cursor={"pointer"}
                          className="hover:text-blue-700"
                          onClick={() => {
                            if (!loading) {
                              setEditLocation({
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
                            deleteLocation(item._id);
                          }
                        }}
                      />
                    )}
                  </Table.Cell>
                </Table.Row>
                {expanded.includes(item._id) &&
                  item.cities?.map((city) => (
                    <>
                      <Table.Row
                        className="bg-white dark:border-gray-700 dark:bg-gray-800 font-medium border-t-2"
                        key={city._id}
                      >
                        <Table.Cell>
                          <div className="flex flex-row items-center gap-2">
                            <MdOutlineKeyboardArrowDown
                              size={24}
                              cursor={"pointer"}
                              className="invisible"
                            />
                            {expanded.includes(city._id) ? (
                              <MdOutlineKeyboardArrowDown
                                size={24}
                                cursor={"pointer"}
                                onClick={() => {
                                  setExpanded(
                                    expanded.filter((id) => id !== city._id)
                                  );
                                }}
                              />
                            ) : (
                              <MdOutlineKeyboardArrowRight
                                size={24}
                                cursor={"pointer"}
                                onClick={() => {
                                  setExpanded((prev) => [...prev, city._id]);
                                }}
                              />
                            )}
                            {city.title}
                            <span className="text-xs">(City)</span>
                          </div>
                        </Table.Cell>
                        <Table.Cell className="flex gap-2">
                          {!loading &&
                            !editLocation.display &&
                            !addNewLocation.display && (
                              <MdAddBox
                                size={24}
                                cursor={"pointer"}
                                className="hover:text-blue-700"
                                onClick={() => {
                                  if (!loading) {
                                    setAddNewLocation({
                                      display: true,
                                      title: "",
                                      locationType: "Area",
                                      parent: city._id,
                                    });
                                  }
                                }}
                              />
                            )}
                          {!loading &&
                            !addNewLocation.display &&
                            !editLocation.display && (
                              <MdEditDocument
                                size={24}
                                cursor={"pointer"}
                                className="hover:text-blue-700"
                                onClick={() => {
                                  if (!loading) {
                                    setEditLocation({
                                      ...city,
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
                                  deleteLocation(city._id);
                                }
                              }}
                            />
                          )}
                        </Table.Cell>
                      </Table.Row>
                      {expanded.includes(city._id) &&
                        city.areas?.map((area) => (
                          <>
                            <Table.Row
                              className="bg-white dark:border-gray-700 dark:bg-gray-800 font-medium border-t-2"
                              key={area._id}
                            >
                              <Table.Cell>
                                <div className="flex flex-row items-center gap-2">
                                  <MdOutlineKeyboardArrowDown
                                    size={24}
                                    cursor={"pointer"}
                                    className="invisible"
                                  />
                                  <MdOutlineKeyboardArrowDown
                                    size={24}
                                    cursor={"pointer"}
                                    className="invisible"
                                  />
                                  {expanded.includes(area._id) ? (
                                    <MdOutlineKeyboardArrowDown
                                      size={24}
                                      cursor={"pointer"}
                                      onClick={() => {
                                        setExpanded(
                                          expanded.filter(
                                            (id) => id !== area._id
                                          )
                                        );
                                      }}
                                    />
                                  ) : (
                                    <MdOutlineKeyboardArrowRight
                                      size={24}
                                      cursor={"pointer"}
                                      onClick={() => {
                                        setExpanded((prev) => [
                                          ...prev,
                                          area._id,
                                        ]);
                                      }}
                                    />
                                  )}
                                  {area.title}
                                  <span className="text-xs">(Area)</span>
                                </div>
                              </Table.Cell>
                              <Table.Cell className="flex gap-2">
                                {!loading &&
                                  !editLocation.display &&
                                  !addNewLocation.display && (
                                    <MdAddBox
                                      size={24}
                                      cursor={"pointer"}
                                      className="hover:text-blue-700"
                                      onClick={() => {
                                        if (!loading) {
                                          setAddNewLocation({
                                            display: true,
                                            title: "",
                                            locationType: "Pincode",
                                            parent: area._id,
                                          });
                                        }
                                      }}
                                    />
                                  )}
                                {!loading &&
                                  !addNewLocation.display &&
                                  !editLocation.display && (
                                    <MdEditDocument
                                      size={24}
                                      cursor={"pointer"}
                                      className="hover:text-blue-700"
                                      onClick={() => {
                                        if (!loading) {
                                          setEditLocation({
                                            ...area,
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
                                        deleteLocation(area._id);
                                      }
                                    }}
                                  />
                                )}
                              </Table.Cell>
                            </Table.Row>
                            {expanded.includes(area._id) &&
                              area.pincodes?.map((pincode) => (
                                <>
                                  <Table.Row
                                    className="bg-white dark:border-gray-700 dark:bg-gray-800 font-medium border-t-2"
                                    key={pincode._id}
                                  >
                                    <Table.Cell>
                                      <div className="flex flex-row items-center gap-2">
                                        <MdOutlineKeyboardArrowDown
                                          size={24}
                                          cursor={"pointer"}
                                          className="invisible"
                                        />
                                        <MdOutlineKeyboardArrowDown
                                          size={24}
                                          cursor={"pointer"}
                                          className="invisible"
                                        />
                                        <MdOutlineKeyboardArrowDown
                                          size={24}
                                          cursor={"pointer"}
                                          className="invisible"
                                        />
                                        {expanded.includes(pincode._id) ? (
                                          <MdOutlineKeyboardArrowDown
                                            size={24}
                                            cursor={"pointer"}
                                            onClick={() => {
                                              setExpanded(
                                                expanded.filter(
                                                  (id) => id !== pincode._id
                                                )
                                              );
                                            }}
                                          />
                                        ) : (
                                          <MdOutlineKeyboardArrowRight
                                            size={24}
                                            cursor={"pointer"}
                                            onClick={() => {
                                              setExpanded((prev) => [
                                                ...prev,
                                                pincode._id,
                                              ]);
                                            }}
                                          />
                                        )}
                                        {pincode.title}
                                        <span className="text-xs">
                                          (Pincode)
                                        </span>
                                      </div>
                                    </Table.Cell>
                                    <Table.Cell className="flex gap-2">
                                      {!loading &&
                                        !addNewLocation.display &&
                                        !editLocation.display && (
                                          <MdEditDocument
                                            size={24}
                                            cursor={"pointer"}
                                            className="hover:text-blue-700"
                                            onClick={() => {
                                              if (!loading) {
                                                setEditLocation({
                                                  ...pincode,
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
                                              deleteLocation(pincode._id);
                                            }
                                          }}
                                        />
                                      )}
                                    </Table.Cell>
                                  </Table.Row>
                                </>
                              ))}
                          </>
                        ))}
                    </>
                  ))}
              </>
            ))}
          </Table.Body>
        </Table>
      </div>
    </>
  );
}
