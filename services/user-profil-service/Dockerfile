FROM node:16

RUN apt-get update -y && \
    apt-get install -y git

WORKDIR /app

RUN git clone https://github.com/yabain/y-legal-indexeur.git .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["node" ,"dist/src/main.js"]