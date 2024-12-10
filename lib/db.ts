import postgres from "postgres";

const sql = postgres("", {
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  max: 10, // Max number of connections
  idle_timeout: 20, // Max idle time for a connection
});
export default sql;
