# To-do-Next.js

To-do application using Next.js with MySQL-based authentication (Prisma).

## Setup

1. Install dependencies:

	```bash
	npm install
	```

2. Create a `.env.local` file in project root:

	```env
	DATABASE_URL="mysql://root:@localhost:3306/todo_next"
	JWT_SECRET=replace-with-a-long-random-secret
	```

3. Create database and tables with Prisma:

	```bash
	npx prisma db push
	```

4. Run the app:

	```bash
	npm run dev
	```

## Auth API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
