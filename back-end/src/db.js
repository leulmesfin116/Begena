import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  host: "db",
  port: "5007",
  user: "Leul Mesfin",
  password: "begena#116",
  database: "db116",
});
export default pool;
