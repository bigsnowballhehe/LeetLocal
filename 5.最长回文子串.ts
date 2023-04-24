/*
 * @lc app=leetcode.cn id=5 lang=typescript
 *
 * [5] 最长回文子串
 */

// @lc code=start
function longestPalindrome(s: string): string {
  let left = 0
  let right = 0
  let maxLength = 0
  const length = s.length
  const getMaxStr = (str: string, i: number, j: number) => {
    const length = str.length
    while (i >= 0 && j < length && str[i] === str[j]) {
      if (j - i + 1 > maxLength) {
        left = i
        right = j
        maxLength = j - i + 1
      }
      i--
      j++
    }
  }
  for (let index = 0; index < length; index++) {
    getMaxStr(s, index, index)
    getMaxStr(s, index, index + 1)
  }

  return s.slice(left, right + 1)
}
// @lc code=end
