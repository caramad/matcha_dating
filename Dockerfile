FROM node
WORKDIR /matcha_dating
COPY package.json /app
RUN npm install
COPY . /matcha_dating
CMD ["node", "app.js"]
