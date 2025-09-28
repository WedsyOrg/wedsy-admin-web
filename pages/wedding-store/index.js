import {
  MdDelete,
  MdEditDocument,
  MdEventAvailable,
  MdOpenInNew,
  MdRemoveRedEye,
} from "react-icons/md";
import { BsPlus, BsSearch } from "react-icons/bs";
import { useEffect, useState } from "react";
import {
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
import { toPriceString, toProperCase } from "@/utils/text";
import Link from "next/link";
import Image from "next/image";

export default function Product({ user }) {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");
  const [productVisibility, setProductVisibility] = useState("");
  const [productAvailability, setProductAvailability] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [labelList, setLabelList] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 0, false]);
  const [label, setLabel] = useState("");
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
  // const fetchList = () => {
  //   setLoading(true);
  //   fetch(
  //     `${process.env.NEXT_PUBLIC_API_URL}/decor?page=${
  //       page || 1
  //     }&limit=${itemsPerPage}${search && `&search=${search}`}${
  //       sort && `&sort=${sort}`
  //     }${category && `&category=${category}`}${
  //       productVisibility && `&productVisibility=${productVisibility}`
  //     }${productAvailability && `&productAvailability=${productAvailability}`}${
  //       label && `&label=${label}`
  //     }${
  //       priceRange[2]
  //         ? `&priceLower=${priceRange[0]}&priceHigher=${priceRange[1]}`
  //         : ""
  //     }&repeat=false`,
  //     {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     }
  //   )
  //     .then((response) => response.json())
  //     .then((response) => {
  //       setLoading(false);
  //       setList(response.list);
  //       setTotalPages(response.totalPages);
  //     })
  //     .catch((error) => {
  //       console.error("There was a problem with the fetch operation:", error);
  //     });
  // };
  const fetchList = () => {
    setLoading(true);

    // Create an object to hold the query parameters
    const params = {
      page: page || 1,
      limit: itemsPerPage,
      repeat: false,
    };

    // Conditionally add filters to the query parameters
    if (search) params.search = search;
    if (sort) params.sort = sort;
    if (category) params.category = category;
    if (productVisibility) params.productVisibility = productVisibility;
    if (productAvailability) params.productAvailability = productAvailability;
    if (label) params.label = label;
    if (priceRange[2]) {
      params.priceLower = priceRange[0];
      params.priceHigher = priceRange[1];
    }

    // Create the URLSearchParams object from the params object
    const queryString = new URLSearchParams(params).toString();

    // Construct the full URL
    const url = `${process.env.NEXT_PUBLIC_API_URL}/decor?${queryString}`;

    // Make the fetch request
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setList(response.list);
        setTotalPages(response.totalPages);
      })
      .catch((error) => {
        setLoading(false); // Stop loading even if there's an error
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const deleteDecor = (id) => {
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
          alert("Product Deleted Successfully");
          fetchList();
        } else {
          alert("Error deleting Product, try again");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updateProductAvailability = (id, status) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/decor/${id}?updateKey=productAvailability`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ productAvailability: status }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          alert("Updated Product Availability Successfully");
          fetchList();
        } else {
          alert("Error, try again");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updateProductVisibility = (id, status) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/decor/${id}?updateKey=productVisibility`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ productVisibility: status }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          alert("Updated Product Visibility Successfully");
          fetchList();
        } else {
          alert("Error, try again");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updateLabel = (id, label) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/decor/${id}?updateKey=label`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ label }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          alert("Updated Label Successfully");
          fetchList();
        } else {
          alert("Error, try again");
        }
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
  useEffect(() => {
    fetchLabels();
    fetchCategory();
  }, []);
  useEffect(() => {
    fetchList();
  }, [page]);
  useEffect(() => {
    if (page === 1) {
      fetchList();
    } else {
      setPage(1);
    }
  }, [
    itemsPerPage,
    search,
    sort,
    category,
    productAvailability,
    productVisibility,
    label,
  ]);
  return (
    <>
      <div className="p-8 flex flex-col gap-6 relative">
        {loading && (
          <div className="absolute left-1/2 grid place-content-center h-screen z-50 -translate-x-1/2">
            <Spinner size="xl" />
          </div>
        )}
        <div className="flex flex-col gap-2 ">
          <div className="flex flex-row gap-6 flex-wrap">
            <Link href={"/wedding-store/packages"}>
              <Button color="gray">Packages</Button>
            </Link>
            <Link href={"/wedding-store/best-sellers"}>
              <Button color="gray">Decor BestSellers</Button>
            </Link>
            <Link href={"/wedding-store/popular"}>
              <Button color="gray">Popular Decor</Button>
            </Link>
            <Link href={"/wedding-store/spotlight"}>
              <Button color="gray">Spotlighted</Button>
            </Link>
            <Link href={"/wedding-store/categories"}>
              <Button color="gray">Manage Categories</Button>
            </Link>
            <Link href={"/wedding-store/add-ons"}>
              <Button color="gray">Manage Add-Ons</Button>
            </Link>
            <Link href={"/wedding-store/product-type"}>
              <Button color="gray">Manage Price Type</Button>
            </Link>
            <Link href={"/wedding-store/attributes"}>
              <Button color="gray">Manage Attributes</Button>
            </Link>
          </div>
          <p className="font-semibold text-lg">Filter by:</p>
          <div className="flex flex-row gap-6">
            <Select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
              }}
              disabled={loading}
            >
              <option value={""}>Sort By:</option>
              <option value={"Price:Low-to-High"}>Price:Low to High</option>
              <option value={"Price:High-to-Low"}>Price:High to Low</option>
              <option value={"Newest-First"}>Newest First</option>
              <option value={"Oldest-First"}>Oldest First</option>
              <option value={"Alphabetical:A-to-Z"}>Alphabetical:A to Z</option>
              <option value={"Alphabetical:Z-to-A"}>Alphabetical:Z to A</option>
            </Select>
            <Select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              disabled={loading}
            >
              <option value={""}>Category</option>
              {categoryList.map((item, index) => (
                <option value={item.name} key={index.name}>
                  {item.name}
                </option>
              ))}
            </Select>
            <Select
              name="Label"
              value={label}
              onChange={(e) => {
                setLabel(e.target.value);
              }}
              disabled={loading}
            >
              <option value={""}>Select Label</option>
              {labelList?.map((item, index) => (
                <option value={item.title} key={item._id}>
                  {item.title}
                </option>
              ))}
            </Select>
            <Select
              value={productAvailability}
              onChange={(e) => {
                setProductAvailability(e.target.value);
              }}
              disabled={loading}
            >
              <option value={""}>Product Availability:</option>
              <option value={"true"}>Product Availability: Yes</option>
              <option value={"false"}>Product Availability: No</option>
            </Select>
            <Select
              value={productVisibility}
              onChange={(e) => {
                setProductVisibility(e.target.value);
              }}
              disabled={loading}
            >
              <option value={""}>Product Visibility:</option>
              <option value={"true"}>Product Visibility: Yes</option>
              <option value={"false"}>Product Visibility: No</option>
            </Select>
            <Button
              color="dark"
              onClick={() => {
                setCategory("");
                setSearch("");
                setSort("");
                setItemsPerPage(10);
                setProductAvailability("");
                setProductVisibility("");
                setLabel("");
                setPriceRange([0, 0, false]);
              }}
              disabled={loading}
            >
              Reset
            </Button>
          </div>
          <div>
            <Label value="Price Range Filter:" />
            <div className="flex flex-row gap-6">
              <TextInput
                type="number"
                value={priceRange[0]}
                onChange={(e) => {
                  let tempStatus = false;
                  let a = parseInt(e.target.value) || 0;
                  let b = parseInt(priceRange[1]) || 0;
                  if (a >= 0 && b > 0 && a < b) {
                    tempStatus = true;
                  }
                  setPriceRange([e.target.value, priceRange[1], tempStatus]);
                }}
                disabled={loading}
              />
              <TextInput
                type="number"
                value={priceRange[1]}
                onChange={(e) => {
                  let tempStatus = false;
                  let a = parseInt(priceRange[0]) || 0;
                  let b = parseInt(e.target.value) || 0;
                  if (a >= 0 && b > 0 && a < b) {
                    tempStatus = true;
                  }
                  setPriceRange([priceRange[0], e.target.value, tempStatus]);
                }}
                disabled={loading}
              />
              <Button
                color="gray"
                onClick={() => {
                  fetchList();
                }}
                disabled={loading}
              >
                Apply Price Filter
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl flex-col flex gap-3 shadow-xl">
          <div className="flex flex-row justify-between items-center pt-4 px-12">
            <div className="flex flex-col">
              <p className="text-lg font-medium">All Products</p>
            </div>
            <div className="flex flex-row gap-4">
              <Link href={"/wedding-store/create"} target="_blank">
                <Button color="light" disabled={loading}>
                  <BsPlus />
                  Add Product
                </Button>
              </Link>
              <TextInput
                icon={BsSearch}
                id="search"
                placeholder="search"
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                // disabled={loading}
              />
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
                <Table.HeadCell />
                <Table.HeadCell>Product Name</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Price/Label</Table.HeadCell>
                <Table.HeadCell>
                  <Tooltip content="Product Availability">
                    <MdEventAvailable size={24} cursor={"pointer"} />
                  </Tooltip>
                </Table.HeadCell>
                <Table.HeadCell>
                  <Tooltip content="Product Visibility">
                    <MdRemoveRedEye size={24} cursor={"pointer"} />
                  </Tooltip>
                </Table.HeadCell>
                <Table.HeadCell className="flex gap-2 h-full">
                  Actions
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {list?.map((item, index) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={item._id}
                  >
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>
                      <img
                        src={item.thumbnail}
                        className="h-24 w-24 object-cover"
                      />
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      [{item.productInfo.id}]{" "}
                      <a
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 relative"
                        href={`/wedding-store/view?id=${item._id}`}
                      >
                        {item.name}
                      </a>
                    </Table.Cell>
                    <Table.Cell>{item.category}</Table.Cell>
                    <Table.Cell className="flex flex-col gap-2">
                      <Label
                        className="text-center font-medium"
                        value={toPriceString(
                          item?.productTypes[0]?.sellingPrice
                        )}
                      />
                      <Select
                        name="Label"
                        value={item.label}
                        onChange={(e) => {
                          updateLabel(item._id, e.target.value);
                        }}
                        disabled={loading}
                        size={"sm"}
                      >
                        <option value={""}>Select Label</option>
                        {labelList?.map((item, index) => (
                          <option value={item.title} key={item._id}>
                            {item.title}
                          </option>
                        ))}
                      </Select>
                    </Table.Cell>
                    <Table.Cell>
                      <ToggleSwitch
                        sizing="sm"
                        checked={item.productAvailability}
                        disabled={loading}
                        onChange={(e) => {
                          updateProductAvailability(item._id, e);
                        }}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <ToggleSwitch
                        sizing="sm"
                        checked={item.productVisibility}
                        disabled={loading}
                        onChange={(e) => {
                          updateProductVisibility(item._id, e);
                        }}
                      />
                    </Table.Cell>
                    <Table.Cell className="flex gap-2">
                      <Link
                        href={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/decor/view/${item._id}`}
                        target="_blank"
                      >
                        <MdOpenInNew
                          size={24}
                          cursor={"pointer"}
                          className="hover:text-blue-700"
                        />
                      </Link>
                      <Link
                        href={`/wedding-store/view?id=${item._id}`}
                        target="_blank"
                      >
                        <MdRemoveRedEye
                          size={24}
                          cursor={"pointer"}
                          className="hover:text-blue-700"
                        />
                      </Link>
                      <Link
                        href={`/wedding-store/edit?id=${item._id}`}
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
                          if (confirm("Do you want to delete the Product?")) {
                            deleteDecor(item._id);
                          }
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
