import StatsCard from "@/components/cards/StatsCard";
import VendorLastActiveCard from "@/components/cards/VendorLastActiveCard";
import VendorHeaderDropdown from "@/components/dropdown/VendorHeaderDropdown";
import HorizontalLine from "@/components/other/HorizontalLine";
import {
  Button,
  Checkbox,
  Label,
  Pagination,
  Select,
  Table,
  TextInput,
} from "flowbite-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsArrowUp, BsPlus, BsSearch } from "react-icons/bs";

export default function Vendor({ message, setMessage }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState({});
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("");
  const fetchVendor = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  return (
    <>
      <div className="flex flex-col gap-6 p-8">
        <p className="text-xl font-medium">Reviews</p>
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-lg">Filter by:</p>
          <div className="grid grid-cols-6 gap-6 gap-y-2">
            <div>
              <Select disabled={loading}>
                <option value={""}>Select Source</option>
                <option value={"Bidding"}>Bidding</option>
              </Select>
            </div>
            <div className="col-span-2">
              <div className="grid grid-cols-2 gap-2">
                <TextInput
                  type="date"
                  // value={dateFilter[0]}
                  // onChange={(e) => {
                  //   setDateFilter([e.target.value, dateFilter[1]]);
                  // }}
                  disabled={loading}
                />
                <TextInput
                  type="date"
                  // value={dateFilter[1]}
                  // onChange={(e) => {
                  //   setDateFilter([dateFilter[0], e.target.value]);
                  // }}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
