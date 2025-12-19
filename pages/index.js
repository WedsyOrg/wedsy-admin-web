import { MdPeople } from "react-icons/md";
import { BiChevronDown, BiChevronUp, BiDollar } from "react-icons/bi";
import { BsArrowUp, BsChevronDown, BsChevronUp, BsSearch } from "react-icons/bs";
import { useEffect, useState } from "react";
import { Spinner, TextInput } from "flowbite-react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Home({ user }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notificationOpen, setNotificationsOpen] = useState(false);
  const [leadStats, setLeadStats] = useState({
    total: 0,
    lost: 0,
    interested: 0,
    fresh: 0,
    new: 0,
  });
  const [eventsPendingApproval, setEventsPendingApproval] = useState(0);
  
  // NEW: Additional lead status counts
  const [hotLeadsCount, setHotLeadsCount] = useState(0);
  const [potentialLeadsCount, setPotentialLeadsCount] = useState(0);
  const [coldLeadsCount, setColdLeadsCount] = useState(0);
  
  // NEW: Task counts
  const [tasksTodayCount, setTasksTodayCount] = useState(0);
  const [tasksTotalCount, setTasksTotalCount] = useState(0);
  
  // NEW: Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchLeadStats = () => {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiry?stats=true`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          // Ensure stats object exists, otherwise use default values
          if (response && response.stats) {
            setLeadStats({
              total: response.stats.total || 0,
              lost: response.stats.lost || 0,
              interested: response.stats.interested || 0,
              fresh: response.stats.fresh || 0,
              new: response.stats.new || 0,
            });
          } else {
            // Keep default values if response is invalid
            setLeadStats({
              total: 0,
              lost: 0,
              interested: 0,
              fresh: 0,
              new: 0,
            });
          }
          resolve();
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
          // Keep default values on error
          setLeadStats({
            total: 0,
            lost: 0,
            interested: 0,
            fresh: 0,
            new: 0,
          });
          resolve(); // Resolve instead of reject to prevent blocking other fetches
        });
    });
  };
  // NEW: Fetch lead counts by status (Hot, Potential, Cold)
  const fetchLeadCountsByStatus = () => {
    const fetchCount = (status) => {
      return fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/enquiry?page=1&limit=1000&status=${encodeURIComponent(status)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            // If response is not ok, return 0 count
            console.warn(`API returned ${response.status} for status=${status}`);
            return 0;
          }
          return response.json();
        })
        .then((response) => {
          // Return count based on list length or use totalPages if available
          if (response && response.list) {
            return response.list.length;
          }
          // If response has totalPages, calculate approximate count
          if (response && response.totalPages) {
            return response.totalPages * (response.limit || 1000);
          }
          return 0;
        })
        .catch((error) => {
          console.error(`Error fetching ${status} leads:`, error);
          return 0;
        });
    };

    return Promise.all([
      fetchCount("Hot").then((count) => setHotLeadsCount(count)),
      fetchCount("Potential").then((count) => setPotentialLeadsCount(count)),
      fetchCount("Cold").then((count) => setColdLeadsCount(count)),
    ]);
  };

  // NEW: Fetch tasks
  const fetchTasks = () => {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/task`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          const list = Array.isArray(response) ? response : [];
          const total = list.length;

          // Count tasks due today
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayEnd = new Date(today);
          todayEnd.setHours(23, 59, 59, 999);

          const todayCount = list.filter((task) => {
            if (!task.deadline) return false;
            const taskDate = new Date(task.deadline);
            return taskDate >= today && taskDate <= todayEnd;
          }).length;

          setTasksTotalCount(total);
          setTasksTodayCount(todayCount);
          resolve();
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
          reject();
        });
    });
  };

  const fetchPendingEventStats = () => {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/event?stats=pending_approval`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          setEventsPendingApproval(response.pending_approval);
          resolve();
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
          reject();
        });
    });
  };

  // Debounce search to avoid too many API calls
  useEffect(() => {
    if (!searchQuery || searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setSearchLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/enquiry?page=1&limit=10&search=${encodeURIComponent(searchQuery)}`,
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
          setSearchResults(response.list || []);
          setSearchLoading(false);
        })
        .catch((error) => {
          console.error("There was a problem with the search operation:", error);
          setSearchResults([]);
          setSearchLoading(false);
        });
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]);
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchLeadStats(),
      fetchPendingEventStats(),
      fetchTasks(),
      fetchLeadCountsByStatus(),
    ]).then(() => setLoading(false));
  }, []);

  // NEW: Generic stat box component matching the design
  const StatBox = ({ label, value }) => (
    <div className="bg-white rounded-2xl shadow-lg px-6 py-4 flex flex-col items-center justify-center min-w-[140px]">
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="text-4xl font-bold mt-2">
        {loading ? <Spinner size="sm" /> : value}
      </p>
    </div>
  );

  return (
    <>
      <div className="p-8 flex flex-col gap-6">
        {/* Header with greeting and search */}
        <div className="flex flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-semibold">
            Hello {user.name} {"👋🏼,"}
          </h2>
          <div className="relative max-w-xs pr-10">
            <TextInput
              icon={BsSearch}
              id="search"
              placeholder="Search"
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="w-full bg-white"
            />
            {/* Search Results Dropdown (optional - can be enhanced later) */}
            {searchQuery && searchResults.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
                {searchLoading ? (
                  <div className="p-4 flex justify-center">
                    <Spinner size="sm" />
                  </div>
                ) : (
                  <div className="p-2">
                    {searchResults.map((lead) => (
                      <Link
                        key={lead._id}
                        href={`/leads/${lead._id}`}
                        className="block"
                      >
                        <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <p className="font-medium text-gray-900">{lead.name}</p>
                          {lead.phone && (
                            <p className="text-sm text-gray-500">{lead.phone}</p>
                          )}
                          {lead.email && (
                            <p className="text-sm text-gray-500">{lead.email}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                    {searchResults.length >= 10 && (
                      <Link
                        href={`/leads?search=${encodeURIComponent(searchQuery)}`}
                        className="block"
                      >
                        <div className="p-3 text-center text-sm text-blue-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                          View all results →
                        </div>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
            {searchQuery && searchResults.length === 0 && !searchLoading && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-4 text-center text-gray-500">
                No results found
        </div>
            )}
          </div>
            </div>

        {/* --- TODAY SECTION --- */}
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold text-gray-700 uppercase">
            Today
          </p>
          <div className="flex flex-row gap-4 flex-wrap">
            <StatBox label="Fresh Leads" value={leadStats?.fresh ?? 0} />
            <StatBox label="Follow Ups" value={leadStats?.interested ?? 0} />
            <StatBox label="Tasks" value={tasksTodayCount} />
            </div>
            </div>

        {/* --- TOTAL SECTION --- */}
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold text-gray-700 uppercase">
            Total
          </p>
          <div className="flex flex-row gap-4 flex-wrap">
            <StatBox label="Hot Lead" value={hotLeadsCount} />
            <StatBox label="Potential Lead" value={potentialLeadsCount} />
            <StatBox label="Cold Lead" value={coldLeadsCount} />
            <StatBox label="Lost leads" value={leadStats?.lost ?? 0} />
            <StatBox label="Booked" value={leadStats?.interested ?? 0} />
            <StatBox label="Super hot" value={hotLeadsCount} />
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-row gap-4 flex-grow">
            <div className="bg-gradient-to-b from-emerald-100 to-green-50 rounded-full p-3 my-auto">
              <BiDollar size={48} color="#00AC4F" />
            </div>
            <div className="flex flex-col gap-1 mx-auto">
              <p className="text-gray-400 font-medium">Total</p>
              <p className="text-4xl font-bold">
                $198k
                {/* --StatsPending-- */}
              </p>
              <p className="flex flex-row gap-1 items-center">
                <BsArrowUp color="#00AC4F" size={18} />
                <span className="text-green-600 font-medium">
                  38%{/* --StatsPending-- */}
                </span>
                <span className="font-medium">this month</span>
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-row gap-4 flex-grow">
            <div className="bg-gradient-to-b from-emerald-100 to-green-50 rounded-full p-3 my-auto">
              <BiDollar size={48} color="#00AC4F" />
            </div>
            <div className="flex flex-col gap-1 mx-auto">
              <p className="text-gray-400 font-medium">Upcoming events</p>
              <p className="text-4xl font-bold">
                2nd Sept{/* --StatsPending-- */}
              </p>
              <p className="flex flex-row gap-1 items-center text-rose-900 font-semibold">
                Karan reception{/* --StatsPending-- */}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-1 text-center flex-grow">
            <p className="text-gray-400 font-medium">Events to be approved</p>
            <p className="text-4xl font-bold">
              {loading ? <Spinner /> : <>{eventsPendingApproval}</>}
            </p>
          </div>
        </div>
        <div className="bg-[#f8f8f8] rounded-2xl shadow-lg flex flex-col">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-row gap-2 justify-between">
            <p className="font-semibold">NOTIFICATIONS</p>
            {notificationOpen ? (
              <BsChevronUp
                size={24}
                onClick={() => setNotificationsOpen(false)}
                className="cursor-pointer"
              />
            ) : (
              <BsChevronDown
                size={24}
                onClick={() => setNotificationsOpen(true)}
                className="cursor-pointer"
              />
            )}
          </div>
          {notificationOpen && (
            <>
              <div className="p-4">
                <p>Hello</p>
              </div>
              <div className="bg-white p-4">
                <p>Hello</p>
              </div>
              <div className="p-4">
                <p>Hello</p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
