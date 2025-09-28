import Link from "next/link";
import { MdOpenInNew } from "react-icons/md";

export default function NotificationCard({ title, link, list, display }) {
  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col">
        <div className="font-semibold bg-white rounded-2xl shadow-lg grid grid-cols-5 gap-2 border-b-2 border-gray-500">
          {link ? (
            <Link
              href={link}
              className="col-span-4 py-4 px-6 flex flex-row items-center gap-2"
              target="_blank"
            >
              <span>{title || "NOTIFICATIONS"}</span>
              <span className="text-sm underline font-normal">view all</span>
              <MdOpenInNew />
            </Link>
          ) : (
            <p className="col-span-4 py-4 px-6">{title || "NOTIFICATIONS"}</p>
          )}
          <p className="py-4 px-6">DATE</p>
        </div>
        {list?.map((item, index) => (
          <div
            key={index}
            className={`${
              index % 2 === 0 ? "bg-gray-100" : "bg-white"
            } shadow-lg grid grid-cols-5 gap-2`}
          >
            <p className="col-span-4 border-r-2 border-black px-4 py-2 flex items-center">
              {item.title}{" "}
              {item.category === "Vendor"
                ? item.references.vendor && (
                    <Link
                      href={`/vendors/${item.references.vendor}`}
                      className="ml-2 text-base"
                      target="_blank"
                    >
                      <MdOpenInNew />
                    </Link>
                  )
                : ""}
            </p>
            <p className="px-3 py-2">
              {new Date(item?.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
