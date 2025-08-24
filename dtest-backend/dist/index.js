import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import testRoutes from "./routes/tests.routes.js";
import attemptRoutes from "./routes/attempts.routes.js";
import statsRoutes from "./routes/stats.routes.js";
import { connectDB } from "./db.js";
import errorHandler from "./middleware/error.js";
import { User } from "./models/User.js";
import { config } from "./config.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// Middlewares
app.use(cors());
app.use(express.json());
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/stats", statsRoutes);
// Error handler
app.use(errorHandler);
async function ensureBootstrapAdmin() {
    try {
        const email = config.bootstrapAdmin.email.toLowerCase();
        const existing = await User.findOne({ email });
        if (!existing) {
            await User.create({
                firstName: config.bootstrapAdmin.first,
                lastName: config.bootstrapAdmin.last,
                email,
                password: config.bootstrapAdmin.password,
                role: "admin",
                enabled: true,
                loginExpiry: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
            });
            console.log("Bootstrap admin created:", email);
        }
    }
    catch (err) {
        console.error("Error ensuring bootstrap admin:", err);
    }
}
app.listen(PORT, async () => {
    await connectDB();
    await ensureBootstrapAdmin();
    console.log(`Server running on http://localhost:${PORT}`);
});
