import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { Button, Spinner, TextInput } from "flowbite-react";

export default function ChatView() {
  const router = useRouter();
  const { chatId } = router.query;
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const title = useMemo(() => {
    const userName = chat?.user?.name || "User";
    const vendorName = chat?.vendor?.name || "Vendor";
    return `${userName} ↔ ${vendorName}`;
  }, [chat]);

  const fetchChat = () => {
    if (!chatId) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}?read=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => r.json())
      .then((resp) => {
        setChat(resp?.message === "error" ? null : resp);
        setLoading(false);
      })
      .catch(() => {
        setChat(null);
        setLoading(false);
      });
  };

  const sendMessage = () => {
    if (!chatId || !message) return;
    setSending(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}/content/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        contentType: "Text",
        content: message,
      }),
    })
      .then((r) => r.json())
      .then((resp) => {
        if (resp?.message !== "error") {
          setMessage("");
          fetchChat();
        }
      })
      .catch(() => {})
      .finally(() => setSending(false));
  };

  useEffect(() => {
    if (chatId) fetchChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  return (
    <div className="p-8 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Button color="light" onClick={() => router.back()}>
          Back
        </Button>
        <div className="text-lg font-semibold">{title}</div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <Spinner /> Loading chat…
        </div>
      ) : !chat ? (
        <div className="text-gray-600">Chat not found / no access.</div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow p-4 max-h-[65vh] overflow-y-auto flex flex-col-reverse gap-3">
            {(chat?.messages || []).map((m) => (
              <div key={m._id} className="flex flex-col gap-1">
                <div className="text-xs text-gray-500">
                  {m?.sender?.role || "unknown"} •{" "}
                  {m?.createdAt ? new Date(m.createdAt).toLocaleString() : ""}
                </div>
                <div className="rounded-lg border px-3 py-2 text-sm text-gray-800 bg-gray-50">
                  {String(m?.content ?? "")}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <TextInput
              className="grow"
              placeholder="Type a message…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={sending}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <Button
              color="success"
              onClick={sendMessage}
              disabled={sending || !message}
            >
              Send
            </Button>
          </div>
        </>
      )}
    </div>
  );
}


