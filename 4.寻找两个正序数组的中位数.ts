/*
 * @lc app=leetcode.cn id=4 lang=typescript
 *
 * [4] 寻找两个正序数组的中位数
 */

// @lc code=start
function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
const tmp = [...nums1,...nums2]
if(tmp.length ===1){
    return tmp[0]
}
tmp.sort((a,b)=>a-b)
if(tmp.length %2 ===0){
    return (tmp[tmp.length/2 - 1] + tmp[tmp.length/2 ])/2
}else{
    return tmp[Math.round(tmp.length/2)-1]
}
};


