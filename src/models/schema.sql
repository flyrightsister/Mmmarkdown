DROP TABLE IF EXISTS files;

CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- bds: triggers are awesome!! Include some comments here about why you're using
-- bds: a trigger and what it's doing
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.modified_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';


CREATE TRIGGER update_file_modtime
  BEFORE UPDATE ON files
  FOR EACH ROW EXECUTE PROCEDURE
  update_modified_column();
