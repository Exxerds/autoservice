-- Создание всех таблиц проекта АвтоСервис

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'manager',
  location_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  working_hours VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(100),
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id),
  location_id INTEGER REFERENCES locations(id),
  service_id INTEGER REFERENCES services(id),
  datetime TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  client_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  source VARCHAR(20) DEFAULT 'manual',
  status VARCHAR(20) DEFAULT 'new',
  location_id INTEGER REFERENCES locations(id),
  manager_id INTEGER REFERENCES users(id),
  booking_id INTEGER REFERENCES bookings(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lead_comments (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id),
  manager_id INTEGER REFERENCES users(id),
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'todo',
  assigned_to INTEGER REFERENCES users(id),
  created_by INTEGER REFERENCES users(id),
  deadline TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Тестовые данные
INSERT INTO locations (name, address, phone, working_hours) VALUES
  ('Автосервис на Ленина', 'г. Москва, ул. Ленина, 10', '+7 (495) 111-22-33', 'Пн-Пт: 9:00-21:00, Сб-Вс: 10:00-20:00'),
  ('Автосервис на Тверской', 'г. Москва, ул. Тверская, 25', '+7 (495) 444-55-66', 'Ежедневно с 8:00 до 22:00');

INSERT INTO services (name, description, price, duration) VALUES
  ('Шиномонтаж', 'Замена и балансировка колес', 2000.00, 60),
  ('Замена масла', 'Замена масла и масляного фильтра', 1500.00, 30),
  ('Диагностика двигателя', 'Полная компьютерная диагностика', 2500.00, 45),
  ('Замена тормозных колодок', 'Замена передних/задних колодок', 3500.00, 90);