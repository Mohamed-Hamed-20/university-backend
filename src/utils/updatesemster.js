import semsterModel from "../../DB/models/semster.model.js";

// الدالة لتحويل قيمة Academic_Year
const convertAcademicYear = (academicYear) => {
  const [startYear, endYear] = academicYear.split("-").map(Number);
  const newStartYear = startYear + 1;
  const newEndYear = endYear + 1;
  return `${newStartYear}-${newEndYear}`;
};

export const updateSemster = async ({ totalHoursPass, oldsemster }) => {
  //   console.log(totalHoursPass, oldsemster);
  const semsterwanted = {};
  const newAcademicYear = convertAcademicYear(oldsemster.Academic_Year);
  semsterwanted.Academic_Year = newAcademicYear;

  if (totalHoursPass >= 141) {
    semsterwanted.level = "graduated";
    semsterwanted.term = "one";
  } else if (totalHoursPass >= 98) {
    semsterwanted.level = "four";
    semsterwanted.term = "one";
  } else if (totalHoursPass >= 57) {
    semsterwanted.level = "three";
    semsterwanted.term = "one";
  } else if (totalHoursPass >= 28) {
    semsterwanted.level = "two";
    semsterwanted.term = "one";
  } else if (totalHoursPass >= 0) {
    (semsterwanted.term = "one"), (semsterwanted.level = "one");
  } else {
    semsterwanted.level = "one";
    semsterwanted.term = "one";
  }
  console.log(semsterwanted);
  let newsemster;
  newsemster = await semsterModel.findOne({
    level: semsterwanted.level,
    term: semsterwanted.term,
    Academic_Year: semsterwanted.Academic_Year,
  });

  if (!newsemster) {
    semsterwanted.name = `semster for ${newAcademicYear} - level: ${semsterwanted.level}`;
    newsemster = await semsterModel.create(semsterwanted);
    console.log("New semster created:", newsemster);
  }
  console.log({ InSide: newsemster });
  return newsemster;
};
