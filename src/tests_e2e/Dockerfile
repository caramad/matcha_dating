FROM cypress/base

WORKDIR /tests

COPY package.json package-lock.json ./

RUN npm install

# Ensure Cypress installation is verified
RUN npx cypress verify

EXPOSE 8080

CMD ["npm", "run", "test"]