import { io } from "socket.io-client";


// default to backend port 4001 where your server runs
const URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080";
const token =  localStorage.getItem("token");

export const socket = io(URL, {
  transports: ["websocket"],
  auth: { token }, // preferred: token accepted at handshake
});

// fallback for projects that still expect registerUser
socket.on("connect", () => {

const u = (() => {
  // try the key with capital U (app stores `User`) then fallback to `user`
  const raw = localStorage.getItem("User") || localStorage.getItem("user");
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();


  const uid = u?.id || u?._id || u?.userId;
  console.debug('[socket] connected id=', socket.id, 'uid=', uid, 'token present=', !!token)
  if (uid) socket.emit("registerUser", uid);
});

socket.on("connect_error", (err) => {
  console.error("Socket connect error:", err.message);
});

export default socket;
