import SettingTextInput from "@/components/forms/SettingTextInput";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { BsPlus } from "react-icons/bs";

export default function MUATaxation({
  setMessage,
  loading,
  setLoading,
  display,
}) {
  const [data, setData] = useState({
    bidding: { sgst: "0", cgst: "0" },
    personalPackage: { sgst: "0", csgt: "0" },
    wedsyPackage: { sgst: "0", cgst: "0" },
  });
  const [editData, setEditData] = useState({
    bidding: { sgst: "0", cgst: "0" },
    personalPackage: { sgst: "0", csgt: "0" },
    wedsyPackage: { sgst: "0", cgst: "0" },
  });
  const [edit, setEdit] = useState(false);

  const fetchData = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/config?code=MUA-Taxation`, {
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
          bidding: {
            sgst: String(response.data.bidding.sgst),
            cgst: String(response.data.bidding.cgst),
          },
          personalPackage: {
            sgst: String(response.data.personalPackage.sgst),
            cgst: String(response.data.personalPackage.cgst),
          },
          wedsyPackage: {
            sgst: String(response.data.wedsyPackage.sgst),
            cgst: String(response.data.wedsyPackage.cgst),
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
    Object.keys(processedData).forEach((key) => {
      Object.keys(processedData[key]).forEach((subKey) => {
        if (subKey === "sgst" || subKey === "cgst") {
          // Convert to float
          const value = parseFloat(
            processedData[key][subKey].replace(/[^0-9.]/g, "")
          );

          // Validate range
          if (isNaN(value) || value < 0 || value > 100) {
            alert(
              `Invalid value for ${subKey} in ${key}: ${processedData[key][subKey]}`
            );
            isValid = false;
          } else {
            processedData[key][subKey] = value;
          }
        }
      });
    });
    if (isValid) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/config`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          code: "MUA-Taxation",
          data: processedData,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Tag updated Successfully!",
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
    if (display === "MUA Taxation") {
      fetchData();
    }
  }, [display]);
  return (
    <>
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full flex flex-col gap-4">
        <p className="text-2xl font-medium border-b-2 pb-3">
          MUA Taxation
          <br />
          <span className="text-sm font-normal">
            Enter the Taxation in Percentage (%)
          </span>
        </p>
        <div className="flex flex-col gap-4 border-b-2 pb-3">
          <p className="text-xl font-medium">Bidding</p>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <Label value="CGST" />
              <TextInput
                readonly={!edit}
                value={edit ? editData?.bidding?.cgst : data?.bidding?.cgst}
                onChange={(e) => {
                  setEditData({
                    ...editData,
                    bidding: {
                      ...editData?.bidding,
                      cgst: e.target.value,
                    },
                  });
                }}
              />
            </div>
            <div>
              <Label value="SGST" />
              <TextInput
                readonly={!edit}
                value={edit ? editData?.bidding?.sgst : data?.bidding?.sgst}
                onChange={(e) => {
                  setEditData({
                    ...editData,
                    bidding: {
                      ...editData?.bidding,
                      sgst: e.target.value,
                    },
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 border-b-2 pb-3">
          <p className="text-xl font-medium">Wedsy Packages</p>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <Label value="CGST" />
              <TextInput
                readonly={!edit}
                value={
                  edit ? editData?.wedsyPackage?.cgst : data?.wedsyPackage?.cgst
                }
                onChange={(e) => {
                  setEditData({
                    ...editData,
                    wedsyPackage: {
                      ...editData?.wedsyPackage,
                      cgst: e.target.value,
                    },
                  });
                }}
              />
            </div>
            <div>
              <Label value="SGST" />
              <TextInput
                readonly={!edit}
                value={
                  edit ? editData?.wedsyPackage?.sgst : data?.wedsyPackage?.sgst
                }
                onChange={(e) => {
                  setEditData({
                    ...editData,
                    wedsyPackage: {
                      ...editData?.wedsyPackage,
                      sgst: e.target.value,
                    },
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 border-b-2 pb-3">
          <p className="text-xl font-medium">Personal Packages</p>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <Label value="CGST" />
              <TextInput
                readonly={!edit}
                value={
                  edit
                    ? editData?.personalPackage?.cgst
                    : data?.personalPackage?.cgst
                }
                onChange={(e) => {
                  setEditData({
                    ...editData,
                    personalPackage: {
                      ...editData?.personalPackage,
                      cgst: e.target.value,
                    },
                  });
                }}
              />
            </div>
            <div>
              <Label value="SGST" />
              <TextInput
                readonly={!edit}
                value={
                  edit
                    ? editData?.personalPackage?.sgst
                    : data?.personalPackage?.sgst
                }
                onChange={(e) => {
                  setEditData({
                    ...editData,
                    personalPackage: {
                      ...editData?.personalPackage,
                      sgst: e.target.value,
                    },
                  });
                }}
              />
            </div>
          </div>
        </div>
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
