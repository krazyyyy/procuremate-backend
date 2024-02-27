
export interface SQLColumn {
  type: string | 'INT' | 'VARCHAR' | 'TEXT' | 'BOOLEAN' | 'CHAR' | 'JSONB' | 'JSON',
  name: string,
}

export function sqlTableAlter(tableName: string, columns: SQLColumn[], type: 'drop' | 'add' = 'add') {
  let query = '';
  query = `ALTER TABLE "${tableName}" `;
  for (let index in columns) {
    const col = columns[index];
    if (type === 'drop') {
      query += `DROP COLUMN IF EXISTS "${col.name}" ${col.type}`
    } else {
      query += `ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type}`
    }
    if (Number(index) < (columns.length - 1)) {
      query += ', '
    }
  }
  return query;
}