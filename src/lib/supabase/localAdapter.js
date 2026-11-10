import fs from 'fs';
import path from 'path';

const LOCAL_STORE_FILE = path.join(process.cwd(), '.next', 'local_rooms_store.json');

function readStore() {
  try {
    if (fs.existsSync(LOCAL_STORE_FILE)) {
      const content = fs.readFileSync(LOCAL_STORE_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading local rooms store:', err);
  }
  return { rooms: [], room_participants: [] };
}

function writeStore(data) {
  try {
    const dir = path.dirname(LOCAL_STORE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local rooms store:', err);
  }
}

class QueryBuilder {
  constructor(tableName) {
    this.tableName = tableName;
    this.filters = [];
    this.selectedFields = null;
    this.orderConfig = null;
    this.limitCount = null;
    this.operation = 'select'; // 'select', 'insert', 'update', 'delete'
    this.payload = null;
  }

  select(fields = '*') {
    this.selectedFields = fields;
    return this;
  }

  eq(column, value) {
    this.filters.push({ type: 'eq', column, value });
    return this;
  }

  in(column, values) {
    this.filters.push({ type: 'in', column, value: values });
    return this;
  }

  lt(column, value) {
    this.filters.push({ type: 'lt', column, value });
    return this;
  }

  order(column, { ascending = true } = {}) {
    this.orderConfig = { column, ascending };
    return this;
  }

  limit(count) {
    this.limitCount = count;
    return this;
  }

  insert(data) {
    this.operation = 'insert';
    this.payload = data;
    return this;
  }

  update(data) {
    this.operation = 'update';
    this.payload = data;
    return this;
  }

  delete() {
    this.operation = 'delete';
    return this;
  }

  applyFilters(rows) {
    return rows.filter((row) => {
      for (const f of this.filters) {
        if (f.type === 'eq' && row[f.column] !== f.value) return false;
        if (f.type === 'in' && Array.isArray(f.value) && !f.value.includes(row[f.column])) return false;
        if (f.type === 'lt' && !(row[f.column] < f.value)) return false;
      }
      return true;
    });
  }

  async execute() {
    const store = readStore();
    const table = store[this.tableName] || [];

    if (this.operation === 'insert') {
      const toInsert = Array.isArray(this.payload) ? this.payload : [this.payload];
      const inserted = toInsert.map((item) => ({
        id: item.id || `loc_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        created_at: item.created_at || new Date().toISOString(),
        ...item,
      }));

      store[this.tableName] = [...table, ...inserted];
      writeStore(store);

      const result = Array.isArray(this.payload) ? inserted : inserted[0];
      return { data: result, error: null };
    }

    if (this.operation === 'update') {
      let updatedCount = 0;
      store[this.tableName] = table.map((row) => {
        let matches = true;
        for (const f of this.filters) {
          if (f.type === 'eq' && row[f.column] !== f.value) matches = false;
        }
        if (matches) {
          updatedCount++;
          return { ...row, ...this.payload };
        }
        return row;
      });

      writeStore(store);
      return { data: null, error: null, count: updatedCount };
    }

    if (this.operation === 'delete') {
      const remaining = table.filter((row) => {
        for (const f of this.filters) {
          if (f.type === 'eq' && row[f.column] === f.value) return false;
        }
        return true;
      });

      store[this.tableName] = remaining;
      writeStore(store);
      return { data: null, error: null };
    }

    // Default: SELECT
    let rows = this.applyFilters(table);

    if (this.orderConfig) {
      const { column, ascending } = this.orderConfig;
      rows.sort((a, b) => {
        if (a[column] < b[column]) return ascending ? -1 : 1;
        if (a[column] > b[column]) return ascending ? 1 : -1;
        return 0;
      });
    }

    if (this.limitCount) {
      rows = rows.slice(0, this.limitCount);
    }

    return { data: rows, error: null };
  }

  async maybeSingle() {
    const res = await this.execute();
    if (res.error) return { data: null, error: res.error };
    const rows = Array.isArray(res.data) ? res.data : [res.data];
    return { data: rows.length > 0 ? rows[0] : null, error: null };
  }

  async single() {
    const res = await this.execute();
    if (res.error) return { data: null, error: res.error };
    const rows = Array.isArray(res.data) ? res.data : [res.data];
    if (rows.length === 0) {
      return { data: null, error: new Error('Record not found') };
    }
    return { data: rows[0], error: null };
  }

  then(resolve, reject) {
    return this.execute().then(resolve, reject);
  }
}

export function createLocalSupabaseAdapter() {
  return {
    from(tableName) {
      return new QueryBuilder(tableName);
    },
  };
}
