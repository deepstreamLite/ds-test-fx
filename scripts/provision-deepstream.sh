sudo wget https://bintray.com/deepstreamio/rpm/rpm -O /etc/yum.repos.d/bintray-deepstreamio-rpm.repo
sudo yum install -y deepstream.io
wget https://rpm.nodesource.com/setup_6.x
chmod +x setup_6.x
sudo ./setup_6.x
sudo yum install -y nodejs
sudo npm install -g pm2
pm2 start deepstream