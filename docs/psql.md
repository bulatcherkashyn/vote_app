## Custom PSQL
Create DB cluster at the new location 
```shell script
su postgres -c '/usr/lib/postgresql/10/bin/initdb -D /usr/local/pgsql/data'
```
Where:
- postgres is your database username
- Path `/usr/lib/postgresql/10/bin/` points to your PostgreSQL bin folder
- Path `/usr/local/pgsql/data` points to the folder with your DB data
- Path `/usr/local/pgsql/log` points to the folder with your DB logs
 
Launch the server with
```shell script
su postgres -c '/usr/lib/postgresql/10/bin/pg_ctl -D /usr/local/pgsql/data -l /usr/local/pgsql/log/dbserver.log start'
```
Where:
- postgres is your database username
- Path `/usr/lib/postgresql/10/bin/` points to your PostgreSQL bin folder
- Path `/usr/local/pgsql/data` points to the folder with your DB data
- Path `/usr/local/pgsql/log` points to the folder with your DB logs

```shell script
su postgres -c '/usr/lib/postgresql/10/bin/pg_ctl -D /usr/local/pgsql/data' stop
```
 
Connect to PSQL and Create DB `iviche_voting`.
```postgresql
CREATE DATABASE iviche_voting OWNER postgres ENCODING 'UTF8';
```

Connect to a remote database (works for Docker)
```shell script
psql -h localhost -p 5432 -U postgres -W iviche_voting
```

Drop all tables from current schema
```sql
DO $$ DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;
```