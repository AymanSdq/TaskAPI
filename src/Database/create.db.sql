CREATE TABLE users (
	userID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fullName VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    avatarUrl TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Creating ENUM for the status of the task
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed');

CREATE TABLE tasks (
    taksid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userid UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status task_status DEFAULT 'pending',
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE
);