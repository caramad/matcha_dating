CREATE EXTENSION IF NOT EXISTS postgis;
DROP TABLE IF EXISTS user_attributes CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS user_interests CASCADE;
DROP TABLE IF EXISTS interests CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_images CASCADE;
DROP TABLE IF EXISTS user_likes CASCADE;
DROP TABLE IF EXISTS user_matches CASCADE;
DROP TABLE IF EXISTS user_dislikes CASCADE;
DROP TABLE IF EXISTS messages CASCADE;


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
	password VARCHAR(128) NOT NULL
);

CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    age INT CHECK (age >= 18),  -- Minimum age restriction
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
    sexuality TEXT CHECK (sexuality IN ('Heterosexual', 'Homosexual', 'Bisexual')),
    bio TEXT,
    location GEOGRAPHY(POINT, 4326), -- Stores lat/lon in WGS 84
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE interests (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL -- Example: "Hiking", "Gaming", "Reading"
);

CREATE TABLE user_interests (
    user_id INT NOT NULL,
    interest_id INT NOT NULL,
    PRIMARY KEY (user_id, interest_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (interest_id) REFERENCES interests(id) ON DELETE CASCADE
);

CREATE TABLE user_preferences (
    user_id INT PRIMARY KEY,
    preferred_gender TEXT CHECK (preferred_gender IN ('Male', 'Female', 'All')),
    min_age INT CHECK (min_age >= 18),
    max_age INT CHECK (max_age <= 99),
    location_radius INT CHECK (location_radius >= 0), -- In km
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Flexible Key-Value Storage
CREATE TABLE user_attributes (
    user_id INT NOT NULL,
    attribute_key TEXT NOT NULL,  -- Example: "Political View", "Favorite Music"
    attribute_value TEXT NOT NULL, -- Example: "Liberal", "Rock"
    PRIMARY KEY (user_id, attribute_key),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_images (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    image_path TEXT NOT NULL,
    position INT NOT NULL CHECK (position >= 1), -- Image order
    UNIQUE (user_id, position)
);

CREATE TABLE user_likes (
	user_id INT NOT NULL,
	liked_user_id INT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (user_id, liked_user_id),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (liked_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_matches (
	user_id INT NOT NULL,
	matched_user_id INT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (user_id, matched_user_id),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (matched_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_dislikes (
	user_id INT NOT NULL,
	disliked_user_id INT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (user_id, disliked_user_id),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (disliked_user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE messages (
	id SERIAL PRIMARY KEY,
	sender_id INT NOT NULL,
	receiver_id INT NOT NULL,
	sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	content TEXT NOT NULL,
	FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);


-- trigger for integrity check of user_matches to make sure they can only exist if both users have liked each other
CREATE OR REPLACE FUNCTION check_user_matches() RETURNS TRIGGER AS $$
BEGIN
	IF EXISTS (SELECT 1 FROM user_likes WHERE user_id = NEW.matched_user_id AND liked_user_id = NEW.user_id) THEN
		RETURN NEW;
	ELSE
		RAISE EXCEPTION 'User must like each other to match';
	END IF;
END;

$$ LANGUAGE plpgsql;

CREATE TRIGGER user_matches_trigger
	BEFORE INSERT ON user_matches
	FOR EACH ROW
	EXECUTE FUNCTION check_user_matches();
