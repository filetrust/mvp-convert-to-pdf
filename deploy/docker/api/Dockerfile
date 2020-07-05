# ******** Docker image for: api

FROM    node
WORKDIR /home/node

#install docker client
RUN apt-get update
RUN apt-get -y install libreoffice
RUN apt-get install build-essential
RUN wget https://www.imagemagick.org/download/ImageMagick.tar.gz
RUN tar xvzf ImageMagick.tar.gz
RUN cd ImageMagick-7.0.10-23
RUN ./configure
RUN make
RUN make install
RUN ldconfig /usr/local/lib
RUN magick -version
#install node dependencies
COPY    package.json .
RUN     npm install
COPY    . .
EXPOSE  4443

CMD npm start
