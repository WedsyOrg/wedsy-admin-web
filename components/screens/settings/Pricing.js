import {
  Button,
  Label,
  Select,
  Table,
  TextInput,
  ToggleSwitch,
  Tooltip,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { BsPlus, BsSearch } from "react-icons/bs";
import { MdDelete, MdEditDocument, MdRefresh } from "react-icons/md";
import { FaUndoAlt } from "react-icons/fa";

const taxationInitialValues = {
  title: "",
  sgst: 0,
  cgst: 0,
  decorItems: [],
  categories: [],
  status: true,
};

const couponInitialValues = {
  title: "",
  couponPercentage: 0,
  couponAmount: 0,
  decorItems: [],
  categories: [],
  status: true,
};

const discountInitialValues = {
  title: "",
  discountPercentage: 0,
  discountAmount: 0,
  decorItems: [],
  categories: [],
  status: true,
};

const pricingVariationInitialValues = {
  title: "",
  variationType: "",
  pricingType: "",
  percentage: 0,
  amount: 0,
  decorItems: [],
  categories: [],
  status: true,
};

export default function Pricing({
  message,
  setMessage,
  loading,
  setLoading,
  display,
}) {
  const [module, setModule] = useState("");
  const [taxationList, setTaxationList] = useState([]);
  const [couponList, setCouponList] = useState([]);
  const [discountList, setDiscountList] = useState([]);
  const [pricingVariationList, setPricingVariationList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [decorItemList, setDecorItemList] = useState([]);
  const [displayCategories, setDisplayCategories] = useState(false);
  const [displayDecorItems, setDisplayItems] = useState(false);
  const [decorSearchText, setDecorSearchText] = useState("");
  const [addNewTaxation, setAddNewTaxation] = useState({
    ...taxationInitialValues,
    display: false,
  });
  const [addNewCoupon, setAddNewCoupon] = useState({
    ...couponInitialValues,
    display: false,
  });
  const [addNewDiscount, setAddNewDiscount] = useState({
    ...discountInitialValues,
    display: false,
  });
  const [addNewPricingVariation, setAddNewPricingVariation] = useState({
    ...pricingVariationInitialValues,
    display: false,
  });
  const [editTaxation, setEditTaxation] = useState({
    ...taxationInitialValues,
    display: false,
    _id: "",
  });
  const [editCoupon, setEditCoupon] = useState({
    ...couponInitialValues,
    display: false,
    _id: "",
  });
  const [editDiscount, setEditDiscount] = useState({
    ...discountInitialValues,
    display: false,
    _id: "",
  });
  const fetchDecorList = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/decor?searchFor=decorId&decorId=${decorSearchText}&limit=5`,
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
        setDecorItemList(response.list);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchLists = () => {
    setLoading(true);
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/taxation`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((response) => response.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupon`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((response) => response.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/discount`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((response) => response.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/pricing-variation`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((response) => response.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((response) => response.json()),
    ])
      .then((responses) => {
        setTaxationList(responses[0]);
        setCouponList(responses[1]);
        setDiscountList(responses[2]);
        setPricingVariationList(responses[3]);
        setCategoryList(responses[4]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchTaxations = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/taxation`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setTaxationList(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchCoupons = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupon`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setCouponList(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchDiscounts = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/discount`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setDiscountList(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchPricingVariations = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/pricing-variation`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setPricingVariationList(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addTaxation = async () => {
    if (addNewTaxation.title) {
      setLoading(true);
      let tempData = addNewTaxation;
      delete tempData.display;
      tempData.decorItems = tempData.decorItems?.map((i) => i._id);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/taxation`, {
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
              text: "Taxation added Successfully!",
              status: "success",
              display: true,
            });
            setAddNewTaxation({
              ...addNewTaxation,
              ...taxationInitialValues,
              display: false,
            });
            fetchTaxations();
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
  const addCoupon = async () => {
    if (addNewCoupon.title) {
      setLoading(true);
      let tempData = addNewCoupon;
      delete tempData.display;
      tempData.decorItems = tempData.decorItems?.map((i) => i._id);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupon`, {
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
              text: "Coupon added Successfully!",
              status: "success",
              display: true,
            });
            setAddNewCoupon({
              ...addNewCoupon,
              ...couponInitialValues,
              display: false,
            });
            fetchCoupons();
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
  const addDiscount = async () => {
    if (addNewDiscount.title) {
      setLoading(true);
      let tempData = addNewDiscount;
      delete tempData.display;
      tempData.decorItems = tempData.decorItems?.map((i) => i._id);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/discount`, {
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
              text: "Discount added Successfully!",
              status: "success",
              display: true,
            });
            setAddNewDiscount({
              ...addNewDiscount,
              ...discountInitialValues,
              display: false,
            });
            fetchDiscounts();
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
  const addPricingVariation = async () => {
    if (addNewPricingVariation.title) {
      setLoading(true);
      let tempData = addNewPricingVariation;
      delete tempData.display;
      tempData.decorItems = tempData.decorItems?.map((i) => i._id);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/pricing-variation`, {
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
              text: "Pricing Variation added Successfully!",
              status: "success",
              display: true,
            });
            setAddNewPricingVariation({
              ...addNewPricingVariation,
              ...pricingVariationInitialValues,
              display: false,
            });
            fetchPricingVariations();
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
  const updateTaxation = async () => {
    if (editTaxation.title) {
      setLoading(true);
      let tempData = editTaxation;
      delete tempData.display;
      tempData.decorItems = tempData.decorItems?.map((i) => i._id);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/taxation/${editTaxation._id}`, {
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
              text: "Taxation updated Successfully!",
              status: "success",
              display: true,
            });
            setEditTaxation({
              ...editTaxation,
              ...taxationInitialValues,
              display: false,
              _id: "",
            });
            fetchTaxations();
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
  const updateCoupon = async () => {
    if (editCoupon.title) {
      setLoading(true);
      let tempData = editCoupon;
      delete tempData.display;
      tempData.decorItems = tempData.decorItems?.map((i) => i._id);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupon/${editCoupon._id}`, {
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
              text: "Coupon updated Successfully!",
              status: "success",
              display: true,
            });
            setEditCoupon({
              ...editCoupon,
              ...couponInitialValues,
              display: false,
              _id: "",
            });
            fetchCoupons();
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
  const updateDiscount = async () => {
    if (editDiscount.title) {
      setLoading(true);
      let tempData = editDiscount;
      delete tempData.display;
      tempData.decorItems = tempData.decorItems?.map((i) => i._id);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/discount/${editDiscount._id}`, {
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
              text: "Discount updated Successfully!",
              status: "success",
              display: true,
            });
            setEditDiscount({
              ...editDiscount,
              ...discountInitialValues,
              display: false,
              _id: "",
            });
            fetchDiscounts();
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
  const updateTaxationStatus = async (_id, status) => {
    if (_id) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/taxation/${_id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Taxation Status updated Successfully!",
              status: "success",
              display: true,
            });
            fetchTaxations();
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
  const updateCouponStatus = async (_id, status) => {
    if (_id) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupon/${_id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Coupon Status updated Successfully!",
              status: "success",
              display: true,
            });
            fetchCoupons();
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
  const updateDiscountStatus = async (_id, status) => {
    if (_id) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/discount/${_id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Discount Status updated Successfully!",
              status: "success",
              display: true,
            });
            fetchDiscounts();
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
  const revertPricingVariation = async (_id) => {
    if (_id) {
      setLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pricing-variation/${_id}/revert`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Pricing Variation reverted Successfully!",
              status: "success",
              display: true,
            });
            fetchPricingVariations();
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
  const deleteTaxation = (_id) => {
    if (_id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/taxation/${_id}`, {
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
              text: "Taxation deleted Successfully!",
              status: "success",
              display: true,
            });
            fetchTaxations();
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
  const deleteCoupon = (_id) => {
    if (_id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupon/${_id}`, {
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
              text: "Coupon deleted Successfully!",
              status: "success",
              display: true,
            });
            fetchCoupons();
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
  const deleteDiscount = (_id) => {
    if (_id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/discount/${_id}`, {
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
              text: "Discount deleted Successfully!",
              status: "success",
              display: true,
            });
            fetchDiscounts();
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
    if (display === "Pricing") {
      fetchLists();
    }
  }, [display]);
  useEffect(() => {
    if (decorSearchText) {
      fetchDecorList();
    }
  }, [decorSearchText]);
  return (
    <>
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-4">
          <p
            className={`text-xl font-medium ${
              module !== "Price Variations" && " col-span-2 "
            }`}
          >
            Pricing
          </p>
          {module === "Price Variations" && (
            <Button
              color="light"
              onClick={() => {
                fetchPricingVariations();
              }}
              disabled={loading}
            >
              <MdRefresh size={16} /> Refresh
            </Button>
          )}
          <Button
            color="light"
            onClick={() => {
              if (module === "Taxation") {
                setAddNewTaxation({
                  ...addNewTaxation,
                  ...taxationInitialValues,
                  display: true,
                });
              } else if (module === "Discount") {
                setAddNewDiscount({
                  ...addNewDiscount,
                  ...discountInitialValues,
                  display: true,
                });
              } else if (module === "Coupons") {
                setAddNewCoupon({
                  ...addNewCoupon,
                  ...couponInitialValues,
                  display: true,
                });
              } else if (module === "Price Variations") {
                setAddNewPricingVariation({
                  ...addNewPricingVariation,
                  ...pricingVariationInitialValues,
                  display: true,
                });
              }
            }}
            disabled={
              loading ||
              module === "" ||
              addNewTaxation.display ||
              addNewCoupon.display ||
              addNewDiscount.display ||
              addNewPricingVariation.display ||
              editTaxation.display ||
              editCoupon.display ||
              editDiscount.display
            }
          >
            <BsPlus size={16} /> Add New
          </Button>
          <Select
            value={module}
            onChange={(e) => {
              setAddNewTaxation({
                ...addNewTaxation,
                ...taxationInitialValues,
                display: false,
              });
              setEditTaxation({
                ...editTaxation,
                ...taxationInitialValues,
                display: false,
                _id: "",
              });
              setAddNewDiscount({
                ...addNewDiscount,
                ...discountInitialValues,
                display: false,
              });
              setEditDiscount({
                ...editDiscount,
                ...discountInitialValues,
                display: false,
                _id: "",
              });
              setAddNewCoupon({
                ...addNewCoupon,
                ...couponInitialValues,
                display: false,
              });
              setEditCoupon({
                ...editCoupon,
                ...couponInitialValues,
                display: false,
                _id: "",
              });
              setAddNewPricingVariation({
                ...addNewPricingVariation,
                ...pricingVariationInitialValues,
                display: false,
              });
              setModule(e.target.value);
            }}
            disabled={loading}
          >
            <option value={""}>Select Option</option>
            <option value={"Taxation"}>Taxation</option>
            <option value={"Discount"}>Discount</option>
            <option value={"Coupons"}>Coupons</option>
            <option value={"Price Variations"}>Price Variations</option>
          </Select>
        </div>
        {addNewTaxation.display && (
          <div className="grid grid-cols-4 gap-4">
            <div className="">
              <Label value="Title" />
              <TextInput
                placeholder="Title"
                value={addNewTaxation.title}
                disabled={loading}
                onChange={(e) => {
                  setAddNewTaxation({
                    ...addNewTaxation,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div className="">
              <Label value="SGST" />
              <TextInput
                type="number"
                placeholder="SGST"
                value={addNewTaxation.sgst}
                disabled={loading}
                onChange={(e) => {
                  setAddNewTaxation({
                    ...addNewTaxation,
                    sgst: e.target.value,
                  });
                }}
              />
            </div>
            <div className="">
              <Label value="CGST" />
              <TextInput
                type="number"
                placeholder="CGST"
                value={addNewTaxation.cgst}
                disabled={loading}
                onChange={(e) => {
                  setAddNewTaxation({
                    ...addNewTaxation,
                    cgst: e.target.value,
                  });
                }}
              />
            </div>
            <div className="place-self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  addTaxation();
                }}
                disabled={loading || !addNewTaxation.title}
                className="grow"
              >
                Add Taxation
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setAddNewTaxation({
                    ...addNewTaxation,
                    ...taxationInitialValues,
                    display: false,
                  });
                }}
                disabled={loading}
              >
                <MdDelete size={24} />
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4 items-center col-span-4">
              <Button
                color="gray"
                onClick={() => {
                  setDecorSearchText("");
                  setDisplayItems(false);
                  setDisplayCategories(true);
                }}
                disabled={loading || displayCategories}
                className="grow"
              >
                Select Categories
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setDecorSearchText("");
                  setDisplayItems(true);
                  setDisplayCategories(false);
                }}
                disabled={loading || displayDecorItems}
                className="grow"
              >
                Select Decor Items
              </Button>
              {displayDecorItems && (
                <TextInput
                  placeholder="Search Decor Items"
                  icon={BsSearch}
                  onChange={(e) => {
                    setDecorSearchText(e.target.value);
                  }}
                />
              )}
            </div>
            {(displayCategories || displayDecorItems) && (
              <div className="col-span-4 flex flex-row gap-3 items-center flex-wrap">
                {displayCategories &&
                  categoryList?.map((item, index) => (
                    <Button
                      key={index}
                      color={
                        addNewTaxation.categories.includes(item.name)
                          ? "success"
                          : "gray"
                      }
                      onClick={() => {
                        if (addNewTaxation.categories.includes(item.name)) {
                          setAddNewTaxation({
                            ...addNewTaxation,
                            categories: addNewTaxation.categories.filter(
                              (i) => i !== item.name
                            ),
                          });
                        } else {
                          setAddNewTaxation({
                            ...addNewTaxation,
                            categories: [
                              ...addNewTaxation.categories,
                              item.name,
                            ],
                          });
                        }
                      }}
                    >
                      {item.name}
                    </Button>
                  ))}
                {displayDecorItems &&
                  addNewTaxation.decorItems
                    ?.filter(
                      (item) =>
                        !decorItemList.find((i) => i._id == item._id)?._id
                    )
                    ?.map((item, index) => (
                      <Button
                        key={index}
                        color={
                          addNewTaxation.decorItems.find(
                            (i) => i._id == item._id
                          )
                            ? "success"
                            : "gray"
                        }
                        onClick={() => {
                          if (
                            addNewTaxation.decorItems.find(
                              (i) => i._id == item._id
                            )
                          ) {
                            setAddNewTaxation({
                              ...addNewTaxation,
                              decorItems: addNewTaxation.decorItems.filter(
                                (i) => i._id !== item._id
                              ),
                            });
                          } else {
                            setAddNewTaxation({
                              ...addNewTaxation,
                              decorItems: [...addNewTaxation.decorItems, item],
                            });
                          }
                        }}
                      >
                        {item.productInfo.id} | {item.name}
                      </Button>
                    ))}
                {displayDecorItems &&
                  decorItemList?.map((item, index) => (
                    <Button
                      key={index}
                      color={
                        addNewTaxation.decorItems.find((i) => i._id == item._id)
                          ? "success"
                          : "gray"
                      }
                      onClick={() => {
                        if (
                          addNewTaxation.decorItems.find(
                            (i) => i._id == item._id
                          )
                        ) {
                          setAddNewTaxation({
                            ...addNewTaxation,
                            decorItems: addNewTaxation.decorItems.filter(
                              (i) => i._id !== item._id
                            ),
                          });
                        } else {
                          setAddNewTaxation({
                            ...addNewTaxation,
                            decorItems: [...addNewTaxation.decorItems, item],
                          });
                        }
                      }}
                    >
                      {item.productInfo.id} | {item.name}
                    </Button>
                  ))}
              </div>
            )}
          </div>
        )}
        {addNewCoupon.display && (
          <div className="grid grid-cols-4 gap-4">
            <div className="">
              <Label value="Title" />
              <TextInput
                placeholder="Title"
                value={addNewCoupon.title}
                disabled={loading}
                onChange={(e) => {
                  setAddNewCoupon({
                    ...addNewCoupon,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div className="">
              <Label value="Amount" />
              <TextInput
                type="number"
                placeholder="Amount"
                value={addNewCoupon.couponAmount}
                disabled={loading}
                onChange={(e) => {
                  setAddNewCoupon({
                    ...addNewCoupon,
                    couponAmount: e.target.value,
                  });
                }}
              />
            </div>
            <div className="">
              <Label value="Percentage" />
              <TextInput
                type="number"
                placeholder="Percentage"
                value={addNewCoupon.couponPercentage}
                disabled={loading}
                onChange={(e) => {
                  setAddNewCoupon({
                    ...addNewCoupon,
                    couponPercentage: e.target.value,
                  });
                }}
              />
            </div>
            <div className="place-self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  addCoupon();
                }}
                disabled={loading || !addNewCoupon.title}
                className="grow"
              >
                Add Coupon
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setAddNewCoupon({
                    ...addNewCoupon,
                    ...couponInitialValues,
                    display: false,
                  });
                }}
                disabled={loading}
              >
                <MdDelete size={24} />
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4 items-center col-span-4">
              <Button
                color="gray"
                onClick={() => {
                  setDecorSearchText("");
                  setDisplayItems(false);
                  setDisplayCategories(true);
                }}
                disabled={loading || displayCategories}
                className="grow"
              >
                Select Categories
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setDecorSearchText("");
                  setDisplayItems(true);
                  setDisplayCategories(false);
                }}
                disabled={loading || displayDecorItems}
                className="grow"
              >
                Select Decor Items
              </Button>
              {displayDecorItems && (
                <TextInput
                  placeholder="Search Decor Items"
                  icon={BsSearch}
                  onChange={(e) => {
                    setDecorSearchText(e.target.value);
                  }}
                />
              )}
            </div>
            {(displayCategories || displayDecorItems) && (
              <div className="col-span-4 flex flex-row gap-3 items-center flex-wrap">
                {displayCategories &&
                  categoryList?.map((item, index) => (
                    <Button
                      key={index}
                      color={
                        addNewCoupon.categories.includes(item.name)
                          ? "success"
                          : "gray"
                      }
                      onClick={() => {
                        if (addNewCoupon.categories.includes(item.name)) {
                          setAddNewCoupon({
                            ...addNewCoupon,
                            categories: addNewCoupon.categories.filter(
                              (i) => i !== item.name
                            ),
                          });
                        } else {
                          setAddNewCoupon({
                            ...addNewCoupon,
                            categories: [...addNewCoupon.categories, item.name],
                          });
                        }
                      }}
                    >
                      {item.name}
                    </Button>
                  ))}
                {displayDecorItems &&
                  addNewCoupon.decorItems
                    ?.filter(
                      (item) =>
                        !decorItemList.find((i) => i._id == item._id)?._id
                    )
                    ?.map((item, index) => (
                      <Button
                        key={index}
                        color={
                          addNewCoupon.decorItems.find((i) => i._id == item._id)
                            ? "success"
                            : "gray"
                        }
                        onClick={() => {
                          if (
                            addNewCoupon.decorItems.find(
                              (i) => i._id == item._id
                            )
                          ) {
                            setAddNewCoupon({
                              ...addNewCoupon,
                              decorItems: addNewCoupon.decorItems.filter(
                                (i) => i._id !== item._id
                              ),
                            });
                          } else {
                            setAddNewCoupon({
                              ...addNewCoupon,
                              decorItems: [...addNewCoupon.decorItems, item],
                            });
                          }
                        }}
                      >
                        {item.productInfo.id} | {item.name}
                      </Button>
                    ))}
                {displayDecorItems &&
                  decorItemList?.map((item, index) => (
                    <Button
                      key={index}
                      color={
                        addNewCoupon.decorItems.find((i) => i._id == item._id)
                          ? "success"
                          : "gray"
                      }
                      onClick={() => {
                        if (
                          addNewCoupon.decorItems.find((i) => i._id == item._id)
                        ) {
                          setAddNewCoupon({
                            ...addNewCoupon,
                            decorItems: addNewCoupon.decorItems.filter(
                              (i) => i._id !== item._id
                            ),
                          });
                        } else {
                          setAddNewCoupon({
                            ...addNewCoupon,
                            decorItems: [...addNewCoupon.decorItems, item],
                          });
                        }
                      }}
                    >
                      {item.productInfo.id} | {item.name}
                    </Button>
                  ))}
              </div>
            )}
          </div>
        )}
        {addNewDiscount.display && (
          <div className="grid grid-cols-4 gap-4">
            <div className="">
              <Label value="Title" />
              <TextInput
                placeholder="Title"
                value={addNewDiscount.title}
                disabled={loading}
                onChange={(e) => {
                  setAddNewDiscount({
                    ...addNewDiscount,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div className="">
              <Label value="Amount" />
              <TextInput
                type="number"
                placeholder="Amount"
                value={addNewDiscount.discountAmount}
                disabled={loading}
                onChange={(e) => {
                  setAddNewDiscount({
                    ...addNewDiscount,
                    discountAmount: e.target.value,
                  });
                }}
              />
            </div>
            <div className="">
              <Label value="Percentage" />
              <TextInput
                type="number"
                placeholder="Percentage"
                value={addNewDiscount.discountPercentage}
                disabled={loading}
                onChange={(e) => {
                  setAddNewDiscount({
                    ...addNewDiscount,
                    discountPercentage: e.target.value,
                  });
                }}
              />
            </div>
            <div className="place-self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  addDiscount();
                }}
                disabled={loading || !addNewDiscount.title}
                className="grow"
              >
                Add Discount
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setAddNewDiscount({
                    ...addNewDiscount,
                    ...discountInitialValues,
                    display: false,
                  });
                }}
                disabled={loading}
              >
                <MdDelete size={24} />
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4 items-center col-span-4">
              <Button
                color="gray"
                onClick={() => {
                  setDecorSearchText("");
                  setDisplayItems(false);
                  setDisplayCategories(true);
                }}
                disabled={loading || displayCategories}
                className="grow"
              >
                Select Categories
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setDecorSearchText("");
                  setDisplayItems(true);
                  setDisplayCategories(false);
                }}
                disabled={loading || displayDecorItems}
                className="grow"
              >
                Select Decor Items
              </Button>
              {displayDecorItems && (
                <TextInput
                  placeholder="Search Decor Items"
                  icon={BsSearch}
                  onChange={(e) => {
                    setDecorSearchText(e.target.value);
                  }}
                />
              )}
            </div>
            {(displayCategories || displayDecorItems) && (
              <div className="col-span-4 flex flex-row gap-3 items-center flex-wrap">
                {displayCategories &&
                  categoryList?.map((item, index) => (
                    <Button
                      key={index}
                      color={
                        addNewDiscount.categories.includes(item.name)
                          ? "success"
                          : "gray"
                      }
                      onClick={() => {
                        if (addNewDiscount.categories.includes(item.name)) {
                          setAddNewDiscount({
                            ...addNewDiscount,
                            categories: addNewDiscount.categories.filter(
                              (i) => i !== item.name
                            ),
                          });
                        } else {
                          setAddNewDiscount({
                            ...addNewDiscount,
                            categories: [
                              ...addNewDiscount.categories,
                              item.name,
                            ],
                          });
                        }
                      }}
                    >
                      {item.name}
                    </Button>
                  ))}
                {displayDecorItems &&
                  addNewDiscount.decorItems
                    ?.filter(
                      (item) =>
                        !decorItemList.find((i) => i._id == item._id)?._id
                    )
                    ?.map((item, index) => (
                      <Button
                        key={index}
                        color={
                          addNewDiscount.decorItems.find(
                            (i) => i._id == item._id
                          )
                            ? "success"
                            : "gray"
                        }
                        onClick={() => {
                          if (
                            addNewDiscount.decorItems.find(
                              (i) => i._id == item._id
                            )
                          ) {
                            setAddNewDiscount({
                              ...addNewDiscount,
                              decorItems: addNewDiscount.decorItems.filter(
                                (i) => i._id !== item._id
                              ),
                            });
                          } else {
                            setAddNewDiscount({
                              ...addNewDiscount,
                              decorItems: [...addNewDiscount.decorItems, item],
                            });
                          }
                        }}
                      >
                        {item.productInfo.id} | {item.name}
                      </Button>
                    ))}
                {displayDecorItems &&
                  decorItemList?.map((item, index) => (
                    <Button
                      key={index}
                      color={
                        addNewDiscount.decorItems.find((i) => i._id == item._id)
                          ? "success"
                          : "gray"
                      }
                      onClick={() => {
                        if (
                          addNewDiscount.decorItems.find(
                            (i) => i._id == item._id
                          )
                        ) {
                          setAddNewDiscount({
                            ...addNewDiscount,
                            decorItems: addNewDiscount.decorItems.filter(
                              (i) => i._id !== item._id
                            ),
                          });
                        } else {
                          setAddNewDiscount({
                            ...addNewDiscount,
                            decorItems: [...addNewDiscount.decorItems, item],
                          });
                        }
                      }}
                    >
                      {item.productInfo.id} | {item.name}
                    </Button>
                  ))}
              </div>
            )}
          </div>
        )}
        {addNewPricingVariation.display && (
          <div className="grid grid-cols-4 gap-4">
            <div className="">
              <Label value="Title" />
              <TextInput
                placeholder="Title"
                value={addNewPricingVariation.title}
                disabled={loading}
                onChange={(e) => {
                  setAddNewPricingVariation({
                    ...addNewPricingVariation,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div className="">
              <Label value="Amount" />
              <TextInput
                type="number"
                placeholder="Amount"
                value={addNewPricingVariation.amount}
                disabled={loading}
                onChange={(e) => {
                  setAddNewPricingVariation({
                    ...addNewPricingVariation,
                    amount: e.target.value,
                  });
                }}
              />
            </div>
            <div className="">
              <Label value="Percentage" />
              <TextInput
                type="number"
                placeholder="Percentage"
                value={addNewPricingVariation.percentage}
                disabled={loading}
                onChange={(e) => {
                  setAddNewPricingVariation({
                    ...addNewPricingVariation,
                    percentage: e.target.value,
                  });
                }}
              />
            </div>
            <div className="place-self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  addPricingVariation();
                }}
                disabled={
                  loading ||
                  !addNewPricingVariation.title ||
                  !addNewPricingVariation.variationType ||
                  !addNewPricingVariation.pricingType
                }
                className="grow"
              >
                Add Pricing Variation
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setAddNewPricingVariation({
                    ...addNewPricingVariation,
                    ...pricingVariationInitialValues,
                    display: false,
                  });
                }}
                disabled={loading}
              >
                <MdDelete size={24} />
              </Button>
            </div>
            <Select
              value={addNewPricingVariation.variationType}
              onChange={(e) => {
                setAddNewPricingVariation({
                  ...addNewPricingVariation,
                  variationType: e.target.value,
                });
              }}
              disabled={loading}
            >
              <option value={""}>Select Variation</option>
              <option value={"Increase"}>Increase</option>
              <option value={"Decrease"}>Decrease</option>
            </Select>
            <Select
              value={addNewPricingVariation.pricingType}
              onChange={(e) => {
                setAddNewPricingVariation({
                  ...addNewPricingVariation,
                  pricingType: e.target.value,
                });
              }}
              disabled={loading}
            >
              <option value={""}>Select Price Type</option>
              <option value={"SellingPrice"}>SellingPrice</option>
              <option value={"CostPrice"}>CostPrice</option>
            </Select>
            <div className="grid grid-cols-4 gap-4 items-center col-span-4">
              <Button
                color="gray"
                onClick={() => {
                  setDecorSearchText("");
                  setDisplayItems(false);
                  setDisplayCategories(true);
                }}
                disabled={loading || displayCategories}
                className="grow"
              >
                Select Categories
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setDecorSearchText("");
                  setDisplayItems(true);
                  setDisplayCategories(false);
                }}
                disabled={loading || displayDecorItems}
                className="grow"
              >
                Select Decor Items
              </Button>
              {displayDecorItems && (
                <TextInput
                  placeholder="Search Decor Items"
                  icon={BsSearch}
                  onChange={(e) => {
                    setDecorSearchText(e.target.value);
                  }}
                />
              )}
            </div>
            {(displayCategories || displayDecorItems) && (
              <div className="col-span-4 flex flex-row gap-3 items-center flex-wrap">
                {displayCategories &&
                  categoryList?.map((item, index) => (
                    <Button
                      key={index}
                      color={
                        addNewPricingVariation.categories.includes(item.name)
                          ? "success"
                          : "gray"
                      }
                      onClick={() => {
                        if (
                          addNewPricingVariation.categories.includes(item.name)
                        ) {
                          setAddNewPricingVariation({
                            ...addNewPricingVariation,
                            categories:
                              addNewPricingVariation.categories.filter(
                                (i) => i !== item.name
                              ),
                          });
                        } else {
                          setAddNewPricingVariation({
                            ...addNewPricingVariation,
                            categories: [
                              ...addNewPricingVariation.categories,
                              item.name,
                            ],
                          });
                        }
                      }}
                    >
                      {item.name}
                    </Button>
                  ))}
                {displayDecorItems &&
                  addNewPricingVariation.decorItems
                    ?.filter(
                      (item) =>
                        !decorItemList.find((i) => i._id == item._id)?._id
                    )
                    ?.map((item, index) => (
                      <Button
                        key={index}
                        color={
                          addNewPricingVariation.decorItems.find(
                            (i) => i._id == item._id
                          )
                            ? "success"
                            : "gray"
                        }
                        onClick={() => {
                          if (
                            addNewPricingVariation.decorItems.find(
                              (i) => i._id == item._id
                            )
                          ) {
                            setAddNewPricingVariation({
                              ...addNewPricingVariation,
                              decorItems:
                                addNewPricingVariation.decorItems.filter(
                                  (i) => i._id !== item._id
                                ),
                            });
                          } else {
                            setAddNewPricingVariation({
                              ...addNewPricingVariation,
                              decorItems: [
                                ...addNewPricingVariation.decorItems,
                                item,
                              ],
                            });
                          }
                        }}
                      >
                        {item.productInfo.id} | {item.name}
                      </Button>
                    ))}
                {displayDecorItems &&
                  decorItemList?.map((item, index) => (
                    <Button
                      key={index}
                      color={
                        addNewPricingVariation.decorItems.find(
                          (i) => i._id == item._id
                        )
                          ? "success"
                          : "gray"
                      }
                      onClick={() => {
                        if (
                          addNewPricingVariation.decorItems.find(
                            (i) => i._id == item._id
                          )
                        ) {
                          setAddNewPricingVariation({
                            ...addNewPricingVariation,
                            decorItems:
                              addNewPricingVariation.decorItems.filter(
                                (i) => i._id !== item._id
                              ),
                          });
                        } else {
                          setAddNewPricingVariation({
                            ...addNewPricingVariation,
                            decorItems: [
                              ...addNewPricingVariation.decorItems,
                              item,
                            ],
                          });
                        }
                      }}
                    >
                      {item.productInfo.id} | {item.name}
                    </Button>
                  ))}
              </div>
            )}
          </div>
        )}
        {editTaxation.display && (
          <div className="grid grid-cols-4 gap-4">
            <div className="">
              <Label value="Title" />
              <TextInput
                placeholder="Title"
                value={editTaxation.title}
                disabled={loading}
                onChange={(e) => {
                  setEditTaxation({
                    ...editTaxation,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div className="">
              <Label value="SGST" />
              <TextInput
                type="number"
                placeholder="SGST"
                value={editTaxation.sgst}
                disabled={loading}
                onChange={(e) => {
                  setEditTaxation({
                    ...editTaxation,
                    sgst: e.target.value,
                  });
                }}
              />
            </div>
            <div className="">
              <Label value="CGST" />
              <TextInput
                type="number"
                placeholder="CGST"
                value={editTaxation.cgst}
                disabled={loading}
                onChange={(e) => {
                  setEditTaxation({
                    ...editTaxation,
                    cgst: e.target.value,
                  });
                }}
              />
            </div>
            <div className="place-self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  updateTaxation();
                }}
                disabled={loading || !editTaxation.title}
                className="grow"
              >
                Update Taxation
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setEditTaxation({
                    ...editTaxation,
                    ...taxationInitialValues,
                    display: false,
                    _id: "",
                  });
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4 items-center col-span-4">
              <Button
                color="gray"
                onClick={() => {
                  setDecorSearchText("");
                  setDisplayItems(false);
                  setDisplayCategories(true);
                }}
                disabled={loading || displayCategories}
                className="grow"
              >
                Select Categories
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setDecorSearchText("");
                  setDisplayItems(true);
                  setDisplayCategories(false);
                }}
                disabled={loading || displayDecorItems}
                className="grow"
              >
                Select Decor Items
              </Button>
              {displayDecorItems && (
                <TextInput
                  placeholder="Search Decor Items"
                  icon={BsSearch}
                  onChange={(e) => {
                    setDecorSearchText(e.target.value);
                  }}
                />
              )}
            </div>
            {(displayCategories || displayDecorItems) && (
              <div className="col-span-4 flex flex-row gap-3 items-center flex-wrap">
                {displayCategories &&
                  categoryList?.map((item, index) => (
                    <Button
                      key={index}
                      color={
                        editTaxation.categories.includes(item.name)
                          ? "success"
                          : "gray"
                      }
                      onClick={() => {
                        if (editTaxation.categories.includes(item.name)) {
                          setEditTaxation({
                            ...editTaxation,
                            categories: editTaxation.categories.filter(
                              (i) => i !== item.name
                            ),
                          });
                        } else {
                          setEditTaxation({
                            ...editTaxation,
                            categories: [...editTaxation.categories, item.name],
                          });
                        }
                      }}
                    >
                      {item.name}
                    </Button>
                  ))}
                {displayDecorItems &&
                  editTaxation.decorItems
                    ?.filter(
                      (item) =>
                        !decorItemList.find((i) => i._id == item._id)?._id
                    )
                    ?.map((item, index) => (
                      <Button
                        key={index}
                        color={
                          editTaxation.decorItems.find((i) => i._id == item._id)
                            ? "success"
                            : "gray"
                        }
                        onClick={() => {
                          if (
                            editTaxation.decorItems.find(
                              (i) => i._id == item._id
                            )
                          ) {
                            setEditTaxation({
                              ...editTaxation,
                              decorItems: editTaxation.decorItems.filter(
                                (i) => i._id !== item._id
                              ),
                            });
                          } else {
                            setEditTaxation({
                              ...editTaxation,
                              decorItems: [...editTaxation.decorItems, item],
                            });
                          }
                        }}
                      >
                        {item.productInfo.id} | {item.name}
                      </Button>
                    ))}
                {displayDecorItems &&
                  decorItemList?.map((item, index) => (
                    <Button
                      key={index}
                      color={
                        editTaxation.decorItems.find((i) => i._id == item._id)
                          ? "success"
                          : "gray"
                      }
                      onClick={() => {
                        if (
                          editTaxation.decorItems.find((i) => i._id == item._id)
                        ) {
                          setEditTaxation({
                            ...editTaxation,
                            decorItems: editTaxation.decorItems.filter(
                              (i) => i._id !== item._id
                            ),
                          });
                        } else {
                          setEditTaxation({
                            ...editTaxation,
                            decorItems: [...editTaxation.decorItems, item],
                          });
                        }
                      }}
                    >
                      {item.productInfo.id} | {item.name}
                    </Button>
                  ))}
              </div>
            )}
          </div>
        )}
        {editCoupon.display && (
          <div className="grid grid-cols-4 gap-4">
            <div className="">
              <Label value="Title" />
              <TextInput
                placeholder="Title"
                value={editCoupon.title}
                disabled={loading}
                onChange={(e) => {
                  setEditCoupon({
                    ...editCoupon,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div className="">
              <Label value="Amount" />
              <TextInput
                type="number"
                placeholder="Amount"
                value={editCoupon.couponAmount}
                disabled={loading}
                onChange={(e) => {
                  setEditCoupon({
                    ...editCoupon,
                    couponAmount: e.target.value,
                  });
                }}
              />
            </div>
            <div className="">
              <Label value="Percentage" />
              <TextInput
                type="number"
                placeholder="Percentage"
                value={editCoupon.couponPercentage}
                disabled={loading}
                onChange={(e) => {
                  setEditCoupon({
                    ...editCoupon,
                    couponPercentage: e.target.value,
                  });
                }}
              />
            </div>
            <div className="place-self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  updateCoupon();
                }}
                disabled={loading || !editCoupon.title}
                className="grow"
              >
                Update Coupon
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setEditCoupon({
                    ...editCoupon,
                    ...couponInitialValues,
                    display: false,
                    _id: "",
                  });
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4 items-center col-span-4">
              <Button
                color="gray"
                onClick={() => {
                  setDecorSearchText("");
                  setDisplayItems(false);
                  setDisplayCategories(true);
                }}
                disabled={loading || displayCategories}
                className="grow"
              >
                Select Categories
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setDecorSearchText("");
                  setDisplayItems(true);
                  setDisplayCategories(false);
                }}
                disabled={loading || displayDecorItems}
                className="grow"
              >
                Select Decor Items
              </Button>
              {displayDecorItems && (
                <TextInput
                  placeholder="Search Decor Items"
                  icon={BsSearch}
                  onChange={(e) => {
                    setDecorSearchText(e.target.value);
                  }}
                />
              )}
            </div>
            {(displayCategories || displayDecorItems) && (
              <div className="col-span-4 flex flex-row gap-3 items-center flex-wrap">
                {displayCategories &&
                  categoryList?.map((item, index) => (
                    <Button
                      key={index}
                      color={
                        editCoupon.categories.includes(item.name)
                          ? "success"
                          : "gray"
                      }
                      onClick={() => {
                        if (editCoupon.categories.includes(item.name)) {
                          setEditCoupon({
                            ...editCoupon,
                            categories: editCoupon.categories.filter(
                              (i) => i !== item.name
                            ),
                          });
                        } else {
                          setEditCoupon({
                            ...editCoupon,
                            categories: [...editCoupon.categories, item.name],
                          });
                        }
                      }}
                    >
                      {item.name}
                    </Button>
                  ))}
                {displayDecorItems &&
                  editCoupon.decorItems
                    ?.filter(
                      (item) =>
                        !decorItemList.find((i) => i._id == item._id)?._id
                    )
                    ?.map((item, index) => (
                      <Button
                        key={index}
                        color={
                          editCoupon.decorItems.find((i) => i._id == item._id)
                            ? "success"
                            : "gray"
                        }
                        onClick={() => {
                          if (
                            editCoupon.decorItems.find((i) => i._id == item._id)
                          ) {
                            setEditCoupon({
                              ...editCoupon,
                              decorItems: editCoupon.decorItems.filter(
                                (i) => i._id !== item._id
                              ),
                            });
                          } else {
                            setEditCoupon({
                              ...editCoupon,
                              decorItems: [...editCoupon.decorItems, item],
                            });
                          }
                        }}
                      >
                        {item.productInfo.id} | {item.name}
                      </Button>
                    ))}
                {displayDecorItems &&
                  decorItemList?.map((item, index) => (
                    <Button
                      key={index}
                      color={
                        editCoupon.decorItems.find((i) => i._id == item._id)
                          ? "success"
                          : "gray"
                      }
                      onClick={() => {
                        if (
                          editCoupon.decorItems.find((i) => i._id == item._id)
                        ) {
                          setEditCoupon({
                            ...editCoupon,
                            decorItems: editCoupon.decorItems.filter(
                              (i) => i._id !== item._id
                            ),
                          });
                        } else {
                          setEditCoupon({
                            ...editCoupon,
                            decorItems: [...editCoupon.decorItems, item],
                          });
                        }
                      }}
                    >
                      {item.productInfo.id} | {item.name}
                    </Button>
                  ))}
              </div>
            )}
          </div>
        )}
        {editDiscount.display && (
          <div className="grid grid-cols-4 gap-4">
            <div className="">
              <Label value="Title" />
              <TextInput
                placeholder="Title"
                value={editDiscount.title}
                disabled={loading}
                onChange={(e) => {
                  setEditDiscount({
                    ...editDiscount,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div className="">
              <Label value="Amount" />
              <TextInput
                type="number"
                placeholder="Amount"
                value={editDiscount.discountAmount}
                disabled={loading}
                onChange={(e) => {
                  setEditDiscount({
                    ...editDiscount,
                    discountAmount: e.target.value,
                  });
                }}
              />
            </div>
            <div className="">
              <Label value="Percentage" />
              <TextInput
                type="number"
                placeholder="Percentage"
                value={editDiscount.discountPercentage}
                disabled={loading}
                onChange={(e) => {
                  setEditDiscount({
                    ...editDiscount,
                    discountPercentage: e.target.value,
                  });
                }}
              />
            </div>
            <div className="place-self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  updateDiscount();
                }}
                disabled={loading || !editDiscount.title}
                className="grow"
              >
                Update Discount
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setEditDiscount({
                    ...editDiscount,
                    ...discountInitialValues,
                    display: false,
                    _id: "",
                  });
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4 items-center col-span-4">
              <Button
                color="gray"
                onClick={() => {
                  setDecorSearchText("");
                  setDisplayItems(false);
                  setDisplayCategories(true);
                }}
                disabled={loading || displayCategories}
                className="grow"
              >
                Select Categories
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setDecorSearchText("");
                  setDisplayItems(true);
                  setDisplayCategories(false);
                }}
                disabled={loading || displayDecorItems}
                className="grow"
              >
                Select Decor Items
              </Button>
              {displayDecorItems && (
                <TextInput
                  placeholder="Search Decor Items"
                  icon={BsSearch}
                  onChange={(e) => {
                    setDecorSearchText(e.target.value);
                  }}
                />
              )}
            </div>
            {(displayCategories || displayDecorItems) && (
              <div className="col-span-4 flex flex-row gap-3 items-center flex-wrap">
                {displayCategories &&
                  categoryList?.map((item, index) => (
                    <Button
                      key={index}
                      color={
                        editDiscount.categories.includes(item.name)
                          ? "success"
                          : "gray"
                      }
                      onClick={() => {
                        if (editDiscount.categories.includes(item.name)) {
                          setEditDiscount({
                            ...editDiscount,
                            categories: editDiscount.categories.filter(
                              (i) => i !== item.name
                            ),
                          });
                        } else {
                          setEditDiscount({
                            ...editDiscount,
                            categories: [...editDiscount.categories, item.name],
                          });
                        }
                      }}
                    >
                      {item.name}
                    </Button>
                  ))}
                {displayDecorItems &&
                  editDiscount.decorItems
                    ?.filter(
                      (item) =>
                        !decorItemList.find((i) => i._id == item._id)?._id
                    )
                    ?.map((item, index) => (
                      <Button
                        key={index}
                        color={
                          editDiscount.decorItems.find((i) => i._id == item._id)
                            ? "success"
                            : "gray"
                        }
                        onClick={() => {
                          if (
                            editDiscount.decorItems.find(
                              (i) => i._id == item._id
                            )
                          ) {
                            setEditDiscount({
                              ...editDiscount,
                              decorItems: editDiscount.decorItems.filter(
                                (i) => i._id !== item._id
                              ),
                            });
                          } else {
                            setEditDiscount({
                              ...editDiscount,
                              decorItems: [...editDiscount.decorItems, item],
                            });
                          }
                        }}
                      >
                        {item.productInfo.id} | {item.name}
                      </Button>
                    ))}
                {displayDecorItems &&
                  decorItemList?.map((item, index) => (
                    <Button
                      key={index}
                      color={
                        editDiscount.decorItems.find((i) => i._id == item._id)
                          ? "success"
                          : "gray"
                      }
                      onClick={() => {
                        if (
                          editDiscount.decorItems.find((i) => i._id == item._id)
                        ) {
                          setEditDiscount({
                            ...editDiscount,
                            decorItems: editDiscount.decorItems.filter(
                              (i) => i._id !== item._id
                            ),
                          });
                        } else {
                          setEditDiscount({
                            ...editDiscount,
                            decorItems: [...editDiscount.decorItems, item],
                          });
                        }
                      }}
                    >
                      {item.productInfo.id} | {item.name}
                    </Button>
                  ))}
              </div>
            )}
          </div>
        )}
        {module === "Taxation" && (
          <Table hoverable className="width-full overflow-x-auto">
            <Table.Head>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>SGST</Table.HeadCell>
              <Table.HeadCell>CGST</Table.HeadCell>
              <Table.HeadCell>Categories/Decor Items</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {taxationList?.map((item, index) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800 font-medium"
                  key={index}
                >
                  <Table.Cell>{item.title}</Table.Cell>
                  <Table.Cell>{item.sgst}</Table.Cell>
                  <Table.Cell>{item.cgst}</Table.Cell>
                  <Table.Cell>
                    {item.categories.length > 0 && (
                      <div className="block">
                        Categories: {item.categories.join(", ")}
                      </div>
                    )}
                    {item.decorItems.length > 0 && (
                      <div className="block">
                        Decor Items:&nbsp;
                        {item.decorItems.map((i) => i.name).join(", ")}
                      </div>
                    )}
                  </Table.Cell>
                  <Table.Cell className="flex gap-2">
                    <ToggleSwitch
                      checked={item.status}
                      disabled={loading}
                      onChange={(e) => {
                        updateTaxationStatus(item._id, e);
                      }}
                    />
                    {!editTaxation.display && (
                      <MdEditDocument
                        size={24}
                        cursor={"pointer"}
                        className={
                          loading
                            ? "cursor-not-allowed text-gray-300"
                            : "hover:text-blue-700"
                        }
                        onClick={() => {
                          if (!loading) {
                            setEditTaxation({
                              ...item,
                              display: true,
                            });
                          }
                        }}
                      />
                    )}
                    <MdDelete
                      size={24}
                      cursor={"pointer"}
                      className={
                        loading
                          ? "cursor-not-allowed text-gray-300"
                          : "hover:text-blue-700"
                      }
                      onClick={() => {
                        if (!loading) {
                          deleteTaxation(item._id);
                        }
                      }}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
        {module === "Discount" && (
          <Table hoverable className="width-full overflow-x-auto">
            <Table.Head>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Discount Amount</Table.HeadCell>
              <Table.HeadCell>Discount Percentage</Table.HeadCell>
              <Table.HeadCell>Categories/Decor Items</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {discountList?.map((item, index) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800 font-medium"
                  key={index}
                >
                  <Table.Cell>{item.title}</Table.Cell>
                  <Table.Cell>{item.discountAmount}</Table.Cell>
                  <Table.Cell>{item.discountPercentage}</Table.Cell>
                  <Table.Cell>
                    {item.categories.length > 0 && (
                      <div className="block">
                        Categories: {item.categories.join(", ")}
                      </div>
                    )}
                    {item.decorItems.length > 0 && (
                      <div className="block">
                        Decor Items:&nbsp;
                        {item.decorItems.map((i) => i.name).join(", ")}
                      </div>
                    )}
                  </Table.Cell>
                  <Table.Cell className="flex gap-2">
                    <ToggleSwitch
                      checked={item.status}
                      disabled={loading}
                      onChange={(e) => {
                        updateDiscountStatus(item._id, e);
                      }}
                    />
                    {!editDiscount.display && (
                      <MdEditDocument
                        size={24}
                        cursor={"pointer"}
                        className={
                          loading
                            ? "cursor-not-allowed text-gray-300"
                            : "hover:text-blue-700"
                        }
                        onClick={() => {
                          if (!loading) {
                            setEditDiscount({
                              ...item,
                              display: true,
                            });
                          }
                        }}
                      />
                    )}
                    <MdDelete
                      size={24}
                      cursor={"pointer"}
                      className={
                        loading
                          ? "cursor-not-allowed text-gray-300"
                          : "hover:text-blue-700"
                      }
                      onClick={() => {
                        if (!loading) {
                          deleteDiscount(item._id);
                        }
                      }}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
        {module === "Coupons" && (
          <Table hoverable className="width-full overflow-x-auto">
            <Table.Head>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Coupon Amount</Table.HeadCell>
              <Table.HeadCell>Coupon Percentage</Table.HeadCell>
              <Table.HeadCell>Categories/Decor Items</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {couponList?.map((item, index) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800 font-medium"
                  key={index}
                >
                  <Table.Cell>{item.title}</Table.Cell>
                  <Table.Cell>{item.couponAmount}</Table.Cell>
                  <Table.Cell>{item.couponPercentage}</Table.Cell>
                  <Table.Cell>
                    {item.categories.length > 0 && (
                      <div className="block">
                        Categories: {item.categories.join(", ")}
                      </div>
                    )}
                    {item.decorItems.length > 0 && (
                      <div className="block">
                        Decor Items:&nbsp;
                        {item.decorItems.map((i) => i.name).join(", ")}
                      </div>
                    )}
                  </Table.Cell>
                  <Table.Cell className="flex gap-2">
                    <ToggleSwitch
                      checked={item.status}
                      disabled={loading}
                      onChange={(e) => {
                        updateCouponStatus(item._id, e);
                      }}
                    />
                    {!editCoupon.display && (
                      <MdEditDocument
                        size={24}
                        cursor={"pointer"}
                        className={
                          loading
                            ? "cursor-not-allowed text-gray-300"
                            : "hover:text-blue-700"
                        }
                        onClick={() => {
                          if (!loading) {
                            setEditCoupon({
                              ...item,
                              display: true,
                            });
                          }
                        }}
                      />
                    )}
                    <MdDelete
                      size={24}
                      cursor={"pointer"}
                      className={
                        loading
                          ? "cursor-not-allowed text-gray-300"
                          : "hover:text-blue-700"
                      }
                      onClick={() => {
                        if (!loading) {
                          deleteCoupon(item._id);
                        }
                      }}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
        {module === "Price Variations" && (
          <Table hoverable className="width-full overflow-x-auto">
            <Table.Head>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Info</Table.HeadCell>
              <Table.HeadCell>Amount</Table.HeadCell>
              <Table.HeadCell>Percentage</Table.HeadCell>
              <Table.HeadCell>Categories/Decor Items</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {pricingVariationList?.map((item, index) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800 font-medium"
                  key={index}
                >
                  <Table.Cell>{item.title}</Table.Cell>
                  <Table.Cell>
                    {item.pricingType} | {item.variationType}
                  </Table.Cell>
                  <Table.Cell>{item.amount}</Table.Cell>
                  <Table.Cell>{item.percentage}</Table.Cell>
                  <Table.Cell>
                    {item.categories.length > 0 && (
                      <div className="block">
                        Categories: {item.categories.join(", ")}
                      </div>
                    )}
                    {item.decorItems.length > 0 && (
                      <div className="block">
                        Decor Items:&nbsp;
                        {item.decorItems.map((i) => i.name).join(", ")}
                      </div>
                    )}
                  </Table.Cell>
                  <Table.Cell>{item?.status}</Table.Cell>
                  <Table.Cell className="">
                    {item?.status === "Completed" && (
                      <FaUndoAlt
                        size={16}
                        cursor={"pointer"}
                        className={
                          loading
                            ? "cursor-not-allowed text-gray-300"
                            : "hover:text-blue-700"
                        }
                        onClick={() => {
                          if (!loading) {
                            revertPricingVariation(item._id);
                          }
                        }}
                      />
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>
    </>
  );
}
