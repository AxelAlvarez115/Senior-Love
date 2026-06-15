import express from "express";
import session from "express-session";
import * as dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import router from "./app/router.js";
import addUserData from "./app/middleware/addUserData.js";
import handleAlerts from "./app/middleware/handleAlerts.js";
import { initSocket } from "./app/socket.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "./app/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

const sessionMiddleware = session({
	saveUninitialized: false,
	resave: false,
	secret: process.env.SECRET_POUR_EXPRESS_SESSION,
	cookie: {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
});

app.use(sessionMiddleware);
app.use(addUserData);
app.use(handleAlerts);
app.use(router);

const io = new Server(httpServer);
initSocket(io, sessionMiddleware);
export { io };

httpServer.listen(port, () => {
	console.log(`Serveur démarré sur http://127.0.0.1:${port}`);
});
