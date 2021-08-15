# pull the official base image
FROM node: alpine
# set working direction
WORKDIR /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
# install application dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm i
# add app
COPY . ./

EXPOSE 3000

CMD ["npm","start"]
# RUN npm i -g serve
# RUN npm run build

# EXPOSE 5000
# # start app
# CMD ["serve", "-s", "build"]