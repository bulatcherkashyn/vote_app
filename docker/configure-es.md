Configuration files must be readable by the elasticsearch user
By default, Elasticsearch runs inside the container as user elasticsearch using uid:gid 1000:1000.
```shell script
sudo chmod g+rwx elastic_data
sudo chgrp -R 1000 elastic_data
sudo chown -R 1000 elastic_data

sudo chmod g+rwx plugins
sudo chgrp -R 1000 plugins
sudo chown -R 1000 plugins
```
