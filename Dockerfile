FROM node:24-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# need to remove when we use dev command
# RUN npm run build 

EXPOSE 3000

# CMD ["node", "dist/index.js"]
CMD ["npm", "run", "dev"]