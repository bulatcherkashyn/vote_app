# iViche portal back-end
NodeJS voting portal. Communication to the portal is done over REST API. 
- Express
- Knex
- PostgreSQL

## Before start
`docker` and `docker-compose` should to be installed

Knex requires Node.js version 12.0 or newer.
Check your Node.js version using `node -v`, and if your version lower, than 12.0 update it.

## Run in production
Run within terminal script `run-production.sh` to launch databases.

API server should be available at [localhost:8080](http://localhost:8080)

Actualize database, if needed. See below.

## Run in development
Run within terminal script `run-services.sh` to launch databases.

Actualize database, if needed.  See below.

Start server:
```shell script
npm start
```

## Actualize database
When database is up an running (launch PostgreSQL or launch docker)
```shell script
npm run migrate:latest
```

## Tests
- Apply `npm test` for unit tests
- Apply `npm run test:i9n` for integration tests
- Add `:coverage` to check tests coverage (Look at package.json)

## Manual tests
[Postman](https://www.getpostman.com/downloads/) is a nice tool for testing REST API.
 
## Best Practices and Guides
Test your code for sync blocks with (Development mode only):
```shell script
npm start --trace-sync-io
```

## More documentation
See folder `./docs/`

## TODO
