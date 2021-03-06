/**
 * This is the entry point for your Probot App.
 * @param {import('probot').Application} app - Probot's Application class.
 */
// module.exports = app => {
//   // Your code here
//   app.log('Yay, the app was loaded!')

//   app.on('issues.opened', async context => {
//     const issueComment = context.issue({ body: 'Thanks for opening this issue!' })
//     return context.github.issues.createComment(issueComment)
//   })

//   // For more information on building apps:
//   // https://probot.github.io/docs/

//   // To get your app running against GitHub, see:
//   // https://probot.github.io/docs/development/
// }

const issueMatch = require('./lib/utils.js')
const defaultConfig = require('./lib/defaultConfig.js')

const issueEvents = ['issues.opened', 'issues.edited', 'issues.reopened']
// const prEvents = ['pull_requrest.opened', 'pull_requrest.edited', 'reopened']

module.exports = app => {
  app.on(issueEvents, async context => {
    const repoConfig = await context.config('issue_template.yml')
    const config = Object.assign({}, defaultConfig, repoConfig)
    const issueBody = context.payload.issue.body
    const params = {
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      number: context.payload.issue.number
    }
    if (!issueMatch(issueBody, config.issueConfigs)) {
      const issueComment = context.issue({ body: config.comments.closeIssue })
      context.github.issues.createComment(issueComment)
      return context.github.issues.edit({
        ...params,
        state: 'closed'
      })
    }
    return context.github.issues.edit({
      ...params,
      state: 'open'
    })
  })
  // app.on(prEvents, async context => {

  // })
}

