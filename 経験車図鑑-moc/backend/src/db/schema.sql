
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS car_masters (
  car_id INTEGER PRIMARY KEY AUTOINCREMENT,
  maker_id INTEGER NOT NULL,
  maker_name TEXT NOT NULL,
  model_name TEXT NOT NULL,
  segment TEXT,
  rarity INTEGER NOT NULL CHECK (rarity BETWEEN 1 AND 10),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (maker_id, model_name)
);

CREATE INDEX IF NOT EXISTS idx_car_masters_maker_id ON car_masters(maker_id);
CREATE INDEX IF NOT EXISTS idx_car_masters_maker_name ON car_masters(maker_name);

CREATE TABLE IF NOT EXISTS experiences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL DEFAULT 1,
  car_id INTEGER NOT NULL,
  experience_type TEXT NOT NULL CHECK (experience_type IN ('saw','rode','drove','owned')),
  points INTEGER NOT NULL CHECK (points >= 0),
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (car_id) REFERENCES car_masters(car_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_experiences_user ON experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_experiences_car ON experiences(car_id);
CREATE INDEX IF NOT EXISTS idx_experiences_type ON experiences(experience_type);

CREATE VIEW IF NOT EXISTS makers AS
SELECT DISTINCT maker_id, maker_name
FROM car_masters
ORDER BY maker_name;

CREATE VIEW IF NOT EXISTS user_score AS
SELECT 
  user_id, 
  COALESCE(SUM(points), 0) AS score,
  COUNT(DISTINCT car_id) AS total_cars,
  COUNT(CASE WHEN experience_type = 'saw' THEN 1 END) AS saw_count,
  COUNT(CASE WHEN experience_type = 'rode' THEN 1 END) AS rode_count,
  COUNT(CASE WHEN experience_type = 'drove' THEN 1 END) AS drove_count,
  COUNT(CASE WHEN experience_type = 'owned' THEN 1 END) AS owned_count
FROM experiences
GROUP BY user_id;
