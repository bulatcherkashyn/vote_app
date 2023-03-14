class MailMessage {
  public text = ''
  public subject = ''
  public html = ''

  public constructor(init: Partial<MailMessage>) {
    Object.assign(this, init)
  }
}

export default MailMessage
