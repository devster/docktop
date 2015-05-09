Add the docker group if it doesn't already exist.

sudo groupadd docker

Add the connected user "${USER}" to the docker group. Change the user name to match your preferred user.

sudo gpasswd -a ${USER} docker

Restart the Docker daemon:

sudo service docker restart

If you are on Ubuntu 14.04 and up use docker.io instead:

sudo service docker.io restart

Either do a newgrp docker or log out/in to activate the changes to groups.
