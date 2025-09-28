import VendorHeaderDropdown from "@/components/dropdown/VendorHeaderDropdown";
import HorizontalLine from "@/components/other/HorizontalLine";
import { toPriceString } from "@/utils/text";
import { Button, Label, Select, TextInput, ToggleSwitch } from "flowbite-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BiPlus, BiRupee } from "react-icons/bi";
import { BsArrowUp, BsPlus, BsPlusCircle } from "react-icons/bs";
import { MdCancel, MdDelete, MdOpenInNew } from "react-icons/md";

export default function Vendor({ message, setMessage }) {
  const router = useRouter();
  const { vendorId } = router.query;
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState({});
  const [personalPackages, setPersonalPackages] = useState([]);
  const [newPersonalPackage, setNewPersonalPackage] = useState({
    name: "",
    services: [],
    price: 0,
    amountToVendor: 0,
    amountToWedsy: 0,
  });
  const [editPersonalPackage, setEditPersonalPackage] = useState({
    name: "",
    services: [],
    price: 0,
    amountToVendor: 0,
    amountToWedsy: 0,
  });
  const [displayNewPersonalPackage, setDisplayNewPersonalPackage] =
    useState(false);
  const [displayEditPersonalPackage, setDisplayEditPersonalPackage] =
    useState(false);
  const [bookingAmount, setBookingAmount] = useState({});
  const updatePersonalPackage = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor-personal-package/${displayEditPersonalPackage}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editPersonalPackage),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          setMessage({
            text: "Package added Successfully!",
            status: "success",
            display: true,
          });
          setDisplayEditPersonalPackage(false);
          setEditPersonalPackage({
            name: "",
            services: [],
            price: 0,
            amountToVendor: 0,
            amountToWedsy: 0,
          });
          fetchPersonalPackages();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updatePersonalPackageStatus = (pid, active) => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor-personal-package/${pid}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ active }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          setMessage({
            text: "Package status updated Successfully!",
            status: "success",
            display: true,
          });
          fetchPersonalPackages();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const deletePersonalPackage = (pid) => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor-personal-package/${pid}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          setMessage({
            text: "Package deleted Successfully!",
            status: "success",
            display: true,
          });
          fetchPersonalPackages();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addPersonalPackage = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor-personal-package`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ ...newPersonalPackage, vendorId }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          setMessage({
            text: "Package added Successfully!",
            status: "success",
            display: true,
          });
          setDisplayNewPersonalPackage(false);
          setNewPersonalPackage({
            name: "",
            services: [],
            price: 0,
            amountToVendor: 0,
            amountToWedsy: 0,
          });
          fetchPersonalPackages();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchBookingAmount = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/config?code=MUA-BookingAmount`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setBookingAmount(response.data);
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchPersonalPackages = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor-personal-package?vendorId=${vendorId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          router.push("/login");
          return;
        } else {
          return response.json();
        }
      })
      .then((response) => {
        if (response) {
          setLoading(false);
          setPersonalPackages(response);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchVendor = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/${vendorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setVendor(response);
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    if (vendorId) {
      fetchVendor();
      fetchPersonalPackages();
      fetchBookingAmount();
    }
  }, [vendorId]);
  return (
    <>
      <div className="flex flex-col gap-6 p-8">
        <div className="grid grid-cols-4 gap-4 items-end">
          <p className="text-xl font-medium col-span-3">{vendor.name}</p>
          <VendorHeaderDropdown
            display={"Personal Packages"}
            vendorId={vendorId}
          />
        </div>
        <div className="flex flex-row gap-4 items-end">
          <div>
            <Label value="Registration Date" />
            <TextInput
              value={new Date(vendor.registrationDate).toLocaleString()}
              readOnly={true}
            />
          </div>
          <div>
            <Label value="Phone" />
            <TextInput value={vendor.phone} readOnly={true} />
          </div>
          <div>
            <Label value="Email" />
            <TextInput value={vendor.email} readOnly={true} />
          </div>
          <div>
            <Label value="Tag" />
            <Select
              value={vendor.tag}
              onChange={(e) => {
                updateTag(e.target.value);
              }}
              readOnly={true}
            >
              <option value="">{vendor.tag}</option>
            </Select>
          </div>
        </div>
        <HorizontalLine />
        <p className="text-lg font-medium">Packages</p>
        <div className="grid grid-cols-4 gap-4">
          {!displayNewPersonalPackage && (
            <Button
              color="dark"
              onClick={() => {
                setDisplayNewPersonalPackage(true);
                setNewPersonalPackage({
                  name: "",
                  services: [""],
                  price: 0,
                  amountToVendor: 0,
                  amountToWedsy: 0,
                });
              }}
            >
              <BiPlus />
              Add More Packages
            </Button>
          )}
          {displayNewPersonalPackage && (
            <>
              <div>
                <Label value="Package Name" />
                <TextInput
                  placeholder="Package Name"
                  disabled={loading}
                  value={newPersonalPackage?.name}
                  onChange={(e) => {
                    setNewPersonalPackage({
                      ...newPersonalPackage,
                      name: e.target.value,
                    });
                  }}
                  className="mb-4"
                />
                <Label value="Package Price" />
                <TextInput
                  placeholder="Package Price"
                  disabled={loading}
                  type="number"
                  value={newPersonalPackage?.price}
                  onChange={(e) => {
                    let p = parseInt(e.target.value) || 0;
                    setNewPersonalPackage({
                      ...newPersonalPackage,
                      price: e.target.value,
                      amountToWedsy:
                        p * (bookingAmount?.personalPackage?.percentage / 100),
                      amountToVendor:
                        p *
                        (1 - bookingAmount?.personalPackage?.percentage / 100),
                    });
                  }}
                />
              </div>
              <div>
                <Label value="Services that will be provided" />
                {newPersonalPackage?.services?.map((item, index) => (
                  <div
                    className="flex flex-row gap-2 items-center mb-2"
                    key={index}
                  >
                    <TextInput
                      key={index}
                      placeholder="Services"
                      value={item}
                      onChange={(e) => {
                        let temp = newPersonalPackage?.services;
                        temp[index] = e.target.value;
                        setNewPersonalPackage({
                          ...newPersonalPackage,
                          services: temp,
                        });
                      }}
                      disabled={loading}
                      className="grow"
                    />
                    <MdCancel
                      size={20}
                      onClick={() => {
                        setNewPersonalPackage({
                          ...newPersonalPackage,
                          services: newPersonalPackage?.services?.filter(
                            (_, i) => i !== index
                          ),
                        });
                      }}
                    />
                  </div>
                ))}
                <div
                  className="flex items-center gap-1 text-sm"
                  onClick={() => {
                    setNewPersonalPackage({
                      ...newPersonalPackage,
                      services: [...newPersonalPackage?.services, ""],
                    });
                  }}
                >
                  Add more <BsPlusCircle />
                </div>
              </div>
              <div>
                <p className="text-xl font-semibold mt-4">Wedsy Settlements</p>
                <div className="flex flex-row justify-between">
                  <p>Amount Payable to Wedsy</p>
                  <p>{toPriceString(newPersonalPackage?.amountToWedsy)}</p>
                </div>
                <div className="flex flex-row justify-between">
                  <p>Amount Payable to You</p>
                  <p>{toPriceString(newPersonalPackage?.amountToVendor)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 items-end gap-4">
                <Button
                  color="success"
                  disabled={loading}
                  onClick={() => {
                    addPersonalPackage();
                  }}
                >
                  Save Package
                </Button>
                <Button
                  color="failure"
                  disabled={loading}
                  onClick={() => {
                    setDisplayNewPersonalPackage(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col gap-4 divide-y">
          {personalPackages?.map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 pt-4">
              <div className="flex flex-col gap-4">
                <div>
                  <Label value="Package Name" />
                  <TextInput
                    readOnly={displayEditPersonalPackage !== item._id}
                    value={
                      displayEditPersonalPackage !== item._id
                        ? item.name
                        : editPersonalPackage.name
                    }
                    onChange={(e) => {
                      setEditPersonalPackage({
                        ...editPersonalPackage,
                        name: e.target.value,
                      });
                    }}
                  />
                </div>
                <div>
                  <Label value="Package Price" />
                  <TextInput
                    readOnly={displayEditPersonalPackage !== item._id}
                    value={
                      displayEditPersonalPackage !== item._id
                        ? item.price
                        : editPersonalPackage.price
                    }
                    onChange={(e) => {
                      let p = parseInt(e.target.value) || 0;
                      setEditPersonalPackage({
                        ...editPersonalPackage,
                        price: e.target.value,
                        amountToWedsy:
                          p *
                          (bookingAmount?.personalPackage?.percentage / 100),
                        amountToVendor:
                          p *
                          (1 -
                            bookingAmount?.personalPackage?.percentage / 100),
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label value="Services" className="-mb-1" />
                {(displayEditPersonalPackage !== item._id
                  ? item
                  : editPersonalPackage
                )?.services.map((rec, recIndex) => (
                  <div
                    className="flex flex-row gap-2 items-center mb-2"
                    key={recIndex}
                  >
                    <TextInput
                      placeholder="Services"
                      value={rec}
                      onChange={(e) => {
                        let temp = editPersonalPackage?.services;
                        temp[index] = e.target.value;
                        setEditPersonalPackage({
                          ...editPersonalPackage,
                          services: temp,
                        });
                      }}
                      disabled={loading}
                      className="grow"
                      readOnly={displayEditPersonalPackage !== item._id}
                    />
                    {displayEditPersonalPackage === item._id && (
                      <MdCancel
                        size={20}
                        onClick={() => {
                          setEditPersonalPackage({
                            ...editPersonalPackage,
                            services: editPersonalPackage?.services?.filter(
                              (_, i) => i !== index
                            ),
                          });
                        }}
                      />
                    )}
                  </div>
                ))}
                {displayEditPersonalPackage === item._id && (
                  <div
                    className="flex items-center gap-1 text-sm"
                    onClick={() => {
                      setEditPersonalPackage({
                        ...editPersonalPackage,
                        services: [...editPersonalPackage?.services, ""],
                      });
                    }}
                  >
                    Add more <BsPlusCircle />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex flex-row justify-between">
                    <p>Amount Payable to Wedsy</p>
                    <p>
                      {toPriceString(
                        (displayEditPersonalPackage !== item._id
                          ? item
                          : editPersonalPackage
                        )?.amountToWedsy
                      )}
                    </p>
                  </div>
                  <div className="flex flex-row justify-between">
                    <p>Amount Payable to You</p>
                    <p>
                      {toPriceString(
                        (displayEditPersonalPackage !== item._id
                          ? item
                          : editPersonalPackage
                        )?.amountToVendor
                      )}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-auto">
                  {!displayEditPersonalPackage && (
                    <>
                      <Button
                        color="success"
                        onClick={() => {
                          setDisplayEditPersonalPackage(item._id);
                          setEditPersonalPackage(item);
                        }}
                      >
                        Update
                      </Button>
                      <div className="flex flex-row items-center gap-4">
                        <Button
                          color="failure"
                          onClick={() => {
                            if (
                              confirm("Do you want to delete this package?")
                            ) {
                              deletePersonalPackage(item._id);
                            }
                          }}
                        >
                          <MdDelete size={20} className="flex-shrink-0" />
                        </Button>
                        <ToggleSwitch
                          checked={item.active}
                          onChange={() => {
                            updatePersonalPackageStatus(
                              item?._id,
                              !item.active
                            );
                          }}
                        />
                      </div>
                    </>
                  )}
                  {displayEditPersonalPackage === item._id && (
                    <>
                      <Button
                        color="success"
                        onClick={() => {
                          updatePersonalPackage();
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        color="failure"
                        onClick={() => {
                          setDisplayEditPersonalPackage("");
                          setEditPersonalPackage({
                            name: "",
                            services: [],
                            price: 0,
                            amountToVendor: 0,
                            amountToWedsy: 0,
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
