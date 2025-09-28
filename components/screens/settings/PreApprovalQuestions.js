import { uploadFile } from "@/utils/file";
import {
  Button,
  FileInput,
  Label,
  Select,
  Table,
  TextInput,
} from "flowbite-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { MdDelete, MdEditDocument } from "react-icons/md";

export default function PreApprovalQuestions({
  message,
  setMessage,
  loading,
  setLoading,
  display,
}) {
  const [eventMandatoryQuestions, setEventMandatoryQuestions] = useState([]);
  const [addNewEventMandatoryQuestion, setAddNewEventMandatoryQuestion] =
    useState({
      display: false,
      title: "",
      image: "",
      description: "",
      price: "",
      itemRequired: false,
      imageFile: null,
    });
  const [editEventMandatoryQuestion, setEditEventMandatoryQuestion] = useState({
    display: false,
    title: "",
    image: "",
    description: "",
    price: "",
    itemRequired: false,
    imageFile: null,
    _id: "",
  });
  const addNewEventMandatoryQuestionImageRef = useRef();
  const editEventMandatoryQuestionImageRef = useRef();
  const fetchEventMandatoryQuestions = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/event-mandatory-question`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setEventMandatoryQuestions(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addEventMandatoryQuestion = async () => {
    if (
      addNewEventMandatoryQuestion.title &&
      addNewEventMandatoryQuestion.imageFile
    ) {
      setLoading(true);
      let tempImage = await uploadFile({
        file: addNewEventMandatoryQuestion.imageFile,
        path: "pre-approval-questions",
        id: `${new Date().getTime()}-${addNewEventMandatoryQuestion.title
          .substring(0, 10)
          .replace(/[^a-zA-Z0-9]/g, "-")}`,
      });
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/event-mandatory-question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          image: tempImage,
          title: addNewEventMandatoryQuestion.title,
          description: "",
          price: "",
          itemRequired: false,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Question added Successfully!",
              status: "success",
              display: true,
            });
            setAddNewEventMandatoryQuestion({
              display: false,
              title: "",
              image: "",
              description: "",
              price: "",
              itemRequired: false,
              imageFile: null,
            });
            fetchEventMandatoryQuestions();
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
  const updateEventMandatoryQuestion = async () => {
    if (editEventMandatoryQuestion.title) {
      setLoading(true);
      let tempImage = editEventMandatoryQuestion.imageFile
        ? await uploadFile({
            file: editEventMandatoryQuestion.imageFile,
            path: "pre-approval-questions",
            id: `${new Date().getTime()}-${editEventMandatoryQuestion.title
              .substring(0, 10)
              .replace(/[^a-zA-Z0-9]/g, "-")}`,
          })
        : editEventMandatoryQuestion.image;
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/event-mandatory-question/${editEventMandatoryQuestion._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            image: tempImage,
            title: editEventMandatoryQuestion.title,
            description: "",
            price: "",
            itemRequired: false,
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Question updated Successfully!",
              status: "success",
              display: true,
            });
            setEditEventMandatoryQuestion({
              display: false,
              title: "",
              image: "",
              description: "",
              price: "",
              itemRequired: false,
              imageFile: null,
              _id: "",
            });
            fetchEventMandatoryQuestions();
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
  const deleteEventMandatoryQuestion = (_id) => {
    if (_id) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/event-mandatory-question/${_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.message !== "error") {
            setLoading(false);
            setMessage({
              text: "Question deleted added Successfully!",
              status: "success",
              display: true,
            });
            fetchEventMandatoryQuestions();
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
    if (display === "Pre-approval Questions") {
      fetchEventMandatoryQuestions();
    }
  }, [display]);
  return (
    <>
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-4">
          <p className="text-xl font-medium col-span-3">
            Pre-Approval Questions
          </p>
          <Button
            color="light"
            onClick={() => {
              setAddNewEventMandatoryQuestion({
                display: true,
                title: "",
                image: "",
                description: "",
                price: "",
                itemRequired: false,
                imageFile: null,
              });
            }}
            disabled={
              loading ||
              addNewEventMandatoryQuestion.display ||
              editEventMandatoryQuestion.display
            }
          >
            <BsPlus size={16} /> Add New
          </Button>
        </div>
        {addNewEventMandatoryQuestion.display && (
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <Label value="Question" />
              <TextInput
                placeholder="Question"
                value={addNewEventMandatoryQuestion.title}
                disabled={loading}
                onChange={(e) => {
                  setAddNewEventMandatoryQuestion({
                    ...addNewEventMandatoryQuestion,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <Label value="Image" />
              <FileInput
                ref={addNewEventMandatoryQuestionImageRef}
                disabled={loading}
                onChange={(e) => {
                  setAddNewEventMandatoryQuestion({
                    ...addNewEventMandatoryQuestion,
                    imageFile: e.target.files[0],
                  });
                }}
              />
            </div>
            <div className="place-self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  addEventMandatoryQuestion();
                }}
                disabled={
                  loading ||
                  !addNewEventMandatoryQuestion.title ||
                  !addNewEventMandatoryQuestion.imageFile
                }
                className="grow"
              >
                Add Question
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setAddNewEventMandatoryQuestion({
                    display: false,
                    title: "",
                    image: "",
                    description: "",
                    price: "",
                    itemRequired: false,
                    imageFile: null,
                  });
                }}
                disabled={loading}
              >
                <MdDelete size={24} />
              </Button>
            </div>
          </div>
        )}
        {editEventMandatoryQuestion.display && (
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <Label value="Question" />
              <TextInput
                placeholder="Question"
                value={editEventMandatoryQuestion.title}
                disabled={loading}
                onChange={(e) => {
                  setEditEventMandatoryQuestion({
                    ...editEventMandatoryQuestion,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <Label value="Image" />
              <FileInput
                ref={editEventMandatoryQuestionImageRef}
                disabled={loading}
                onChange={(e) => {
                  setEditEventMandatoryQuestion({
                    ...editEventMandatoryQuestion,
                    imageFile: e.target.files[0],
                  });
                }}
              />
              <Image
                src={editEventMandatoryQuestion.image}
                alt="Question"
                width={0}
                height={0}
                sizes="100%"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <div className="place-self-end w-full flex flex-row gap-3">
              <Button
                color="success"
                onClick={() => {
                  updateEventMandatoryQuestion();
                }}
                disabled={loading || !editEventMandatoryQuestion.title}
                className="grow"
              >
                Edit Question
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  setEditEventMandatoryQuestion({
                    display: false,
                    title: "",
                    image: "",
                    description: "",
                    price: "",
                    itemRequired: false,
                    imageFile: null,
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
            <Table.HeadCell>Question</Table.HeadCell>
            <Table.HeadCell>Image</Table.HeadCell>{" "}
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {eventMandatoryQuestions?.map((item, index) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800 font-medium"
                key={index}
              >
                <Table.Cell>{item.title}</Table.Cell>
                <Table.Cell>
                  <Image
                    src={item.image}
                    alt="Decor"
                    width={0}
                    height={0}
                    sizes="100%"
                    className="h-auto w-auto min-h-24 min-w-24"
                  />
                </Table.Cell>
                <Table.Cell className="flex gap-2">
                  {!loading && !editEventMandatoryQuestion.display && (
                    <MdEditDocument
                      size={24}
                      cursor={"pointer"}
                      className="hover:text-blue-700"
                      onClick={() => {
                        if (!loading) {
                          setEditEventMandatoryQuestion({
                            ...item,
                            display: true,
                            imageFile: null,
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
                          deleteEventMandatoryQuestion(item._id);
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
