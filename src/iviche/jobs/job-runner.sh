job_name=$1
message="background task ${job_name} is running...";
if [ "$NODE_ENV" = "development" ]
then
    echo "$message" MODE: development
    ts-node src/iviche/jobs/"$1".ts
elif [ "$NODE_ENV" = "production" ]
then
    echo "$message" MODE: production
    node build/src/iviche/jobs/"$1".js
fi