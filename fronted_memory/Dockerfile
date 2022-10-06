FROM node:alpine
WORKDIR /frontend
COPY package.json /frontend
COPY package-lock.json /frontend
COPY . .
RUN npm i
CMD ["npm","start"]
