// server/src/server.js

const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 4000;

const apiRoutes = require("./routes/api.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/api", apiRoutes);
app.use("/admin", adminRoutes);



app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
