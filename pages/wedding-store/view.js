import { Label, Rating, Spinner } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MdDelete, MdEditDocument, MdOpenInNew } from "react-icons/md";

export default function Decor({}) {
  const router = useRouter();
  const { id } = router.query;
  const [decor, setDecor] = useState({});
  const [loading, setLoading] = useState(false);
  const deleteDecor = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/decor/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          alert("Decor Deleted Successfully");
          router.push("/wedding-store");
        } else {
          alert("Error deleting Decor, try again");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
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
            setDecor(response);
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
      {loading || !decor._id ? (
        <div className="absolute left-1/2 grid place-content-center h-screen z-50 -translate-x-1/2">
          <Spinner size="xl" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="font-semibold text-2xl flex flex-row justify-between">
            <span>
              {decor.name}&nbsp;
              <Label>
                [Id: {decor.productInfo?.id} |&nbsp;
                {decor.productVisibility ? (
                  <span className="text-blue-500">Visible</span>
                ) : (
                  <span className="text-red-500">Not Visible</span>
                )}
                &nbsp; |&nbsp;
                {decor.productAvailability ? (
                  <span className="text-blue-500">Available</span>
                ) : (
                  <span className="text-red-500">Not Available</span>
                )}
                ]
              </Label>
            </span>
            <div className="flex gap-2">
              <Link
                href={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/decor/view/${decor._id}`}
                target="_blank"
              >
                <MdOpenInNew
                  size={24}
                  cursor={"pointer"}
                  className="hover:text-blue-700"
                />
              </Link>
              <Link
                href={`/wedding-store/edit?id=${decor._id}`}
                target="_blank"
              >
                <MdEditDocument
                  size={24}
                  cursor={"pointer"}
                  className="hover:text-blue-700"
                />
              </Link>
              <MdDelete
                size={24}
                cursor={"pointer"}
                className="hover:text-red-500"
                onClick={() => {
                  if (confirm("Do you want to delete the Decor?")) {
                    deleteDecor();
                  }
                }}
              />
            </div>
          </p>
          <p className="font-semibold text-xl">General</p>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label>Category: </Label>
              <p className="">{decor.category}</p>
            </div>
            <div>
              <Label>Label: </Label>
              <p className="">{decor.label}</p>
            </div>
            <div>
              <Label>Id: </Label>
              <p>{decor.productInfo?.id}</p>
            </div>
            <div>
              <Label>Rating: </Label>
              <Rating size={"md"}>
                {[null, null, null, null, null].map((i, index) => (
                  <Rating.Star key={index} filled={index + 1 <= decor.rating} />
                ))}
              </Rating>
            </div>
            <div className="col-span-4">
              <Label>Description: </Label>
              <p>{decor.description}</p>
            </div>
            <div className="col-span-4">
              <Label>Tags: </Label>
              <p>{decor.tags.join(", ")}</p>
            </div>
            <div>
              <Label>Image:</Label>
              <Image
                src={decor.image}
                alt="Decor"
                width={0}
                height={0}
                sizes="100%"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <div>
              <Label>Thumbnail:</Label>
              <Image
                src={decor.thumbnail}
                alt="Decor"
                width={0}
                height={0}
                sizes="100%"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <div className="col-span-2">
              {decor.video && (
                <Link
                  className="flex text-blue-500 underline items-center"
                  href={decor.video}
                  target="_blank"
                >
                  Video <MdOpenInNew />
                </Link>
              )}
              {decor.pdf && (
                <Link
                  className="flex text-blue-500 underline items-center"
                  href={decor.pdf}
                  target="_blank"
                >
                  PDF <MdOpenInNew />
                </Link>
              )}
            </div>
            <div className="col-span-4">
              <Label>Additional Images: </Label>
              <div className="grid grid-cols-5 gap-4">
                {decor.additionalImages.map((item, index) => (
                  <Image
                    src={item}
                    alt="Decor"
                    width={0}
                    height={0}
                    sizes="100%"
                    style={{ width: "100%", height: "auto" }}
                    key={index}
                  />
                ))}
              </div>
            </div>
          </div>
          <p className="font-semibold text-xl">Meta</p>
          <div className="grid grid-cols-4 gap-4">
            <div className="row-span-2">
              <Label>Seo Image</Label>
              {decor.seoTags?.image && (
                <Image
                  src={decor.seoTags?.image}
                  alt="Decor"
                  width={0}
                  height={0}
                  sizes="100%"
                  style={{ width: "100%", height: "auto" }}
                />
              )}
            </div>
            <div className="col-span-3">
              <Label>SEO Title: </Label>
              <p>{decor.seoTags?.title}</p>
            </div>
            <div className="col-span-3">
              <Label>SEO Description: </Label>
              <p>{decor.seoTags?.description}</p>
            </div>
          </div>
          <p className="font-semibold text-xl">Measurements</p>
          <div className="grid grid-cols-6 gap-4">
            <div className="">
              <Label value="Measurements" />
              <p>{decor.productInfo.measurements.other}</p>
            </div>
            <div className="">
              <Label value="Area(sq.ft)" />
              <p>{decor.productInfo.measurements.area}</p>
            </div>
            <div className="">
              <Label value="Radius(ft)" />
              <p>{decor.productInfo.measurements.radius}</p>
            </div>
            <div className="">
              <Label value="Length(ft)" />
              <p>{decor.productInfo.measurements.length}</p>
            </div>
            <div className="">
              <Label value="Width(ft)" />
              <p>{decor.productInfo.measurements.width}</p>
            </div>
            <div className="">
              <Label value="Height" />
              <p>{decor.productInfo.measurements.height}</p>
            </div>
          </div>
          <p className="font-semibold text-xl">Attributes</p>
          <div className="grid grid-cols-1 gap-4">
            {decor.attributes?.map((item, index) => (
              <div key={index}>
                <Label value={item.name} />
                <p>{item.list.join(", ")}</p>
              </div>
            ))}
          </div>
          <p className="font-semibold text-xl">Quantity</p>
          <div className="grid grid-cols-5 gap-4">
            <div>
              <Label value="Unit" />
              <p>{decor.unit}</p>
            </div>
            <div>
              <Label value="SKU" />
              <p>{decor.productInfo.SKU}</p>
            </div>
            <div>
              <Label value="Quantity" />
              <p>{decor.productInfo.quantity}</p>
            </div>
            <div>
              <Label value="Minimum Order Quantity (MOQ)" />
              <p>{decor.productInfo?.minimumOrderQuantity}</p>
            </div>
            <div>
              <Label value="Maximum Order Quantity (Total)" />
              <p>{decor.productInfo?.maximumOrderQuantity}</p>
            </div>
          </div>
          <p className="font-semibold text-xl">Raw Material</p>
          <p className="">
            {decor.rawMaterials
              ?.map((item, index) => `${item.name} (${item.quantity})`)
              .join(", ")}
          </p>
          <p className="font-semibold text-xl">Included</p>
          <p className="">{decor.productInfo.included.join(", ")}</p>
          <p className="font-semibold text-xl">Add Ons</p>
          <p className="">
            {decor.productAddOns
              ?.map((i) => `${i.name}[${i.productInfo.id}]`)
              .join(", ")}
          </p>
          <p className="font-semibold text-xl">Variants</p>
          <div className="grid grid-cols-4 gap-4">
            {decor.productVariants?.map((item, index) => (
              <div className="flex flex-col" key={index}>
                <Image
                  src={item.image}
                  alt={item.name}
                  width={0}
                  height={0}
                  className="w-full object-contain"
                />
                <Label>
                  {item.name} ({item.priceModifier})
                </Label>
              </div>
            ))}
          </div>
          {/* Pricing (Product Types)*/}
          <p className="font-semibold text-xl">Price Types</p>
          <div className="grid grid-cols-4 pb-2 gap-4 items-center">
            <Label value="Prices" />
            <Label value="Cost Price:" />
            <Label value="Selling Price:" />
            <Label value="Discount:" />
            {decor.productTypes?.map((item, index) => (
              <>
                <p>{item.name}</p>
                <p>{item.costPrice}</p>
                <p>{item.sellingPrice}</p>
                <p>{item.discount}</p>
              </>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
