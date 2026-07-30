import app from "./src/app.js"
import logs from "./src/utils/logs.js";

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {logs(`🚀 Server running on http://localhost:${PORT}`);});