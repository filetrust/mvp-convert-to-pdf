# ******** Docker image for: client

FROM    node
WORKDIR /home/node
COPY    package.json .
RUN     npm install
COPY    . .

EXPOSE  5443

CMD npm start
