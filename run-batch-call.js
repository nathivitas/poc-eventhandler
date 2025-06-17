import mysql from "mysql2/promise";
import axios from "axios";

const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const API_HOST = process.env.API_HOST || "http://localhost:3000";
const API_ENDPOINT = `${API_HOST}/fulfill/status`;

try {
  const [rows] = await db.execute("SELECT mc_id FROM enhanced_profile_statuses WHERE ep_status != 'Complete'");
  console.log(`🟡 Found ${rows.length} incomplete rows`);

  for (const row of rows) {
    try {
      const res = await axios.post(API_ENDPOINT, { mc_id: row.mc_id });
      console.log(`✅ Sent ${row.mc_id} → status ${res.status}`);
    } catch (err) {
      console.error(`❌ Failed ${row.mc_id}: ${err.message}`);
    }
  }

  await db.end();
} catch (err) {
  console.error("🔥 Error:", err.message);
}
