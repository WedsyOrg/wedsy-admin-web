import { uploadFile } from "@/utils/file";
import {
  Button,
  FileInput,
  Label,
  Modal,
  Rating,
  Select,
  Spinner,
  TextInput,
  Textarea,
  ToggleSwitch,
} from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BsPlus, BsPlusSlashMinus } from "react-icons/bs";
import { MdDelete, MdOpenInNew } from "react-icons/md";

const initalValues = {
  seoImageFile: null,
  imageFile: null,
  thumbnailFile: null,
  videoFile: null,
  pdfFile: null,
  additionalImagesFile: [],
  category: "",
  label: "",
  rating: 0,
  productVisibility: false,
  productAvailability: false,
  name: "",
  unit: "",
  tags: [""],
  additionalImages: [],
  image: "",
  thumbnail: "",
  video: "",
  description: "",
  pdf: "",
  attributes: [],
  productInfo: {
    id: "",
    measurements: {
      length: 0,
      width: 0,
      height: 0,
      area: 0,
      radius: 0,
      other: "",
    },
    included: [""],
    quantity: 1,
    minimumOrderQuantity: 1,
    maximumOrderQuantity: 1,
    SKU: "",
  },
  seoTags: {
    title: "",
    description: "",
    image: "",
  },
  rawMaterials: [],
  productTypes: [],
  productVariants: [],
  productAddOns: [],
};

export default function Decor({}) {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(initalValues);
  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [attributeList, setAttributeList] = useState([]);
  const [labelList, setLabelList] = useState([]);
  const [rawMaterialsList, setRawMaterialsList] = useState([]);
  const [addProductAddOns, setAddProductAddOns] = useState({
    productAddOnsList: [],
    productId: "",
    display: false,
  });
  const imageRef = useRef();
  const thumbnailRef = useRef();
  const videoRef = useRef();
  const pdfRef = useRef();
  const seoImageRef = useRef();
  const fetchProductAddOns = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/decor?searchFor=decorId&decorId=${addProductAddOns?.productId}&limit=5`,
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
        setAddProductAddOns({
          ...addProductAddOns,
          productAddOnsList: response.list,
        });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchCategory = () => {
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
        setCategoryList(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchLabels = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/label`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setLabelList(response);
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
        setAttributeList(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchRawMaterials = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/raw-material`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setRawMaterialsList(response);
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
    } else if (!data.category) {
      alert("Select Category");
      setLoading(false);
    } else if (!data.unit) {
      alert("Enter Unit");
      setLoading(false);
    } else if (data.tags.filter((i) => i).length <= 0) {
      alert("Enter Tags");
      setLoading(false);
    } else if (!data.description) {
      alert("Enter Description");
      setLoading(false);
    } else {
      try {
        let image = data.image;
        let thumbnail = data.thumbnail;
        let video = data.video;
        let pdf = data.pdf;
        let seoImage = data.seoTags.image;
        // Uploading the files
        if (data.imageFile) {
          image = await uploadFile({
            file: data.imageFile,
            path: "decor-images/image",
            id: data.productInfo.id,
          });
        }
        if (data.thumbnailFile) {
          thumbnail = await uploadFile({
            file: data.thumbnailFile,
            path: "decor-images/thumbnail",
            id: data.productInfo.id,
          });
        }
        if (data.videoFile) {
          video = await uploadFile({
            file: data.videoFile,
            path: "decor-video",
            id: data.productInfo.id,
          });
        }
        if (data.pdfFile) {
          pdf = await uploadFile({
            file: data.pdfFile,
            path: "decor-pdf",
            id: data.productInfo.id,
          });
        }
        if (data.seoImageFile) {
          seoImage = await uploadFile({
            file: data.seoImageFile,
            path: "decor-images/seoTagImage",
            id: data.productInfo.id,
          });
        }
        let tempadditionalImagesFile = data.additionalImagesFile.filter(
          (i) => i
        );
        let tempadditionalImages = [];
        if (tempadditionalImagesFile.length > 0) {
          tempadditionalImages = await Promise.all(
            tempadditionalImagesFile.map(
              async (i, index) =>
                await uploadFile({
                  file: i,
                  path: "decor-images/additional-images",
                  id: `${data.productInfo.id}-${new Date().getTime()}-${index}`,
                })
            )
          );
        }
        tempadditionalImages = [
          ...data.additionalImages,
          ...tempadditionalImages,
        ];
        let tempproductVariantsImageFiles = data.productVariants.map((i) => i);
        let tempproductVariantsImages = [];
        let tempproductVariants = [];
        if (tempproductVariantsImageFiles.length > 0) {
          tempproductVariantsImages = await Promise.all(
            tempproductVariantsImageFiles.map(async (i, index) =>
              !i.imageFile
                ? i.image
                : await uploadFile({
                    file: i.imageFile,
                    path: "decor-images/product-variant-images",
                    id: `${
                      data.productInfo.id
                    }-${new Date().getTime()}-${index}`,
                  })
            )
          );
          tempproductVariants = await Promise.all(
            data.productVariants
              .map((i, index) => ({
                name: i.name,
                priceModifier: i.priceModifier,
                image: tempproductVariantsImages[index] || i.image,
              }))
              .filter((i) => i.name)
          );
        }
        let tempproductTypes = await Promise.all(
          data.productTypes.filter((i) => i.name)
        );
        let tempProductAddOns = data.productAddOns.map((i) => i._id);

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/decor/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            category: data.category,
            label: data.label.trim(),
            rating: data.rating,
            productVisibility: data.productVisibility,
            productAvailability: data.productAvailability,
            name: data.name.trim(),
            unit: data.unit.trim(),
            tags: data.tags.map((i) => i.trim()).filter((i) => i),
            additionalImages: tempadditionalImages,
            image,
            thumbnail,
            video,
            description: data.description.trim(),
            pdf,
            attributes: data.attributes.map((i) => ({
              ...i,
              list: i.list.map((j) => j.trim()).filter((j) => j),
            })),
            productInfo: {
              id: data.productInfo.id,
              measurements: data.productInfo.measurements,
              included: data.productInfo.included
                .map((i) => i.trim())
                .filter((i) => i),
              quantity: data.productInfo.quantity,
              minimumOrderQuantity: data.productInfo.minimumOrderQuantity,
              maximumOrderQuantity: data.productInfo.maximumOrderQuantity,
              SKU: data.productInfo.SKU,
            },
            seoTags: {
              title: data.seoTags.title.trim(),
              description: data.seoTags.description.trim(),
              image: seoImage,
            },
            rawMaterials: data.rawMaterials,
            productTypes: tempproductTypes,
            productVariants: tempproductVariants,
            productAddOns: tempProductAddOns,
          }),
        })
          .then((response) => response.json())
          .then((response) => {
            if (response.message !== "error") {
              alert("Decor Updated Successfully");
              router.push(`/wedding-store/view?id=${id}`);
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
    fetchCategory();
    fetchLabels();
    fetchAttributes();
    fetchRawMaterials();
  }, []);
  useEffect(() => {
    if (addProductAddOns.productId) {
      fetchProductAddOns();
    }
  }, [addProductAddOns.productId]);
  useEffect(() => {
    if (id) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/decor/${id}?populate=productAddOns`,
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
          if (response._id) {
            setLoading(false);
            setData({ ...data, ...response });
          } else {
            router.push("/wedding-store");
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  }, []);
  return (
    <div className="p-8 flex flex-col gap-6 relative">
      {loading && (
        <div className="absolute left-1/2 grid place-content-center h-screen z-50 -translate-x-1/2">
          <Spinner size="xl" />
        </div>
      )}
      {data._id && (
        <div className="flex flex-col gap-4">
          <p className="font-semibold text-2xl">Edit Decor</p>
          <form className="flex flex-col gap-4">
            <p className="font-semibold text-xl">General</p>
            <div className="grid grid-cols-3 gap-4 items-center">
              {/* Category */}
              <div>
                <div className="mb-2 block">
                  <Label value="Category" />
                </div>
                <Select
                  name="category"
                  value={data.category}
                  onChange={(e) => {
                    setData({ ...data, category: e.target.value });
                  }}
                  disabled={loading || true}
                  required
                >
                  <option value={""}>Category</option>
                  {categoryList?.map((item, index) => (
                    <option value={item.name} key={item._id}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div />
              {/* Id */}
              <div>
                <div className="mb-2 block">
                  <Label value="Decor Id" />
                </div>
                <TextInput
                  placeholder="Decor Id"
                  name="id"
                  value={data.productInfo.id}
                  onChange={(e) => {
                    setData({
                      ...data,
                      productInfo: { ...data.productInfo, id: e.target.value },
                    });
                  }}
                  disabled={loading || true}
                  required
                />
              </div>
              {/* Name */}
              <div className="">
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
              <div class="col-span-1" />
              {/* Label */}
              <div>
                <div className="mb-2 block">
                  <Label value="Label" />
                </div>
                <Select
                  name="Label"
                  value={data.label}
                  onChange={(e) => {
                    setData({ ...data, label: e.target.value });
                  }}
                  disabled={loading}
                  required
                >
                  <option value={""}>Label</option>
                  {labelList?.map((item, index) => (
                    <option value={item.title} key={item._id}>
                      {item.title}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="col-span-2">
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
                  required
                />
              </div>
              <div className="place-self-end w-full">
                <div className="bg-gray-100 rounded-lg border border-black px-4 py-2 mb-4 flex flex-row justify-between">
                  <Label value="Rating:" />
                  <Rating>
                    {[null, null, null, null, null].map((i, index) => (
                      <Rating.Star
                        key={index}
                        filled={index + 1 <= data.rating}
                        onClick={() => {
                          setData({ ...data, rating: index + 1 });
                        }}
                        className="cursor-pointer"
                      />
                    ))}
                  </Rating>
                </div>
                <div className="bg-gray-100 rounded-lg border border-black px-4 py-2 mb-4 flex flex-row justify-between">
                  <Label value="Product Visibility" />
                  <ToggleSwitch
                    sizing="sm"
                    checked={data.productVisibility}
                    disabled={loading}
                    onChange={(e) => {
                      setData({ ...data, productVisibility: e });
                    }}
                  />
                </div>
                <div className="bg-gray-100 rounded-lg border border-black px-4 py-2 mb-4 flex flex-row justify-between">
                  <Label value="Product Availability" />
                  <ToggleSwitch
                    sizing="sm"
                    checked={data.productAvailability}
                    disabled={loading}
                    onChange={(e) => {
                      setData({ ...data, productAvailability: e });
                    }}
                  />
                </div>
              </div>
            </div>
            {/* Tags */}
            <div className="">
              <div className="mb-2 block">
                <Label value="Tags" />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {data.tags.map((item, index) => (
                  <div className="flex gap-2 items-center" key={index}>
                    <TextInput
                      placeholder="Tag..."
                      name="tag"
                      value={item}
                      onChange={(e) => {
                        setData({
                          ...data,
                          tags: data.tags.map((rec, recIndex) =>
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
                          tags: data.tags.filter(
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
                      tags: [...data.tags, ""],
                    });
                  }}
                >
                  <BsPlus />
                  Add New
                </Button>
              </div>
            </div>
            {/* Uploads */}
            <div className="grid grid-cols-4 gap-4 items-center">
              <div>
                <Label value="Image" />
                <div className="flex flex-row gap-2 items-center">
                  {data.image && (
                    <Link href={data.image}>
                      <Button color="gray">
                        Image <MdOpenInNew size={20} />
                      </Button>
                    </Link>
                  )}
                  <FileInput
                    ref={imageRef}
                    disabled={loading}
                    onChange={(e) => {
                      setData({ ...data, imageFile: e.target.files[0] });
                    }}
                    className="grow"
                  />
                </div>
              </div>
              <div>
                <Label value="Thumbnail" />
                <div className="flex flex-row gap-2 items-center">
                  {data.thumbnail && (
                    <Link href={data.thumbnail}>
                      <Button color="gray">
                        Thumbnail <MdOpenInNew size={20} />
                      </Button>
                    </Link>
                  )}
                  <FileInput
                    ref={thumbnailRef}
                    disabled={loading}
                    onChange={(e) => {
                      setData({ ...data, thumbnailFile: e.target.files[0] });
                    }}
                    className="grow"
                  />
                </div>
              </div>
              <div>
                <Label value="Video" />
                <div className="flex flex-row gap-2 items-center">
                  {data.video && (
                    <Link href={data.video}>
                      <Button color="gray">
                        Video <MdOpenInNew size={20} />
                      </Button>
                    </Link>
                  )}
                  <FileInput
                    ref={videoRef}
                    disabled={loading}
                    onChange={(e) => {
                      setData({ ...data, videoFile: e.target.files[0] });
                    }}
                    className="grow"
                  />
                </div>
              </div>
              <div>
                <Label value="PDF" />
                <div className="flex flex-row gap-2 items-center">
                  {data.pdf && (
                    <Link href={data.pdf}>
                      <Button color="gray">
                        PDF <MdOpenInNew size={20} />
                      </Button>
                    </Link>
                  )}
                  <FileInput
                    ref={pdfRef}
                    disabled={loading}
                    onChange={(e) => {
                      setData({ ...data, pdfFile: e.target.files[0] });
                    }}
                    className="grow"
                  />
                </div>
              </div>
            </div>
            {/* Additional Images */}
            <div className="pb-2 border-b-4">
              <div className="mb-2 block">
                <Label value="Additional Images" />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {data.additionalImages.map((item, index) => (
                  <div className="flex gap-2 items-center" key={index}>
                    <Link href={item} className="grow">
                      <Button color="gray" className="w-full">
                        Image <MdOpenInNew size={20} />
                      </Button>
                    </Link>
                    <MdDelete
                      size={24}
                      className="hover:text-red-500"
                      cursor={"pointer"}
                      onClick={() => {
                        setData({
                          ...data,
                          additionalImages: data.additionalImages.filter(
                            (rec, recIndex) => recIndex != index
                          ),
                        });
                      }}
                    />
                  </div>
                ))}
                {data.additionalImagesFile.map((item, index) => (
                  <div className="flex gap-2 items-center" key={index}>
                    <FileInput
                      disabled={loading}
                      onChange={(e) => {
                        setData({
                          ...data,
                          additionalImagesFile: data.additionalImagesFile.map(
                            (rec, recIndex) =>
                              recIndex === index ? e.target.files[0] : rec
                          ),
                        });
                      }}
                    />
                    <MdDelete
                      size={24}
                      className="hover:text-red-500"
                      cursor={"pointer"}
                      onClick={() => {
                        setData({
                          ...data,
                          additionalImagesFile:
                            data.additionalImagesFile.filter(
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
                      additionalImagesFile: [
                        ...data.additionalImagesFile,
                        null,
                      ],
                    });
                  }}
                >
                  <BsPlus />
                  Add New
                </Button>
              </div>
            </div>
            {/* Meta */}
            <p className="font-semibold text-xl">Meta</p>
            <div className="pb-2 border-b-4 grid grid-cols-3 gap-4">
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
              {/* Seo Description */}
              <div className="col-span-2 row-span-2 place-self-start w-full">
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
              {/* Seo Image */}
              <div>
                <div className="mb-2 block">
                  <Label value="SEO Image" />
                </div>
                <div className="flex flex-row gap-2 items-center w-full">
                  {data.seoTags.image && (
                    <Link href={data.seoTags.image}>
                      <Button color="gray">
                        Image <MdOpenInNew size={20} />
                      </Button>
                    </Link>
                  )}
                  <FileInput
                    ref={seoImageRef}
                    disabled={loading}
                    onChange={(e) => {
                      setData({ ...data, seoImageFile: e.target.files[0] });
                    }}
                    className="grow"
                  />
                </div>
              </div>
            </div>
            {/* Measurements */}
            <p className="font-semibold text-xl">Measurements</p>
            <div className="grid grid-cols-6 gap-4 pb-2 border-b-4 items-center">
              <div className="">
                <div className="mb-2 block">
                  <Label value="Measurements" />
                </div>
                <TextInput
                  value={data.productInfo.measurements?.other?.toString()}
                  onChange={(e) => {
                    setData({
                      ...data,
                      productInfo: {
                        ...data.productInfo,
                        measurements: {
                          ...data.productInfo.measurements,
                          other: e.target.value,
                        },
                      },
                    });
                  }}
                  disabled={loading}
                />
              </div>
              <div className="">
                <div className="mb-2 block">
                  <Label value="Area(sq.ft)" />
                </div>
                <TextInput
                  type="number"
                  value={data.productInfo.measurements?.area?.toString()}
                  onChange={(e) => {
                    setData({
                      ...data,
                      productInfo: {
                        ...data.productInfo,
                        measurements: {
                          ...data.productInfo.measurements,
                          area: parseInt(e.target.value),
                        },
                      },
                    });
                  }}
                  disabled={loading}
                />
              </div>
              <div className="">
                <div className="mb-2 block">
                  <Label value="Radius(ft)" />
                </div>
                <TextInput
                  type="number"
                  value={data.productInfo.measurements?.radius?.toString()}
                  onChange={(e) => {
                    setData({
                      ...data,
                      productInfo: {
                        ...data.productInfo,
                        measurements: {
                          ...data.productInfo.measurements,
                          radius: parseInt(e.target.value),
                        },
                      },
                    });
                  }}
                  disabled={loading}
                />
              </div>
              <div className="">
                <div className="mb-2 block">
                  <Label value="Length(ft)" />
                </div>
                <TextInput
                  type="number"
                  value={data.productInfo.measurements?.length?.toString()}
                  onChange={(e) => {
                    setData({
                      ...data,
                      productInfo: {
                        ...data.productInfo,
                        measurements: {
                          ...data.productInfo.measurements,
                          length: parseInt(e.target.value),
                        },
                      },
                    });
                  }}
                  disabled={loading}
                />
              </div>
              <div className="">
                <div className="mb-2 block">
                  <Label value="Width(ft)" />
                </div>
                <TextInput
                  type="number"
                  value={data.productInfo.measurements?.width?.toString()}
                  onChange={(e) => {
                    setData({
                      ...data,
                      productInfo: {
                        ...data.productInfo,
                        measurements: {
                          ...data.productInfo.measurements,
                          width: parseInt(e.target.value),
                        },
                      },
                    });
                  }}
                  disabled={loading}
                />
              </div>
              <div className="">
                <div className="mb-2 block">
                  <Label value="Height" />
                </div>
                <TextInput
                  type="number"
                  value={data.productInfo.measurements?.height?.toString()}
                  onChange={(e) => {
                    setData({
                      ...data,
                      productInfo: {
                        ...data.productInfo,
                        measurements: {
                          ...data.productInfo.measurements,
                          height: parseInt(e.target.value),
                        },
                      },
                    });
                  }}
                  disabled={loading}
                />
              </div>
            </div>
            <p className="font-semibold text-xl">Attributes</p>
            {/* Attributes */}
            <div className="pb-2 border-b-4 ">
              {data.attributes?.map((item, index) => (
                <div className="" key={index}>
                  <div className="mb-2 block">
                    <Label value={item.name} />
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {item.list.map((rec, recIndex) => (
                      <div className="flex gap-2 items-center" key={recIndex}>
                        <TextInput
                          placeholder={item.name}
                          name={item.name}
                          value={rec}
                          onChange={(e) => {
                            setData({
                              ...data,
                              attributes: data.attributes.map(
                                (attr, attrIndex) =>
                                  attr.name === item.name
                                    ? {
                                        ...attr,
                                        list: attr.list.map(
                                          (attrList, attrListIndex) =>
                                            recIndex === attrListIndex
                                              ? e.target.value
                                              : attrList
                                        ),
                                      }
                                    : attr
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
                              attributes: data.attributes.map(
                                (attr, attrIndex) =>
                                  attr.name === item.name
                                    ? {
                                        ...attr,
                                        list: attr.list.filter(
                                          (attrList, attrListIndex) =>
                                            recIndex != attrListIndex
                                        ),
                                      }
                                    : attr
                              ),
                            });
                          }}
                        />
                      </div>
                    ))}
                    <Select
                      name={item.name}
                      value={""}
                      onChange={(e) => {
                        setData({
                          ...data,
                          attributes: data.attributes.map((attr, attrIndex) =>
                            attr.name === item.name
                              ? {
                                  ...attr,
                                  list: [...attr.list, e.target.value],
                                }
                              : attr
                          ),
                        });
                      }}
                      disabled={loading}
                    >
                      <option value={""}>Select {item.name}</option>
                      {attributeList
                        ?.find((i) => i.name === item.name)
                        ?.list?.filter((i) => !item.list.includes(i))
                        .map((i, index) => (
                          <option value={i} key={i}>
                            {i}
                          </option>
                        ))}
                    </Select>
                    <Button
                      color="light"
                      onClick={() => {
                        setData({
                          ...data,
                          attributes: data.attributes.map((attr, attrIndex) =>
                            attr.name === item.name
                              ? {
                                  ...attr,
                                  list: [...attr.list, ""],
                                }
                              : attr
                          ),
                        });
                      }}
                    >
                      <BsPlus />
                      Add New
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <p className="font-semibold text-xl">Quantity</p>
            <div className="pb-2 border-b-4 grid grid-cols-5 gap-4 items-center">
              {/* Unit */}
              <div>
                <div className="mb-2 block">
                  <Label value="Unit" />
                </div>
                <TextInput
                  placeholder="Unit"
                  name="unit"
                  value={data.unit}
                  onChange={(e) => {
                    setData({ ...data, unit: e.target.value });
                  }}
                  disabled={loading}
                  required
                />
              </div>
              {/* SKU */}
              <div>
                <div className="mb-2 block">
                  <Label value="SKU" />
                </div>
                <TextInput
                  placeholder="SKU"
                  name="sku"
                  value={data.productInfo.SKU}
                  onChange={(e) => {
                    setData({
                      ...data,
                      productInfo: {
                        ...data.productInfo,
                        SKU: e.target.value,
                      },
                    });
                  }}
                  disabled={loading}
                />
              </div>
              {/* Quantity */}
              <div>
                <div className="mb-2 block">
                  <Label value="Quantity" />
                </div>
                <TextInput
                  placeholder="Quantity"
                  type="number"
                  name="quantity"
                  value={data.productInfo.quantity}
                  onChange={(e) => {
                    setData({
                      ...data,
                      productInfo: {
                        ...data.productInfo,
                        quantity: parseInt(e.target.value),
                      },
                    });
                  }}
                  disabled={loading}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label value="Minimum Order Quantity (MOQ)" />
                </div>
                <TextInput
                  placeholder="Quantity"
                  type="number"
                  name="quantity"
                  value={data.productInfo.minimumOrderQuantity}
                  onChange={(e) => {
                    setData({
                      ...data,
                      productInfo: {
                        ...data.productInfo,
                        minimumOrderQuantity: parseInt(e.target.value),
                      },
                    });
                  }}
                  disabled={loading}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label value="Maximum Order Quantity (Total)" />
                </div>
                <TextInput
                  placeholder="Quantity"
                  type="number"
                  name="quantity"
                  value={data.productInfo.maximumOrderQuantity}
                  onChange={(e) => {
                    setData({
                      ...data,
                      productInfo: {
                        ...data.productInfo,
                        maximumOrderQuantity: parseInt(e.target.value),
                      },
                    });
                  }}
                  disabled={loading}
                />
              </div>
            </div>
            {/* Raw Materials */}
            <p className="font-semibold text-xl">Raw Material</p>
            <div className="pb-2 border-b-4 ">
              {data.rawMaterials?.map((item, index) => (
                <div
                  className="grid grid-cols-4 gap-4 mb-2 items-center"
                  key={index}
                >
                  <TextInput
                    placeholder={"Raw Materials"}
                    name={"Raw Materials"}
                    value={item.name}
                    onChange={(e) => {
                      setData({
                        ...data,
                        rawMaterials: data.rawMaterials.map((rec, recIndex) =>
                          recIndex === index
                            ? {
                                ...rec,
                                name: e.target.value,
                              }
                            : rec
                        ),
                      });
                    }}
                    disabled={loading}
                    required
                  />
                  <TextInput
                    type="number"
                    placeholder={"Quantity"}
                    name={"Quantity"}
                    value={item.quantity}
                    onChange={(e) => {
                      setData({
                        ...data,
                        rawMaterials: data.rawMaterials.map((rec, recIndex) =>
                          recIndex === index
                            ? {
                                ...rec,
                                quantity: parseInt(e.target.value),
                              }
                            : rec
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
                        rawMaterials: data.rawMaterials.filter(
                          (rec, recIndex) => recIndex != index
                        ),
                      });
                    }}
                  />
                </div>
              ))}
              <div className="grid grid-cols-4 gap-4">
                <Select
                  name={"Raw Materials"}
                  value={""}
                  onChange={(e) => {
                    setData({
                      ...data,
                      rawMaterials: [
                        ...data.rawMaterials,
                        { name: e.target.value, quantity: 1 },
                      ],
                    });
                  }}
                  disabled={loading}
                >
                  <option value={""}>Select Raw Material</option>
                  {rawMaterialsList
                    ?.filter(
                      (i) =>
                        !data.rawMaterials?.map((l) => l.name).includes(i.name)
                    )
                    .map((i, index) => (
                      <option value={i.name} key={i.name}>
                        {i.name}
                      </option>
                    ))}
                </Select>
                <Button
                  color="light"
                  onClick={() => {
                    setData({
                      ...data,
                      rawMaterials: [
                        ...data.rawMaterials,
                        { name: "", quantity: 1 },
                      ],
                    });
                  }}
                >
                  <BsPlus />
                  Add New
                </Button>
              </div>
            </div>
            <p className="font-semibold text-xl">Included</p>
            {/* Included */}
            <div className="pb-2 border-b-4">
              <div className="mb-2 block">
                <Label value="Included" />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {data.productInfo.included.map((item, index) => (
                  <div className="flex gap-2 items-center" key={index}>
                    <TextInput
                      placeholder="Included..."
                      name="included"
                      value={item}
                      onChange={(e) => {
                        setData({
                          ...data,
                          productInfo: {
                            ...data.productInfo,
                            included: data.productInfo.included.map(
                              (rec, recIndex) =>
                                recIndex === index ? e.target.value : rec
                            ),
                          },
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
                          productInfo: {
                            ...data.productInfo,
                            included: data.productInfo.included.filter(
                              (rec, recIndex) => recIndex != index
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
                    setData({
                      ...data,
                      productInfo: {
                        ...data.productInfo,
                        included: [...data.productInfo.included, ""],
                      },
                    });
                  }}
                >
                  <BsPlus />
                  Add New
                </Button>
              </div>
            </div>
            {/* Product AddOns */}
            <p className="font-semibold text-xl">Product Add Ons</p>
            <div className="grid grid-cols-5 gap-4 items-center mb-2 pb-2 border-b-4">
              {data.productAddOns?.map((item, index) => (
                <Button
                  color={"success"}
                  key={index}
                  className=""
                  onClick={() => {
                    setData({
                      ...data,
                      productAddOns: data.productAddOns.filter(
                        (i) => i._id !== item._id
                      ),
                    });
                  }}
                >
                  {item.name}
                </Button>
              ))}
              <Button
                color="light"
                onClick={() => {
                  setAddProductAddOns({
                    ...addProductAddOns,
                    display: true,
                    productAddOnsList: [],
                    productId: "",
                  });
                }}
                disabled={loading}
              >
                <BsPlus size={16} /> Add New
              </Button>
              <Modal
                show={addProductAddOns.display}
                size="xl"
                onClose={() => {
                  setAddProductAddOns({
                    ...addProductAddOns,
                    display: false,
                    productId: "",
                    productAddOnsList: [],
                  });
                }}
                popup
              >
                <Modal.Header />
                <Modal.Body>
                  <div className="space-y-6">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                      Add Product Add-on
                    </h3>
                    <div>
                      <div className="mb-2 block">
                        <Label value="Search for Product (By Product Id)" />
                      </div>
                      <TextInput
                        placeholder="Decor Id"
                        value={addProductAddOns.productId}
                        onChange={(event) =>
                          setAddProductAddOns({
                            ...addProductAddOns,
                            productId: event.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    {addProductAddOns?.productAddOnsList?.length > 0 && (
                      <div className="flex flex-row flex-wrap gap-2">
                        {addProductAddOns?.productAddOnsList?.map(
                          (item, index) => (
                            <Button
                              key={index}
                              color="gray"
                              onClick={() => {
                                if (
                                  !data.productAddOns
                                    .map((i) => i._id)
                                    .includes(item._id)
                                ) {
                                  setData({
                                    ...data,
                                    productAddOns: [
                                      ...data.productAddOns,
                                      item,
                                    ],
                                  });
                                  setAddProductAddOns({
                                    ...addProductAddOns,
                                    display: false,
                                    productId: "",
                                    productAddOnsList: [],
                                  });
                                }
                              }}
                              disabled={
                                loading ||
                                data.productAddOns
                                  .map((i) => i._id)
                                  .includes(item._id)
                              }
                            >
                              {item.productInfo.id} | {item.name}
                            </Button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </Modal.Body>
              </Modal>
            </div>
            {/* Product Variants */}
            <p className="font-semibold text-xl">Variants</p>
            <div className="pb-2 border-b-4">
              {data.productVariants?.map((item, index) => (
                <div
                  className="grid grid-cols-3 gap-4 items-center mb-2"
                  key={index}
                >
                  <TextInput
                    placeholder={"Name"}
                    name={"Name"}
                    value={item.name}
                    onChange={(e) => {
                      setData({
                        ...data,
                        productVariants: data.productVariants.map(
                          (rec, recIndex) =>
                            recIndex === index
                              ? {
                                  ...rec,
                                  name: e.target.value,
                                }
                              : rec
                        ),
                      });
                    }}
                    disabled={loading}
                    required
                  />
                  <div className="flex flex-row gap-2 items-center w-full">
                    {item.image && (
                      <Link href={item.image}>
                        <Button color="gray">
                          Image <MdOpenInNew size={20} />
                        </Button>
                      </Link>
                    )}
                    <FileInput
                      disabled={loading}
                      onChange={(e) => {
                        setData({
                          ...data,
                          productVariants: data.productVariants.map(
                            (rec, recIndex) =>
                              recIndex === index
                                ? {
                                    ...rec,
                                    imageFile: e.target.files[0],
                                  }
                                : rec
                          ),
                        });
                      }}
                      className="grow"
                    />
                  </div>
                  <div className="flex flex-row gap-2 items-center w-full">
                    <TextInput
                      placeholder={"Quantity"}
                      name={"Quantity"}
                      type="number"
                      value={item.priceModifier}
                      onChange={(e) => {
                        setData({
                          ...data,
                          productVariants: data.productVariants.map(
                            (rec, recIndex) =>
                              recIndex === index
                                ? {
                                    ...rec,
                                    priceModifier: parseInt(e.target.value),
                                  }
                                : rec
                          ),
                        });
                      }}
                      disabled={loading}
                      required
                    />
                    <Button
                      color="light"
                      onClick={() => {
                        setData({
                          ...data,
                          productVariants: data.productVariants.map(
                            (rec, recIndex) =>
                              recIndex === index
                                ? {
                                    ...rec,
                                    priceModifier: rec.priceModifier * -1,
                                  }
                                : rec
                          ),
                        });
                      }}
                    >
                      <BsPlusSlashMinus />
                    </Button>
                    <MdDelete
                      size={24}
                      className="hover:text-red-500"
                      cursor={"pointer"}
                      onClick={() => {
                        setData({
                          ...data,
                          productVariants: data.productVariants.filter(
                            (rec, recIndex) => recIndex != index
                          ),
                        });
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-3 gap-4 items-center">
                <Button
                  color="light"
                  onClick={() => {
                    setData({
                      ...data,
                      productVariants: [
                        ...data.productVariants,
                        {
                          name: "",
                          priceModifier: 0,
                          image: "",
                          imageFile: null,
                        },
                      ],
                    });
                  }}
                >
                  <BsPlus />
                  Add New
                </Button>
              </div>
            </div>
            {/* Pricing (Product Types)*/}
            <p className="font-semibold text-xl">Price Type</p>
            <div className="grid grid-cols-4 border-b-4 pb-2 gap-4 items-center">
              <Label value="Prices" />
              <Label value="Cost Price:" />
              <Label value="Selling Price:" />
              <Label value="Discount:" />
              {data.productTypes?.map((item, index) => (
                <>
                  <div className="flex flex-row gap-2 items-center">
                    <TextInput
                      value={item.name}
                      onChange={(e) => {
                        setData({
                          ...data,
                          productTypes: data.productTypes?.map(
                            (rec, recIndex) =>
                              rec.name === item.name
                                ? { ...rec, name: e.target.value }
                                : rec
                          ),
                        });
                      }}
                      disabled={loading}
                      required
                      className="grow"
                    />
                    <MdDelete
                      size={24}
                      className="hover:text-red-500"
                      cursor={"pointer"}
                      onClick={() => {
                        setData({
                          ...data,
                          productTypes: data.productTypes.filter(
                            (rec, recIndex) => recIndex != index
                          ),
                        });
                      }}
                    />
                  </div>
                  <TextInput
                    type="number"
                    value={item.costPrice.toString()}
                    onChange={(e) => {
                      setData({
                        ...data,
                        productTypes: data.productTypes?.map((rec, recIndex) =>
                          rec.name === item.name
                            ? { ...rec, costPrice: parseInt(e.target.value) }
                            : rec
                        ),
                      });
                    }}
                    disabled={loading}
                    required
                  />
                  <TextInput
                    type="number"
                    value={item.sellingPrice.toString()}
                    onChange={(e) => {
                      setData({
                        ...data,
                        productTypes: data.productTypes?.map((rec, recIndex) =>
                          rec.name === item.name
                            ? { ...rec, sellingPrice: parseInt(e.target.value) }
                            : rec
                        ),
                      });
                    }}
                    disabled={loading}
                    required
                  />
                  <TextInput
                    type="number"
                    value={item.discount.toString()}
                    onChange={(e) => {
                      setData({
                        ...data,
                        productTypes: data.productTypes?.map((rec, recIndex) =>
                          rec.name === item.name
                            ? { ...rec, discount: parseInt(e.target.value) }
                            : rec
                        ),
                      });
                    }}
                    disabled={loading}
                    required
                  />
                </>
              ))}
              <Button
                color="light"
                onClick={() => {
                  setData({
                    ...data,
                    productTypes: [
                      ...data.productTypes,
                      {
                        name: "",
                        costPrice: 0,
                        sellingPrice: 0,
                        discount: 0,
                      },
                    ],
                  });
                }}
              >
                <BsPlus />
                Add New
              </Button>
            </div>
            <div className="flex justify-center gap-6">
              {/* Submit Button */}
              <Button
                type="submit"
                onClick={handleSubmit}
                className="px-16 mt-2"
                disabled={loading}
              >
                Update Decor
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
