const arr = [70, 6, 23, 4, 5, 6, 7, 634, 1, 32];

if (arr.length >= 5) {
  // حذف العناصر الإضافية باستخدام splice()
  arr.splice(0, arr.length - 5);
}

console.log(arr);
