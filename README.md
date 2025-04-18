# core

This is the backend NestJS application configured to use TypeORM with a MySQL database. This README provides detailed instructions on how to set up and run the application.

## Prerequisites

Before running the application, ensure you have the following installed:

-   Node.js (v20.x or later)
-   npm (v10.x or later)
-   MySQL (v8.x.x or higher)

## Getting Started

1. **Clone the Repository**

```sh
$ git clone https://github.com/{elhay-backend-repo}.git
$ cd core
```

2. **Install Dependencies**

```sh
$ npm install
```

3. **Configure Environment Variables**

Create a .env file in the root directory of the project. You can use the .env.sample file as a template:

```sh
cp .env.sample .env
```

Fill in the necessary environment variables in the .env file:

```sh
DATABASE_HOST="localhost"
DATABASE_PORT="3306"
DATABASE_USER="your username"
DATABASE_PASS="your password"
DATABASE_NAME="your database name"
```

4. **Database Setup**

Ensure your MySQL server is running and the database credentials are specified in the `.env`. You can create the database using the MySQL command line or any database management tool.

4b. **Database migrations**

Generate migrations:

```sh
  npm run migration:generate -- -d ./typeorm.factory.ts src/migrations/{migration name}
```

Run migrations:

```sh
  npm run migration:run -- -d ./typeorm.factory.ts
```

Undo last migrations:

```sh
  npm run migration:revert -- -d ./typeorm.factory.ts
```

5. **Running the Application**

To run the application, use the following command:

```sh
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

This will start the NestJS application, and it should connect to the MySQL database using TypeORM.

## Interactive API documentation (Swagger)

The endpoints are documented and can be tested using swagger.
Swagger gives us an interface to make requests to the api & visualize its response(s).

While the application is running in development mode navigate to the following address to interact with the application via the swagger interface:

```
http://localhost:3001/api#/
```

## TypeORM

This project uses TypeORM as the ORM for database interactions. The out-of-the-box NestJS TypeORM package specifically.

For more information on the package, refer to this [documentation](https://docs.nestjs.com/techniques/database#typeorm-integration).

## NestJS Framework

This project is built with NestJS, a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. For more information on NestJS, refer to their [documentation](https://docs.nestjs.com).
