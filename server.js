import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import pg from "pg"
import authRoutes from "./Routes/auth_routes.js"
import fs from "fs"
import { env } from "process"
import session from "express-session";
import { sequelize } from "./Models/user.js" // Import sequelize directly
import User from "./Models/user.js"

// load environmental variables
// Debugging: Check if .env file exists and can be read
if (!fs.existsSync(".env")) {
    console.error("❌ .env file is missing or not accessible.");
    process.exit(1);
}
dotenv.config();

const Corsoptions = {
    origin:[
        "http://localhost:3000",
        "http://localhost:3001"
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};

const app = express();
const {Pool} = pg;
const PORT = process.env.PORT || 5000;

app.use(cors(Corsoptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SECRET_KEY || "fallback-secret", // better pattern
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // change to true with HTTPS
      maxAge: 5 * 60 * 1000 // 5 minutes
    }
}));

if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not defined in .env");
    process.exit(1); // Exit process if .env is missing
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log("📦 Database connected");
        client.release();
    } catch (error) {
        console.error("❌ Database connection error");
        console.error(error);
        process.exit(1);
    }
};

testConnection();

(async () => {
    try {
      await sequelize.authenticate(); // Corrected authentication method
      console.log("📦 Sequelize DB connected");
  
      await sequelize.sync({ alter: true }); // Sync all models (recommended for dev)
      console.log("✅ All models synced");
  
      // Start server only after DB is ready
      app.use('/', authRoutes);
  
      app.get('/', (req, res) => {
        res.send("Server is running");
      });
  
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
  
    } catch (error) {
      console.error("❌ Sequelize error:", error);
      process.exit(1);
    }
})();
