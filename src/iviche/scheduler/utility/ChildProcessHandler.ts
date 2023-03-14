import { spawn } from 'child_process'
import path from 'path'

import { logger } from '../../logger/LoggerFactory'

export class ChildProcessHandler {
  public static runScript(fileName: string, loggerTitle = 'ChildProcessHandler'): void {
    logger.debug(`${loggerTitle}.start`)

    const scriptPath = path.join(process.cwd(), 'src/iviche/jobs/job-runner.sh')
    const script = spawn('sh', [scriptPath, fileName])
    script.stdout.on('data', function(data) {
      process.stdout.write(`${data}`)
    })

    script.on('close', () => {
      logger.debug(`${loggerTitle}.done`)
    })
  }
}
