import app from "./src/app.js";
import connectToDatabase from "./src/config/db.js";

const PORT = Number(process.env.PORT || 8000);

async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();
