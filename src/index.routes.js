import connectDB from "../DB/connect.js";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";
import semsterRouter from "./routes/semster.routes.js";
import instructorRouter from "./routes/instructor.routes.js";
import StudentGradesRouter from "./routes/StudentGrades.routes.js";
import courseRouter from "./routes/course.routes.js";
import trainingRouter from "./routes/training.routes.js";
import AvailablecourseRouter from "./routes/AvailableCourses.routes.js";
import RegisterRouter from "./routes/Register.routes.js";
import { GlobalErrorHandling } from "./utils/errorHandling.js";
import morgan from "morgan";
import { hellowpage } from "./utils/templetHtml.js";

export const bootstrap = (app, express) => {
  // const allowedOrigins = [
  //   "http://localhost:3000",
  //   "https://graduation-project-beryl-seven.vercel.app",
  // ];
  // {
  //       origin: allowedOrigins,
  //     }
  app.use(cors());

  //Allow feaching Data
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // DB connection
  connectDB();

  if ((process.env.MOOD = "DEV")) {
    app.use(morgan("dev"));
  } else {
    app.use(morgan("combined"));
  }

  // =====================================chk rate limiter==================================================
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  });

  // Apply the rate limiting
  app.use(limiter);

  // API
  app.use("/Api/user", userRouter);
  app.use("/Api/admin", adminRouter);
  app.use("/Api/instructor", instructorRouter);
  app.use("/Api/courses", courseRouter);
  app.use("/Api/semster", semsterRouter);
  app.use("/Api/training", trainingRouter);
  app.use("/Api/student", AvailablecourseRouter);
  app.use("/Api/student/register", RegisterRouter);
  app.use("/Api/student/Grades", StudentGradesRouter);

  //Welcome Page
  app.get("/", async (req, res, next) => {
    console.log({ IP: req.ip });
    const result = await hellowpage();
    return res.send(`${result}`);
  });

  //API bad
  app.all("*", (req, res) => res.send("invalid router link or method!"));

  //Globale error handling
  app.use(GlobalErrorHandling);
};
