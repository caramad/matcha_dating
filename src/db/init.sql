DROP TABLE IF EXISTS user_attributes CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS user_interests CASCADE;
DROP TABLE IF EXISTS interests CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;


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
    location TEXT, -- City/State/Country
    profile_picture TEXT, -- URL or Path to Image Storage
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
