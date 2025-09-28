import { Dropdown, TextInput } from "flowbite-react";
import {
  MdArrowDropDownCircle,
  MdClose,
  MdDelete,
  MdDone,
  MdEditDocument,
} from "react-icons/md";

export default function SettingTextInput({
  index,
  placeholder,
  value,
  onChange,
  readOnly,
  loading,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  showDropdown,
  dropdownItems,
}) {
  return (
    <div
      className="flex flex-row gap-2 items-center border-2 rounded-lg pr-2"
      key={index}
    >
      <TextInput
        placeholder={placeholder || "Title"}
        value={value}
        disabled={loading}
        readOnly={readOnly}
        onChange={onChange}
      />
      {showDropdown && (
        <div className="relative">
          <Dropdown
            label=""
            dismissOnClick={false}
            renderTrigger={() => (
              <MdArrowDropDownCircle
                size={24}
                cursor={"pointer"}
                className={`relative ${
                  loading ? "text-black" : "text-black/80"
                } hover:text-black`}
              />
            )}
          >
            {dropdownItems.map((item, index) => (
              <Dropdown.Item className="whitespace-nowrap" key={index}>
                {item}
              </Dropdown.Item>
            ))}
          </Dropdown>
        </div>
      )}
      {readOnly ? (
        <>
          <MdEditDocument
            size={24}
            cursor={"pointer"}
            className={`${
              loading ? "text-blue-700" : "text-blue-500"
            } hover:text-blue-700`}
            onClick={onEdit}
          />
          <MdDelete
            size={24}
            cursor={"pointer"}
            className={`${
              loading ? "text-red-700" : "text-red-500"
            } hover:text-red-700`}
            onClick={onDelete}
          />
        </>
      ) : (
        <>
          <MdDone
            size={24}
            cursor={"pointer"}
            className={`${
              loading ? "text-green-700" : "text-green-500"
            } hover:text-green-700`}
            onClick={onSave}
          />
          <MdClose
            size={24}
            cursor={"pointer"}
            className={`${
              loading ? "text-red-700" : "text-red-500"
            } hover:text-red-700`}
            onClick={onCancel}
          />
        </>
      )}
    </div>
  );
}
