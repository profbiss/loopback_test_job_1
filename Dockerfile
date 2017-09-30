FROM node:latest

WORKDIR /app

RUN groupmod -g 1001 node \
  && usermod -u 1001 -g 1001 node

RUN adduser --disabled-password --gecos '' --uid 1000 docker && \
  adduser docker sudo && \
  echo 'docker ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers && \
  chown -R docker:docker /app

RUN npm install -g --unsafe-perm loopback-cli

USER docker

ENTRYPOINT ["npm", "start"]
CMD []