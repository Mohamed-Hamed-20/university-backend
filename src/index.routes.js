import connectDB from "../DB/connect.js";
// securty imports
import cors from "cors";
import hpp from "hpp";
import mongosanitize from "express-mongo-sanitize";

import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";
import settingRouter from "./routes/setting.routes.js";
import semsterRouter from "./routes/semster.routes.js";
import instructorRouter from "./routes/instructor.routes.js";
import StudentGradesRouter from "./routes/StudentGrades.routes.js";
import courseRouter from "./routes/course.routes.js";
import AvailablecourseRouter from "./routes/AvailableCourses.routes.js";
import RegisterRouter from "./routes/Register.routes.js";
import trainingRouter from "./routes/training.routes.js";
import TrainingResultRouter from "./routes/trainingResult.routes.js";
import TrainingRegisterRouter from "./routes/TrainingRegister.routes.js";

import { GlobalErrorHandling } from "./utils/errorHandling.js";
import morgan from "morgan";
import { hellowpage } from "./utils/templetHtml.js";
import { settingAPIS } from "./controllers/setting/setting.js";
import { routes } from "./utils/routes.path.js";

export const bootstrap = (app, express) => {
  const allowedOrigins = [
    "https://graduation-project-beryl-seven.vercel.app/",
    "https://graduation-project-beryl-seven.vercel.app",
    "http://localhost:3000/",
    "http://localhost:3000",
    "https://localhost:3000",
  ];

  const corsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  };

  app.use(cors(corsOptions));

  //Allow feaching Data
  app.use(express.json({ limit: "100kb" }));
  app.use(express.urlencoded({ extended: true }));

  //to apply data sanitizing
  app.use(mongosanitize());

  //middleware to protect against HTTP Parameter Pollution attacks
  app.use(hpp());

  // DB connection
  connectDB();

  if ((process.env.MOOD = "DEV")) {
    app.use(morgan("dev"));
  } else {
    app.use(morgan("combined"));
  }

  app.use(settingAPIS);
  // API
  app.use(`${routes.student._id}`, userRouter);
  app.use(`${routes.Admin._id}`, adminRouter);
  app.use(`${routes.instructor._id}`, instructorRouter);
  app.use(`${routes.course._id}`, courseRouter);
  app.use(`${routes.student._id}`, AvailablecourseRouter);
  app.use(`${routes.courseRegister._id}`, RegisterRouter);
  app.use(`${routes.studentGrades._id}`, StudentGradesRouter);
  app.use(`${routes.semster._id}`, semsterRouter);
  app.use(`${routes.setting._id}`, settingRouter);
  app.use(`${routes.Training._id}`, trainingRouter);
  app.use(`${routes.RegisterTraining._id}`, TrainingRegisterRouter);
  app.use(`${routes.TrainingResult._id}`, TrainingResultRouter);

  //Welcome Page
  app.get("/", async (req, res, next) => {
    console.log({ IP: req.ip });
    // return res.json({ AllRoutes });
    const result = await hellowpage();
    return res.send(`${result}`);
  });

  //API bad
  app.all("*", (req, res) => res.send("invalid router link or method!"));

  //Globale error handling
  app.use(GlobalErrorHandling);
};
