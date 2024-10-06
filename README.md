# Universal Converter API

A small and simple API to compare the total volume of two objects and convert between them.

e.g How many bees is 1 Olympic Swimming Pool? (~840 million)

## Development

### 1. Setup the Database

You will need a local Postgres database running
Add the DATABASUE_URL in an `.env` file in the root of the project:

```bash
DATABASE_URL=<database_url>
```

### 2. Setup Auth (Clerk)

You will need a publishable and shareable key from clerk, also in the `.env` file:

```bash
CLERK_PUBLISHABLE_KEY=<publishable_key>
CLERK_SECRET_KEY=<secret_key>
```

nb: Auth isn't necessary for public endpoint but because the Clerk plugin is registered at the root of the application it _will_ try and validate these keys when you start up the server.

### 3. Generate the initial prisma client

```shellscript
npm run generate:prisma
```

### 4. Run migrations and seed data

```shellscript
npm run migrate
```

### 5. Run the dev server

This will run both the server and the prisma generate command in watch mode.

```shellscript
npm run dev
```

## Built With

- [Fastify](https://fastify.dev/)
- [Prisma](https://www.prisma.io/)
- [Railway](https://railway.app/)
- [Clerk](https://clerk.com/)
