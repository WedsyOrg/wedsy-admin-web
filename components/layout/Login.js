import { Button, Label, Spinner, TextInput } from "flowbite-react";
import Image from "next/image";
import { useState } from "react";
import { BiLogIn } from "react-icons/bi";

export default function Login({ CheckLogin, setLogIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        password: password.trim(),
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "Login Successful" && response.token) {
          localStorage.setItem("token", response.token);
          setEmail("");
          setPassword("");
          setLoading(false);
          setLogIn(false);
          CheckLogin();
        } else {
          alert(response.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  return (
    <div className="flex justify-center items-center h-screen bg-rose-900">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="relative mb-6 h-12">
            <Image
              src="/assets/logo-black.png"
              alt="Logo"
              width={0}
              height={0}
              sizes="100%"
              className="mx-auto"
              style={{ height: "100%", width: "auto" }}
            />
          </div>
          <form>
            <div className="mb-4">
              <div className="mb-2 block">
                <Label htmlFor="email" value="Your Email" />
              </div>
              <TextInput
                id="email"
                placeholder="name@wedsy.in"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <div className="mb-2 block">
                <Label htmlFor="password" value="Your Password" />
              </div>
              <TextInput
                id="password"
                required
                type="password"
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="w-full">
              <Button
                type="submit"
                className="w-full bg-rose-800 hover:bg-rose-900 enabled:hover:bg-rose-900"
                disabled={
                  !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                    email.trim()
                  ) ||
                  !password.trim() ||
                  loading
                }
                onClick={handleLogin}
              >
                {loading ? (
                  <>
                    <Spinner size={"sm"} />
                    <p className="ml-2 ">Logging in...</p>
                  </>
                ) : (
                  <>
                    <BiLogIn className="mr-2 h-5 w-5" />
                    <p>Login</p>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
