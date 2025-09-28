import { Button, Checkbox, Select } from "flowbite-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOpenInNew } from "react-icons/md";

export default function Tasks({ message, setMessage }) {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState("All");
  const fetchTasks = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/task`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setList(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const completeTask = (id) => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/${id}/complete`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setMessage({
          text: "Marked the Task as Completed!",
          status: "success",
          display: true,
        });
        fetchTasks();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    fetchTasks();
  }, []);
  return (
    <>
      <div className="p-8 flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-semibold">Tasks</h2>
        </div>
        <div className="grid grid-cols-5 gap-4 py-4">
          <Select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
          >
            <option value={"All"}>All Tasks</option>
            <option value={"Today"}>Sort By: Only Today</option>
            <option value={"Pending"}>Sort By: Tasks Lined Up</option>
            <option value={"Completed"}>Sort By: Completed Tasks</option>
          </Select>
          <Button
            color="gray"
            onClick={() => {
              setFilter("Completed");
            }}
          >
            View Previous Tasks
          </Button>
        </div>
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col">
          <div className="font-semibold bg-white rounded-2xl shadow-lg grid grid-cols-6 gap-2 border-b-2 border-gray-500">
            <p className="col-span-4 py-4 px-6">Tasks</p>
            <p className="py-4 px-6 text-center">DATE</p>
            <p></p>
          </div>
          {list
            ?.filter((item) =>
              filter === "Today"
                ? new Date(item.deadline).toLocaleDateString() ===
                  new Date().toLocaleDateString()
                : filter === "Pending"
                ? !item.completed
                : filter === "Completed"
                ? item.completed
                : true
            )
            .sort(
              (a, b) =>
                a.completed - b.completed ||
                new Date(a.deadline) - new Date(b.deadline)
            )
            ?.map((item, index) => (
              <div
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } shadow-lg grid grid-cols-6 gap-2`}
              >
                <p className="col-span-4 px-4 py-2 flex items-center">
                  [{item.category}] {item.task}{" "}
                  {item.category === "Vendor"
                    ? item.referenceId && (
                        <Link
                          href={`/vendors/${item.referenceId}`}
                          className="ml-2 text-base"
                          target="_blank"
                        >
                          <MdOpenInNew />
                        </Link>
                      )
                    : ""}
                  {item.category === "Event"
                    ? item.referenceId && (
                        <Link
                          href={`/event-tool/event/${item.referenceId}`}
                          className="ml-2 text-base"
                          target="_blank"
                        >
                          <MdOpenInNew />
                        </Link>
                      )
                    : ""}
                </p>
                <p className="px-3 py-2 border-x-2 border-black text-center">
                  {new Date(item?.deadline).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-center">
                  <Checkbox
                    checked={item?.completed}
                    disabled={loading || item?.completed}
                    onChange={(e) => {
                      if (e.target.checked) {
                        completeTask(item?._id);
                      }
                    }}
                  />
                </p>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
