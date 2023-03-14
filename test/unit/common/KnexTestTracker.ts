import knex, * as Knex from 'knex'
import mockKnex, { QueryDetails, Tracker } from 'mock-knex'

export class KnexTestTracker {
  private readonly knexTracker: Tracker
  private readonly db: Knex
  private collectedQueries: Array<string> = []
  private expectedQueries: Array<string> = []
  private successful = false

  constructor() {
    this.db = knex({ client: 'pg' })
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    mockKnex.mock(this.db)

    this.knexTracker = mockKnex.getTracker()
  }

  public getTestConnection(): Knex {
    return this.db
  }

  public install(): void {
    this.knexTracker.install()
  }

  public uninstall(): void {
    this.knexTracker.uninstall()
    this.verifyMocks()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public mockSQL(req: Array<string> | string, res: Array<any> | any, successful = true): void {
    if (typeof req === 'string') {
      this.doMockSQL([req], [res], successful)
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.doMockSQL(req as Array<string>, res as Array<any>, successful)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private doMockSQL(req: Array<string>, res: Array<any>, successful = true): void {
    this.collectedQueries = []
    this.expectedQueries = [...req]
    this.successful = successful

    this.knexTracker.on('query', (query: QueryDetails, step: number) => {
      if (step === 1) {
        // Transaction start
        this.collectedQueries.push(query.sql)
        query.response({ action: 'TRX START' })
      } else if (step < req.length + 2) {
        this.collectedQueries.push(query.sql)
        query.response(res[step - 2])
      } else if (step === req.length + 2) {
        this.collectedQueries.push(query.sql)
        // Transaction end
        query.response({ action: 'TRX END' })
      }
    })
  }

  private verifyMocks(): void {
    this.collectedQueries.forEach((query, step) => {
      if (step === 0) {
        // Transaction start
        expect(query).toBe('BEGIN;')
      } else if (step < this.expectedQueries.length + 1) {
        expect(query).toBe(this.expectedQueries[step - 1])
      } else if (step === this.expectedQueries.length + 1) {
        // Transaction end
        expect(query).toBe(`${this.successful ? 'COMMIT;' : 'ROLLBACK'}`)
      }
    })
  }
}
