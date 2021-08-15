FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
ENV PORT 8080
ENV DATABASE insurance_client2
ENV DB_USERNAME postgres
ENV DB_PASSWORD postgres
ENV FRONTEND_URL "http://localhost:3000"
ENV DB_CONNECTION_STRING "postgres://postgres:postgres@localhost:5432/insurance_client2"

RUN npm run build

EXPOSE 8080
CMD [ "npm","run", "dist/index.js" ]