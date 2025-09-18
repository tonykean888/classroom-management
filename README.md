# Student Management System

A comprehensive application for managing students and classrooms, built with NestJS (API), React (Frontend), GraphQL, TypeORM, and MySQL.

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

This project is built using the Nx monorepo structure, which provides a powerful set of tools for managing and developing multiple applications and libraries within a single workspace.

## System Requirements

- **Node.js**: v18.x or higher (recommended: v18.16.0)
- **npm**: v9.x or higher
- **MySQL**: v8.x or higher

## Project Structure

```
student-management/
├── api/               # NestJS backend API with GraphQL
├── api-e2e/           # API end-to-end tests
├── frontend/          # React frontend application
├── frontend-e2e/      # Frontend end-to-end tests
├── docs/              # Project documentation
└── packages/          # Shared packages/libraries
```

## Getting Started

### Prerequisites

1. Make sure you have Node.js installed (v18.x or higher)

   ```sh
   node --version
   ```

2. Make sure you have MySQL installed and running

   ```sh
   mysql --version
   ```

3. Create a MySQL database for the project
   ```sh
   mysql -u root -p
   CREATE DATABASE student_management;
   exit;
   ```

### Installation

1. Clone the repository

   ```sh
   git clone https://github.com/yourusername/student-management.git
   cd student-management
   ```

2. Install dependencies

   ```sh
   npm install
   ```

3. Set up environment variables

   - Create a `.env` file in the root directory and in the `/api` directory with the following content (adjust values according to your setup):

   ```sh
   # api/.env
   DATABASE_HOST=localhost
   DATABASE_PORT=3306
   DATABASE_USERNAME=root
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=student_management
   PORT=3000
   ```

### Running the Application

1. Start both the API and frontend in development mode

   ```sh
   npm run dev
   ```

   This will run:

   - API on http://localhost:3000/api
   - GraphQL Playground on http://localhost:3000/graphql
   - Frontend on http://localhost:4200

2. Or run each application separately:

   Start the API only:

   ```sh
   npm run start:api
   ```

   Start the frontend only:

   ```sh
   npm run start:frontend
   ```

### Building for Production

1. Build the entire application

   ```sh
   npm run build
   ```

2. Or build each application separately:

   ```sh
   npm run build:api
   npm run build:frontend
   ```

3. The build artifacts will be stored in the `dist/` directory.

## Features

- **Student Management**: Add, edit, delete and view students
- **Classroom Management**: Create and manage classrooms
- **Student-Classroom Assignment**: Assign and remove students from classrooms
- **Dashboard**: View summary statistics of students and classrooms
- **GraphQL API**: Access data through a flexible GraphQL API

## Database Schema

The application uses the following main entities:

- **Student**: Manages student information
- **Classroom**: Manages classroom data
- **Gender**: Provides gender options for students
- **GradeLevel**: Manages grade levels
- **Prefix**: Manages name prefixes (Mr., Ms., etc.)
- **StudentClassroom**: Junction table for student-classroom assignments

## Testing

1. Run all tests

   ```sh
   npm run test
   ```

2. Run specific tests

   ```sh
   npm run test:api
   npm run test:frontend
   ```

3. Run end-to-end tests
   ```sh
   npm run e2e
   ```

## Other Available Commands

- **Lint code**

  ```sh
  npm run lint
  ```

- **Format code**

  ```sh
  npm run format
  ```

- **View dependency graph**
  ```sh
  npm run dep-graph
  ```

## Troubleshooting

- **Database connection issues**: Verify your MySQL server is running and check the credentials in your .env file
- **Port conflicts**: If ports 3000 or 4200 are already in use, you can modify the ports in the .env file

## Technical Details

- **Backend**: NestJS with GraphQL (code-first approach), TypeORM for database operations
- **Frontend**: React with Apollo Client, Ant Design for UI components
- **Database**: MySQL
- **Development Tools**: Nx monorepo, TypeScript, ESLint, Jest

## License

This project is licensed under the MIT License - see the LICENSE file for details.

```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Versioning and releasing

To version and release the library use

```

npx nx release

````

Pass `--dry-run` to see what would happen without actually releasing the library.

[Learn more about Nx release &raquo;](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Keep TypeScript project references up to date

Nx automatically updates TypeScript [project references](https://www.typescriptlang.org/docs/handbook/project-references.html) in `tsconfig.json` files to ensure they remain accurate based on your project dependencies (`import` or `require` statements). This sync is automatically done when running tasks such as `build` or `typecheck`, which require updated references to function correctly.

To manually trigger the process to sync the project graph dependencies information to the TypeScript project references, run the following command:

```sh
npx nx sync
````

You can enforce that the TypeScript project references are always in the correct state when running in CI by adding a step to your CI job configuration that runs the following command:

```sh
npx nx sync:check
```

[Learn more about nx sync](https://nx.dev/reference/nx-commands#sync)

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/js?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:

- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
