import express from "express"
import mongoose from "mongoose"
import listingRoutes from "../server/routes/listingRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express()
const port = process.env.PORT || 3000

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {})
.then(() => {console.log("MongoDB Connected")})
.catch((error) => {"MongoDB Error", error});

//routes
app.use('/', listingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${port}`)
});
