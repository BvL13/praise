FROM node:18.15

# Create app directory
WORKDIR /usr/src/

# Copy workspace config
COPY ./package*.json .
COPY ./.yarnrc.yml .
COPY ./yarn.lock .
COPY ./.yarn ./.yarn

# Copy packages
COPY ./packages/api ./packages/api

# Install dependencies
RUN corepack enable
RUN yarn

# Run the app
CMD ["yarn", "api:start"]


