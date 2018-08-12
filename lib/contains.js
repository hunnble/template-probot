function contains (str, subStrs) {
  return subStrs.every(subStr => str.includes(subStr))
}

module.exports = contains
