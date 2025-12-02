import { io } from "socket.io-client";


// prefer explicit socket URL from env, fallback to localhost backend
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
  console.debug('[socket] connected id=', socket.id, 'uid=', uid, 'token present=', !!token, 'url=', URL)
  // emit both common registration event names as a fallback so different backends can register the socket
  if (uid) {
    socket.emit("registerUser", uid);
    socket.emit("register", uid);
    console.debug('[socket] emitted registerUser/register with uid=', uid);
  } else if (token) {
    // if we don't have a parsed user, send token so the server can map the socket
    socket.emit('registerWithToken', token);
    console.debug('[socket] emitted registerWithToken (token present)');
  }
});

socket.on("connect_error", (err) => {
  console.error("Socket connect error:", err.message);
});

socket.on('disconnect', (reason) => {
  console.debug('[socket] disconnected', reason);
});

socket.on('reconnect_attempt', (attempt) => {
  console.debug('[socket] reconnect attempt', attempt);
});

export default socket;
