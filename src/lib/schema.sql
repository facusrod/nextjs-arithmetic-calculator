DROP TABLE IF EXISTS record;
DROP TABLE IF EXISTS operation;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  status VARCHAR(20) CHECK (status IN ('active', 'inactive')) NOT NULL,
  user_balance REAL NOT NULL
);

CREATE TABLE operation (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  cost REAL NOT NULL
);

CREATE TABLE record (
  id SERIAL PRIMARY KEY,
  operation_id INTEGER NOT NULL REFERENCES operation(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  amount REAL NOT NULL,
  operation_response TEXT NOT NULL,
  user_balance REAL NOT NULL,
  date TIMESTAMP NOT NULL,
  deleted TIMESTAMP
);

INSERT INTO operation (type, cost) VALUES('ADDITION', 1);
INSERT INTO operation (type, cost) VALUES('SUBSTRACTION', 2);
INSERT INTO operation (type, cost) VALUES('MULTIPLICATION', 3);
INSERT INTO operation (type, cost) VALUES('DIVISION', 4);
INSERT INTO operation (type, cost) VALUES('SQUARE_ROOT', 5);
INSERT INTO operation (type, cost) VALUES('RANDOM_STRING', 6);
