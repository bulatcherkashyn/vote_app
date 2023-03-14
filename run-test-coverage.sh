set -e
    COMPOSE_HTTP_TIMEOUT=600 docker-compose -f docker/docker-compose.coverage.yml up --exit-code-from=node --force-recreate --renew-anon-volumes; echo $?
