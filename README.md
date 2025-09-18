# Student Management System


## System Requirements

- **Node.js**: v24.x or higher (recommended: v24.7.0)


## Project Structure

```
student-management/
├── api/               # NestJS backend API with GraphQL
├── api-e2e/           # API end-to-end tests
├── frontend/          # React frontend application
├── frontend-e2e/      # Frontend end-to-end tests
└── packages/          # Shared packages/libraries
```

## Getting Started

### Prerequisites

1. Make sure you have Node.js installed (v24.x or higher)

   ```sh
   node --version
   ```
### Installation

1. Clone the repository

   ```sh
   git clone https://github.com/tonykean888/classroom-management.git
   cd classroom-management
   ```

2. Install dependencies

   ```sh
   npm install
   ```

3. Set up environment variables

   - Create a `.env` file in the root directory 

   ```sh
   # .env
    DB_HOST=locahost
    DB_PORT=3306
    DB_USER=username
    DB_PASSWORD=your-password
    DB_NAME=your-database
    DB_SYNC=true
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



