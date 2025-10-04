import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// --- pretend database (4 users / 2 tenants) ---
const USERS = {
  "owner@demo.test":  { id:"u1", name:"Olivia Owner",  role:"OWNER",  tenant:{id:"t1", name:"Alpha Co"}, features:["billing"] },
  "admin@demo.test":  { id:"u2", name:"Andy Admin",    role:"ADMIN",  tenant:{id:"t1", name:"Alpha Co"}, features:["billing"] },
  "staff@demo.test":  { id:"u3", name:"Sam Staff",     role:"STAFF",  tenant:{id:"t1", name:"Alpha Co"}, features:[] },
  "user@demo.test":   { id:"u4", name:"Una User",      role:"USER",   tenant:{id:"t2", name:"Beta Co"},  features:[] },
};
const PASSWORD = "pass123";

// in-memory sessions: sid -> email
const SESS = new Map();
const setSession = (res, email) => {
  const sid = Math.random().toString(36).slice(2);
  SESS.set(sid, email);
  res.cookie("sid", sid, { httpOnly: true, sameSite: "lax" });
};
const getUserFromReq = (req) => {
  const sid = req.cookies.sid;
  if (!sid) return null;
  const email = SESS.get(sid);
  if (!email) return null;
  return USERS[email] || null;
};

app.post("/api/login", (req, res) => {
  const { email, password } = req.body || {};
  const user = USERS[email];
  if (!user || password !== PASSWORD) {
    return res.status(401).send("Invalid email or password");
  }
  setSession(res, email);
  return res.json(user);
});

app.get("/api/me", (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).send("Not authenticated");
  res.json(user);
});

app.post("/api/logout", (req, res) => {
  const sid = req.cookies.sid;
  if (sid) SESS.delete(sid);
  res.clearCookie("sid");
  res.sendStatus(204);
});

app.post("/api/signup", (req, res) => {
  const { name, email } = req.body || {};
  if (!email) return res.status(400).send("email required");
  USERS[email] = {
    id: "u" + Math.random().toString(36).slice(2, 8),
    name: name || "New Owner",
    role: "OWNER",
    tenant: { id: "t" + Math.random().toString(36).slice(2, 6), name: "New Tenant" },
    features: ["billing"],
  };
  setSession(res, email);
  res.json(USERS[email]);
});

const PORT = 4000;
app.listen(PORT, () => console.log("Mock API on http://localhost:" + PORT));
