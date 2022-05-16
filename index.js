import express from "express";
import bodyParser from "body-parser";
//to be able to use path.dirname(__filename)
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
//
import artistRoutes from "./routes/artist.js";

const app = express();
const PORT = process.env.PORT || 3000;

// API Middleware
app.use(bodyParser.json());
app.use("/artist", artistRoutes);

//Display the index.html file
app.get("/", (req, res) =>
  res.sendFile(path.dirname(__filename) + "/index.html")
);

app.listen(PORT, () =>
  console.log(`Server is running on port: http://localhost:${PORT}`)
);
