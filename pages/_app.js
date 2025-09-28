import AdminSidebar from "@/components/layout/AdminSidebar";
import Login from "@/components/layout/Login";
import "@/styles/globals.css";
import { Spinner, Toast } from "flowbite-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [logIn, setLogIn] = useState(false);
  const [user, setUser] = useState({});
  const [message, setMessage] = useState({
    text: "",
    status: "",
    display: false,
  });
  const onLogout = () => {
    setLogIn(true);
    setUser({});
    localStorage.removeItem("token");
  };
  const CheckLogin = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          localStorage.removeItem("token");
          setLogIn(true);
          return;
        } else {
          return response.json();
        }
      })
      .then((response) => {
        if (response) {
          setLogIn(false);
          setUser(response);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setLogIn(true);
      setLoading(false);
    } else if (localStorage.getItem("token")) {
      setLoading(true);
      CheckLogin();
    }
  }, []);
  return loading ? (
    <div className="grid place-content-center h-screen ">
      <Spinner size="xl" />
    </div>
  ) : logIn ? (
    <Login setLogIn={setLogIn} CheckLogin={CheckLogin} />
  ) : (
    <div className="flex flex-row h-full">
      <Head>
        <title>Wedsy Dashboard</title>
      </Head>
      <AdminSidebar user={user} onLogout={onLogout} />
      {message.display && (
        <div className="absolute bottom-6 left-6 overflow-hidden z-50">
          <Toast>
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
              {message.status === "success" ? (
                <HiCheck className="h-5 w-5" />
              ) : message.status === "failure" ? (
                <HiX className="h-5 w-5" />
              ) : message.status === "warning" ? (
                <HiExclamation className="h-5 w-5" />
              ) : (
                ""
              )}
            </div>
            <div className="ml-3 text-sm font-normal">{message.text}</div>
            <Toast.Toggle
              onClick={() => {
                setMessage({ text: "", status: "", display: false });
              }}
            />
          </Toast>
        </div>
      )}
      <div className="flex-grow bg-[#fafbff] h-screen overflow-y-auto">
        <Component
          {...pageProps}
          userLoggedIn={!logIn}
          user={user}
          message={message}
          setMessage={setMessage}
        />
      </div>
    </div>
  );
}
