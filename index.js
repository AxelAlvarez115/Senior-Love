import express from "express";
import session from "express-session";
import * as dotenv from "dotenv";
import router from "./app/router.js";
import addUserData from "./app/middleware/addUserData.js";
import handleAlerts from "./app/middleware/handleAlerts.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "./app/views");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

if (!process.env.SECRET_POUR_EXPRESS_SESSION || process.env.SECRET_POUR_EXPRESS_SESSION.length < 32) {
	console.warn("ATTENTION: SECRET_POUR_EXPRESS_SESSION manquant ou trop court (>= 32 caractères recommandés).");
}

app.use(
	session({
		saveUninitialized: false,
		resave: false,
		secret: process.env.SECRET_POUR_EXPRESS_SESSION,
		cookie: {
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
			maxAge: 1000 * 60 * 60 * 24 * 7,
		},
	}),
);

app.use(addUserData);
app.use(handleAlerts);

app.use(router);
app.listen(port, () => {
	console.log(`Serveur démarré sur http://127.0.0.1:${port}`);
});
