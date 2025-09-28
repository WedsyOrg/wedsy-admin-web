import { Sidebar } from "flowbite-react";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  HiCash,
  HiChartPie,
  HiCog,
  HiFolder,
  HiInbox,
  HiUser,
  HiViewBoards,
  HiClipboardList,
  HiOutlineLogout,
} from "react-icons/hi";

export default function AdminSidebar({ user, onLogout }) {
  const router = useRouter();
  const [displayText, setDisplayText] = useState(false);
  return router?.pathname === `/payments/[paymentId]/invoice` ? null : (
    <Sidebar
      className="h-screen min-w-fit max-w-max [&>*]:flex [&>*]:flex-col [&>*]:no-scrollbar overflow-y-auto"
      id="sidebar"
    >
      <Sidebar.Logo
        onClick={() => setDisplayText(!displayText)}
        img={displayText ? "/assets/logo-black.png" : "/assets/logo-icon.png"}
        imgAlt="Logo"
        className={`${
          displayText ? "" : "[&>img]:mr-0 pl-0 justify-center"
        } cursor-pointer`}
      />
      <Sidebar.Items className="overflow-y-auto grow flex flex-col no-scrollbar justify-between">
        <Sidebar.ItemGroup className="overflow-y-auto grow no-scrollbar">
          <Sidebar.Item
            href="/"
            icon={HiChartPie}
            className={`${displayText ? "" : "[&>span]:hidden"} ${
              router.pathname === "/"
                ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                : ""
            }`}
          >
            {displayText && <p>Dashboard</p>}
          </Sidebar.Item>
          <Sidebar.Item
            href="/leads"
            icon={HiInbox}
            className={`${displayText ? "" : "[&>span]:hidden"} ${
              router.pathname.includes("/leads")
                ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                : ""
            }`}
          >
            {displayText && <p>Leads</p>}
          </Sidebar.Item>
          <Sidebar.Item
            href="/event-tool"
            icon={HiViewBoards}
            className={`${displayText ? "" : "[&>span]:hidden"} ${
              router.pathname.includes("/event-tool")
                ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                : ""
            }`}
          >
            {displayText && <p>Event Tool</p>}
          </Sidebar.Item>
          {user?.roles?.includes("owner") && (
            <Sidebar.Item
              href="/wedding-store"
              icon={HiFolder}
              className={`${displayText ? "" : "[&>span]:hidden"} ${
                router.pathname.includes("/wedding-store")
                  ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                  : ""
              }`}
            >
              {displayText && <p>Wedding Store</p>}
            </Sidebar.Item>
          )}
          <Sidebar.Item
            href="/tasks"
            icon={HiClipboardList}
            className={`${displayText ? "" : "[&>span]:hidden"} ${
              router.pathname.includes("/tasks")
                ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                : ""
            }`}
          >
            {displayText && <p>Tasks</p>}
          </Sidebar.Item>
          {user?.roles?.includes("owner") && (
            <Sidebar.Item
              href="/payments"
              icon={HiCash}
              className={`${displayText ? "" : "[&>span]:hidden"} ${
                router.pathname.startsWith("/payments")
                  ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                  : ""
              }`}
            >
              {displayText && <p>Payments (Store)</p>}
            </Sidebar.Item>
          )}
          <Sidebar.Item
            href="/orders"
            icon={HiUser}
            className={`${displayText ? "" : "[&>span]:hidden"} ${
              router.pathname.startsWith("/orders")
                ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                : ""
            }`}
          >
            {displayText && <p>Orders (Store)</p>}
          </Sidebar.Item>
          {user?.roles?.includes("owner") && (
            <Sidebar.Item
              href="/settings"
              icon={HiCog}
              className={`${displayText ? "" : "[&>span]:hidden"} ${
                router.pathname.includes("/settings")
                  ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                  : ""
              }`}
            >
              {displayText && <p>Settings</p>}
            </Sidebar.Item>
          )}
          {user?.roles?.includes("owner") && (
            <Sidebar.Item
              href="/makeup/dashboard"
              icon={HiChartPie}
              className={`${displayText ? "" : "[&>span]:hidden"} ${
                router.pathname.includes("/makeup/dashboard")
                  ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                  : ""
              }`}
            >
              {displayText && <p>Makeup Dashboard</p>}
            </Sidebar.Item>
          )}
          {user?.roles?.includes("owner") && (
            <Sidebar.Item
              href="/vendors"
              icon={HiChartPie}
              className={`${displayText ? "" : "[&>span]:hidden"} ${
                router.pathname.includes("/vendors")
                  ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                  : ""
              }`}
            >
              {displayText && <p>Vendors</p>}
            </Sidebar.Item>
          )}
          {user?.roles?.includes("owner") && (
            <Sidebar.Item
              href="/chats"
              icon={HiChartPie}
              className={`${displayText ? "" : "[&>span]:hidden"} ${
                router.pathname.includes("/chats")
                  ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                  : ""
              }`}
            >
              {displayText && <p>Chats</p>}
            </Sidebar.Item>
          )}
          {user?.roles?.includes("owner") && (
            <Sidebar.Item
              href="/dummy"
              icon={HiChartPie}
              className={`${displayText ? "" : "[&>span]:hidden"} ${
                router.pathname.includes("/dummy")
                  ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                  : ""
              }`}
            >
              {displayText && <p>Bidding (Main)</p>}
            </Sidebar.Item>
          )}
          {user?.roles?.includes("owner") && (
            <Sidebar.Item
              href="/makeup/packages"
              icon={HiChartPie}
              className={`${displayText ? "" : "[&>span]:hidden"} ${
                router.pathname.includes("/makeup/packages")
                  ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                  : ""
              }`}
            >
              {displayText && <p>Packages(Main)</p>}
            </Sidebar.Item>
          )}
          <Sidebar.Item
            href="/makeup/orders"
            icon={HiChartPie}
            className={`${displayText ? "" : "[&>span]:hidden"} ${
              router.pathname.includes("/makeup/orders")
                ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                : ""
            }`}
          >
            {displayText && <p>Orders (Main)</p>}
          </Sidebar.Item>
          {user?.roles?.includes("owner") && (
            <Sidebar.Item
              href="/makeup/payments"
              icon={HiChartPie}
              className={`${displayText ? "" : "[&>span]:hidden"} ${
                router.pathname.includes("/makeup/payments")
                  ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                  : ""
              }`}
            >
              {displayText && <p>Payments (Main)</p>}
            </Sidebar.Item>
          )}
          {user?.roles?.includes("owner") && (
            <Sidebar.Item
              href="/settlements"
              icon={HiChartPie}
              className={`${displayText ? "" : "[&>span]:hidden"} ${
                router.pathname.includes("/settlements")
                  ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                  : ""
              }`}
            >
              {displayText && <p>Settlements</p>}
            </Sidebar.Item>
          )}
          {user?.roles?.includes("owner") && (
            <Sidebar.Item
              href="/makeup/reviews"
              icon={HiChartPie}
              className={`${displayText ? "" : "[&>span]:hidden"} ${
                router.pathname.includes("/makeup/reviews")
                  ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                  : ""
              }`}
            >
              {displayText && <p>Reviews</p>}
            </Sidebar.Item>
          )}
          {user?.roles?.includes("owner") && (
            <Sidebar.Item
              href="/community"
              icon={HiChartPie}
              className={`${displayText ? "" : "[&>span]:hidden"} ${
                router.pathname.includes("/community")
                  ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                  : ""
              }`}
            >
              {displayText && <p>Community</p>}
            </Sidebar.Item>
          )}
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup className="mt-auto pt-0">
          <Sidebar.Item
            onClick={onLogout}
            icon={HiOutlineLogout}
            className={`${displayText ? "" : "[&>span]:hidden"}`}
          >
            {displayText && <p>Logout</p>}
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
