import { Sidebar } from "flowbite-react";
import { useRouter } from "next/router";
import Link from "next/link";
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
        <Sidebar.ItemGroup className="overflow-y-auto grow no-scrollbar gap-2">
          <Link href="/" className="block">
            <Sidebar.Item
              icon={HiChartPie}
              className={`${displayText ? "" : "[&>span]:hidden"} ${
                router.pathname === "/"
                  ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                  : ""
              }`}
            >
              {displayText && <p>Dashboard</p>}
            </Sidebar.Item>
          </Link>
          <Link href="/leads" className="block">
            <Sidebar.Item
              icon={HiInbox}
              className={`${displayText ? "" : "[&>span]:hidden"} ${
                router.pathname.includes("/leads")
                  ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                  : ""
              }`}
            >
              {displayText && <p>Leads</p>}
            </Sidebar.Item>
          </Link>
          <Link href="/event-tool" className="block">
            <Sidebar.Item
              icon={HiViewBoards}
              className={`${displayText ? "" : "[&>span]:hidden"} ${
                router.pathname.includes("/event-tool")
                  ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                  : ""
              }`}
            >
              {displayText && <p>Event Tool</p>}
            </Sidebar.Item>
          </Link>
          {user?.roles?.includes("owner") && (
            <Link href="/wedding-store" className="block">
              <Sidebar.Item
                icon={HiFolder}
                className={`${displayText ? "" : "[&>span]:hidden"} ${
                  router.pathname.includes("/wedding-store")
                    ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                    : ""
                }`}
              >
                {displayText && <p>Wedding Store</p>}
              </Sidebar.Item>
            </Link>
          )}
          <Link href="/tasks" className="block">
            <Sidebar.Item
              icon={HiClipboardList}
              className={`${displayText ? "" : "[&>span]:hidden"} ${
                router.pathname.includes("/tasks")
                  ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                  : ""
              }`}
            >
              {displayText && <p>Tasks</p>}
            </Sidebar.Item>
          </Link>
          {user?.roles?.includes("owner") && (
            <Link href="/payments" className="block">
              <Sidebar.Item
                icon={HiCash}
                className={`${displayText ? "" : "[&>span]:hidden"} ${
                  router.pathname.startsWith("/payments")
                    ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                    : ""
                }`}
              >
                {displayText && <p>Payments (Store)</p>}
              </Sidebar.Item>
            </Link>
          )}
          <Link href="/orders" className="block">
            <Sidebar.Item
              icon={HiUser}
              className={`${displayText ? "" : "[&>span]:hidden"} ${
                router.pathname.startsWith("/orders")
                  ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                  : ""
              }`}
            >
              {displayText && <p>Orders (Store)</p>}
            </Sidebar.Item>
          </Link>
          {user?.roles?.includes("owner") && (
            <Link href="/settings" className="block">
              <Sidebar.Item
                icon={HiCog}
                className={`${displayText ? "" : "[&>span]:hidden"} ${
                  router.pathname.includes("/settings")
                    ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                    : ""
                }`}
              >
                {displayText && <p>Settings</p>}
              </Sidebar.Item>
            </Link>
          )}
          {user?.roles?.includes("owner") && (
            <Link href="/makeup/dashboard" className="block">
              <Sidebar.Item
                icon={HiChartPie}
                className={`${displayText ? "" : "[&>span]:hidden"} ${
                  router.pathname.includes("/makeup/dashboard")
                    ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                    : ""
                }`}
              >
                {displayText && <p>Makeup Dashboard</p>}
              </Sidebar.Item>
            </Link>
          )}
          {user?.roles?.includes("owner") && (
            <Link href="/vendors" className="block">
              <Sidebar.Item
                icon={HiChartPie}
                className={`${displayText ? "" : "[&>span]:hidden"} ${
                  router.pathname.includes("/vendors")
                    ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                    : ""
                }`}
              >
                {displayText && <p>Vendors</p>}
              </Sidebar.Item>
            </Link>
          )}
          {user?.roles?.includes("owner") && (
            <Link href="/chats" className="block">
              <Sidebar.Item
                icon={HiChartPie}
                className={`${displayText ? "" : "[&>span]:hidden"} ${
                  router.pathname.includes("/chats")
                    ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                    : ""
                }`}
              >
                {displayText && <p>Chats</p>}
              </Sidebar.Item>
            </Link>
          )}
          {user?.roles?.includes("owner") && (
            <Link href="/dummy" className="block">
              <Sidebar.Item
                icon={HiChartPie}
                className={`${displayText ? "" : "[&>span]:hidden"} ${
                  router.pathname.includes("/dummy")
                    ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                    : ""
                }`}
              >
                {displayText && <p>Bidding (Main)</p>}
              </Sidebar.Item>
            </Link>
          )}
          {user?.roles?.includes("owner") && (
            <Link href="/makeup/packages" className="block">
              <Sidebar.Item
                icon={HiChartPie}
                className={`${displayText ? "" : "[&>span]:hidden"} ${
                  router.pathname.includes("/makeup/packages")
                    ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                    : ""
                }`}
              >
                {displayText && <p>Packages(Main)</p>}
              </Sidebar.Item>
            </Link>
          )}
          <Link href="/makeup/orders" className="block">
            <Sidebar.Item
              icon={HiChartPie}
              className={`${displayText ? "" : "[&>span]:hidden"} ${
                router.pathname.includes("/makeup/orders")
                  ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                  : ""
              }`}
            >
              {displayText && <p>Orders (Main)</p>}
            </Sidebar.Item>
          </Link>
          {user?.roles?.includes("owner") && (
            <Link href="/makeup/payments" className="block">
              <Sidebar.Item
                icon={HiChartPie}
                className={`${displayText ? "" : "[&>span]:hidden"} ${
                  router.pathname.includes("/makeup/payments")
                    ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                    : ""
                }`}
              >
                {displayText && <p>Payments (Main)</p>}
              </Sidebar.Item>
            </Link>
          )}
          {user?.roles?.includes("owner") && (
            <Link href="/settlements" className="block">
              <Sidebar.Item
                icon={HiChartPie}
                className={`${displayText ? "" : "[&>span]:hidden"} ${
                  router.pathname.includes("/settlements")
                    ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                    : ""
                }`}
              >
                {displayText && <p>Settlements</p>}
              </Sidebar.Item>
            </Link>
          )}
          {user?.roles?.includes("owner") && (
            <Link href="/makeup/reviews" className="block">
              <Sidebar.Item
                icon={HiChartPie}
                className={`${displayText ? "" : "[&>span]:hidden"} ${
                  router.pathname.includes("/makeup/reviews")
                    ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                    : ""
                }`}
              >
                {displayText && <p>Reviews</p>}
              </Sidebar.Item>
            </Link>
          )}
          {user?.roles?.includes("owner") && (
            <Link href="/community" className="block">
              <Sidebar.Item
                icon={HiChartPie}
                className={`${displayText ? "" : "[&>span]:hidden"} ${
                  router.pathname.includes("/community")
                    ? "bg-rose-800 [&>svg]:text-white text-white hover:bg-rose-900"
                    : ""
                }`}
              >
                {displayText && <p>Community</p>}
              </Sidebar.Item>
            </Link>
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
