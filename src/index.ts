import express from "express";
import tweetRoutes from "./routes/tweetRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(express.json());
app.use("/user", userRoutes);
app.use("/tweet", tweetRoutes);

app.listen(5000, () => {
  console.log("server started");
});
