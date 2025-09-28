import {
  MdDelete,
  MdDoNotDisturbAlt,
  MdOutlineArrowOutward,
  MdPeople,
} from "react-icons/md";
import { BiChevronDown, BiChevronUp, BiDollar, BiUser } from "react-icons/bi";
import {
  BsArrowDownLeft,
  BsArrowUp,
  BsChevronDown,
  BsChevronUp,
  BsPlus,
  BsSearch,
} from "react-icons/bs";
import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Checkbox,
  Dropdown,
  Label,
  Modal,
  Pagination,
  Select,
  Table,
  TextInput,
  Tooltip,
} from "flowbite-react";
import { processMobileNumber } from "@/utils/phoneNumber";

export default function Leads({ user }) {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState("");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState([]);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [addLeadData, setAddLeadData] = useState({
    name: "",
    phone: "",
  });
  const fetchList = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/enquiry?page=${
        page || 1
      }&limit=${itemsPerPage}${sort && `&sort=${sort}`}${
        search && `&search=${search}`
      }${source && `&source=${source}`}${date && `&date=${date}`}${
        status && `&status=${status}`
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
  const markInterested = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiry`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ action: "MarkInterested", leadIds: selected }),
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          alert("Marked Leads as Interested");
        }
        fetchList();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const markLost = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiry`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ action: "MarkLost", leadIds: selected }),
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          alert("Marked Leads as Lost");
        }
        fetchList();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const deleteLeads = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiry`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ leadIds: selected }),
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          alert("Leads deleted as successfully");
        }
        fetchList();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const handleAddLead = async () => {
    if (await processMobileNumber(addLeadData.phone)) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...addLeadData,
          phone: processMobileNumber(addLeadData.phone),
          verified: false,
          source: "Admin Dashboard",
        }),
      })
        .then((response) => {
          if (response.ok) {
            setIsAddLeadModalOpen(false);
            setAddLeadData({ name: "", phone: "" });
            fetchList();
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    } else {
      alert("Please enter valid mobile number");
    }
  };
  useEffect(() => {
    fetchList();
  }, [page]);
  useEffect(() => {
    if (page === 1) {
      fetchList();
    } else {
      setPage(1);
    }
  }, [itemsPerPage, source, date, search, sort, status]);
  return (
    <>
      <Modal
        show={isAddLeadModalOpen}
        size="xl"
        onClose={() => {
          setIsAddLeadModalOpen(false);
          setAddLeadData({ name: "", phone: "" });
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Add a new Lead
            </h3>
            <div>
              <div className="mb-2 block">
                <Label value="Name" />
              </div>
              <TextInput
                placeholder="Lead/User Name"
                value={addLeadData.name}
                onChange={(event) =>
                  setAddLeadData({ ...addLeadData, name: event.target.value })
                }
                required
                disabled={loading}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label value="Phone No." />
              </div>
              <TextInput
                placeholder="Lead/User Phone No."
                value={addLeadData.phone}
                onChange={(event) =>
                  setAddLeadData({ ...addLeadData, phone: event.target.value })
                }
                required
                disabled={loading}
              />
            </div>
            <div className="w-full">
              <Button
                disabled={loading || !addLeadData.name || !addLeadData.phone}
                onClick={handleAddLead}
              >
                Add Lead
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <div className="p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-lg">Filter by:</p>
          <div className="flex flex-row gap-6">
            <Select
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
              }}
              disabled={loading}
            >
              <option value={""}>Select Source</option>
              {[
                "Landing Screen",
                "Landing Page | Speak to Expert",
                "Decor Landing Page",
                "Admin Dashboard",
              ].map((item, index) => (
                <option value={item} key={index}>
                  {item}
                </option>
              ))}
            </Select>
            {/* <Select id="">
              <option value={""}>Event Tool</option>
              <option>Canada</option>
              <option>France</option>
              <option>Germany</option>
            </Select> */}
            <Select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
              }}
              disabled={loading}
            >
              <option value={""}>Select Status</option>
              <option value={"Fresh"}>Fresh: New lead(past 24hrs)</option>
              <option value={"New"}>New: leads(past week)</option>
              <option value={"Hot"}>Hot: Event within 8 weeks</option>
              <option value={"Potential"}>
                Potential: Event in 8 - 20 weeks
              </option>
              <option value={"Cold"}>Cold: Event beyond 20 weeks</option>
              <option value={"Lost"}>Lost: Waste/Dummy Lead</option>
              <option value={"Interested"}>Interested: Useful Leads</option>
              <option value={"Verified"}>Verified: Verified by OTP</option>
              <option value={"NotVerified"}>Not Verified</option>
            </Select>
            <TextInput
              type="date"
              placeholder="Date"
              value={date}
              onChange={(e) => {
                console.log(e.target.value);
                setDate(e.target.value);
              }}
              disabled={loading}
            />
            <Button
              color="dark"
              onClick={() => {
                setSearch("");
                setSort("");
                setItemsPerPage(10);
                setDate("");
                setSource("");
                setStatus("");
              }}
              disabled={loading}
            >
              Reset
            </Button>
          </div>
          <p className="font-semibold text-lg">Actions:</p>
          <div className="flex flex-row gap-6">
            <Tooltip content="Mark as Lost">
              <Button
                disabled={selected.length == 0 || loading}
                color="light"
                onClick={() => {
                  if (selected.length == 0) {
                    alert("Please select at least one lead");
                  } else {
                    markLost();
                  }
                }}
              >
                <MdDoNotDisturbAlt className="mr-2 h-5 w-5" />
                <p>Change Status</p>
              </Button>
            </Tooltip>
            <Tooltip content="Mark as Interested">
              <Button
                disabled={selected.length == 0 || loading}
                color="light"
                onClick={() => {
                  if (selected.length == 0) {
                    alert("Please select at least one lead");
                  } else {
                    markInterested();
                  }
                }}
              >
                <BsSearch className="mr-2 h-5 w-5" />
                <p>Move to prospect</p>
              </Button>
            </Tooltip>
            <Button color="light" disabled={true}>
              <BiUser className="mr-2 h-5 w-5" />
              <p>Assign</p>
            </Button>
            <Button color="light" disabled={true}>
              <BsArrowDownLeft className="mr-2 h-5 w-5" />
              <p>Import</p>
            </Button>
            <Button
              color="light"
              disabled={loading}
              onClick={() => {
                setIsAddLeadModalOpen(true);
                setAddLeadData({ name: "", phone: "" });
              }}
            >
              <BsPlus className="mr-2 h-5 w-5" />
              <p>Add Lead</p>
            </Button>
            <Tooltip content="Delete Lead">
              <Button
                disabled={selected.length == 0 || loading}
                color="light"
                onClick={() => {
                  if (selected.length == 0) {
                    alert("Please select at least one lead");
                  } else if (confirm("Do you want to delete the Leads?")) {
                    deleteLeads();
                  }
                }}
              >
                <MdDelete className="h-5 w-5" />
              </Button>
            </Tooltip>
          </div>
        </div>
        <div className="bg-white rounded-3xl flex-col flex gap-3 shadow-xl">
          <div className="flex flex-row justify-between items-center pt-4 px-12">
            <div className="flex flex-col">
              <p className="text-lg font-medium">All Customers</p>
              <p className="text-teal-500 text-sm">Active Members</p>
            </div>
            <div className="flex flex-row gap-4">
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
                <option value={"Date: Newest"}>Date: Newest</option>
                <option value={"Date: Oldest"}>Date: Oldest</option>
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
                </Table.HeadCell>{" "}
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
                <Table.HeadCell>Customer Name</Table.HeadCell>
                <Table.HeadCell>Source</Table.HeadCell>
                <Table.HeadCell>Phone Number</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Date</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                {/* <Table.HeadCell>Status</Table.HeadCell> */}
                {/* <Table.HeadCell>Account</Table.HeadCell>
                <Table.HeadCell>Event</Table.HeadCell> */}
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
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                        href={`/leads/${item._id}`}
                      >
                        <p>{item.name}</p>
                      </a>
                    </Table.Cell>
                    <Table.Cell>{item.source}</Table.Cell>
                    <Table.Cell>{item.phone}</Table.Cell>
                    <Table.Cell>{item.email}</Table.Cell>
                    <Table.Cell>
                      {new Date(item.createdAt).toLocaleDateString()}
                      <br />
                      {new Date(item.createdAt).toLocaleTimeString(
                        navigator.language,
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </Table.Cell>
                    <Table.Cell className="flex flex-row flex-wrap gap-2">
                      {item.verified ? (
                        <Badge color="success">Verified</Badge>
                      ) : (
                        <Badge color="failure">Not Verified</Badge>
                      )}
                      {item.isInterested && (
                        <Badge color="success">Interested</Badge>
                      )}{" "}
                      {item.isLost && <Badge color="failure">Lost</Badge>}
                    </Table.Cell>
                    {/* <Table.Cell>{item.verified.toString()}</Table.Cell> */}
                    {/* <Table.Cell className="p-4 text-center">
                      <Checkbox disabled />
                    </Table.Cell>
                    <Table.Cell className="p-4 text-center">
                      <Checkbox disabled />
                    </Table.Cell> */}
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
