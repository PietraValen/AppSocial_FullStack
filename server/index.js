import express from "express";
import bodyParse from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dontev from "dotenv"
import multer from "multer";
import HelmetOptions from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import { register } from "./controllers/auth.js"

/* Configurations */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dontev.config();
const app = express();
app.use(express.json);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParse.json({ limit: "30mb", extended: true }));
app.use(bodyParse.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

/* ROUTE WITH FILES */

app.post("/auth/register", upload.single("picture"), register);

/* ROUTES */

app.use("/auth", authRoutes);

/* MONGOOSE SETUP -*/
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParse: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log('Server Port: ${PORT}'));
}).catch((error) => console.log('${error} did not connect'));