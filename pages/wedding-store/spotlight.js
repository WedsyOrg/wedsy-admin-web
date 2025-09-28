import {
  MdDelete,
  MdEditDocument,
  MdOpenInNew,
  MdRemoveRedEye,
} from "react-icons/md";
import { BsPlus, BsSearch } from "react-icons/bs";
import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Label,
  Modal,
  Pagination,
  Select,
  Spinner,
  Table,
  TextInput,
} from "flowbite-react";
import { toProperCase } from "@/utils/text";
import Link from "next/link";

export default function Decor({ user }) {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [spotlightColor, setSpotlightColor] = useState("");
  const [spotlightSearch, setSpotlightSearch] = useState("");
  const [spotlightList, setSpotlightList] = useState([]);
  const [spotlight, setSpotlight] = useState("");
  function onCloseModal() {
    setOpenModal(false);
    setSpotlightColor("");
    setSpotlightSearch("");
    setSpotlightList([]);
    setSpotlight("");
  }
  const fetchList = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/decor?spotlight=true&page=${
        page || 1
      }&limit=${itemsPerPage}${search && `&search=${search}`}${
        sort && `&sort=${sort}`
      }${category && `&category=${category}`}&repeat=false`,
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
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchDecor = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/decor?searchFor=decorId&decorId=${spotlightSearch}&limit=5`,
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
        setSpotlightList(response.list);
        setSpotlight("");
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addSpotlightDecor = () => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/decor/${spotlight}?addTo=spotlight`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ spotlightColor }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          alert("Decor Added to Spotlight Successfully");
          fetchList();
          onCloseModal();
        } else {
          alert("Error adding Decor, try again");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const deleteSpotlightDecor = (id) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/decor/${id}?removeFrom=spotlight`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({}),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          alert("Decor Removed from Spotlight Successfully");
          fetchList();
          onCloseModal();
        } else {
          alert("Error removing Decor, try again");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    if (spotlightSearch) {
      fetchDecor();
    }
  }, [spotlightSearch]);
  useEffect(() => {
    fetchList();
  }, [page]);
  useEffect(() => {
    if (page === 1) {
      fetchList();
    } else {
      setPage(1);
    }
  }, [itemsPerPage, search, sort, category]);
  return (
    <>
      <div className="p-8 flex flex-col gap-6 relative">
        {loading && (
          <div className="absolute left-1/2 grid place-content-center h-screen z-50 -translate-x-1/2">
            <Spinner size="xl" />
          </div>
        )}
        <Modal show={openModal} size="xl" onClose={onCloseModal} popup>
          <Modal.Header />
          <Modal.Body>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Select a decor to spotlight
              </h3>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="color" value="Spotlight Background Color" />
                </div>
                <TextInput
                  id="color"
                  placeholder="Background Color Hex with (#)"
                  value={spotlightColor}
                  onChange={(event) => setSpotlightColor(event.target.value)}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="color"
                    value="Search for Product (By Product Id)"
                  />
                </div>
                <TextInput
                  id="color"
                  placeholder="Decor Id"
                  value={spotlightSearch}
                  onChange={(event) => setSpotlightSearch(event.target.value)}
                  required
                />
              </div>
              {spotlightList.length > 0 && (
                <div className="flex flex-row flex-wrap gap-2">
                  {spotlightList.map((item, index) => (
                    <Button
                      key={index}
                      color="gray"
                      onClick={() => setSpotlight(item._id)}
                      disabled={loading || spotlight === item._id}
                    >
                      {item.productInfo.id} | {item.name}
                    </Button>
                  ))}
                </div>
              )}
              <div className="w-full">
                <Button
                  disabled={loading || !spotlightColor || !spotlight}
                  onClick={addSpotlightDecor}
                >
                  Add to Spotlight
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        <div className="flex flex-col gap-2">
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
            </Select>
            <Select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              disabled={loading}
            >
              <option value={""}>Category</option>
              {[
                "Stage",
                "Pathway",
                "Entrance",
                "Photobooth",
                "Mandap",
                "Nameboard",
              ].map((item, index) => (
                <option value={item} key={index}>
                  {item}
                </option>
              ))}
            </Select>
            <Button
              color="dark"
              onClick={() => {
                setCategory("");
                setSearch("");
                setSort("");
                setItemsPerPage(10);
              }}
              disabled={loading}
            >
              Reset
            </Button>
          </div>
        </div>
        <div className="bg-white rounded-3xl flex-col flex gap-3 shadow-xl">
          <div className="flex flex-row justify-between items-center pt-4 px-12">
            <div className="flex flex-col">
              <p className="text-lg font-medium">Decor Spotlight</p>
            </div>
            <div className="flex flex-row gap-4">
              <Button
                color="light"
                disabled={loading}
                onClick={() => setOpenModal(true)}
              >
                <BsPlus />
                Add Product
              </Button>
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
                <Table.HeadCell>Decor Name</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Background Color</Table.HeadCell>
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
                    <Table.Cell>{item.spotlightColor}</Table.Cell>
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
                      <MdDelete
                        size={24}
                        cursor={"pointer"}
                        className="hover:text-red-500"
                        onClick={() => {
                          if (
                            confirm(
                              "Do you want to remove the Decor from Spotlight?"
                            )
                          ) {
                            deleteSpotlightDecor(item._id);
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
