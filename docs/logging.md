## Winston logger
### General overview
Our logger is built on top of `winston` logger and it writes three types of logs:
- all express requests log: 'express.%DATE%.log'
- iviche detailed log: 'iviche.%DATE%.log'
- iviche errors log: 'iviche-errors.%DATE%.log'

Logging configuration is stored at `${project-root}/config/loggerConfig.ts`

All logs are written in JSON format and mainly needed for machine, reading rather than human debug.

Express log includes information about requests and mainly needed for performance review and health check.
Express log is controlled by env var `LOGGING_EXPRESS_REQ_LEVEL` and can be disabled by `LOGGING_EXPRESS_REQ_LEVEL=off`.

Log `iviche` includes all messages and also those that are written into log `iviche-errors`.
Log `iviche` is needed for debug, while `iviche-errors` serves to exception registration.
Log `iviche-errors` is always enabled. Log `iviche` is controlled by env var `LOGGING_LEVEL` and can be disable by
`LOGGING_LEVEL=off`.

### Development logging
#### Console logging
Server contains console logger that is configured dynamically, when `NODE_ENV=development`.
Console logger writes records in human readable format with level `LOGGING_LEVEL` from env vars directly into console.
Console doesn't prevent writing the same information into the main three logs.

#### Knex query logging
Knex is currently configured to log queries with logging level `silly`. If you need to see knex queries,
enable silly logging level with `LOGGING_LEVEL=silly`.

### Logging recommendation
#### Main logging levels
Two main logging levels are `error` and `debug`.

Logging messages usually should describe start and finish (and sometimes intermediate states) of some operation with
level `debug`. Debug logging level is helpful for understanding server behavior and finding a place to start debugging.

Caught errors must be logged with level `error`. However, if an error is rethrown, it must be logged with logging level
`debug`, to avoid double error registration within logs.

#### Messages format
Logging message should contain machine readable message that mainly describes the point,
where the message has been logged. Write logging messages with idea that an automatic tool must be able
to group messages by the provided key and even found common prefixes there.
For example, AuthenticationProvider, start of jwt authentication process: `logger.debug('auth.provider.jwt.start')`

Parameter-object of a logging message is named `meta`. Logging-meta must be passed, as parameters of the logging method.
For example, a user mistake within AuthenticationProvider: `logger.debug('auth.provider.jwt.user-mistake:', info)`

Errors must be logged with error-object, as logging-meta passed to parameters.
For example, error within AuthenticationProvider: `logger.error('auth.provider.jwt.error:', serverErr)`

Pay attention that Winston logger automatically copies field `message` and adds it to the logging message,
if this field is present within the `meta`. By default all Errors have field `message`, so it is copied.
If a raw `meta` has field `message`, it will be added to the logging message.
Don't forget to use `:` in the end of your logging message, to delimit logging message and human-readable message.          

#### About logging levels
There are following logging levels:
- off
- error
- warn
- info
- verbose
- debug
- silly

Logging level `silly` is the most detailed and includes all levels above it.

Logging level `debug` is one of the main logging levels. Usually, enabled on `dev` and `stage` servers, but disabled
on `prod` servers.

Logging level `verbose` is needed to describe a complex business process, which is higher, than `debug`,
and is needed to have some distinction with `debug`.

Logging level `info` is used to register general successful events of the server:
`configuration initialized`, `server started`, etc.

Logging level `warn` is used to register errors that doesn't lead to system crush, but can lead to any other mistakes.
For example, `WARN: SMTP connection cannot be established`. SMTP error doesn't lead to server crush,
but emails won't work.

Logging level `error` is one of the main logging levels and it is used to register caught errors or any abnormal cases,
corresponds to HTTP statuses 5xx, but is not limited by HTTP statuses.

Logging level `off` is needed to disable logging.