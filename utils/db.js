import knex from 'knex';

const db = knex({
    client: 'pg',
    connection: {
        host: 'aws-1-ap-southeast-1.pooler.supabase.com',
        port: 6543,
        database: 'postgres',
        user: 'postgres.qtsffejxxhqgpvnfgaya',
        password: '23110018UTE',
        pool: { min: 0, max: 15 }
    }
});

export default db;
