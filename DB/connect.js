import monngoose from "mongoose";
//connect With DataBase
const connectDB = async () => {
  await monngoose
    .connect(process.env.DB_url)
    .then(() => {
      console.log("DB connected");
    })
    .catch((error) => {
      console.log("error in connection :(");
    });
};
export default connectDB;
