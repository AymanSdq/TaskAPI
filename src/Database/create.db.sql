CREATE TABLE users (
	userid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fullname VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    avatarurl TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');

CREATE TABLE tasks (
    taskid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userid UUID NOT NULL,
    categoryid UUID,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status task_status DEFAULT 'pending',
    priority task_priority DEFAULT 'medium',
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE,
    FOREIGN KEY (categoryid) REFERENCES categories(categoryid) ON DELETE CASCADE
);


CREATE TABLE categories (
    categoryid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userid UUID NOT NULL,
    name VARCHAR(50) NOT NULL,
    description TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE
)