# ******** Docker image for: api

FROM    node
WORKDIR /home/node

#install docker client
RUN apt-get update
RUN apt-get -y install libreoffice

#install node dependencies
COPY    package.json .
RUN     npm install
COPY    . .
EXPOSE  4443

CMD npm start
