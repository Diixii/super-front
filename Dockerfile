FROM node:19-alpine

RUN npx create-react-app ai-site
WORKDIR /ai-site
COPY public ./public
COPY src ./src
COPY npmlist.json ./npmlist.json
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json 
RUN npm install
EXPOSE 3000

CMD [ "npm", "start" ]

