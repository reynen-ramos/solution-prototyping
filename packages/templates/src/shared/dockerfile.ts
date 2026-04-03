export const nodejsDockerfile = `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE {{port}}
CMD ["npm", "start"]
`;

export const pythonDockerfile = `FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE {{port}}
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "{{port}}"]
`;

export const dotnetDockerfile = `FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
EXPOSE {{port}}
ENV ASPNETCORE_URLS=http://+:{{port}}
ENTRYPOINT ["dotnet", "{{serviceName}}.dll"]
`;

export const reactDockerfile = `FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
`;

export const postgresDockerfile = `FROM postgres:16-alpine
COPY schema.sql /docker-entrypoint-initdb.d/01-schema.sql
`;

export const sqlserverDockerfile = `FROM mcr.microsoft.com/mssql/server:2022-latest
COPY schema.sql /schema.sql
`;
