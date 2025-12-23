import SettingsHeader from "@/components/layout/SettingsHeader";
import Chats from "@/components/screens/settings/Chats";
import ColorScreen from "@/components/screens/settings/ColorScreen";
import EventToolScreen from "@/components/screens/settings/EventToolScreen";
import Labels from "@/components/screens/settings/Labels";
import LeadScreen from "@/components/screens/settings/LeadScreen";
import Location from "@/components/screens/settings/Location";
import MUABookingAmount from "@/components/screens/settings/MUABookingAmount";
import MUATaxation from "@/components/screens/settings/MUATaxation";
import PreApprovalQuestions from "@/components/screens/settings/PreApprovalQuestions";
import Pricing from "@/components/screens/settings/Pricing";
import RawMaterials from "@/components/screens/settings/RawMaterials";
import Units from "@/components/screens/settings/Units";
import VendorCategory from "@/components/screens/settings/VendorCategory";
import WebsiteSetting from "@/components/screens/settings/WebsiteSetting";
import { Button } from "flowbite-react";
import { useState } from "react";

export default function Settings({ message, setMessage }) {
  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState("");
  const isEventToolSettings =
    display === "Event Tool" ||
    display === "Event-Type" ||
    display === "Event-Community" ||
    display === "Event-Lost-Response" ||
    display === "Quantity";
  const isLeadSettings =
    display === "Leads" ||
    display === "Lead-Interest" ||
    display === "Lead-Source" ||
    display === "Lead-Lost-Response";

  return (
    <>
      <div className="p-8 w-full">
        <SettingsHeader display={display} setDisplay={setDisplay} />
        {/* Default */}
        {display === "" && (
          <div className="flex flex-col gap-4">
            <div className="bg-white shadow-xl rounded-3xl p-8 w-full flex flex-col gap-4">
              <p className="text-xl font-medium col-span-3">Event</p>
              <div className="grid grid-cols-4 gap-4">
                <Button
                  color="light"
                  onClick={() => {
                    setDisplay("Event-Type");
                  }}
                  disabled={loading || display !== ""}
                >
                  Event Type
                </Button>
                <Button
                  color="light"
                  onClick={() => {
                    setDisplay("Event-Community");
                  }}
                  disabled={loading || display !== ""}
                >
                  Event Community
                </Button>
                <Button
                  color="light"
                  onClick={() => {
                    setDisplay("Event-Lost-Response");
                  }}
                  disabled={loading || display !== ""}
                >
                  Event Lost Response
                </Button>
              </div>
            </div>
            <div className="bg-white shadow-xl rounded-3xl p-8 w-full flex flex-col gap-4">
              <p className="text-xl font-medium col-span-3">Lead</p>
              <div className="grid grid-cols-4 gap-4">
                <Button
                  color="light"
                  onClick={() => {
                    setDisplay("Lead-Interest");
                  }}
                  disabled={loading || display !== ""}
                >
                  Lead Interest
                </Button>
                <Button
                  color="light"
                  onClick={() => {
                    setDisplay("Lead-Source");
                  }}
                  disabled={loading || display !== ""}
                >
                  Lead Source
                </Button>
                <Button
                  color="light"
                  onClick={() => {
                    setDisplay("Lead-Lost-Response");
                  }}
                  disabled={loading || display !== ""}
                >
                  Lead Lost Response
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* MUA Booking Amount */}
        {display === "MUA Booking Amount" && (
          <MUABookingAmount
            message={message}
            setMessage={setMessage}
            loading={loading}
            setLoading={setLoading}
            display={display}
          />
        )}
        {/* Chats */}
        {display === "Chats" && (
          <Chats
            message={message}
            setMessage={setMessage}
            loading={loading}
            setLoading={setLoading}
            display={display}
          />
        )}
        {/* MUA Taxation */}
        {display === "MUA Taxation" && (
          <MUATaxation
            message={message}
            setMessage={setMessage}
            loading={loading}
            setLoading={setLoading}
            display={display}
          />
        )}
        {/* Website Settings */}
        {display === "Website Settings" && (
          <WebsiteSetting
            message={message}
            setMessage={setMessage}
            loading={loading}
            setLoading={setLoading}
            display={display}
          />
        )}
        {/* Vendor Category */}
        {display === "Vendor Category" && (
          <VendorCategory
            message={message}
            setMessage={setMessage}
            loading={loading}
            setLoading={setLoading}
            display={display}
          />
        )}
        {/* Location */}
        {display === "Location" && (
          <Location
            message={message}
            setMessage={setMessage}
            loading={loading}
            setLoading={setLoading}
            display={display}
          />
        )}
        {/* Event Tool */}
        {isEventToolSettings && (
          <EventToolScreen
            message={message}
            setMessage={setMessage}
            loading={loading}
            setLoading={setLoading}
            display={display}
          />
        )}
        {/* Leads (Lead Information) */}
        {isLeadSettings && (
          <LeadScreen
            message={message}
            setMessage={setMessage}
            loading={loading}
            setLoading={setLoading}
            display={display}
          />
        )}
        {/* Color */}
        {display === "Color" && (
          <ColorScreen
            message={message}
            setMessage={setMessage}
            loading={loading}
            setLoading={setLoading}
            display={display}
          />
        )}
        {/* Pricing */}
        {display === "Pricing" && (
          <Pricing
            message={message}
            setMessage={setMessage}
            loading={loading}
            setLoading={setLoading}
            display={display}
          />
        )}
        {/* Pre-approval Questions */}
        {display === "Pre-approval Questions" && (
          <PreApprovalQuestions
            message={message}
            setMessage={setMessage}
            loading={loading}
            setLoading={setLoading}
            display={display}
          />
        )}
        {/* Labels */}
        {display === "Labels" && (
          <Labels
            message={message}
            setMessage={setMessage}
            loading={loading}
            setLoading={setLoading}
            display={display}
          />
        )}
        {/* Units */}
        {display === "Units" && (
          <Units
            message={message}
            setMessage={setMessage}
            loading={loading}
            setLoading={setLoading}
            display={display}
          />
        )}
        {/* Raw-Materials */}
        {display === "Raw-Materials" && (
          <RawMaterials
            message={message}
            setMessage={setMessage}
            loading={loading}
            setLoading={setLoading}
            display={display}
          />
        )}
      </div>
    </>
  );
}
