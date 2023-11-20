function sortArrayFromMiddleToEnds(arr) {
  let sortedArr = [];
  let midIndex = Math.floor(arr.length / 2);
  sortedArr.push(arr[midIndex]);
  for (let i = 1; i <= midIndex; i++) {
    if (arr[midIndex + i] !== void 0) {
      sortedArr.push(arr[midIndex - i]);
      sortedArr.push(arr[midIndex + i]);
    } else if (arr[midIndex - i] !== void 0) {
      sortedArr.push(arr[midIndex - i]);
    }
  }
  return sortedArr;
}
export {
  sortArrayFromMiddleToEnds
};
