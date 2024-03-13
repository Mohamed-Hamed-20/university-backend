import { Types } from "mongoose";

export const arrayofIds = (arrayIds) => {
  const resultArrayIds = arrayIds.map((key) => new Types.ObjectId(key));
  return resultArrayIds;
};

export const convertToobjectId = (id) => {
  const objectId = new Types.objectId(id);
  return objectId;
};

export const arrayofstring = async (array) => {
  const newarray = array.map((key) => {
    return key.toString();
  });
  return newarray;
};

export const filterArray = (array, element) => {
  const newarray = array.filter((ele) => {
    return ele.toString() !== element.toString();
  });
  return newarray;
};
