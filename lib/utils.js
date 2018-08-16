function match (str, subStrs) {
  return subStrs.every(subStr => str.includes(subStr))
}

function issueMatch (issueBody, issueConfigs) {
  let issueLines = issueBody
    .split(/\n/)
    .map(line => line.replace(/\r|\*|#/ig, '').trim())
    .filter(line => !!line)
  const issueBodyTitle = issueLines[0];
  issueLines = issueLines.slice(1);
  let match = false;
  issueConfigs.forEach(issueConfig => {
    // 第一行issue标题不能含有无效
    if (issueConfig.bannedTitle && new RegExp(issueConfig.bannedTitle).test(issueBodyTitle)) {
      return
    }
    // 包含全部小标题
    // TODO: 优化复杂度
    if (issueConfig.subtitles && !issueConfig.subtitles.every(subtitle => issueLines.find(line => subtitle === line))) {
      return;
    }
    // 不能含有无效内容
    // TODO: 优化复杂度
    if (issueConfig.bannedContents && issueConfig.bannedContents.some(content => issueLines.find(line => line === `[${content}]` || line === `(${content})`))) {
      return;
    }
    match = true;
  })
  return match;
}

module.exports = issueMatch
