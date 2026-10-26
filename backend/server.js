import dotenv from "dotenv";

dotenv.config({ path: new URL("./.env", import.meta.url) });

const [{ default: app }, { default: connectDB }] = await Promise.all([
  import("./app.js"),
  import("./config/db.js"),
]);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

    const shutdown = async () => {
      server.close(async () => {
        await (await import("mongoose")).default.disconnect();
        process.exit(0);
      });
    };

    process.once("SIGINT", shutdown);
    process.once("SIGTERM", shutdown);
  } catch (error) {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  }
};

await startServer();