/* eslint-disable */
const fs = require('fs')
const git = require('simple-git/promise')

const endOfLine = '\n'

async function readGitUser(param) {
  let useremail = await git().raw(['config', param])
  if (!useremail) {
    useremail = await git().raw(['config', '--global', param])
  }

  return useremail.trim()
}

async function verifyCommitAuthor() {
  const NAME_PATTERN = /^[A-Z][a-z]{2,} [A-Z][a-z]{2,}$/
  const EMAIL_PATTERN = /^[a-z]{3,}\.[a-z]{3,}@dewais.com$/

  const username = await readGitUser('user.name')
  if (!NAME_PATTERN.test(username)) {
    console.error('COMMIT MESSAGE ERROR:\n'
      + `Inappropriate username [${username}].`
      + ' Username should include first name and last name, separated by space.'
      + ' Each word should start from a capital letter. For example: "Firstname Lastname", "John Johnson", etc.\n\n'
      + 'USE:>git config user.name "Firstname Lastname"'
    )
    return false
  }

  const useremail = await readGitUser('user.email')
  if (!EMAIL_PATTERN.test(useremail)) {
    console.error('COMMIT MESSAGE ERROR:\n'
      + `Inappropriate user email [${useremail}].`
      + ' User email should include first name and last name, separated by dot.'
      + ' Email should be in lowercase. Only @dewais.com emails are allowed.'
      + ' For example: "firstname.lastname@dewais.com", "john.johnson@dewais.com", etc.\n\n'
      + 'USE: >git config user.email "firstname.lastname@dewais.com"'
    )
    return false
  }

  return true
}

async function readCommitMessageLines() {
  try {
    const commitMessage = fs.readFileSync(
      Buffer.from(process.env.HUSKY_GIT_PARAMS)
    ).toString("UTF8")

    const lines = commitMessage.split(endOfLine)

    // cleanup last line
    if (!lines[lines.length - 1]) {
      lines.pop()
    }

    return lines
  } catch (err) {
    console.error("Cannot read git commit message file", err)
    process.exit(-1)
  }
}

async function checkCommitMessage() {
  const COMMIT_MESSAGE_HEADER_PATTERN = /^(T-[a-z0-9]{6})|(IV-[0-9]{2,6})|(IVW-[0-9]{2,6}): .*$/
  const MERGE_MESSAGE_HEADER_PATTERN = /^(Merge|Merged)+ .*$/

  const lines = await readCommitMessageLines()

  if (lines.length === 1 || lines.length >= 3) {
    const commitMessageHeader = lines[0]
    if (!COMMIT_MESSAGE_HEADER_PATTERN.test(commitMessageHeader)
      && !MERGE_MESSAGE_HEADER_PATTERN.test(commitMessageHeader)
      || commitMessageHeader.length > 72) {
      // Header doesn't include ticket number or 'merged', or header is too long
      return false
    } else if (lines.length > 1 && !!lines[1]) {
      // Second line is not empty
      return false
    }

    return true
  } else {
    // Commit message must be one line or at least three lines : header + (empty line) + body
    return false
  }
}

async function verifyCommitMessage() {
  const commitMessageValid = await checkCommitMessage()
  if (!commitMessageValid) {
    console.error('COMMIT MESSAGE ERROR:\n'
      + 'Commit message should start a from ticket number or a merge request and should not be longer than 72 symbols.'
      + ' Long description can be put into commit message after an empty line.\n'
      + 'Example 1:\n'
      + 'T-1ab2cd: My commit message\n\n'
      + 'Example 2:\n'
      + 'T-1ab2cd: My commit message\n\n'
      + 'This is detailed commit message\n\n'
      + 'Example 3:\n'
      + 'Merged in feature/auth/T-1wem1x\n'
    )
    return false
  }
  return true
}

async function verifyCommit() {
  const authorValid = await verifyCommitAuthor()
  const messageValid = await verifyCommitMessage()
  if (!messageValid || !authorValid) {
    process.exit(-1)
  }
}

verifyCommit()
  .catch(error => {
    console.error(error)
    process.exit(-1)
  })
