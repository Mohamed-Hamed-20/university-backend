export const formatDOB = async (dateString) => {
  try {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.getMonth() + 1; // يجب إضافة 1 للشهر لأنه يبدأ من 0
    const year = date.getFullYear();
    if (!day || !month || !year) {
      throw new Error("error In formating Date");
    }
    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
  } catch (error) {
    throw new Error("error In formating Date");
  }
};
