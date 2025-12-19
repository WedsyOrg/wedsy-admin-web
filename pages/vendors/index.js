import {
  MdDelete,
  MdEditDocument,
  MdOpenInNew,
  MdOutlineFileDownload,
  MdRemoveRedEye,
} from "react-icons/md";
import { BsPlus, BsSearch } from "react-icons/bs";
import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Checkbox,
  Label,
  Pagination,
  Select,
  Spinner,
  Table,
  TextInput,
  ToggleSwitch,
  Tooltip,
} from "flowbite-react";
import { toProperCase } from "@/utils/text";
import Link from "next/link";

export default function Event({ user }) {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [dateFilter, setDateFilter] = useState(["", ""]);
  const [selected, setSelected] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [tag, setTag] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [pincode, setPincode] = useState("");
  const [profileVerified, setProfileVerified] = useState("");
  const [profileVisibility, setProfileVisibility] = useState("");
  const [packageStatus, setPackageStatus] = useState("");
  const [biddingStatus, setBiddingStatus] = useState("");
  const [servicesOffered, setServicesOffered] = useState("");

  const fetchLocationData = () => {
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
        let tempList = response;
        let states = tempList.filter((i) => i.locationType === "State");
        let cities = tempList.filter((i) => i.locationType === "City");
        let areas = tempList.filter((i) => i.locationType === "Area");
        let pincodes = tempList.filter((i) => i.locationType === "Pincode");
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
        ).then((result) => setLocationData(result));
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchTagList = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/tag`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setTagList(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const handleCSVDownload = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor?download=csv&page=${
        page || 1
      }&limit=${itemsPerPage}${search && `&search=${search}`}${
        sort && `&sort=${sort}`
      }${tag && `&tag=${tag}`}${state && `&state=${state}`}${
        city && `&city=${city}`
      }${area && `&area=${area}`}${pincode && `&pincode=${pincode}`}${
        profileVerified && `&profileVerified=${profileVerified}`
      }${profileVisibility && `&profileVisibility=${profileVisibility}`}${
        packageStatus && `&packageStatus=${packageStatus}`
      }${biddingStatus && `&biddingStatus=${biddingStatus}`}${
        servicesOffered && `&servicesOffered=${servicesOffered}`
      }
      ${
        dateFilter[0]
          ? dateFilter[1]
            ? `&startDate=${dateFilter[0]}&endDate=${dateFilter[1]}`
            : `&registrationDate=${dateFilter[0]}`
          : ""
      }`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => response.blob())
      .then((blob) => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "vendors.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setLoading(false);
      })
      .catch((err) => console.error("Error downloading CSV:", err));
  };
  const fetchList = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor?page=${
        page || 1
      }&limit=${itemsPerPage}${search && `&search=${search}`}${
        sort && `&sort=${sort}`
      }${tag && `&tag=${tag}`}${state && `&state=${state}`}${
        city && `&city=${city}`
      }${area && `&area=${area}`}${pincode && `&pincode=${pincode}`}${
        profileVerified && `&profileVerified=${profileVerified}`
      }${profileVisibility && `&profileVisibility=${profileVisibility}`}${
        packageStatus && `&packageStatus=${packageStatus}`
      }${biddingStatus && `&biddingStatus=${biddingStatus}`}${
        servicesOffered && `&servicesOffered=${servicesOffered}`
      }
      ${
        dateFilter[0]
          ? dateFilter[1]
            ? `&startDate=${dateFilter[0]}&endDate=${dateFilter[1]}`
            : `&registrationDate=${dateFilter[0]}`
          : ""
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setList(response.list);
        setTotalPages(response.totalPages);
        setSelected([]);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const deleteVendors = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ vendorIds: selected }),
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          alert("Vendors deleted successfully");
        }
        fetchList();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updateProfileVerified = (id, status) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor/${id}?updateKey=profileVerified`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ profileVerified: status }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          alert("Updated Profile Verified Status Successfully");
          fetchList();
        } else {
          alert("Error, try again");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updateProfileVisibility = (id, status) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor/${id}?updateKey=profileVisibility`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ profileVisibility: status }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          alert("Updated Profile Visibility Successfully");
          fetchList();
        } else {
          alert("Error, try again");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const updateVendorRating = (id, rating) => {
    const nextRating = parseInt(rating);
    if (![1, 2, 3, 4, 5].includes(nextRating)) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/${id}?updateKey=rating`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ rating: nextRating }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          // optimistic update
          setList((prev) =>
            (prev || []).map((v) =>
              v._id === id ? { ...v, rating: nextRating } : v
            )
          );
        } else {
          alert("Error, try again");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    fetchList();
  }, [page]);
  useEffect(() => {
    fetchTagList();
    fetchLocationData();
  }, []);
  useEffect(() => {
    if (page === 1) {
      fetchList();
    } else {
      setPage(1);
    }
  }, [itemsPerPage, search, sort]);
  return (
    <>
      <div className="p-8 flex flex-col gap-6 relative">
        {loading && (
          <div className="absolute left-1/2 grid place-content-center h-screen z-50 -translate-x-1/2">
            <Spinner size="xl" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-lg">Filter by:</p>
          <div className="grid grid-cols-6 gap-6 gap-y-2">
            <div>
              <Label value="Profile Visibility" />
              <Select
                value={profileVisibility}
                onChange={(e) => {
                  setProfileVisibility(e.target.value);
                }}
                disabled={loading}
              >
                <option value={""}>Profile Visibility</option>
                <option value={"true"}>Visibility: Yes</option>
                <option value={"false"}>Visibility: No</option>
              </Select>
            </div>
            <div>
              <Label value="Bidding Status" />
              <Select
                value={biddingStatus}
                onChange={(e) => {
                  setBiddingStatus(e.target.value);
                }}
                disabled={loading}
              >
                <option value={""}>Bidding Status</option>
                <option value={"true"}>Bidding: Enabled</option>
                <option value={"false"}>Bidding: Disabled</option>
              </Select>
            </div>
            <div>
              <Label value="Packages Status" />
              <Select
                value={packageStatus}
                onChange={(e) => {
                  setPackageStatus(e.target.value);
                }}
                disabled={loading}
              >
                <option value={""}>Packages Status</option>
                <option value={"true"}>Packages: Enabled</option>
                <option value={"false"}>Packages: Disabled</option>
              </Select>
            </div>
            <div>
              <Label value="Profile Verified" />
              <Select
                value={profileVerified}
                onChange={(e) => {
                  setProfileVerified(e.target.value);
                }}
                disabled={loading}
              >
                <option value={""}>Profile Verified</option>
                <option value={"true"}>Verified: Yes</option>
                <option value={"false"}>Verified: No</option>
              </Select>
            </div>
            <div>
              <Label value="Services Offered" />
              <Select
                value={servicesOffered}
                onChange={(e) => {
                  setServicesOffered(e.target.value);
                }}
                disabled={loading}
              >
                <option value={""}>Services Offered</option>
                <option value={"Hairstylist"}>Hairstylist</option>
                <option value={"MUA"}>MUA</option>
                <option value={"Both"}>Both</option>
              </Select>
            </div>
            <div>
              <Label value="Tags" />
              <Select
                value={tag}
                onChange={(e) => {
                  setTag(e.target.value);
                }}
                disabled={loading}
              >
                <option value={""}>Select Tag</option>
                {tagList.map((item, index) => (
                  <option value={item.title} key={index}>
                    {item.title}
                  </option>
                ))}
              </Select>
            </div>
            <div className="col-span-2">
              <Label value="Registration Date (or Date Range) Filter" />
              <div className="grid grid-cols-2 gap-2">
                <TextInput
                  type="date"
                  value={dateFilter[0]}
                  onChange={(e) => {
                    setDateFilter([e.target.value, dateFilter[1]]);
                  }}
                  disabled={loading}
                />
                <TextInput
                  type="date"
                  value={dateFilter[1]}
                  onChange={(e) => {
                    setDateFilter([dateFilter[0], e.target.value]);
                  }}
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <Label value="State" />
              <Select
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  setCity("");
                  setArea("");
                  setPincode("");
                }}
                disabled={loading}
              >
                <option value={""}>Select State</option>
                {locationData.map((item, index) => (
                  <option value={item.title} key={index}>
                    {item.title}
                  </option>
                ))}
              </Select>
            </div>
            {state && (
              <div>
                <Label value="City" />
                <Select
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setArea("");
                    setPincode("");
                  }}
                  disabled={loading}
                >
                  <option value={""}>Select City</option>
                  {locationData
                    ?.find((i) => i.title === state)
                    ?.cities?.map((item, index) => (
                      <option value={item.title} key={index}>
                        {item.title}
                      </option>
                    ))}
                </Select>
              </div>
            )}
            {city && (
              <div>
                <Label value="Area" />
                <Select
                  value={area}
                  onChange={(e) => {
                    setArea(e.target.value);
                    setPincode("");
                  }}
                  disabled={loading}
                >
                  <option value={""}>Select Area</option>
                  {locationData
                    ?.find((i) => i.title === state)
                    ?.cities?.find((i) => i.title === city)
                    ?.areas?.map((item, index) => (
                      <option value={item.title} key={index}>
                        {item.title}
                      </option>
                    ))}
                </Select>
              </div>
            )}
            {area && (
              <div>
                <Label value="Pincode" />
                <Select
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value);
                  }}
                  disabled={loading}
                >
                  <option value={""}>Select Pincode</option>
                  {locationData
                    ?.find((i) => i.title === state)
                    ?.cities?.find((i) => i.title === city)
                    ?.areas?.find((i) => i.title === area)
                    ?.pincodes?.map((item, index) => (
                      <option value={item.title} key={index}>
                        {item.title}
                      </option>
                    ))}
                </Select>
              </div>
            )}
          </div>
          <div className="grid grid-cols-6 gap-6">
            <Button
              color="success"
              onClick={() => {
                if (page === 1) {
                  fetchList();
                } else {
                  setPage(1);
                }
              }}
              disabled={loading}
            >
              Apply
            </Button>
            <Button
              color="dark"
              onClick={() => {
                setSearch("");
                setSort("");
                setItemsPerPage(10);
                setTag("");
                setDateFilter(["", ""]);
                setState("");
                setCity("");
                setArea("");
                setPincode("");
                setProfileVerified("");
                setProfileVisibility("");
                setPackageStatus("");
                setBiddingStatus("");
                setServicesOffered("");
                if (page === 1) {
                  fetchList();
                } else {
                  setPage(1);
                }
              }}
              disabled={loading}
            >
              Reset
            </Button>
            <Button
              color="light"
              onClick={handleCSVDownload}
              disabled={loading }
              className="col-start-6"
            >
              <MdOutlineFileDownload size={20} className="mr-2" /> Download CSV
            </Button>
          </div>
        </div>
        <div className="bg-white rounded-3xl flex-col flex gap-3 shadow-xl">
          <div className="flex flex-row justify-between items-center pt-4 px-12">
            <div className="flex flex-col">
              <p className="text-lg font-medium">All Vendors</p>
            </div>
            <div className="flex flex-row gap-4">
              <Tooltip content="Delete Vendors">
                <Button
                  disabled={selected.length == 0 || loading}
                  color="light"
                  onClick={() => {
                    if (selected.length == 0) {
                      alert("Please select at least one vendor");
                    } else if (confirm("Do you want to delete the Vendors?")) {
                      deleteVendors();
                    }
                  }}
                >
                  <MdDelete className="h-5 w-5" />
                </Button>
              </Tooltip>
              <TextInput
                icon={BsSearch}
                id="search"
                placeholder="search"
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <Select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                }}
                disabled={loading}
              >
                <option value={""}>Sort By:</option>
                <option value={"Orders (Highest to Lowest)"}>
                  Orders (Highest to Lowest)
                </option>
                <option value={"Orders (Lowest to Highest)"}>
                  Orders (Lowest to Highest)
                </option>
                <option value={"Newest (Registration)"}>
                  Newest (Registration)
                </option>
                <option value={"Older (Registration)"}>
                  Older (Registration)
                </option>
                <option value={"Alphabetical Order"}>Alphabetical Order</option>
              </Select>
              <Select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(e.target.value);
                }}
                disabled={loading}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Select>
            </div>
          </div>
          <div className="width-full overflow-x-auto">
            <Table hoverable className="width-full overflow-x-auto">
              <Table.Head>
                <Table.HeadCell className="p-4">
                  <Checkbox className="sr-only" />
                </Table.HeadCell>
                <Table.HeadCell className="p-4">
                  <Checkbox
                    className=""
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelected(list.map((i) => i._id));
                      } else {
                        setSelected([]);
                      }
                    }}
                    checked={
                      list
                        .map((i) => i._id)
                        .filter((i) => !selected.includes(i)).length <= 0
                    }
                  />
                </Table.HeadCell>
                <Table.HeadCell>Vendor Name</Table.HeadCell>
                <Table.HeadCell>Phone Number</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Reg. Date</Table.HeadCell>
                <Table.HeadCell>City</Table.HeadCell>
                <Table.HeadCell className="text-center">Rating</Table.HeadCell>
                <Table.HeadCell>Verified</Table.HeadCell>
                <Table.HeadCell>Profile Visibility</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {list?.map((item, index) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={item._id}
                  >
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell className="p-4">
                      <Checkbox
                        onChange={(e) => {
                          if (e.target.checked) {
                            if (!selected.includes(item._id)) {
                              setSelected([...selected, item._id]);
                            }
                          } else {
                            setSelected(selected.filter((i) => i !== item._id));
                          }
                        }}
                        checked={selected.includes(item._id)}
                      />
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      <a
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 relative"
                        href={`/vendors/${item._id}`}
                        target="_blank"
                      >
                        {item.name}
                      </a>
                    </Table.Cell>
                    <Table.Cell>{item.phone}</Table.Cell>
                    <Table.Cell>{item.email}</Table.Cell>
                    <Table.Cell>
                      {new Date(item.registrationDate).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>{item.businessAddress?.city}</Table.Cell>
                    <Table.Cell className="text-center">
                      <Select
                        value={item.rating || 0}
                        onChange={(e) => {
                          updateVendorRating(item._id, e.target.value);
                        }}
                        disabled={loading}
                      >
                        <option value={0}>-</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                      </Select>
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      <Checkbox
                        checked={item.profileVerified}
                        onChange={(e) => {
                          updateProfileVerified(item._id, e.target.checked);
                        }}
                      />
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      <ToggleSwitch
                        sizing="sm"
                        checked={item.profileVisibility}
                        disabled={loading || !item.profileVerified}
                        onChange={(e) => {
                          updateProfileVisibility(item._id, e);
                        }}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
          <div className="p-4 mb-4 mx-auto">
            <Pagination
              currentPage={page}
              layout="pagination"
              nextLabel=""
              onPageChange={(newPage) => {
                setPage(newPage);
              }}
              previousLabel=""
              showIcons
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </>
  );
}
