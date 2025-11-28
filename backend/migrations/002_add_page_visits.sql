-- Page visits table for tracking daily ritual check-ins
CREATE TABLE IF NOT EXISTS page_visits (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    page TEXT NOT NULL,
    period TEXT NOT NULL,  -- 'morning', 'afternoon', 'evening'
    date TEXT NOT NULL,    -- 'YYYY-MM-DD'
    visited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, page, period, date)
);

CREATE INDEX IF NOT EXISTS idx_page_visits_user_date ON page_visits(user_id, date);
CREATE INDEX IF NOT EXISTS idx_page_visits_user_page_date ON page_visits(user_id, page, date);
