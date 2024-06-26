# Arithmetic Calculator REST API

This project harnesses Next.js, Tailwind CSS, and PostgreSQL to create a robust web application. By utilizing Next.js API features, it streamlines both backend and frontend development, saving significant development time.

## Features

- **Next.js API Routes**: Utilized for building backend APIs, reducing development time.
- **Unit Tests**: Unit tests are included to validate the functionality of critical components, including API routes, service layers, and utility functions.
- **Pagination**: Implementing pagination for better user experience and optimized data loading.
- **PostgreSQL**: Relational database for storing application data.
- **Tailwind CSS**: Utility-first CSS framework for styling components.
- **JWT Authentication**: Used JWT-based authentication for securing API endpoints.
- **Deployment on Vercel**: Project deployment is facilitated using Vercel's free service account, ensuring seamless hosting and scaling capabilities.

## Improvements and Future Enhancements

- **State Management**: Consider integrating context or Redux for efficient state management across components.
- **OAuth Integration**: Explore integrating OAuth-based authentication for seamless user authentication via third-party providers.
- **Server Framework for AWS**: Evaluate using server frameworks like Express.js or Nest.js for backend APIs, facilitating deployment on AWS services.
- **Containerization**: Dockerize PostgreSQL to streamline local development setup and testing.
- **Dependency Injection**: Evaluate using Dependency Injection (DI) to reduced coupling, enhance testability and maintainability of service layers.
- **ORM Implementation**: Use an ORM (Object-Relational Mapping) like TypeORM or Sequelize to mitigate SQL injection vulnerabilities and simplify database interactions.

## Deployment

The application will be deployed using Vercel's free service account, leveraging its seamless integration with Next.js.

## Getting Started

To run the project locally:

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up PostgreSQL and configure connection details in `.env.local` file.
4. Run the application using `npm run dev`.
5. Access the application at `http://localhost:3000`.
6. Access the API at `http://localhost:3000/api/v1/`.

### Environment Variables

- `DB_HOST`: Hostname or IP address of the database server
- `DB_USER`: Database username
- `DB_PASSWORD`: Password for the database user
- `DB_NAME`: Name of the database
- `DB_PORT`: Port number on which the database server is listening
- `JWT_SECRET`: Secret key used for JWT token signing and verification
- `DEFAULT_USER_BALANCE`: Default balance amount assigned to new users
- `URL_RANDOM_STR_SERVICE`: URL endpoint or service location for generating random strings


#### Login Screen

![Login Screen](./screenshots/login-screen.png)

#### Account Screen

![Account Screen](./screenshots/account-screen.png)

#### Calculator Screen

![Account Screen](./screenshots/calculator-screen.png)
