const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
/**
 * 兼容的时间字符串转换
 */
function parseTime(str) {
  var arr = str.split(/[- :\/\\]/)
  return new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  parseTime: parseTime,
}