### Knex
Install knex globally or use knex from node_modules.

- 1 packet initialization
  ```shell script
  knex init -x ts
  ```
- 2 Configurate knexfile - set migration path.
- 3 Create Migration command
  ```shell script
  knex migrate:make migration_name -x ts
  ```
- 4 Run migrate
  ```shell script
  knex migrate:latest
  ```
- 5 Rollbacks
  ```shell script
  knex migrate:rollback //or knex migrate:rollback --all
  ```
- 6 Create Seed command
  ```shell script
  knex seed:make testseed
  ```
- 7 Seed
  ```shell script
   knex seed:run //or knex seed:run --specific=seed-filename.js
  ```
