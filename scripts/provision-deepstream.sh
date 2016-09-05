#sudo wget https://bintray.com/deepstreamio/rpm/rpm -O /etc/yum.repos.d/bintray-deepstreamio-rpm.repo
#sudo yum install -y deepstream.io
curl https://rpm.nodesource.com/setup_4.x -o setup_4.x
chmod +x setup_4.x
sudo ./setup_4.x
sudo yum install -y nodejs git
git clone https://github.com/deepstreamIO/deepstream.io.git
sudo npm install -g pm2
pm2 start deepstream