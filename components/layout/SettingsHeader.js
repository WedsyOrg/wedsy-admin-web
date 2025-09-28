import { Dropdown } from "flowbite-react";
import { useEffect, useState } from "react";

export default function SettingsHeader({ display, setDisplay }) {
  const [displayLabel, setDisplayLabel] = useState("");
  useEffect(() => {
    if (display === "") {
      setDisplayLabel("Select Option");
    } else if (display === "Raw-Materials") {
      setDisplayLabel("Raw Materials");
    } else if (display === "Color") {
      setDisplayLabel("Colors (Primary & Secondary)");
    } else if (display === "Leads") {
      setDisplayLabel("Lead Information");
    } else if (display === "Event Tool") {
      setDisplayLabel("Event Details");
    } else {
      setDisplayLabel(display);
    }
  }, [display]);
  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      <p className="text-2xl font-semibold col-span-3">Settings</p>
      {/* <Select
            value={display}
            onChange={(e) => {
              setDisplay(e.target.value);
            }}
            disabled={loading}
          >
            <option value={""}>Select Option</option>
            <option value={"Pricing"}>Pricing</option>
            <option value={"Units"}>Units</option>
            <option value={"Labels"}>Labels (Tags)</option>
            <option value={"Raw-Materials"}>Raw Materials</option>
            <option value={"Pre-approval Questions"}>
              Pre-Approval Questions
            </option>
            <option value={"Event-Type"}>Event Type</option>
            <option value={"Event-Community"}>Event Community</option>
            <option value={"Event-Lost-Response"}>Event Lost Response</option>
            <option value={"Lead-Lost-Response"}>Lead Lost Response</option>
            <option value={"Lead-Interest"}>Lead Interest</option>
            <option value={"Lead-Source"}>Lead Source</option>
            <option value={"Color"}>Color</option>
            <option value={"Quantity"}>Quantity</option>
          </Select> */}
      <Dropdown label={displayLabel} color="gray">
        <Dropdown.Item className="font-semibold">Store</Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            setDisplay("Pricing");
          }}
        >
          Pricing
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            setDisplay("Units");
          }}
        >
          Units
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            setDisplay("Labels");
          }}
        >
          Label
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            setDisplay("Raw-Materials");
          }}
        >
          Raw Materials
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item className="font-semibold">Event Tool</Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            setDisplay("Leads");
          }}
        >
          Lead Information
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            setDisplay("Event Tool");
          }}
        >
          Event Details
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            setDisplay("Pre-approval Questions");
          }}
        >
          Pre-approval Questions
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            setDisplay("Color");
          }}
        >
          Colors (Primary & Secondary)
        </Dropdown.Item>
        <Dropdown.Item>Payments</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item className="font-semibold">MakeUp</Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            setDisplay("Location");
          }}
        >
          Location
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            setDisplay("Vendor Category");
          }}
        >
          Vendor Category
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            setDisplay("Website Settings");
          }}
        >
          Website Settings
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            setDisplay("MUA Taxation");
          }}
        >
          MUA Taxation
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            setDisplay("Chats");
          }}
        >
          Chats
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            setDisplay("MUA Booking Amount");
          }}
        >
          MUA Booking Amount
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
}
