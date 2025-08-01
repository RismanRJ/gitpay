const request = require('./request')
const constants = require('./constants')
const i18n = require('i18n')
const emailTemplate = require('./templates/base-content')

const Sendmail = {
  success: (user, subject, msg) => {},
  error: (to, subject, msg) => {}
}

if (constants.canSendEmail) {
  Sendmail.success = (user, subject, msg) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    user?.receiveNotifications && request(
      to,
      subject,
      [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(msg)
        }
      ]
    )
  }

  Sendmail.error = (user, subject, msg) => {
    const to = user.email
    const language = user.language || 'en'
    i18n.setLocale(language)
    user?.receiveNotifications && request(
      to,
      subject,
      [
        {
          type: 'text/html',
          value: emailTemplate.baseContentEmailTemplate(msg)
        }
      ]
    )
  }
}

module.exports = Sendmail
