import { formatDistanceToNow } from "date-fns";
import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";

export default function VendorLastActiveCard({ vendorId }) {
  const [lastActive, setLastActive] = useState(null);
  const [lastActiveStatus, setLastActiveStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const fetchLastActive = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/${vendorId}/last-active`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setLastActive(response?.lastActive);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    fetchLastActive();
  }, []);
  useEffect(() => {
    if (lastActive) {
      const lastActiveDate = new Date(lastActive);
      const diffInMinutes = (new Date() - lastActiveDate) / (1000 * 60);
      let status;
      if (diffInMinutes <= 5) {
        status = "Online";
      } else {
        status = formatDistanceToNow(lastActiveDate, { addSuffix: true });
      }
      setLastActiveStatus(status);
    } else {
      setLastActiveStatus("Not Found");
    }
  }, [lastActive]);
  return (
    <>
      <div className="grow bg-white rounded-lg border py-2 px-6 text-center">
        {loading ? <Spinner /> : <>Last Active: {lastActiveStatus}</>}
      </div>
    </>
  );
}
