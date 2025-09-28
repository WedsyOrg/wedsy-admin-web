import ImageCard from "@/components/cards/ImageCard";
import NotificationCard from "@/components/cards/NotificationCard";
import StatsCard from "@/components/cards/StatsCard";
import StatsIconCard from "@/components/cards/StatsIconCard";
import VendorHeaderDropdown from "@/components/dropdown/VendorHeaderDropdown";
import HorizontalLine from "@/components/other/HorizontalLine";
import { uploadFile } from "@/utils/file";
import { loadGoogleMaps } from "@/utils/loadGoogleMaps";
import { toPriceString } from "@/utils/text";
import {
  Button,
  Checkbox,
  FileInput,
  Label,
  Modal,
  Rating,
  Select,
  Textarea,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BiPlus, BiRupee } from "react-icons/bi";
import { BsArrowUp, BsPlus, BsPlusCircle } from "react-icons/bs";
import { MdCancel, MdDelete, MdOpenInNew } from "react-icons/md";

export default function Vendor({ message, setMessage }) {
  const router = useRouter();
  const { vendorId } = router.query;
  const inputRef = useRef(null);
  const [expandedImage, setExpandedImage] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [googleInstance, setGoogleInstance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState({});
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [rating, setRating] = useState(0);
  const [editRating, setEditRating] = useState(false);
  const [locationData, setLocationData] = useState([]);
  const [address, setAddress] = useState({
    place_id: "",
    formatted_address: "",
    address_components: [],
    city: "",
    postal_code: "",
    locality: "",
    state: "",
    country: "",
    geometry: {
      location: {
        lat: 0,
        lng: 0,
      },
    },
    edit: false,
  });
  const [profile, setProfile] = useState({
    businessName: "",
    businessDescription: "",
    speciality: "",
    servicesOffered: "",
    groomMakeup: false,
    edit: false,
  });
  const [about, setAbout] = useState({
    experience: "",
    awards: [],
    makeupProducts: [],
    edit: false,
  });
  const [gallery, setGallery] = useState({
    coverPhoto: "",
    photos: [],
    addCoverPhoto: false,
    addPhoto: false,
    updatedCoverPhoto: "",
    newPhoto: "",
    deletePhotos: false,
    deletedPhotosId: [],
  });
  const coverPhotoRef = useRef();
  const photoRef = useRef();
  const [addNewNote, setAddNewNote] = useState({
    text: "",
    display: false,
  });
  const [addNewTask, setAddNewTask] = useState({
    task: "",
    deadline: "",
    display: false,
  });
  const [displayTasksHistory, setDisplayTasksHistory] = useState(false);
  const [personalPackages, setPersonalPackages] = useState([]);
  const [newPersonalPackage, setNewPersonalPackage] = useState({
    name: "",
    services: [],
    price: 0,
    amountToVendor: 0,
    amountToWedsy: 0,
  });
  const [editPersonalPackage, setEditPersonalPackage] = useState({
    name: "",
    services: [],
    price: 0,
    amountToVendor: 0,
    amountToWedsy: 0,
  });
  const [displayNewPersonalPackage, setDisplayNewPersonalPackage] =
    useState(false);
  const [displayEditPersonalPackage, setDisplayEditPersonalPackage] =
    useState(false);
  const [bookingAmount, setBookingAmount] = useState({});
  const updatePersonalPackage = (redirect) => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor-personal-package/${displayEditPersonalPackage}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editPersonalPackage),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          setMessage({
            text: "Package added Successfully!",
            status: "success",
            display: true,
          });
          setDisplayEditPersonalPackage(false);
          setEditPersonalPackage({
            name: "",
            services: [],
            price: 0,
            amountToVendor: 0,
            amountToWedsy: 0,
          });
          fetchPersonalPackages();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updatePersonalPackageStatus = (pid, active) => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor-personal-package/${pid}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ active }),
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          setMessage({
            text: "Package status updated Successfully!",
            status: "success",
            display: true,
          });
          fetchPersonalPackages();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const deletePersonalPackage = (pid) => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor-personal-package/${pid}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          setMessage({
            text: "Package deleted Successfully!",
            status: "success",
            display: true,
          });
          fetchPersonalPackages();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addPersonalPackage = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor-personal-package`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ ...newPersonalPackage, vendorId }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          setMessage({
            text: "Package added Successfully!",
            status: "success",
            display: true,
          });
          setDisplayNewPersonalPackage(false);
          setNewPersonalPackage({
            name: "",
            services: [],
            price: 0,
            amountToVendor: 0,
            amountToWedsy: 0,
          });
          fetchPersonalPackages();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchBookingAmount = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/config?code=MUA-BookingAmount`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setBookingAmount(response.data);
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchPersonalPackages = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor-personal-package?vendorId=${vendorId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          router.push("/login");
          return;
        } else {
          return response.json();
        }
      })
      .then((response) => {
        if (response) {
          setLoading(false);
          setPersonalPackages(response);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchTasks = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/task?category=Vendor&referenceId=${vendorId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setTasks(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchTags = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/tag`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setTags(response);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addTask = async () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        task: addNewTask.task,
        deadline: addNewTask.deadline,
        category: "Vendor",
        referenceId: vendorId,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          setMessage({
            text: "Task added Successfully!",
            status: "success",
            display: true,
          });
          setAddNewTask({
            ...addNewTask,
            task: "",
            deadline: "",
            display: false,
          });
          fetchTasks();
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const addNote = async () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/${vendorId}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        text: addNewNote.text,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          setMessage({
            text: "Note added Successfully!",
            status: "success",
            display: true,
          });
          setAddNewNote({
            ...addNewNote,
            text: "",
            display: false,
          });
          fetchVendor();
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchVendor = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/${vendorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        setVendor(response);
        setNotes(response.notes);
        setAddress({ ...address, ...response.businessAddress });
        setRating(response.rating || 0);
        setEditRating(false);
        setProfile({
          ...profile,
          businessName: response.businessName,
          businessDescription: response.businessDescription,
          speciality: response.speciality,
          servicesOffered:
            JSON.stringify(response.servicesOffered) ===
            JSON.stringify(["Hairstylist", "MUA"])
              ? "Both"
              : response.servicesOffered[0] || "",
          groomMakeup: response.other.groomMakeup,
          edit: false,
        });
        setAbout({
          ...about,
          edit: false,
          experience: response.other.experience,
          awards: response.other.awards,
          makeupProducts: response.other.makeupProducts,
        });
        setGallery({
          ...gallery,
          ...response.gallery,
          addCoverPhoto: false,
          addPhoto: false,
          updatedCoverPhoto: "",
          newPhoto: "",
          deletePhotos: false,
          deletedPhotosId: [],
        });
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updateTag = async (tag) => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/${vendorId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        tag,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          setMessage({
            text: "Tag updated Successfully!",
            status: "success",
            display: true,
          });
          fetchVendor();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updateAddress = async (tag) => {
    setLoading(true);
    const { edit, ...tempAddress } = address;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/${vendorId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        businessAddress: tempAddress,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          setMessage({
            text: "Address updated Successfully!",
            status: "success",
            display: true,
          });
          fetchVendor();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updateRating = async () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/${vendorId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        rating,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          setMessage({
            text: "Rating updated Successfully!",
            status: "success",
            display: true,
          });
          fetchVendor();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updateProfile = async (tag) => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/${vendorId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        businessName: profile.businessName,
        businessDescription: profile.businessDescription,
        speciality: profile.speciality,
        servicesOffered:
          profile.servicesOffered === "Both"
            ? ["Hairstylist", "MUA"]
            : [profile.servicesOffered],
        other: { groomMakeup: profile.groomMakeup },
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          setMessage({
            text: "Profile updated Successfully!",
            status: "success",
            display: true,
          });
          fetchVendor();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updateAbout = async (tag) => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/${vendorId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        other: {
          experience: about.experience,
          awards: about.awards,
          makeupProducts: about.makeupProducts,
        },
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          setMessage({
            text: "Profile updated Successfully!",
            status: "success",
            display: true,
          });
          fetchVendor();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updateCoverPhoto = async () => {
    let tempImage = await uploadFile({
      file: gallery.updatedCoverPhoto,
      path: "vendor-gallery/",
      id: `${new Date().getTime()}-${vendorId}-coverphoto`,
    });
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/${vendorId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        gallery: { coverPhoto: tempImage },
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          coverPhotoRef.current.value = null;
          setMessage({
            text: "Profile updated Successfully!",
            status: "success",
            display: true,
          });
          fetchVendor();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const deletePhoto = async () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/${vendorId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        gallery: {
          photos: gallery?.photos?.filter(
            (_, i) => !gallery?.deletedPhotosId?.includes(i)
          ),
        },
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          setMessage({
            text: "Profile updated Successfully!",
            status: "success",
            display: true,
          });
          fetchVendor();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const updatePhoto = async () => {
    let tempImage = await uploadFile({
      file: gallery.newPhoto,
      path: "vendor-gallery/",
      id: `${new Date().getTime()}-${vendorId}-photo-${gallery.photos.length}`,
    });
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/${vendorId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        gallery: { photos: [...gallery?.photos, tempImage] },
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "success") {
          setLoading(false);
          photoRef.current.value = null;
          setMessage({
            text: "Profile updated Successfully!",
            status: "success",
            display: true,
          });
          fetchVendor();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const fetchLocationData = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/location`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        let tempList = response;
        let states = tempList.filter((i) => i.locationType === "State");
        let cities = tempList.filter((i) => i.locationType === "City");
        let areas = tempList.filter((i) => i.locationType === "Area");
        let pincodes = tempList.filter((i) => i.locationType === "Pincode");
        Promise.all(
          states.map((i) => {
            return new Promise((resolve, reject) => {
              let tempCities = cities.filter((j) => j.parent == i._id);
              Promise.all(
                tempCities.map((j) => {
                  return new Promise((resolve1, reject1) => {
                    let tempAreas = areas.filter((k) => k.parent == j._id);
                    Promise.all(
                      tempAreas.map((k) => {
                        return new Promise((resolve2, reject1) => {
                          let tempPincodes = pincodes.filter(
                            (l) => l.parent == k._id
                          );
                          resolve2({ ...k, pincodes: tempPincodes });
                        });
                      })
                    ).then((result) => resolve1({ ...j, areas: result }));
                  });
                })
              ).then((result) => resolve({ ...i, cities: result }));
            });
          })
        ).then((result) => setLocationData(result));
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  const extractAddressComponents = (components) => {
    const result = {
      city: "",
      postal_code: "",
      state: "",
      country: "",
      locality: "",
    };

    components.forEach((component) => {
      if (component.types.includes("locality")) {
        result.city = component.long_name; // Locality usually represents the city
      }
      if (
        component.types.includes("administrative_area_level_2") &&
        !result.city
      ) {
        result.city = component.long_name; // Fallback if locality isn't available
      }
      if (component.types.includes("postal_code")) {
        result.postal_code = component.long_name; // Extract postal code
      }
      if (component.types.includes("administrative_area_level_1")) {
        result.state = component.long_name; // Extract state
      }
      if (component.types.includes("country")) {
        result.country = component.long_name; // Extract country
      }
      if (
        component.types.includes("sublocality") ||
        component.types.includes("neighborhood")
      ) {
        result.locality = component.long_name; // More granular locality info
      }
    });

    return result;
  };

  useEffect(() => {
    const initializeAutocomplete = async () => {
      try {
        let google = null;
        if (!isLoaded) {
          google = await loadGoogleMaps(); // Load Google Maps API
          setGoogleInstance(google);
          setIsLoaded(true);
        } else {
          google = googleInstance;
        }
        if (!google?.maps) {
          throw new Error("Google Maps library is not loaded properly.");
        }
        // Check if inputRef.current exists before initializing Autocomplete
        if (inputRef.current) {
          const autocomplete = new google.maps.places.Autocomplete(
            inputRef.current,
            {
              types: ["geocode"], // Restrict results to addresses only
            }
          );
          // Listen for place selection
          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
              const { city, postal_code, state, country, locality } =
                extractAddressComponents(place.address_components);
              setAddress((prevItems) => {
                return {
                  ...prevItems,
                  city,
                  postal_code,
                  state,
                  country,
                  locality,
                  place_id: place.place_id,
                  formatted_address: place.formatted_address,
                  geometry: {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                  },
                };
              });
            }
          });
        } else {
          console.warn("Input reference is not available yet.");
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      }
    };
    if (address.edit) {
      initializeAutocomplete();
    }
  }, [address]);
  useEffect(() => {
    if (vendorId) {
      fetchVendor();
      fetchTasks();
      fetchTags();
      fetchLocationData();
      fetchPersonalPackages();
      fetchBookingAmount();
    }
  }, [vendorId]);
  return (
    <>
      {/* Tasks Hstory Modal */}
      <Modal
        show={displayTasksHistory || false}
        size="lg"
        popup
        onClose={() => setDisplayTasksHistory(false)}
      >
        <Modal.Header>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white px-4">
            Task History for {vendor.name}
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            {tasks.map((item, index) => (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <TextInput readOnly={true} value={item.task} />
                  <TextInput
                    type="datetime-local"
                    readOnly={true}
                    value={new Date(item.deadline)
                      .toLocaleString("sv-SE", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      .replace(" ", "T")}
                  />
                </div>
              </>
            ))}
          </div>
        </Modal.Body>
      </Modal>
      {/* Add Task Modal */}
      <Modal
        show={addNewTask?.display || false}
        size="lg"
        popup
        onClose={() =>
          setAddNewTask({
            ...addNewTask,
            display: false,
          })
        }
      >
        <Modal.Header>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white px-4">
            Add New Task for {vendor.name}
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            <TextInput
              value={addNewTask.task}
              disabled={loading}
              onChange={(e) => {
                setAddNewTask({
                  ...addNewTask,
                  task: e.target.value,
                });
              }}
            />
            <TextInput
              type="datetime-local"
              value={addNewTask.deadline}
              disabled={loading}
              onChange={(e) => {
                setAddNewTask({
                  ...addNewTask,
                  deadline: e.target.value,
                });
                console.log(e.target.value);
              }}
            />
            <Button
              color={"gray"}
              onClick={() => {
                addTask();
              }}
              disabled={loading || !addNewTask.task || !addNewTask.deadline}
            >
              <BsPlus /> Create Task
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      {/* Add Notes Modal */}
      <Modal
        show={addNewNote?.display || false}
        size="lg"
        popup
        onClose={() =>
          setAddNewNote({
            ...addNewNote,
            display: false,
          })
        }
      >
        <Modal.Header>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white px-4">
            Add New Note for {vendor.name}
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            <TextInput
              value={addNewNote.text}
              disabled={loading}
              onChange={(e) => {
                setAddNewNote({
                  ...addNewNote,
                  text: e.target.value,
                });
              }}
            />
            <Button
              color={"gray"}
              onClick={() => {
                addNote();
              }}
              disabled={loading || !addNewNote.text}
            >
              <BsPlus /> Add Note
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <div className="flex flex-col gap-6 p-8">
        <div className="grid grid-cols-4 gap-4 items-end">
          <p className="text-xl font-medium col-span-3">{vendor.name}</p>
          <VendorHeaderDropdown
            display={"Account Details"}
            vendorId={vendorId}
          />
        </div>
        <div className="flex flex-row gap-4 items-end">
          <div>
            <Label value="Registration Date" />
            <TextInput
              value={new Date(vendor.registrationDate).toLocaleString()}
              readOnly={true}
            />
          </div>
          <div>
            <Label value="Phone" />
            <TextInput value={vendor.phone} readOnly={true} />
          </div>
          <div>
            <Label value="Email" />
            <TextInput value={vendor.email} readOnly={true} />
          </div>
          <div>
            <Label value="Tag" />
            <Select
              value={vendor.tag}
              onChange={(e) => {
                updateTag(e.target.value);
              }}
            >
              <option value="">Select Tag</option>
              {vendor.tag && <option value={vendor.tag}>{vendor.tag}</option>}
              {tags
                .filter((i) => i !== vendor.tag)
                .map((item, index) => (
                  <option value={item.title} key={index}>
                    {item.title}
                  </option>
                ))}
            </Select>
          </div>
        </div>
        <HorizontalLine />
        <p className="text-lg font-medium">Address Details</p>
        <div className="grid grid-cols-6 gap-4 items-end">
          <div className="col-span-2">
            <Label value="Address" />
            <TextInput
              placeholder="Address"
              value={address.formatted_address}
              onChange={(e) => {
                setAddress({
                  ...address,
                  formatted_address: e.target.value,
                });
              }}
              ref={inputRef}
              disabled={loading || !address.edit}
            />
          </div>
          <div>
            <Label value="State" />
            <TextInput
              value={address.state}
              readOnly={true}
              disabled={loading || !address.edit}
            />
          </div>
          <div>
            <Label value="City" />
            <TextInput
              value={address.city}
              readOnly={true}
              disabled={loading || !address.edit}
            />
          </div>
          <div>
            <Label value="Area" />
            <TextInput
              value={address.locality}
              readOnly={true}
              disabled={loading || !address.edit}
            />
          </div>
          <div>
            <Label value="Pincode" />
            <TextInput
              value={address.postal_code}
              readOnly={true}
              disabled={loading || !address.edit}
            />
          </div>
          {!address.edit && (
            <Button
              color="light"
              onClick={() => {
                setAddress({ ...address, edit: true });
              }}
              className="col-start-6"
            >
              Edit
            </Button>
          )}
          {address.edit && (
            <Button
              color="failure"
              onClick={() => {
                setAddress({
                  ...address,
                  edit: false,
                  ...vendor.businessAddress,
                });
              }}
              className="col-start-5"
            >
              Cancel
            </Button>
          )}
          {address.edit && (
            <Button
              color="success"
              onClick={() => {
                updateAddress();
              }}
              className="col-start-6"
            >
              Update
            </Button>
          )}
        </div>
        <HorizontalLine />
        <p className="text-lg font-medium">Profile</p>
        <div className="grid grid-cols-3 gap-4 items-end">
          <div className="">
            <Label value="Display name / Business Name" />
            <TextInput
              placeholder="Display name / Business Name"
              value={profile.businessName}
              onChange={(e) => {
                setProfile({
                  ...profile,
                  businessName: e.target.value,
                });
              }}
              disabled={loading || !profile.edit}
            />
          </div>
          <div className="col-span-2 row-span-2 self-start">
            <Label value="Description about yourself ( in 300 characters )" />
            <Textarea
              placeholder="Description about yourself ( in 300 characters )"
              rows={5}
              value={profile.businessDescription}
              onChange={(e) => {
                setProfile({
                  ...profile,
                  businessDescription: e.target.value,
                });
              }}
              disabled={loading || !profile.edit}
            />
          </div>
          <div className="">
            <Label value="Speciality in ( eg: south indian, muslim etc. )" />
            <TextInput
              placeholder="Speciality in ( eg: south indian, muslim etc. )"
              value={profile.speciality}
              onChange={(e) => {
                setProfile({
                  ...profile,
                  speciality: e.target.value,
                });
              }}
              disabled={loading || !profile.edit}
            />
          </div>
          <div className="">
            <Label value="Services you provide" />
            <Select
              value={profile.servicesOffered}
              onChange={(e) => {
                setProfile({
                  ...profile,
                  servicesOffered: e.target.value,
                });
              }}
              disabled={loading || !profile.edit}
            >
              <option value="">Select Option</option>
              <option value={"Hairstylist"}>Hairstylist</option>
              <option value={"MUA"}>MUA</option>
              <option value={"Both"}>Both</option>
            </Select>
          </div>
          <div className="self-start">
            <Label value="Do you also do groom Makeup?" />
            <div className="grid grid-cols-3 gap-4 px-6">
              <div className="flex flex-row items-center gap-2">
                <Label>Yes</Label>
                <Checkbox
                  checked={profile.groomMakeup === true}
                  onChange={(e) => {
                    setProfile({
                      ...profile,
                      groomMakeup: e.target.checked,
                    });
                  }}
                  disabled={loading || !profile.edit}
                />
              </div>
              <div className="flex flex-row items-center gap-2">
                <Label>No</Label>
                <Checkbox
                  checked={profile.groomMakeup === false}
                  onChange={(e) => {
                    setProfile({
                      ...profile,
                      groomMakeup: !e.target.checked,
                    });
                  }}
                  disabled={loading || !profile.edit}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {!profile.edit && (
              <Button
                color="light"
                onClick={() => {
                  setProfile({ ...profile, edit: true });
                }}
                className="col-start-2"
              >
                Edit
              </Button>
            )}
            {profile.edit && (
              <Button
                color="failure"
                onClick={() => {
                  setProfile({
                    ...profile,
                    edit: false,
                    businessName: vendor.businessName,
                    businessDescription: vendor.businessDescription,
                    speciality: vendor.speciality,
                    servicesOffered:
                      JSON.stringify(vendor.servicesOffered) ===
                      JSON.stringify(["Hairstylist", "MUA"])
                        ? "Both"
                        : vendor.servicesOffered[0] || "",
                    groomMakeup: vendor.other.groomMakeup,
                  });
                }}
              >
                Cancel
              </Button>
            )}
            {profile.edit && (
              <Button
                color="success"
                onClick={() => {
                  updateProfile();
                }}
              >
                Update
              </Button>
            )}
          </div>
        </div>
        <HorizontalLine />
        <p className="text-lg font-medium">About you</p>
        <div className="grid grid-cols-3 gap-4 items-end">
          <div className="">
            <Label value="How many years of experience ?" />
            <TextInput
              placeholder="How many years of experience ?"
              value={about.experience}
              onChange={(e) => {
                setAbout({
                  ...about,
                  experience: e.target.value,
                });
              }}
              disabled={loading || !about.edit}
            />
          </div>
          <div className="col-span-2" />
          <div className="self-start">
            <Label value="Certificate/Awards that you have received" />
            {about?.awards?.map((item, index) => (
              <div
                className="flex flex-row gap-2 items-center mb-2"
                key={index}
              >
                <TextInput
                  key={index}
                  placeholder="Certificate/Awards"
                  value={item.title}
                  onChange={(e) => {
                    let temp = about?.awards;
                    temp[index].title = e.target.value;
                    setAbout({
                      ...about,
                      awards: temp,
                    });
                  }}
                  disabled={loading || !about.edit}
                  className="grow"
                />
                {about.edit && (
                  <MdCancel
                    size={20}
                    onClick={() => {
                      setAbout({
                        ...about,
                        awards: about?.awards?.filter((_, i) => i !== index),
                      });
                    }}
                  />
                )}
              </div>
            ))}
            {about.edit && (
              <div
                className="flex items-center gap-1 text-sm"
                onClick={() => {
                  setAbout({
                    ...about,
                    awards: [...about?.awards, { title: "", certificate: "" }],
                  });
                }}
              >
                Add more <BsPlusCircle />
              </div>
            )}
          </div>
          <div className="self-start">
            <Label value="Mention the Makeup Products that you use" />
            {about?.makeupProducts?.map((item, index) => (
              <div
                className="flex flex-row gap-2 items-center mb-2"
                key={index}
              >
                <TextInput
                  key={index}
                  placeholder="Makeup Products"
                  value={item}
                  onChange={(e) => {
                    let temp = about?.makeupProducts;
                    temp[index] = e.target.value;
                    setAbout({
                      ...about,
                      makeupProducts: temp,
                    });
                  }}
                  disabled={loading || !about.edit}
                  className="grow"
                />
                {about.edit && (
                  <MdCancel
                    size={20}
                    onClick={() => {
                      setAbout({
                        ...about,
                        makeupProducts: about?.makeupProducts?.filter(
                          (_, i) => i !== index
                        ),
                      });
                    }}
                  />
                )}
              </div>
            ))}
            {about.edit && (
              <div
                className="flex items-center gap-1 text-sm"
                onClick={() => {
                  setAbout({
                    ...about,
                    makeupProducts: [...about?.makeupProducts, ""],
                  });
                }}
              >
                Add more <BsPlusCircle />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {!about.edit && (
              <Button
                color="light"
                onClick={() => {
                  setAbout({ ...about, edit: true });
                }}
                className="col-start-2"
              >
                Edit
              </Button>
            )}
            {about.edit && (
              <Button
                color="failure"
                onClick={() => {
                  setAbout({
                    ...about,
                    edit: false,
                    experience: vendor.other.experience,
                    awards: vendor.other.awards,
                    makeupProducts: vendor.other.makeupProducts,
                  });
                }}
              >
                Cancel
              </Button>
            )}
            {about.edit && (
              <Button
                color="success"
                onClick={() => {
                  updateAbout();
                }}
              >
                Update
              </Button>
            )}
          </div>
        </div>
        <HorizontalLine />
        <div className="grid grid-cols-3 gap-4 items-end">
          <p className="text-lg font-medium">Rating</p>
          {editRating ? (
            <div>
              <Rating size="md">
                <Rating.Star
                  cursor={"pointer"}
                  filled={rating >= 1}
                  onClick={() => {
                    setRating(1);
                  }}
                />
                <Rating.Star
                  cursor={"pointer"}
                  filled={rating >= 2}
                  onClick={() => {
                    setRating(2);
                  }}
                />
                <Rating.Star
                  cursor={"pointer"}
                  filled={rating >= 3}
                  onClick={() => {
                    setRating(3);
                  }}
                />
                <Rating.Star
                  cursor={"pointer"}
                  filled={rating >= 4}
                  onClick={() => {
                    setRating(4);
                  }}
                />
                <Rating.Star
                  cursor={"pointer"}
                  filled={rating >= 5}
                  onClick={() => {
                    setRating(5);
                  }}
                />
              </Rating>
            </div>
          ) : (
            <div>
              <Rating size="md">
                <Rating.Star filled={rating >= 1} />
                <Rating.Star filled={rating >= 2} />
                <Rating.Star filled={rating >= 3} />
                <Rating.Star filled={rating >= 4} />
                <Rating.Star filled={rating >= 5} />
              </Rating>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            {!editRating && (
              <Button
                color="light"
                onClick={() => {
                  setEditRating(true);
                }}
                className="col-start-2"
              >
                Edit
              </Button>
            )}
            {editRating && (
              <Button
                color="failure"
                onClick={() => {
                  setEditRating(false);
                  setRating(vendor?.rating || 0);
                }}
              >
                Cancel
              </Button>
            )}
            {editRating && (
              <Button
                color="success"
                onClick={() => {
                  updateRating();
                }}
              >
                Update
              </Button>
            )}
          </div>
        </div>
        <HorizontalLine />
        <p className="text-lg font-medium">Prices</p>
        <div className="grid grid-cols-3 gap-4 items-end">
          <div className="">
            <Label value="Bridal makeup Starting price" />
            <TextInput value={vendor?.prices?.bridal} readOnly />
          </div>
          <div className="">
            <Label value="Party makeup starting price (optional) " />
            <TextInput value={vendor?.prices?.party} readOnly />
          </div>
          <div className="">
            <Label value="Groom makeup starting price" />
            <TextInput value={vendor?.prices?.groom} readOnly />
          </div>
        </div>
        <HorizontalLine />
        <p className="text-lg font-medium">Bank Details</p>
        <div className="grid grid-cols-3 gap-4 items-end">
          <div className="">
            <Label value="Account Number" />
            <TextInput
              value={
                vendor?.razporPay_product_info?.settlements?.account_number
              }
              readOnly
            />
          </div>
          <div className="">
            <Label value="IFSC Code" />
            <TextInput
              value={vendor?.razporPay_product_info?.settlements?.ifsc_code}
              readOnly
            />
          </div>
          <div className="">
            <Label value="Beneficiary Name" />
            <TextInput
              value={
                vendor?.razporPay_product_info?.settlements?.beneficiary_name
              }
              readOnly
            />
          </div>
        </div>
        <HorizontalLine />
        <p className="text-lg font-medium">Packages</p>
        <div className="grid grid-cols-4 gap-4">
          {!displayNewPersonalPackage && (
            <Button
              color="dark"
              onClick={() => {
                setDisplayNewPersonalPackage(true);
                setNewPersonalPackage({
                  name: "",
                  services: [""],
                  price: 0,
                  amountToVendor: 0,
                  amountToWedsy: 0,
                });
              }}
            >
              <BiPlus />
              Add More Packages
            </Button>
          )}
          {displayNewPersonalPackage && (
            <>
              <div>
                <Label value="Package Name" />
                <TextInput
                  placeholder="Package Name"
                  disabled={loading}
                  value={newPersonalPackage?.name}
                  onChange={(e) => {
                    setNewPersonalPackage({
                      ...newPersonalPackage,
                      name: e.target.value,
                    });
                  }}
                  className="mb-4"
                />
                <Label value="Package Price" />
                <TextInput
                  placeholder="Package Price"
                  disabled={loading}
                  type="number"
                  value={newPersonalPackage?.price}
                  onChange={(e) => {
                    let p = parseInt(e.target.value) || 0;
                    setNewPersonalPackage({
                      ...newPersonalPackage,
                      price: e.target.value,
                      amountToWedsy:
                        p * (bookingAmount?.personalPackage?.percentage / 100),
                      amountToVendor:
                        p *
                        (1 - bookingAmount?.personalPackage?.percentage / 100),
                    });
                  }}
                />
              </div>
              <div>
                <Label value="Services that will be provided" />
                {newPersonalPackage?.services?.map((item, index) => (
                  <div
                    className="flex flex-row gap-2 items-center mb-2"
                    key={index}
                  >
                    <TextInput
                      key={index}
                      placeholder="Services"
                      value={item}
                      onChange={(e) => {
                        let temp = newPersonalPackage?.services;
                        temp[index] = e.target.value;
                        setNewPersonalPackage({
                          ...newPersonalPackage,
                          services: temp,
                        });
                      }}
                      disabled={loading}
                      className="grow"
                    />
                    <MdCancel
                      size={20}
                      onClick={() => {
                        setNewPersonalPackage({
                          ...newPersonalPackage,
                          services: newPersonalPackage?.services?.filter(
                            (_, i) => i !== index
                          ),
                        });
                      }}
                    />
                  </div>
                ))}
                <div
                  className="flex items-center gap-1 text-sm"
                  onClick={() => {
                    setNewPersonalPackage({
                      ...newPersonalPackage,
                      services: [...newPersonalPackage?.services, ""],
                    });
                  }}
                >
                  Add more <BsPlusCircle />
                </div>
              </div>
              <div>
                <p className="text-xl font-semibold mt-4">Wedsy Settlements</p>
                <div className="flex flex-row justify-between">
                  <p>Amount Payable to Wedsy</p>
                  <p>{toPriceString(newPersonalPackage?.amountToWedsy)}</p>
                </div>
                <div className="flex flex-row justify-between">
                  <p>Amount Payable to You</p>
                  <p>{toPriceString(newPersonalPackage?.amountToVendor)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 items-end gap-4">
                <Button
                  color="success"
                  disabled={loading}
                  onClick={() => {
                    addPersonalPackage();
                  }}
                >
                  Save Package
                </Button>
                <Button
                  color="failure"
                  disabled={loading}
                  onClick={() => {
                    setDisplayNewPersonalPackage(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col gap-4 divide-y">
          {personalPackages?.map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 pt-4">
              <div className="flex flex-col gap-4">
                <div>
                  <Label value="Package Name" />
                  <TextInput
                    readOnly={displayEditPersonalPackage !== item._id}
                    value={
                      displayEditPersonalPackage !== item._id
                        ? item.name
                        : editPersonalPackage.name
                    }
                    onChange={(e) => {
                      setEditPersonalPackage({
                        ...editPersonalPackage,
                        name: e.target.value,
                      });
                    }}
                  />
                </div>
                <div>
                  <Label value="Package Price" />
                  <TextInput
                    readOnly={displayEditPersonalPackage !== item._id}
                    value={
                      displayEditPersonalPackage !== item._id
                        ? item.price
                        : editPersonalPackage.price
                    }
                    onChange={(e) => {
                      let p = parseInt(e.target.value) || 0;
                      setEditPersonalPackage({
                        ...editPersonalPackage,
                        price: e.target.value,
                        amountToWedsy:
                          p *
                          (bookingAmount?.personalPackage?.percentage / 100),
                        amountToVendor:
                          p *
                          (1 -
                            bookingAmount?.personalPackage?.percentage / 100),
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label value="Services" className="-mb-1" />
                {(displayEditPersonalPackage !== item._id
                  ? item
                  : editPersonalPackage
                )?.services.map((rec, recIndex) => (
                  <div
                    className="flex flex-row gap-2 items-center mb-2"
                    key={recIndex}
                  >
                    <TextInput
                      placeholder="Services"
                      value={rec}
                      onChange={(e) => {
                        let temp = editPersonalPackage?.services;
                        temp[index] = e.target.value;
                        setEditPersonalPackage({
                          ...editPersonalPackage,
                          services: temp,
                        });
                      }}
                      disabled={loading}
                      className="grow"
                      readOnly={displayEditPersonalPackage !== item._id}
                    />
                    {displayEditPersonalPackage === item._id && (
                      <MdCancel
                        size={20}
                        onClick={() => {
                          setEditPersonalPackage({
                            ...editPersonalPackage,
                            services: editPersonalPackage?.services?.filter(
                              (_, i) => i !== index
                            ),
                          });
                        }}
                      />
                    )}
                  </div>
                ))}
                {displayEditPersonalPackage === item._id && (
                  <div
                    className="flex items-center gap-1 text-sm"
                    onClick={() => {
                      setEditPersonalPackage({
                        ...editPersonalPackage,
                        services: [...editPersonalPackage?.services, ""],
                      });
                    }}
                  >
                    Add more <BsPlusCircle />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex flex-row justify-between">
                    <p>Amount Payable to Wedsy</p>
                    <p>
                      {toPriceString(
                        (displayEditPersonalPackage !== item._id
                          ? item
                          : editPersonalPackage
                        )?.amountToWedsy
                      )}
                    </p>
                  </div>
                  <div className="flex flex-row justify-between">
                    <p>Amount Payable to You</p>
                    <p>
                      {toPriceString(
                        (displayEditPersonalPackage !== item._id
                          ? item
                          : editPersonalPackage
                        )?.amountToVendor
                      )}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-auto">
                  {!displayEditPersonalPackage && (
                    <>
                      <Button
                        color="success"
                        onClick={() => {
                          setDisplayEditPersonalPackage(item._id);
                          setEditPersonalPackage(item);
                        }}
                      >
                        Update
                      </Button>
                      <div className="flex flex-row items-center gap-4">
                        <Button
                          color="failure"
                          onClick={() => {
                            if (
                              confirm("Do you want to delete this package?")
                            ) {
                              deletePersonalPackage(item._id);
                            }
                          }}
                        >
                          <MdDelete size={20} className="flex-shrink-0" />
                        </Button>
                        <ToggleSwitch
                          checked={item.active}
                          onChange={() => {
                            updatePersonalPackageStatus(
                              item?._id,
                              !item.active
                            );
                          }}
                        />
                      </div>
                    </>
                  )}
                  {displayEditPersonalPackage === item._id && (
                    <>
                      <Button
                        color="success"
                        onClick={() => {
                          updatePersonalPackage();
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        color="failure"
                        onClick={() => {
                          setDisplayEditPersonalPackage("");
                          setEditPersonalPackage({
                            name: "",
                            services: [],
                            price: 0,
                            amountToVendor: 0,
                            amountToWedsy: 0,
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <HorizontalLine />
        <p className="text-lg font-medium">Gallery & Photos</p>
        {expandedImage !== null && (
          <>
            <div
              className="blur-md inset-0 bg-white opacity-50 backdrop-filter-blur fixed z-50 h-screen w-screen top-0 left-0"
              onClick={() => {
                setExpandedImage(null);
              }}
            />
            <img
              src={expandedImage}
              onClick={() => {
                setExpandedImage(null);
              }}
              className="max-h-screen max-w-screen object-contain fixed z-50 p-8 top-0 left-0 cursor-pointer w-full h-full transition-all duration-75 ease-in-out"
            />
          </>
        )}
        <div className="grid grid-cols-4 gap-4">
          <div className="">
            <Label value="Profile Cover Photo" />
            {gallery.coverPhoto && (
              <img
                src={gallery?.coverPhoto}
                className="object-contain w-full h-48 cursor-pointer"
                onClick={() => {
                  setExpandedImage(gallery?.coverPhoto);
                }}
              />
            )}
            {gallery.addCoverPhoto && (
              <FileInput
                className="mt-4"
                ref={coverPhotoRef}
                disabled={loading}
                onChange={(e) => {
                  setGallery({
                    ...gallery,
                    updatedCoverPhoto: e.target.files[0],
                  });
                }}
              />
            )}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {!gallery.addCoverPhoto && (
                <Button
                  color="light"
                  onClick={() => {
                    setGallery({ ...gallery, addCoverPhoto: true });
                  }}
                >
                  Edit
                </Button>
              )}
              {gallery.addCoverPhoto && gallery.updatedCoverPhoto && (
                <Button
                  onClick={() => {
                    updateCoverPhoto();
                  }}
                  color="success"
                >
                  Upload
                </Button>
              )}
              {gallery.addCoverPhoto && (
                <Button
                  color="failure"
                  onClick={() => {
                    setGallery({
                      ...gallery,
                      addCoverPhoto: false,
                      ...vendor.gallery,
                    });
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
          <div className="col-span-3">
            <Label value="Photos for gallery view" />
            <div className="grid grid-cols-5 gap-4">
              {gallery.photos.map((item, index) => (
                <div
                  key={index}
                  className="w-full aspect-square overflow-hidden relative"
                >
                  {gallery?.deletePhotos && (
                    <Checkbox
                      className="absolute top-2 right-2 cursor-pointer"
                      checked={gallery?.deletedPhotosId.includes(index)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setGallery({
                            ...gallery,
                            deletedPhotosId: [
                              ...gallery?.deletedPhotosId,
                              index,
                            ],
                          });
                        } else {
                          setGallery({
                            ...gallery,
                            deletedPhotosId: gallery?.deletedPhotosId?.filter(
                              (_, i) => i != index
                            ),
                          });
                        }
                      }}
                    />
                  )}
                  <img
                    src={item}
                    alt={`Gallery image ${index + 1}`}
                    className="object-cover w-full h-full max-w-full max-h-full cursor-pointer"
                    onClick={() => {
                      setExpandedImage(item);
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-2 mt-4">
              {gallery.addPhoto && (
                <FileInput
                  className=""
                  ref={photoRef}
                  disabled={loading}
                  onChange={(e) => {
                    setGallery({
                      ...gallery,
                      newPhoto: e.target.files[0],
                    });
                  }}
                />
              )}
              {!gallery.deletePhotos && !gallery.addPhoto && (
                <Button
                  color="light"
                  onClick={() => {
                    setGallery({ ...gallery, addPhoto: true });
                  }}
                >
                  Edit
                </Button>
              )}
              {!gallery.deletePhotos && !gallery.addPhoto && (
                <Button
                  color="failure"
                  onClick={() => {
                    setGallery({ ...gallery, deletePhotos: true });
                  }}
                >
                  Delete Photos
                </Button>
              )}
              {gallery.deletePhotos && gallery?.deletedPhotosId?.length > 0 && (
                <Button
                  onClick={() => {
                    deletePhoto();
                  }}
                  color="success"
                >
                  Delete
                </Button>
              )}
              {gallery.addPhoto && gallery.newPhoto && (
                <Button
                  onClick={() => {
                    updatePhoto();
                  }}
                  color="success"
                >
                  Upload
                </Button>
              )}
              {gallery.addPhoto && (
                <Button
                  color="failure"
                  onClick={() => {
                    setGallery({
                      ...gallery,
                      addPhoto: false,
                      ...vendor.gallery,
                    });
                  }}
                >
                  Cancel
                </Button>
              )}
              {gallery.deletePhotos && (
                <Button
                  color="failure"
                  onClick={() => {
                    setGallery({
                      ...gallery,
                      deletePhotos: false,
                      deletedPhotosId: [],
                      ...vendor.gallery,
                    });
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
