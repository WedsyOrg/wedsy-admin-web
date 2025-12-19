import SettingTextInput from "@/components/forms/SettingTextInput";
import {
  Button,
  Checkbox,
  Label,
  Radio,
  Select,
  TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { MdChevronLeft, MdChevronRight, MdDelete } from "react-icons/md";
import {
  TbEqual,
  TbMathEqualGreater,
  TbMathEqualLower,
  TbMathGreater,
  TbMathLower,
} from "react-icons/tb";

export default function MUABookingAmount({
  setMessage,
  loading,
  setLoading,
  display,
}) {
  const [bookingAmountFor, setBookingAmountFor] = useState("Bidding");
  const [data, setData] = useState({
    bidding: { bookingAmount: "percentage", percentage: "0", condition: [] },
    // bookingAmount[Percentage/Condition],percentage,condition:[{condition,value,bookingAmount,amount,percentage}]
    personalPackage: { percentage: "0" },
    wedsyPackage: { percentage: "0" },
  });
  const [editData, setEditData] = useState({
    bidding: { bookingAmount: "percentage", percentage: "0", condition: [] },
    personalPackage: { percentage: "0" },
    wedsyPackage: { percentage: "0" },
  });
  const [edit, setEdit] = useState(false);

  const fetchData = () => {
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
        setData({
          ...response.data,
          personalPackage: {
            ...response.data.personalPackage,
            percentage: String(response.data.personalPackage.percentage),
          },
          wedsyPackage: {
            ...response.data.wedsyPackage,
            percentage: String(response.data.wedsyPackage.percentage),
          },
          bidding: {
            ...response.data.bidding,
            percentage: String(response.data.bidding.percentage),
            condition: response.data.bidding.condition.map((item) => ({
              ...item,
              value: String(item.value),
              amount: String(item.amount),
              percentage: String(item.percentage),
            })),
          },
        });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updateData = async () => {
    const processedData = { ...editData };
    let isValid = true;
    processedData.personalPackage.percentage = parseFloat(
      processedData.personalPackage.percentage.replace(/[^0-9.]/g, "")
    );
    if (
      isNaN(processedData.personalPackage.percentage) ||
      processedData.personalPackage.percentage < 0 ||
      processedData.personalPackage.percentage > 100
    ) {
      alert(`Invalid value for Percentage in Personal Package`);
      isValid = false;
      return;
    }

    processedData.wedsyPackage.percentage = parseFloat(
      processedData.wedsyPackage.percentage.replace(/[^0-9.]/g, "")
    );
    if (
      isNaN(processedData.wedsyPackage.percentage) ||
      processedData.wedsyPackage.percentage < 0 ||
      processedData.wedsyPackage.percentage > 100
    ) {
      alert(`Invalid value for Percentage in Wedsy Package`);
      isValid = false;
      return;
    }

    processedData.bidding.percentage = parseFloat(
      processedData.bidding.percentage.replace(/[^0-9.]/g, "")
    );
    if (
      isNaN(processedData.bidding.percentage) ||
      processedData.bidding.percentage < 0 ||
      processedData.bidding.percentage > 100
    ) {
      alert(`Invalid value for Percentage in Bidding`);
      isValid = false;
      return;
    }

    processedData.bidding.condition = processedData.bidding.condition.map(
      (i) => {
        let t = i;
        t.value = parseFloat(t.value.replace(/[^0-9.]/g, ""));
        t.amount = parseFloat(t.amount.replace(/[^0-9.]/g, ""));
        t.percentage = parseFloat(t.percentage.replace(/[^0-9.]/g, ""));
        if (isNaN(t.percentage) || t.percentage < 0 || t.percentage > 100) {
          alert(`Invalid value for Percentage in Bidding`);
          isValid = false;
        }
        return t;
      }
    );

    if (isValid) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/config`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          code: "MUA-BookingAmount",
          data: processedData,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Booking Amount updated Successfully!",
              status: "success",
              display: true,
            });
            setEdit(false);
            fetchData();
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
    if (display === "MUA Booking Amount") {
      fetchData();
    }
  }, [display]);
  return (
    <>
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full flex flex-col gap-4">
        <p className="text-2xl font-medium ">MUA Booking Amount</p>
        <div className="grid grid-cols-4 gap-4 border-b-2 pb-3">
          <Select
            value={bookingAmountFor}
            onChange={(e) => {
              setBookingAmountFor(e.target.value);
            }}
            disabled={loading}
          >
            <option value={"Bidding"}>Bidding</option>
            <option value={"Personal Package"}>Personal Package</option>
            <option value={"Wedsy Package"}>Wedsy Package</option>
          </Select>
        </div>
        {bookingAmountFor === "Bidding" && (
          <div className="grid grid-cols-4 gap-6 border-b-2 pb-3 items-center">
            <div>
              <Radio
                id="bidding-percentage"
                name="bidding"
                value="percentage"
                checked={
                  (edit
                    ? editData?.bidding?.bookingAmount
                    : data?.bidding?.bookingAmount) === "percentage"
                }
                onChange={(e) => {
                  setEditData({
                    ...editData,
                    bidding: {
                      ...editData?.bidding,
                      bookingAmount: e.target.value,
                    },
                  });
                }}
                className="mr-2"
              />
              <Label
                value="A. Percentage of total amount payable to wedsy (%)"
                htmlFor="bidding-percentage"
              />
            </div>
            <TextInput
              type="number"
              step="0.01"
              min={0}
              max={100}
              readonly={!edit}
              value={
                edit ? editData?.bidding?.percentage : data?.bidding?.percentage
              }
              onChange={(e) => {
                setEditData({
                  ...editData,
                  bidding: {
                    ...editData?.bidding,
                    percentage: e.target.value,
                  },
                });
              }}
            />
            <div className="col-span-2" />
            <div className="col-span-4">
              <Radio
                id="bidding-condition"
                name="bidding"
                value="condition"
                checked={
                  (edit
                    ? editData?.bidding?.bookingAmount
                    : data?.bidding?.bookingAmount) === "condition"
                }
                onChange={(e) => {
                  setEditData({
                    ...editData,
                    bidding: {
                      ...editData?.bidding,
                      bookingAmount: e.target.value,
                    },
                  });
                }}
                className="mr-2"
              />
              <Label
                value="B. If total amount is"
                htmlFor="bidding-condition"
              />
            </div>
            {(edit
              ? editData?.bidding?.condition
              : data?.bidding?.condition
            )?.map((item, index) => (
              <div
                className="col-span-4 grid grid-cols-4 gap-4 px-12"
                key={index}
              >
                <div className="flex flex-row items-center gap-3 justify-center">
                  <Button
                    color={item.condition === "lt" ? "success" : "light"}
                    onClick={() => {
                      setEditData({
                        ...editData,
                        bidding: {
                          ...editData?.bidding,
                          condition: editData.bidding.condition.map(
                            (rec, recIndex) =>
                              recIndex === index
                                ? { ...rec, condition: "lt" }
                                : rec
                          ),
                        },
                      });
                    }}
                    disabled={loading || !edit}
                  >
                    <TbMathLower />
                  </Button>
                  <Button
                    color={item.condition === "lte" ? "success" : "light"}
                    onClick={() => {
                      setEditData({
                        ...editData,
                        bidding: {
                          ...editData?.bidding,
                          condition: editData.bidding.condition.map(
                            (rec, recIndex) =>
                              recIndex === index
                                ? { ...rec, condition: "lte" }
                                : rec
                          ),
                        },
                      });
                    }}
                    disabled={loading || !edit}
                  >
                    <TbMathEqualLower />
                  </Button>
                  <Button
                    color={item.condition === "eq" ? "success" : "light"}
                    onClick={() => {
                      setEditData({
                        ...editData,
                        bidding: {
                          ...editData?.bidding,
                          condition: editData.bidding.condition.map(
                            (rec, recIndex) =>
                              recIndex === index
                                ? { ...rec, condition: "eq" }
                                : rec
                          ),
                        },
                      });
                    }}
                    disabled={loading || !edit}
                  >
                    <TbEqual />
                  </Button>
                  <Button
                    color={item.condition === "gte" ? "success" : "light"}
                    onClick={() => {
                      setEditData({
                        ...editData,
                        bidding: {
                          ...editData?.bidding,
                          condition: editData.bidding.condition.map(
                            (rec, recIndex) =>
                              recIndex === index
                                ? { ...rec, condition: "gte" }
                                : rec
                          ),
                        },
                      });
                    }}
                    disabled={loading || !edit}
                  >
                    <TbMathEqualGreater />
                  </Button>
                  <Button
                    color={item.condition === "gt" ? "success" : "light"}
                    onClick={() => {
                      setEditData({
                        ...editData,
                        bidding: {
                          ...editData?.bidding,
                          condition: editData.bidding.condition.map(
                            (rec, recIndex) =>
                              recIndex === index
                                ? { ...rec, condition: "gt" }
                                : rec
                          ),
                        },
                      });
                    }}
                    disabled={loading || !edit}
                  >
                    <TbMathGreater />
                  </Button>
                </div>
                <TextInput
                  type="number"
                  min={0}
                  max={100}
                  readonly={!edit}
                  value={item.value}
                  onChange={(e) => {
                    setEditData({
                      ...editData,
                      bidding: {
                        ...editData?.bidding,
                        condition: editData.bidding.condition.map(
                          (rec, recIndex) =>
                            recIndex === index
                              ? { ...rec, value: e.target.value }
                              : rec
                        ),
                      },
                    });
                  }}
                />
                <div className="flex flex-row items-center gap-3">
                  <Button
                    color={"failure"}
                    onClick={() => {
                      // Allow deleting an entry even if user forgot to click "Edit" first.
                      if (!edit) {
                        setEditData(data);
                        setEdit(true);
                      }
                      setEditData({
                        ...(edit ? editData : data),
                        bidding: {
                          ...(edit ? editData?.bidding : data?.bidding),
                          condition: (edit
                            ? editData?.bidding?.condition
                            : data?.bidding?.condition
                          ).filter(
                            (rec, recIndex) => recIndex !== index
                          ),
                        },
                      });
                    }}
                    disabled={loading}
                  >
                    <MdDelete />
                    <span className="ml-1">Delete</span>
                  </Button>
                </div>
                <div className="col-span-1" />
                <div>
                  <Radio
                    id={`bidding-percentage-${index}`}
                    name={`bidding-condition-${index}`}
                    value="percentage"
                    checked={item.bookingAmount === "percentage"}
                    onChange={(e) => {
                      setEditData({
                        ...editData,
                        bidding: {
                          ...editData?.bidding,
                          condition: editData.bidding.condition.map(
                            (rec, recIndex) =>
                              recIndex === index
                                ? { ...rec, bookingAmount: e.target.value }
                                : rec
                          ),
                        },
                      });
                    }}
                    className="mr-2"
                  />
                  <Label
                    value="1. Percentage of total amount (%)"
                    htmlFor={`bidding-percentage-${index}`}
                  />
                </div>
                <TextInput
                  type="number"
                  step={0.01}
                  min={0}
                  max={100}
                  readonly={!edit}
                  value={item.percentage}
                  onChange={(e) => {
                    setEditData({
                      ...editData,
                      bidding: {
                        ...editData?.bidding,
                        condition: editData.bidding.condition.map(
                          (rec, recIndex) =>
                            recIndex === index
                              ? { ...rec, percentage: e.target.value }
                              : rec
                        ),
                      },
                    });
                  }}
                />
                <div className="col-span-2" />
                <div>
                  <Radio
                    id={`bidding-amount-${index}`}
                    name={`bidding-condition-${index}`}
                    value="amount"
                    checked={item.bookingAmount === "amount"}
                    onChange={(e) => {
                      setEditData({
                        ...editData,
                        bidding: {
                          ...editData?.bidding,
                          condition: editData.bidding.condition.map(
                            (rec, recIndex) =>
                              recIndex === index
                                ? { ...rec, bookingAmount: e.target.value }
                                : rec
                          ),
                        },
                      });
                    }}
                    className="mr-2"
                  />
                  <Label
                    value="2. Fixed Amount (INR)"
                    htmlFor={`bidding-amount-${index}`}
                  />
                </div>
                <TextInput
                  type="number"
                  min={0}
                  max={100}
                  readonly={!edit}
                  value={item.amount}
                  onChange={(e) => {
                    setEditData({
                      ...editData,
                      bidding: {
                        ...editData?.bidding,
                        condition: editData.bidding.condition.map(
                          (rec, recIndex) =>
                            recIndex === index
                              ? { ...rec, amount: e.target.value }
                              : rec
                        ),
                      },
                    });
                  }}
                />
              </div>
            ))}
            <Button
              color="light"
              onClick={() => {
                setEditData({
                  ...editData,
                  bidding: {
                    ...editData.bidding,
                    condition: [
                      ...editData.bidding.condition,
                      {
                        condition: "",
                        value: "0",
                        bookingAmount: "percentage",
                        amount: "0",
                        percentage: "0",
                      },
                    ],
                  },
                });
              }}
              disabled={loading || !edit}
            >
              <BsPlus size={16} /> Add New
            </Button>
          </div>
        )}
        {bookingAmountFor === "Personal Package" && (
          <div className="grid grid-cols-4 gap-6 border-b-2 pb-3 items-center">
            <Label value="Percentage of total amount payable to wedsy (%)" />
            <TextInput
              type="number"
              step="0.01"
              min={0}
              max={100}
              readonly={!edit}
              value={
                edit
                  ? editData?.personalPackage?.percentage
                  : data?.personalPackage?.percentage
              }
              onChange={(e) => {
                setEditData({
                  ...editData,
                  personalPackage: {
                    ...editData?.personalPackage,
                    percentage: e.target.value,
                  },
                });
              }}
            />
          </div>
        )}
        {bookingAmountFor === "Wedsy Package" && (
          <div className="grid grid-cols-4 gap-6 border-b-2 pb-3 items-center">
            <Label value="Percentage of total amount payable to wedsy (%)" />
            <TextInput
              type="number"
              step="0.01"
              min={0}
              max={100}
              readonly={!edit}
              value={
                edit
                  ? editData?.wedsyPackage?.percentage
                  : data?.wedsyPackage?.percentage
              }
              onChange={(e) => {
                setEditData({
                  ...editData,
                  wedsyPackage: {
                    ...editData?.wedsyPackage,
                    percentage: e.target.value,
                  },
                });
              }}
            />
          </div>
        )}
        <div className="grid grid-cols-4 gap-6">
          <Button
            color="success"
            onClick={() => {
              if (edit) {
                updateData();
              } else {
                setEditData(data);
                setEdit(true);
              }
            }}
          >
            {edit ? "Save" : "Edit"}
          </Button>
          {edit && (
            <Button
              color="failure"
              onClick={() => {
                setEdit(false);
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
