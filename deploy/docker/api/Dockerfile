# ******** Docker image for: api

FROM    node
WORKDIR /home/node

#install docker client
RUN apt-get update
RUN apt-get -y install libreoffice
RUN apt-get install build-essential
RUN wget https://www.imagemagick.org/download/ImageMagick.tar.gz
RUN tar xvzf ImageMagick.tar.gz
#RUN cd ImageMagick-7.0.10-23 && ./configure && make && make install && ldconfig /usr/local/lib
RUN apt-get install -y imagemagick
RUN apt-get install -y software-properties-common
#RUN apt-get install python-software-properties
#RUN apt-get install software-properties-common
RUN add-apt-repository ppa:rwky/graphicsmagick
RUN apt-get -y update
RUN apt-get -y install graphicsmagick
RUN magick -version
#install node dependencies
COPY    package.json .
RUN     npm install
COPY    . .
EXPOSE  4443

CMD npm start
