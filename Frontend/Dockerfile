FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install && npm install --save-dev @vitejs/plugin-react

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]