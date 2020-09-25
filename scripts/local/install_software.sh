#!/bin/bash

# Ubuntu 18 machine

# Docker and docker-compose
sudo apt install docker docker-compose -y

# # Docker
# sudo apt update
# sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
# curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
# sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
# sudo apt update
# apt-cache policy docker-ce
# sudo apt install -y docker-ce
# sudo systemctl status docker

sudo usermod -aG docker ${USER}

# # Docker Compose
# sudo curl -L https://github.com/docker/compose/releases/download/1.25.4/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
# sudo chmod +x /usr/local/bin/docker-compose
# docker-compose --version

# nvm with latest node and npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
# Close and open terminal again
nvm install node