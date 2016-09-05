aws ecr get-login --region eu-west-1 | sh
docker build -t ds_test_fx_clients .
docker tag ds_test_fx_clients:latest 277026727916.dkr.ecr.eu-west-1.amazonaws.com/ds_test_fx_clients:latest
docker push 277026727916.dkr.ecr.eu-west-1.amazonaws.com/ds_test_fx_clients:latest
