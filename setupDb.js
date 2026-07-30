import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  user: 'postgres',
  password: '153',
  host: 'localhost',
  port: 5432,
  database: 'postgres' // Connexion à la db par défaut
});

try {
  await client.connect();

  // Vérifier si la base de données existe
  const result = await client.query(
    "SELECT 1 FROM pg_database WHERE datname = 'senior'"
  );

  if (result.rows.length === 0) {
    console.log('Création de la base de données senior...');
    await client.query('CREATE DATABASE senior');
    console.log('✅ Base de données senior créée!');
  } else {
    console.log('✅ Base de données senior existe déjà');
  }

  await client.end();
} catch (error) {
  console.error('❌ Erreur:', error.message);
  process.exit(1);
}
