import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const getConnection = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
};

export const getStatusesByMcId = async (mc_id) => {
  const conn = await getConnection();
  const [rows] = await conn.execute(
    'SELECT * FROM enhanced_profile_statuses WHERE mc_id = ?',
    [mc_id]
  );
  await conn.end();
  return rows;
};

export const updateStatuses = async (mc_id, newStatus) => {
  const conn = await getConnection();
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const [result] = await conn.execute(
    `UPDATE enhanced_profile_statuses
     SET ep_status = ?, created_date = ?, updated_date = ?, ticket_created = ?
     WHERE mc_id = ?`,
    [newStatus, now, now, now, mc_id]
  );

  await conn.end();
  return result.affectedRows;
};
