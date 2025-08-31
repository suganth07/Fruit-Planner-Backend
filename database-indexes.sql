-- PostgreSQL Index Commands for Fruit Planner App

-- Primary indexes (automatically created by Prisma)
-- CREATE UNIQUE INDEX users_email_key ON users(email);
-- CREATE UNIQUE INDEX fruits_name_key ON fruits(name);

-- Performance indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_users_conditions ON users USING GIN(conditions);
CREATE INDEX IF NOT EXISTS idx_fruit_restrictions_condition ON fruit_restrictions(condition);
CREATE INDEX IF NOT EXISTS idx_fruit_restrictions_fruit_id ON fruit_restrictions(fruit_id);
CREATE INDEX IF NOT EXISTS idx_weekly_plans_user_id ON weekly_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_plans_week_year ON weekly_plans(week, year);
CREATE INDEX IF NOT EXISTS idx_user_fruit_selections_user_id ON user_fruit_selections(user_id);
CREATE INDEX IF NOT EXISTS idx_user_fruit_selections_week_year ON user_fruit_selections(week, year);

-- Composite indexes for complex queries
CREATE INDEX IF NOT EXISTS idx_weekly_plans_user_week_year ON weekly_plans(user_id, week, year);
CREATE INDEX IF NOT EXISTS idx_fruit_restrictions_condition_level ON fruit_restrictions(condition, restriction_level);

-- Full-text search index for fruits (optional)
CREATE INDEX IF NOT EXISTS idx_fruits_search ON fruits USING GIN(to_tsvector('english', name || ' ' || benefits));
