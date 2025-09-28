import {
  MdDelete,
  MdEditDocument,
  MdOpenInNew,
  MdRemoveRedEye,
} from "react-icons/md";
import { BsPlus, BsSearch } from "react-icons/bs";
import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Checkbox,
  Label,
  Pagination,
  Select,
  Spinner,
  Table,
  TextInput,
  Tooltip,
} from "flowbite-react";
import { toProperCase } from "@/utils/text";
import Link from "next/link";

export default function Event({ user }) {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState([]);
  const [community, setCommunity] = useState("");
  const [communityList, setCommunityList] = useState([]);
  const [eventType, setEventType] = useState("");
  const [eventTypeList, setEventTypeList] = useState([]);
  const [dateFilter, setDateFilter] = useState(["", ""]);
  const fetchEventCommunityList = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event-community`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setCommunityList(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchEventTypeList = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event-type`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setEventTypeList(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchList = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event?page=${
        page || 1
      }&limit=${itemsPerPage}${search && `&search=${search}`}${
        sort && `&sort=${sort}`
      }${status && `&status=${status}`}
      ${community && `&community=${community}`}${
        eventType && `&eventType=${eventType}`
      }${
        dateFilter[0]
          ? dateFilter[1]
            ? `&startDate=${dateFilter[0]}&endDate=${dateFilter[1]}`
            : `&eventDate=${dateFilter[0]}`
          : ""
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
  const deleteEvents = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ eventIds: selected }),
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          alert("Events deleted successfully");
        }
        fetchList();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    fetchList();
  }, [page]);
  useEffect(() => {
    fetchEventCommunityList();
    fetchEventTypeList();
  }, []);
  useEffect(() => {
    if (page === 1) {
      fetchList();
    } else {
      setPage(1);
    }
  }, [itemsPerPage, search, sort, status, community, dateFilter, eventType]);
  return (
    <>
      <div className="p-8 flex flex-col gap-6 relative">
        {loading && (
          <div className="absolute left-1/2 grid place-content-center h-screen z-50 -translate-x-1/2">
            <Spinner size="xl" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-lg">Filter by:</p>
          <div className="flex flex-row gap-6">
            <Select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
              }}
              disabled={loading}
            >
              <option value={""}>Select Status:</option>
              <option value={"Finalized"}>Finalized</option>
              <option value={"Approved"}>Approved</option>
              <option value={"Booked"}>Booked</option>
              <option value={"Partially Paid"}>Partially Paid</option>
              <option value={"Completely Paid"}>Completely Paid</option>
              <option value={"Completed"}>Completed</option>
              <option value={"Event Lost"}>Event Lost</option>
            </Select>
            <Select
              value={community}
              onChange={(e) => {
                setCommunity(e.target.value);
              }}
              disabled={loading}
            >
              <option value={""}>Select Community</option>
              {communityList.map((item, index) => (
                <option value={item.title} key={index}>
                  {item.title}
                </option>
              ))}
            </Select>
            <Select
              value={eventType}
              onChange={(e) => {
                setEventType(e.target.value);
              }}
              disabled={loading}
            >
              <option value={""}>Select Event Type</option>
              {eventTypeList.map((item, index) => (
                <option value={item.title} key={index}>
                  {item.title}
                </option>
              ))}
            </Select>
            <Button
              color="dark"
              onClick={() => {
                setSearch("");
                setSort("");
                setItemsPerPage(10);
                setStatus("");
                setCommunity("");
                setEventType("");
                setDateFilter(["", ""]);
              }}
              disabled={loading}
            >
              Reset
            </Button>
          </div>
          <div>
            <Label value="Event Date Filter" />
            <div className="flex flex-row gap-6">
              <TextInput
                type="date"
                value={dateFilter[0]}
                onChange={(e) => {
                  setDateFilter([e.target.value, dateFilter[1]]);
                }}
                disabled={loading}
              />
              <TextInput
                type="date"
                value={dateFilter[1]}
                onChange={(e) => {
                  setDateFilter([dateFilter[0], e.target.value]);
                }}
                disabled={loading}
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl flex-col flex gap-3 shadow-xl">
          <div className="flex flex-row justify-between items-center pt-4 px-12">
            <div className="flex flex-col">
              <p className="text-lg font-medium">All Events</p>
            </div>
            <div className="flex flex-row gap-4">
              <Tooltip content="Delete Events">
                <Button
                  disabled={selected.length == 0 || loading}
                  color="light"
                  onClick={() => {
                    if (selected.length == 0) {
                      alert("Please select at least one event");
                    } else if (confirm("Do you want to delete the Events?")) {
                      deleteEvents();
                    }
                  }}
                >
                  <MdDelete className="h-5 w-5" />
                </Button>
              </Tooltip>
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
                <option value={"Newest (Creation)"}>Newest (Creation)</option>
                <option value={"Older (Creation)"}>Older (Creation)</option>
                <option value={"Closest (Event Date)"}>
                  Closest (Event Date)
                </option>
                <option value={"Farthest (Event Date)"}>
                  Farthest (Event Date)
                </option>
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
                </Table.HeadCell>
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
                <Table.HeadCell>Event Name</Table.HeadCell>
                <Table.HeadCell>User</Table.HeadCell>
                {status === "Event Lost" ? (
                  <>
                    <Table.HeadCell>Response for Lost Lead</Table.HeadCell>
                  </>
                ) : (
                  <>
                    <Table.HeadCell>Event Days</Table.HeadCell>
                    <Table.HeadCell>Status</Table.HeadCell>
                    <Table.HeadCell>Actions</Table.HeadCell>
                  </>
                )}
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
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 relative"
                        href={`/event-tool/event/${item._id}`}
                      >
                        {item.name}
                      </a>
                    </Table.Cell>
                    <Table.Cell>{item.user.name}</Table.Cell>
                    {status === "Event Lost" ? (
                      <>
                        <Table.Cell>{item.lostResponse}</Table.Cell>
                      </>
                    ) : (
                      <>
                        <Table.Cell>
                          <ol className="list-decimal">
                            {item.eventDays.map((i) => (
                              <li key={i._id} className="flex gap-2">
                                {i.name} [{i.date}]
                              </li>
                            ))}
                          </ol>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex">
                            {item.status.lost ? (
                              <Badge color="failure">Lost</Badge>
                            ) : item.status.completed ? (
                              <Badge color="gray">Completed</Badge>
                            ) : item.status.paymentDone ? (
                              <Badge color="success">Payment Completed</Badge>
                            ) : item.status.approved ? (
                              <Badge color="indigo">Approved</Badge>
                            ) : item.status.finalized ? (
                              <Badge color="purple">Finalized</Badge>
                            ) : null}
                          </div>
                        </Table.Cell>
                        <Table.Cell className="flex gap-2">
                          <Link
                            href={`/event-tool/event/${item._id}`}
                            target="_blank"
                          >
                            <MdEditDocument
                              size={24}
                              cursor={"pointer"}
                              className="hover:text-blue-700"
                            />
                          </Link>
                        </Table.Cell>
                      </>
                    )}
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
