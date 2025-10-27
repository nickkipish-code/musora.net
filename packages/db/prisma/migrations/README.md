This directory will contain Prisma migrations when you run `pnpm db:migrate`.

To create production-ready migrations:

1. Ensure `DATABASE_URL` points to your development DB.
2. Make schema changes in `packages/db/prisma/schema.prisma`.
3. Run `pnpm db:migrate` to create migration files.
4. Review generated SQL in `prisma/migrations` and commit.

For production: run `prisma migrate deploy` on your production host.


