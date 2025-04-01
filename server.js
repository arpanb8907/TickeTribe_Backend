import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import pg from "pg"

// load environmental variables
dotenv.config();

const Corsoptions = {
    origin:[
        "http://localhost:3000"

    ],

    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};

const app = express();
const {Pool} = pg;
const PORT = process.env.PORT || 5000;

//app.options("*", cors(Corsoptions)); // Preflight requests handler
app.use(cors(Corsoptions))
app.use(express.json())

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


app.get('/' , (req,res)=>{
    res.send("Server is running")
});

app.listen(PORT,()=>{

    console.log(`Server is running ${PORT}`)
})

