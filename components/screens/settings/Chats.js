import { uploadFile } from "@/utils/file";
import { Button, Label, Select, Table, TextInput } from "flowbite-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { MdDelete, MdEditDocument } from "react-icons/md";

export default function Chats({
  message,
  setMessage,
  loading,
  setLoading,
  display,
}) {
  const [messageList, setMessageList] = useState([]);
  const [addNewMessage, setAddNewMessage] = useState({
    display: false,
    message: "",
    messageFor: "",
  });
  const [editMessage, setEditMessage] = useState({
    display: false,
    message: "",
    messageFor: "",
    _id: "",
  });
  const fetchMessage = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/message`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setMessageList(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addMessage = async () => {
    if (addNewMessage.message && addNewMessage.messageFor) {
      setLoading(true);

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          message: addNewMessage.message,
          messageFor: addNewMessage.messageFor,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Message added Successfully!",
              status: "success",
              display: true,
            });
            setAddNewMessage({
              display: false,
              message: "",
              messageFor: "",
            });
            fetchMessage();
          } else {
            alert("There was a error try again.");
            setLoading(false);
          }
        })
        .catch((error) => {
          alert("There was a error try again.");
          setLoading(false);
          console.error("There was a problem with the fetch operation:", error);
        });
    } else {
      alert("Fill all the required fields.");
    }
  };
  const updateMessage = async () => {
    if (editMessage.message && editMessage.messageFor) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/message/${editMessage._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          message: editMessage.message,
          messageFor: editMessage.messageFor,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Message updated Successfully!",
              status: "success",
              display: true,
            });
            setEditMessage({
              display: false,
              message: "",
              messageFor: "",
              _id: "",
            });
            fetchMessage();
          } else {
            alert("There was a error try again.");
            setLoading(false);
          }
        })
        .catch((error) => {
          alert("There was a error try again.");
          setLoading(false);
          console.error("There was a problem with the fetch operation:", error);
        });
    } else {
      alert("Fill all the required fields.");
    }
  };
  const deleteMessage = (_id) => {
    if (_id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/message/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Message deleted added Successfully!",
              status: "success",
              display: true,
            });
            fetchMessage();
          } else {
            alert("There was a error try again.");
            setLoading(false);
          }
        })
        .catch((error) => {
          alert("There was a error try again.");
          setLoading(false);
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  };
  useEffect(() => {
    if (display === "Chats") {
      fetchMessage();
    }
  }, [display]);
  return (
    <>
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-4">
          <p className="text-xl font-medium col-span-3">
            Chats (Pre-defined Messages)
          </p>
          <Button
            color="light"
            onClick={() => {
              setAddNewMessage({
                display: true,
                message: "",
                messageFor: "",
              });
            }}
            disabled={loading || addNewMessage.display || editMessage.display}
          >
            <BsPlus size={16} /> Add New
          </Button>
        </div>
        {addNewMessage.display && (
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <Label value="Message" />
              <TextInput
                placeholder="Message"
                value={addNewMessage.message}
                disabled={loading}
                onChange={(e) => {
                  setAddNewMessage({
                    ...addNewMessage,
                    message: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <Label value="Message For" />
              <Select
                value={addNewMessage.messageFor}
                disabled={loading}
                onChange={(e) => {
                  setAddNewMessage({
                    ...addNewMessage,
                    messageFor: e.target.value,
                  });
                }}
              >
                <option value={"Vendor"}>Vendor</option>
                <option value={"Customer"}>Customer</option>
                <option value={"Both (Vendor, Customer)"}>
                  Both (Vendor, Customer)
                </option>
              </Select>
            </div>
            <div className="place-self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  addMessage();
                }}
                disabled={
                  loading || !addNewMessage.message || !addNewMessage.messageFor
                }
                className="grow"
              >
                Add Question
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setAddNewMessage({
                    display: false,
                    message: "",
                    messageFor: "",
                  });
                }}
                disabled={loading}
              >
                <MdDelete size={24} />
              </Button>
            </div>
          </div>
        )}
        {editMessage.display && (
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <Label value="Message" />
              <TextInput
                placeholder="Message"
                value={editMessage.message}
                disabled={loading}
                onChange={(e) => {
                  setEditMessage({
                    ...editMessage,
                    message: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <Label value="Message For" />
              <Select
                value={editMessage.messageFor}
                disabled={loading}
                onChange={(e) => {
                  setEditMessage({
                    ...editMessage,
                    messageFor: e.target.value,
                  });
                }}
              >
                <option value={"Vendor"}>Vendor</option>
                <option value={"Customer"}>Customer</option>
                <option value={"Both (Vendor, Customer)"}>
                  Both (Vendor, Customer)
                </option>
              </Select>
            </div>
            <div className="place-self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  updateMessage();
                }}
                disabled={
                  loading || !editMessage.message || !editMessage.messageFor
                }
                className="grow"
              >
                Edit Message
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setEditMessage({
                    display: false,
                    message: "",
                    messageFor: "",
                    _id: "",
                  });
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        <Table hoverable className="width-full overflow-x-auto">
          <Table.Head>
            <Table.HeadCell>Message</Table.HeadCell>
            <Table.HeadCell>Applicable To</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {messageList?.map((item, index) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800 font-medium"
                key={index}
              >
                <Table.Cell>{item.message}</Table.Cell>
                <Table.Cell>{item.messageFor}</Table.Cell>
                <Table.Cell className="flex gap-2">
                  {!loading && !editMessage.display && (
                    <MdEditDocument
                      size={24}
                      cursor={"pointer"}
                      className="hover:text-blue-700"
                      onClick={() => {
                        if (!loading) {
                          setEditMessage({
                            ...item,
                            display: true,
                          });
                        }
                      }}
                    />
                  )}
                  {!loading && (
                    <MdDelete
                      size={24}
                      cursor={"pointer"}
                      className="hover:text-blue-700"
                      onClick={() => {
                        if (!loading) {
                          deleteMessage(item._id);
                        }
                      }}
                    />
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </>
  );
}
