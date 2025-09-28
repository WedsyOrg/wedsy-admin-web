import { Button, Dropdown } from "flowbite-react";
import { MdKeyboardArrowDown } from "react-icons/md";

export default function VendorHeaderDropdown({ display, vendorId }) {
  return (
    <>
      <Dropdown
        label={""}
        renderTrigger={() => (
          <Button color="light">
            {display}
            <MdKeyboardArrowDown size={24} className="ml-2" />
          </Button>
        )}
      >
        <Dropdown.Item href={`/vendors/${vendorId}`}>Dashboard</Dropdown.Item>
        <Dropdown.Item href={`/vendors/${vendorId}/profile`}>
          Account Details
        </Dropdown.Item>
        <Dropdown.Item href={`/vendors/${vendorId}/personal-packages`}>
          Personal Packages
        </Dropdown.Item>
        <Dropdown.Item href={`/vendors/${vendorId}/bidding`}>
          Bidding
        </Dropdown.Item>
        <Dropdown.Item href={`/vendors/${vendorId}/packages`}>
          Package
        </Dropdown.Item>
        <Dropdown.Item href={`/vendors/${vendorId}/personal-leads`}>
          Personal Leads
        </Dropdown.Item>
        <Dropdown.Item href={`/vendors/${vendorId}/chats`}>Chats</Dropdown.Item>
        <Dropdown.Item href={`/vendors/${vendorId}/orders`}>
          Orders
        </Dropdown.Item>
        <Dropdown.Item href={`/vendors/${vendorId}/notifications`}>
          Notifications
        </Dropdown.Item>
        <Dropdown.Item href={`/vendors/${vendorId}/analytics`}>
          Analytics
        </Dropdown.Item>
      </Dropdown>
    </>
  );
}
