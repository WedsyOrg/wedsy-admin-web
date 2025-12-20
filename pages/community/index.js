import {
  Avatar,
  Button,
  Label,
  Modal,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  BiDislike,
  BiLike,
  BiPlus,
  BiSolidDislike,
  BiSolidLike,
} from "react-icons/bi";
import { BsChatLeftText, BsChatLeftTextFill, BsSearch } from "react-icons/bs";
import { MdDelete } from "react-icons/md";

export default function Community({ message, setMessage }) {
  const router = useRouter();
  const { view } = router.query;
  const [loading, setLoading] = useState(true);
  const [community, setCommunity] = useState([]);
  const [expandedId, setExpandedId] = useState("");
  const [vendorCategory, setVendorCategory] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [reply, setReply] = useState({ reply: "", communityId: "" });
  const [addNewCommuntiy, setAddNewCommunity] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    title: "",
    category: "",
    body: "",
    anonymous: false,
  });

  const fetchVendorCategory = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor-category`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setVendorCategory(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addCommunity = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/community`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newCommunity),
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if (response.message !== "success") {
          alert("Error");
        } else {
          setMessage({
            text: "Community Post added Successfully!",
            status: "success",
            display: true,
          });
          fetchCommunity();
          setAddNewCommunity(false);
          setNewCommunity({
            title: "",
            category: "",
            body: "",
            anonymous: false,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addCommunityReply = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/community/${reply.communityId}/reply`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ reply: reply.reply }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          router.push("/community");
          return;
        } else {
          return response.json();
        }
      })
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          setReply({ reply: "", communityId: "" });
          fetchCommunity();
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const fetchCommunity = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/community`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setCommunity(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const addCommunityLike = (_id) => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/community/${_id}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          router.push("/login");
          return;
        } else {
          return response.json();
        }
      })
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          setCommunity(
            community?.map((i) => (i._id === _id ? response.community : i))
          );
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const addCommunityDisLike = (_id) => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/community/${_id}/dis-like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          router.push("/login");
          return;
        } else {
          return response.json();
        }
      })
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          setCommunity(
            community?.map((i) => (i._id === _id ? response.community : i))
          );
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const removeCommunityLike = (_id) => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/community/${_id}/like`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          router.push("/login");
          return;
        } else {
          return response.json();
        }
      })
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          setCommunity(
            community?.map((i) => (i._id === _id ? response.community : i))
          );
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const removeCommunityDisLike = (_id) => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/community/${_id}/dis-like`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          router.push("/login");
          return;
        } else {
          return response.json();
        }
      })
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          setCommunity(
            community?.map((i) => (i._id === _id ? response.community : i))
          );
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const deleteCommunity = (_id) => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/community/${_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          setMessage({
            text: "Community Post deleted Successfully!",
            status: "success",
            display: true,
          });
          fetchCommunity();
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const deleteCommunityReply = (_id, rid) => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/community/${_id}/reply/${rid}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if (response.message === "success") {
          setMessage({
            text: "Community Reply added Successfully!",
            status: "success",
            display: true,
          });
          fetchCommunity();
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  useEffect(() => {
    fetchCommunity();
    fetchVendorCategory();
  }, []);

  // Support deep-linking: /community?view=<communityId>
  useEffect(() => {
    if (view) setExpandedId(view);
  }, [view]);

  return (
    <>
      {/* New Communtiy Modal */}
      <Modal
        show={addNewCommuntiy || false}
        size="4xl"
        popup
        onClose={() => setAddNewCommunity(false)}
      >
        <Modal.Header>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white px-4">
            Create Post
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            <div>
              <Label value="Reference" />
              <TextInput
                placeholder="title"
                disabled={loading}
                value={newCommunity?.title}
                onChange={(e) => {
                  setNewCommunity({
                    ...newCommunity,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <Label value="Community/Category" />
              <Select
                value={newCommunity?.category}
                onChange={(e) => {
                  setNewCommunity({
                    ...newCommunity,
                    category: e.target.value,
                  });
                }}
              >
                <option value={""}>Select Category</option>
                {vendorCategory?.map((item, index) => (
                  <option value={item.title} key={index}>
                    {item.title}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label value="Post Content" />
              <Textarea
                placeholder="..."
                disabled={loading}
                value={newCommunity?.body}
                onChange={(e) => {
                  setNewCommunity({
                    ...newCommunity,
                    body: e.target.value,
                  });
                }}
                rows={4}
              />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Button
                onClick={() => setAddNewCommunity(false)}
                className="px-4 py-0 rounded-full grow"
                color="light"
              >
                Cancel
              </Button>
              <Button
                onClick={() => addCommunity()}
                className="px-4 py-0 text-white rounded-full grow bg-rose-900 enabled:hover:bg-rose-900"
              >
                Publish Now
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* Reply Modal */}
      <Modal
        show={reply.communityId || false}
        size="lg"
        popup
        onClose={() => setReply({ reply: "", communityId: "" })}
      >
        <Modal.Header>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white px-4">
            Reply
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            <Textarea
              placeholder="Reply Community"
              disabled={loading}
              value={reply.reply}
              onChange={(e) => {
                setReply({ ...reply, reply: e.target.value });
              }}
              rows={4}
            />
            <div className="flex flex-row gap-4 items-center">
              <Button
                onClick={() => addCommunityReply()}
                className="px-4 py-0 text-white bg-rose-900 enabled:hover:bg-rose-900 max-w-max"
              >
                Reply
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <div className="flex flex-col gap-6 p-8">
        <div>
          <h2 className="text-2xl font-semibold">Community</h2>
        </div>
        <div className="grid grid-cols-5 gap-4">
          <Button
            className="px-4 py-0 text-white bg-rose-900 enabled:hover:bg-rose-900"
            onClick={() => {
              setNewCommunity({
                title: "",
                category: "",
                body: "",
                anonymous: false,
              });
              setAddNewCommunity(true);
            }}
            disabled={loading}
          >
            <BiPlus />
            Create Post
          </Button>
          <div className="col-span-2" />
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value={""}>Select Category</option>
            {vendorCategory?.map((item, index) => (
              <option value={item.title} key={index}>
                {item.title}
              </option>
            ))}
          </Select>
          <TextInput
            icon={BsSearch}
            id="search"
            placeholder="Search"
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col gap-4 pb-4 px-6">
          {community
            ?.filter(
              (i) =>
                (search
                  ? i.title.toLowerCase().includes(search.toLowerCase()) ||
                    i.body.toLowerCase().includes(search.toLowerCase())
                  : true) &&
                (category ? i.category === category : true) &&
                (view ? view === i?._id : true)
            )
            .map((item, index) => (
              <div className="p-6 border rounded-lg divide-y-2" key={item?._id}>
                <div className="flex flex-col gap-4 pb-4">
                  <div className="flex flex-row gap-2 items-center">
                    <Avatar rounded size="md" />
                    <div>
                      {item?.author?.anonymous ? (
                        <p className="text-lg font-regule">
                          Anonymous
                          {item?.author?.name ? ` (${item.author.name})` : ""}
                        </p>
                      ) : (
                        <p className="text-lg font-semibold">
                          {item?.author?.name}
                        </p>
                      )}
                      <p className="text-sm">
                        {item.category} |{" "}
                        {new Date(item?.createdAt)?.toLocaleString()}{" "}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <MdDelete
                        size={24}
                        onClick={() => {
                          deleteCommunity(item._id);
                        }}
                        cursor={"pointer"}
                      />
                    </div>
                  </div>
                  <p
                    className="text-xl font-semibold cursor-pointer"
                    onClick={() => {
                      setExpandedId((prev) => {
                        const next = prev === item?._id ? "" : item?._id;
                        const q = { ...router.query };
                        if (next) q.view = next;
                        else delete q.view;
                        router.push(
                          { pathname: router.pathname, query: q },
                          undefined,
                          { shallow: true }
                        );
                        return next;
                      });
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="-mt-4 cursor-pointer"
                    onClick={() => {
                      setExpandedId((prev) => (prev === item?._id ? "" : item?._id));
                    }}
                  >
                    {item.body}
                  </p>
                  <div className="flex flex-row gap-4 items-center">
                    <Button
                      onClick={() =>
                        setReply({ reply: "", communityId: item._id })
                      }
                      className="px-4 py-0 rounded-full text-white bg-rose-900 enabled:hover:bg-rose-900 max-w-max"
                    >
                      Reply
                    </Button>
                    <div className="flex flex-row gap-1 items-center">
                      <BsChatLeftText size={24} className="text-rose-900" />
                      {item?.replies?.length ?? 0}
                    </div>
                    {item.liked ? (
                      <div className="flex flex-row gap-1 items-center">
                        <BiSolidLike
                          size={24}
                          className="text-rose-900"
                          cursor={"pointer"}
                          onClick={() => {
                            removeCommunityLike(item._id);
                          }}
                        />
                        {item.likes}
                      </div>
                    ) : (
                      <div className="flex flex-row gap-1 items-center">
                        <BiLike
                          size={24}
                          className="text-rose-900"
                          cursor={"pointer"}
                          onClick={() => {
                            addCommunityLike(item._id);
                          }}
                        />
                        {item.likes}
                      </div>
                    )}
                    {item.disliked ? (
                      <div className="flex flex-row gap-1 items-center">
                        <BiSolidDislike
                          size={24}
                          className="text-rose-900"
                          cursor={"pointer"}
                          onClick={() => {
                            removeCommunityDisLike(item._id);
                          }}
                        />
                        {item.dislikes}
                      </div>
                    ) : (
                      <div className="flex flex-row gap-1 items-center">
                        <BiDislike
                          size={24}
                          className="text-rose-900"
                          cursor={"pointer"}
                          onClick={() => {
                            addCommunityDisLike(item._id);
                          }}
                        />
                        {item.dislikes}
                      </div>
                    )}
                  </div>
                </div>
                {expandedId === item?._id && item?.replies?.length > 0 && (
                  <div className="flex flex-col gap-4 pb-4 px-6 divide-y-2 pl-6">
                    {item?.replies?.map((rec, recIndex) => (
                      <div
                        className="flex flex-col gap-4 py-4"
                        key={rec?._id || recIndex}
                      >
                        <div className="flex flex-row gap-2 items-center">
                          <Avatar rounded size="md" />
                          <div>
                            {rec?.author?.anonymous ? (
                              <p className="text-lg font-regule">
                                Anonymous
                                {rec?.author?.name ? ` (${rec.author.name})` : ""}
                              </p>
                            ) : (
                              <p className="text-lg font-semibold">
                                {rec?.author?.name}
                              </p>
                            )}
                            <p className="text-sm">
                              {new Date(rec?.createdAt)?.toLocaleString()}{" "}
                            </p>
                          </div>
                          <div className="ml-auto">
                            <MdDelete
                              size={24}
                              onClick={() => {
                                deleteCommunityReply(item._id, rec._id);
                              }}
                              cursor={"pointer"}
                            />
                          </div>
                        </div>
                        <p className="-mt-2">{rec.reply}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
