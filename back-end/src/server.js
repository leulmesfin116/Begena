import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 5007;

//Get the file path from the url of the current module
const __filename = fileURLToPath(import.meta.url);
// Get the directory name from the file path
const __dirname = dirname(__filename);

app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "front-end", "begena-prj", "src", "pages", "Home.jsx")
  );
});

app.listen(PORT, () => {
  console.log(`The serevr has started at Port:${PORT}`);
});
