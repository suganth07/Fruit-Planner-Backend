# PostgreSQL Local Setup Commands

# For Windows (using Chocolatey):
# choco install postgresql

# For Windows (using winget):
# winget install PostgreSQL.PostgreSQL

# After installation, create database:
# createdb fruitplanner

# Connect to database:
# psql -d fruitplanner

# Your local DATABASE_URL would be:
# DATABASE_URL="postgresql://postgres:your_password@localhost:5432/fruitplanner"

# For quick testing with Docker:
# docker run --name postgres-fruit -e POSTGRES_DB=fruitplanner -e POSTGRES_USER=fruit -e POSTGRES_PASSWORD=password123 -p 5432:5432 -d postgres:15

# Docker DATABASE_URL:
# DATABASE_URL="postgresql://fruit:password123@localhost:5432/fruitplanner"
