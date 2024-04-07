import userModel from "./DB/models/user.model.js";
import mongoose from "mongoose";

// تعيين الخيار strict إلى false لتجنب التحذير
mongoose.set("strict", false);

// دالة للاتصال بقاعدة البيانات
const connectDB = async () => {
  try {
    // الاتصال بقاعدة البيانات باستخدام رابط المُحيط
    await mongoose.connect(
      "mongodb+srv://mohamed:MH674281moh@cluster0.4h5fpsc.mongodb.net/university",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("DB connected");
  } catch (error) {
    console.error("Error in connection:", error); // طباعة الخطأ للتحقق من سبب المشكلة
  }
};
connectDB();

let result = await userModel.aggregate([
  { $match: { Full_Name: "mohamed salah" } }, // تطابق الوثائق التي تحتوي على الحقل المعين بالقيمة المعينة
  //   { $group: { _id: "$category", total: { $sum: "$quantity" } } }, // جمع الوثائق بناءً على الفئة وحساب المجموع
  //   { $sort: { total: -1 } }, // فرز النتائج بناءً على المجموع بترتيب تنازلي
  //   { $limit: 10 }, // عرض أول 10 نتائج فقط
]);

 result = await userModel.aggregate([
  {
    $match: {
      department: "cs",
      createdAt: { $gte: new Date("2024-02-01"), $lte: new Date("2024-02-28") },
    },
  },
]);


 result = await userModel.aggregate([
  { $match: { National_Id: "82344478901234" } },
]);

console.log(result);
