import { uploadFile } from "@/utils/file";
import {
  Button,
  FileInput,
  Label,
  Select,
  Spinner,
  TextInput,
  Textarea,
} from "flowbite-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { MdDelete } from "react-icons/md";

const initalValues = {
  seoImageFile: null,
  name: "", //required
  description: "", //optional
  variant: {
    artificialFlowers: {
      costPrice: 0, //required
      sellingPrice: 0, //required
      discount: 0, //optional
    },
    mixedFlowers: {
      costPrice: 0, //required
      sellingPrice: 0, //required
      discount: 0, //optional
    },
    naturalFlowers: {
      costPrice: 0, //required
      sellingPrice: 0, //required
      discount: 0, //optional
    },
  },
  included: [],
  decor: [],
  seoTags: {
    title: "", //optional
    description: "", //optional
    image: "",
  },
};
export default function Decor({}) {
  const router = useRouter();
  const [data, setData] = useState(initalValues);
  const [loading, setLoading] = useState(false);
  const [decorSearchQuery, setDecorSearchQuery] = useState("");
  const [decorSearchList, setDecorSearchList] = useState([]);
  const seoImageRef = useRef();
  const fetchDecor = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/decor?search=${decorSearchQuery}&limit=10`,
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
        setDecorSearchList(response.list);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!data.name) {
      alert("Enter Name");
      setLoading(false);
    } else if (data.included.filter((i) => i).length <= 0) {
      alert("Enter Included");
      setLoading(false);
    } else if (
      Boolean(data.variant.artificialFlowers.costPrice) ^
        Boolean(data.variant.artificialFlowers.sellingPrice) ||
      Boolean(data.variant.mixedFlowers.costPrice) ^
        Boolean(data.variant.mixedFlowers.sellingPrice) ||
      Boolean(data.variant.naturalFlowers.costPrice) ^
        Boolean(data.variant.naturalFlowers.sellingPrice)
    ) {
      alert("Enter all the prices");
      setLoading(false);
    } else {
      try {
        let seoImage = "";
        // Uploading the files
        if (data.seoImageFile) {
          seoImage = await uploadFile({
            file: data.seoImageFile,
            path: "decor-packages/seoTagImage",
            id: `${Date.now()}-${data.name
              .toLowerCase()
              .replace(/\s+/g, "-")
              .substring(0, 10)}`,
          });
        }
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/decor-package`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: data.name.trim(),
            description: data.description.trim(),
            included: data.included.map((i) => i.trim()).filter((i) => i),
            variant: data.variant,
            decor: data.decor.filter((i) => i._id).map((i) => i._id),
            seoTags: {
              title: data.seoTags.title.trim(),
              description: data.seoTags.description.trim(),
              image: seoImage,
            },
          }),
        })
          .then((response) => response.json())
          .then((response) => {
            if (response.message !== "error") {
              alert("Package Added Successfully");
              router.push(`/wedding-store/view-package?id=${response.id}`);
            } else {
              alert("There was a error try again.");
              setLoading(false);
            }
          })
          .catch((error) => {
            alert("There was a error try again.");
            setLoading(false);
            console.error(
              "There was a problem with the fetch operation:",
              error
            );
          });
      } catch (error) {
        alert("There was a error try again.");
        setLoading(false);
        console.error("There was a problem:", error);
      }
    }
  };
  useEffect(() => {
    if (decorSearchQuery) {
      fetchDecor();
    }
  }, [decorSearchQuery]);
  return (
    <div className="p-8 flex flex-col gap-6 relative">
      {loading && (
        <div className="absolute left-1/2 grid place-content-center h-screen z-50 -translate-x-1/2">
          <Spinner size="xl" />
        </div>
      )}
      <div className="flex flex-col gap-4">
        <p className="font-semibold text-2xl">Add New Decor Package</p>
        <form className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Name */}
            <div>
              <div className="mb-2 block">
                <Label value="Name" />
              </div>
              <TextInput
                placeholder="Name"
                name="name"
                value={data.name}
                onChange={(e) => {
                  setData({ ...data, name: e.target.value });
                }}
                disabled={loading}
                required
              />
            </div>
            {/* Seo Title */}
            <div>
              <div className="mb-2 block">
                <Label value="Seo Title" />
              </div>
              <TextInput
                placeholder="Seo Title"
                name="seo-title"
                value={data.seoTags.title}
                onChange={(e) => {
                  setData({
                    ...data,
                    seoTags: {
                      ...data.seoTags,
                      title: e.target.value,
                    },
                  });
                }}
                disabled={loading}
              />
            </div>
          </div>
          {/* Description */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t-4 items-center">
            <div>
              <div className="mb-2 block">
                <Label value="Description" />
              </div>
              <Textarea
                rows={4}
                placeholder="Decor Description"
                name="description"
                value={data.description}
                onChange={(e) => {
                  setData({ ...data, description: e.target.value });
                }}
                disabled={loading}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label value="Seo Description" />
              </div>
              <Textarea
                rows={4}
                placeholder="Decor Description for SEO"
                name="seo-description"
                value={data.seoTags.description}
                onChange={(e) => {
                  setData({
                    ...data,
                    seoTags: { ...data.seoTags, description: e.target.value },
                  });
                }}
                disabled={loading}
              />
            </div>
          </div>
          {/* Included */}
          <div className="pt-2 border-t-4">
            <div className="mb-2 block">
              <Label value="Included" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {data.included.map((item, index) => (
                <div className="flex gap-2 items-center" key={index}>
                  <TextInput
                    placeholder="Included..."
                    name="included"
                    value={item}
                    onChange={(e) => {
                      setData({
                        ...data,
                        included: data.included.map((rec, recIndex) =>
                          recIndex === index ? e.target.value : rec
                        ),
                      });
                    }}
                    disabled={loading}
                    required
                  />
                  <MdDelete
                    size={24}
                    className="hover:text-red-500"
                    cursor={"pointer"}
                    onClick={() => {
                      setData({
                        ...data,
                        included: data.included.filter(
                          (rec, recIndex) => recIndex != index
                        ),
                      });
                    }}
                  />
                </div>
              ))}
              <Button
                color="light"
                onClick={() => {
                  setData({
                    ...data,
                    included: [...data.included, ""],
                  });
                }}
              >
                <BsPlus />
                Add New
              </Button>
            </div>
          </div>
          {/* Decor Items */}
          <div className="pt-2 border-t-4">
            <div className="mb-2 block">
              <Label value="Decor Items" />
            </div>
            <div className="flex flex-row flex-wrap gap-2 mb-3">
              {data.decor.map((item, index) => (
                <div className="flex gap-2 items-center" key={index}>
                  <Button
                    color="gray"
                    onClick={() => {
                      setData({
                        ...data,
                        decor: data.decor.filter((rec) => rec._id !== item._id),
                      });
                    }}
                  >
                    {item.productInfo.id} | {item.name}
                  </Button>
                </div>
              ))}
            </div>
            <TextInput
              placeholder="Decor..."
              name="decor"
              value={decorSearchQuery}
              onChange={(e) => {
                setDecorSearchQuery(e.target.value);
              }}
              // disabled={loading}
              required
            />
            <div className="flex flex-row flex-wrap gap-2 mt-3">
              {decorSearchList.map((item, index) => (
                <div className="flex gap-2 items-center" key={index}>
                  <Button
                    color="light"
                    onClick={() => {
                      setData({ ...data, decor: [...data.decor, item] });
                    }}
                    disabled={
                      data.decor.filter((rec) => rec._id === item._id).length >
                      0
                    }
                  >
                    {item.productInfo.id} | {item.name}
                  </Button>
                </div>
              ))}
            </div>
          </div>
          {/* Pricing */}
          <div className="grid grid-cols-4 border-y-4 py-2 gap-4 items-center">
            <Label value="Prices" />
            <Label value="Artificial Flowers" />
            <Label value="Mixed Flowers" />
            <Label value="Natural Flowers" />
            <Label value="Cost Price (All)" />
            <Label
              value={data.decor.reduce((accumulator, currentObject) => {
                return (
                  accumulator +
                  currentObject.productInfo.variant.artificialFlowers.costPrice
                );
              }, 0)}
            />
            <Label
              value={data.decor.reduce((accumulator, currentObject) => {
                return (
                  accumulator +
                  currentObject.productInfo.variant.mixedFlowers.costPrice
                );
              }, 0)}
            />
            <Label
              value={data.decor.reduce((accumulator, currentObject) => {
                return (
                  accumulator +
                  currentObject.productInfo.variant.naturalFlowers.costPrice
                );
              }, 0)}
            />
            <Label value="Cost Price:" />
            <TextInput
              type="number"
              value={data.variant.artificialFlowers.costPrice.toString()}
              onChange={(e) => {
                setData({
                  ...data,
                  variant: {
                    ...data.variant,
                    artificialFlowers: {
                      ...data.variant.artificialFlowers,
                      costPrice: parseInt(e.target.value),
                    },
                  },
                });
              }}
              disabled={loading}
              required
            />
            <TextInput
              type="number"
              value={data.variant.mixedFlowers.costPrice.toString()}
              onChange={(e) => {
                setData({
                  ...data,
                  variant: {
                    ...data.variant,
                    mixedFlowers: {
                      ...data.variant.mixedFlowers,
                      costPrice: parseInt(e.target.value),
                    },
                  },
                });
              }}
              disabled={loading}
              required
            />
            <TextInput
              type="number"
              value={data.variant.naturalFlowers.costPrice.toString()}
              onChange={(e) => {
                setData({
                  ...data,
                  variant: {
                    ...data.variant,
                    naturalFlowers: {
                      ...data.variant.naturalFlowers,
                      costPrice: parseInt(e.target.value),
                    },
                  },
                });
              }}
              disabled={loading}
              required
            />
            <Label value="Selling Price (All)" />
            <Label
              value={data.decor.reduce((accumulator, currentObject) => {
                return (
                  accumulator +
                  currentObject.productInfo.variant.artificialFlowers
                    .sellingPrice
                );
              }, 0)}
            />
            <Label
              value={data.decor.reduce((accumulator, currentObject) => {
                return (
                  accumulator +
                  currentObject.productInfo.variant.mixedFlowers.sellingPrice
                );
              }, 0)}
            />
            <Label
              value={data.decor.reduce((accumulator, currentObject) => {
                return (
                  accumulator +
                  currentObject.productInfo.variant.naturalFlowers.sellingPrice
                );
              }, 0)}
            />
            <Label value="Selling Price:" />
            <TextInput
              type="number"
              value={data.variant.artificialFlowers.sellingPrice.toString()}
              onChange={(e) => {
                setData({
                  ...data,
                  variant: {
                    ...data.variant,
                    artificialFlowers: {
                      ...data.variant.artificialFlowers,
                      sellingPrice: parseInt(e.target.value),
                    },
                  },
                });
              }}
              disabled={loading}
              required
            />
            <TextInput
              type="number"
              value={data.variant.mixedFlowers.sellingPrice.toString()}
              onChange={(e) => {
                setData({
                  ...data,
                  variant: {
                    ...data.variant,
                    mixedFlowers: {
                      ...data.variant.mixedFlowers,
                      sellingPrice: parseInt(e.target.value),
                    },
                  },
                });
              }}
              disabled={loading}
              required
            />
            <TextInput
              type="number"
              value={data.variant.naturalFlowers.sellingPrice.toString()}
              onChange={(e) => {
                setData({
                  ...data,
                  variant: {
                    ...data.variant,
                    naturalFlowers: {
                      ...data.variant.naturalFlowers,
                      sellingPrice: parseInt(e.target.value),
                    },
                  },
                });
              }}
              disabled={loading}
              required
            />
            <Label value="Discount:" />
            <TextInput
              type="number"
              value={data.variant.artificialFlowers.discount.toString()}
              onChange={(e) => {
                setData({
                  ...data,
                  variant: {
                    ...data.variant,
                    artificialFlowers: {
                      ...data.variant.artificialFlowers,
                      discount: parseInt(e.target.value),
                    },
                  },
                });
              }}
              disabled={loading}
            />
            <TextInput
              type="number"
              value={data.variant.mixedFlowers.discount.toString()}
              onChange={(e) => {
                setData({
                  ...data,
                  variant: {
                    ...data.variant,
                    mixedFlowers: {
                      ...data.variant.mixedFlowers,
                      discount: parseInt(e.target.value),
                    },
                  },
                });
              }}
              disabled={loading}
            />
            <TextInput
              type="number"
              value={data.variant.naturalFlowers.discount.toString()}
              onChange={(e) => {
                setData({
                  ...data,
                  variant: {
                    ...data.variant,
                    naturalFlowers: {
                      ...data.variant.naturalFlowers,
                      discount: parseInt(e.target.value),
                    },
                  },
                });
              }}
              disabled={loading}
            />
          </div>
          {/* Uploads */}
          <div className="grid grid-cols-4 gap-4 items-center">
            <Label value="SEO Image" />
            <FileInput
              ref={seoImageRef}
              disabled={loading}
              onChange={(e) => {
                setData({ ...data, seoImageFile: e.target.files[0] });
              }}
            />
          </div>
          <div className="flex justify-center gap-6">
            {/* Reset */}
            <Button
              type="reset"
              onClick={() => setData(initalValues)}
              className="px-12 mt-2"
              disabled={loading}
              color="dark"
            >
              Reset
            </Button>
            {/* Submit Button */}
            <Button
              type="submit"
              onClick={handleSubmit}
              className="px-16 mt-2"
              disabled={loading}
            >
              Create Decor Package
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
