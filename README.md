Project Documentation

Overview

This project demonstrates a comprehensive implementation of a NestJS application with the following features:

User Authentication and Authorization: JWT-based authentication, role-based access control (Admin, Manager, Member).

Projects Module: CRUD operations for managing projects, with support for pagination and role-based project visibility.

Tasks Module: Task creation and management with Redis caching for summaries and analytics.

Features and Endpoints

1. User Module

Authentication and Authorization

Sign Up: POST /api/v1/users/signup

Creates a new user with hashed password.

Request body:

{
"fullName": "John Doe",
"email": "john@example.com",
"password": "password123",
"role": "member"
}

Login: POST /api/v1/users/login

Validates user credentials and returns a JWT token.

Request body:

{
"email": "john@example.com",
"password": "password123"
}

2. Projects Module

Features

Create Project: POST /api/v1/projects

Role-based access: Only Admin and Manager roles can create projects.

Get All Projects: GET /api/v1/projects

Pagination support using page and limit query parameters.

Visibility based on roles:

Admin: All projects.

Manager: Projects managed by the user.

Member: Projects the user is a member of.

Request example: GET /api/v1/projects?page=1&limit=10

3. Tasks Module

Features

Task Completion Summary: GET /api/v1/tasks/summary

Provides a count of tasks grouped by status (e.g., To Do, In Progress, Completed).

Uses Redis caching to improve performance.

Overdue Tasks Summary: GET /api/v1/tasks/overdue

Lists overdue tasks grouped by project.

Uses Redis caching. But to implement the update of redis you can setup the endpoint of create tasks and can delete existing cache and create new one or can update the cache as of your logic.

Project Task Summary: GET /api/v1/tasks/project-summary/:projectId

Provides task breakdown by status and member contribution.

Installation

Clone the repository:

git clone <repository-url>
cd <repository-name>

Install dependencies:

npm install

Set up environment variables:

Create a .env file in the root directory.

Add the following variables:

PORT=3000
DB_URL=
JWT_SECRET=your_jwt_secret
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
SECRET=

Run Redis server or ensure it's accessible at the specified host and port.

Running the Application

Start the application:

npm run start

Access the application at:

http://localhost:3000/api/v1
