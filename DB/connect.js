import mongoose from "mongoose";

// تعيين الخيار strictQuery إلى false لتجنب التحذير
mongoose.set("strictQuery", false);

// دالة للاتصال بقاعدة البيانات
const connectDB = async () => {
  try {
    // الاتصال بقاعدة البيانات باستخدام رابط المُحيط
    await mongoose.connect(process.env.DB_url);
    console.log("DB connected");
  } catch (error) {
    console.error("Error in connection:");
  }
};

export default connectDB;
