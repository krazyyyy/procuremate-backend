const { DataSource } = require('typeorm')

const AppDataSource = new DataSource({
  type: 'postgres',
  port: 5432,
  database: 'medusa_db',
  username: 'medusa',
  password: 'med123',
  logging: true,
  synchronize: true,
  entities: [
    'src/models/*.js',
    'dist/models/*.js',
  ],
  migrations: [
    'src/migrations*.js',
    'dist/migrations*.js',
  ]
})

module.exports = {
  datasource: AppDataSource,
}