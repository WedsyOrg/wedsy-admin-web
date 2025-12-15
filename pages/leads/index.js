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
  BsXCircle,
} from "react-icons/bs";
import { HiOutlineUserAdd } from "react-icons/hi";
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
  
  // NEW: Tab state
  const [activeTab, setActiveTab] = useState("ALL");
  
  // NEW: Additional filter states (client-side for now, until backend supports)
  const [interestedService, setInterestedService] = useState("");
  const [eventCreated, setEventCreated] = useState("");
  const [eventMonth, setEventMonth] = useState("");
  const [bidRequest, setBidRequest] = useState("");
  const [storeAccess, setStoreAccess] = useState("");
  
  // NEW: Filter states to track if filters are applied
  const [appliedFilters, setAppliedFilters] = useState({
    source: "",
    status: "",
    date: "",
    interestedService: "",
    eventCreated: "",
    eventMonth: "",
    bidRequest: "",
    storeAccess: "",
  });
  const fetchList = () => {
    setLoading(true);
    
    // Build query params - using appliedFilters for backend-supported filters
    let queryParams = `page=${page || 1}&limit=${itemsPerPage}`;
    if (sort) queryParams += `&sort=${sort}`;
    if (search) queryParams += `&search=${encodeURIComponent(search)}`;
    if (appliedFilters.source)
      queryParams += `&source=${encodeURIComponent(appliedFilters.source)}`;
    if (appliedFilters.date) queryParams += `&date=${appliedFilters.date}`;
    if (appliedFilters.status)
      queryParams += `&status=${encodeURIComponent(appliedFilters.status)}`;

    // NEW: backend-supported filters for additional fields
    if (appliedFilters.interestedService) {
      queryParams += `&service=${encodeURIComponent(
        appliedFilters.interestedService
      )}`;
    }
    if (appliedFilters.eventCreated) {
      queryParams += `&eventCreated=${encodeURIComponent(
        appliedFilters.eventCreated
      )}`;
    }
    if (appliedFilters.eventMonth && appliedFilters.eventMonth !== "All months") {
      queryParams += `&eventMonth=${encodeURIComponent(
        appliedFilters.eventMonth
      )}`;
    }
    if (appliedFilters.bidRequest) {
      queryParams += `&bidRequest=${encodeURIComponent(
        appliedFilters.bidRequest
      )}`;
    }
    if (appliedFilters.storeAccess) {
      queryParams += `&storeAccess=${encodeURIComponent(
        appliedFilters.storeAccess
      )}`;
    }
    
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/enquiry?${queryParams}`,
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
        let filteredList = response.list || [];
        
        // Client-side filtering for filters not yet supported by backend
        // This can be removed once backend supports these filters
        if (appliedFilters.interestedService) {
          // Filter by interested service (if data exists in additionalInfo)
          filteredList = filteredList.filter((lead) => {
            const service = lead.additionalInfo?.interestedService || lead.additionalInfo?.service || "";
            return service.toLowerCase().includes(appliedFilters.interestedService.toLowerCase());
          });
        }
        
        if (appliedFilters.eventCreated) {
          // Filter by event created - would need user.events data
          // For now, this is a placeholder that would need backend support
          // filteredList = filteredList.filter((lead) => {
          //   return appliedFilters.eventCreated === "Yes" 
          //     ? lead.user?.events?.length > 0 
          //     : !lead.user?.events?.length;
          // });
        }
        
        if (appliedFilters.bidRequest) {
          // Filter by bid request - would need bidding/order data
          // Placeholder for future backend support
        }
        
        if (appliedFilters.storeAccess) {
          // Filter by store access - related to userCreated
          // This would need backend support to properly filter
        }
        
        setList(filteredList);
        setTotalPages(response.totalPages || 1);
        setSelected([]);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setLoading(false);
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
  // NEW: Apply filters function
  const handleApplyFilters = () => {
    setAppliedFilters({
      source: source,
      status: status,
      date: date,
      interestedService: interestedService,
      eventCreated: eventCreated,
      eventMonth: eventMonth,
      bidRequest: bidRequest,
      storeAccess: storeAccess,
    });
    if (page === 1) {
      fetchList();
    } else {
      setPage(1);
    }
  };
  
  // NEW: Reset filters function
  const handleResetFilters = () => {
    setSource("");
    setDate("");
    setStatus("");
    setInterestedService("");
    setEventCreated("");
    setEventMonth("");
    setBidRequest("");
    setStoreAccess("");
    setAppliedFilters({
      source: "",
      status: "",
      date: "",
      interestedService: "",
      eventCreated: "",
      eventMonth: "",
      bidRequest: "",
      storeAccess: "",
    });
    if (page === 1) {
      fetchList();
    } else {
      setPage(1);
    }
  };

  // NEW: Handle tab clicks for ALL / DECOR / MAKEUP
  const handleTabClick = (tab) => {
    setActiveTab(tab);

    let service = "";
    if (tab === "DECOR") {
      service = "Decor";
    } else if (tab === "MAKEUP") {
      service = "Makeup";
    }

    // Update visible dropdown state
    setInterestedService(service);

    // Update applied filters so fetchList() can use client-side service filter
    setAppliedFilters((prev) => ({
      ...prev,
      interestedService: service,
    }));
  };
  
  useEffect(() => {
    if (page === 1) {
      fetchList();
    } else {
      setPage(1);
    }
  }, [itemsPerPage, search, sort]);
  
  // Update when appliedFilters change
  useEffect(() => {
    if (page === 1) {
      fetchList();
    } else {
      setPage(1);
    }
  }, [appliedFilters]);
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
        {/* Top Tabs: ALL, DECOR, MAKEUP */}
        <div className="flex flex-row gap-4">
          <button
            onClick={() => handleTabClick("ALL")}
            className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === "ALL"
                ? "bg-black text-white"
                : "bg-white text-black border border-gray-300"
            }`}
          >
            ALL
          </button>
          <button
            onClick={() => handleTabClick("DECOR")}
            className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === "DECOR"
                ? "bg-black text-white"
                : "bg-white text-black border border-gray-300"
            }`}
          >
            DECOR
          </button>
          <button
            onClick={() => handleTabClick("MAKEUP")}
            className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === "MAKEUP"
                ? "bg-black text-white"
                : "bg-white text-black border border-gray-300"
            }`}
          >
            MAKEUP
          </button>
        </div>
        
        {/* Filter by Section */}
        <div className=" flex flex-col gap-4">
          <p className="font-semibold text-lg">Filter by:</p>
          
          {/* First Row of Filters */}
          <div className="grid grid-cols-7 gap-4">
            <div className="flex flex-col gap-1">
              <Select
                value={source}
                onChange={(e) => {
                  setSource(e.target.value);
                }}
                disabled={loading}
                className="w-full"
              >
                <option value={""}>Source</option>
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
            </div>
            
            <div className="flex flex-col gap-1">
              <Select
                value={interestedService}
                onChange={(e) => {
                  setInterestedService(e.target.value);
                }}
                disabled={loading}
                className="w-full"
              >
                <option value={""}>Interested Service</option>
                <option value="Decor">Decor</option>
                <option value="Makeup">Makeup</option>
                <option value="Photography">Photography</option>
                <option value="Catering">Catering</option>
                <option value="Venue">Venue</option>
              </Select>
            </div>
            
            <div className="flex flex-col gap-1">
              <Select
                value={eventCreated}
                onChange={(e) => {
                  setEventCreated(e.target.value);
                }}
                disabled={loading}
                className="w-full"
              >
                <option value={""}>Event created</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Select>
              <p className="text-xs text-gray-400 mt-1">Yes/No</p>
            </div>
            
            <div className="flex flex-col gap-1">
              <Select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
                disabled={loading}
                className="w-full"
              >
                <option value={""}>Select Status</option>
                <option value={"Fresh"}>Fresh: New lead(past 24hrs)</option>
                <option value={"New"}>New: leads(past week)</option>
                <option value={"Hot"}>Hot: Event within 8 weeks</option>
                <option value={"Potential"}>Potential: Event in 8 - 20 weeks</option>
                <option value={"Cold"}>Cold: Event beyond 20 weeks</option>
                <option value={"Lost"}>Lost: Waste/Dummy Lead</option>
                <option value={"Interested"}>Interested: Useful Leads</option>
                <option value={"Verified"}>Verified: Verified by OTP</option>
                <option value={"NotVerified"}>Not Verified</option>
              </Select>
            </div>
            
            <div className="flex flex-col gap-1">
              <Select
                value={eventMonth}
                onChange={(e) => {
                  setEventMonth(e.target.value);
                }}
                disabled={loading}
                className="w-full"
              >
                <option value={""}>Event Month</option>
                <option value="All months">All months</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </Select>
              <p className="text-xs text-gray-400 mt-1">All months</p>
            </div>
            
            <div className="flex flex-col gap-1">
              <Select
                value={bidRequest}
                onChange={(e) => {
                  setBidRequest(e.target.value);
                }}
                disabled={loading}
                className="w-full"
              >
                <option value={""}>Bid request</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Select>
              <p className="text-xs text-gray-400 mt-1">Yes/No</p>
            </div>
            
            <div className="flex flex-col gap-1">
              <Select
                value={storeAccess}
                onChange={(e) => {
                  setStoreAccess(e.target.value);
                }}
                disabled={loading}
                className="w-full"
              >
                <option value={""}>Store Access</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Select>
              <p className="text-xs text-gray-400 mt-1">Yes/No</p>
            </div>
          </div>
          
          {/* Apply and Reset Buttons */}
          <div className="flex flex-row gap-4">
            <Button
              color="success"
              onClick={handleApplyFilters}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              Apply
            </Button>
            <Button
              color="dark"
              onClick={handleResetFilters}
              disabled={loading}
            >
              Reset
            </Button>
          </div>
        </div>
        
        {/* Actions Section */}
        <div className="flex flex-col gap-4">
          <p className="font-semibold text-lg">Actions:</p>
          <div className="flex flex-row gap-4 flex-wrap items-center">
            <Button
              disabled={selected.length == 0 || loading}
              color="light"
              onClick={() => {
                if (selected.length == 0) {
                  alert("Please select at least one lead");
                } else {
                  // Open modal or dropdown for status change
                  markLost();
                }
              }}
              className="flex items-center gap-2"
            >
              <BsXCircle className="h-5 w-5" />
              Change status
            </Button>
            
            <div className="flex flex-col">
              <Button
                disabled={true}
                color="light"
                className="flex items-center gap-2"
              >
                <BiUser className="h-5 w-5" />
                Assign
              </Button>
            </div>
            
            <Button
              disabled={true}
              color="light"
              className="flex items-center gap-2"
            >
              <BsArrowDownLeft className="h-5 w-5" />
              Import
            </Button>
            
            <Button
              color="light"
              disabled={loading}
              onClick={() => {
                setIsAddLeadModalOpen(true);
                setAddLeadData({ name: "", phone: "" });
              }}
              className="flex items-center gap-2"
            >
              <BsPlus className="h-5 w-5" />
              Create lead +
            </Button>
            
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
              className="flex items-center gap-2"
            >
              <MdDelete className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Apply button for Actions (if needed based on design) */}
          {selected.length > 0 && (
            <div className="flex flex-row gap-4">
              <Button
                color="success"
                onClick={() => {
                  if (selected.length == 0) {
                    alert("Please select at least one lead");
                  } else {
                    markInterested();
                  }
                }}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                Apply
              </Button>
            </div>
          )}
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
