/**
 * Calculates the sum of all numbers in an array
 * @param {number[]} arr - Array of numbers to sum
 * @returns {number} The total sum of all numbers in the array
 */
export function sumNumbers(arr) {
  let total = 0;
  for (const n of arr) {
    total += n;
  }
  return total;
}

/**
 * Calculates the average (arithmetic mean) of numbers in an array
 * @param {number[]} arr - Array of numbers to calculate average from
 * @returns {number} The average value of the array, or 0 if the array is empty
 */
export function average(arr) {
  if (arr.length === 0) return 0;
  return sumNumbers(arr) / arr.length;
}
