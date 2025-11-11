#!/bin/bash

# Company Registration Module - Database Setup Script

echo "🔧 Setting up company_db database..."

# Database configuration
DB_NAME="company_db"
DB_USER="${PGUSER:-postgres}"

# Check if PostgreSQL is running
if ! pg_isready > /dev/null 2>&1; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL and try again."
    exit 1
fi

echo "✅ PostgreSQL is running"

# Check if database exists
if psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "⚠️  Database '$DB_NAME' already exists."
    read -p "Do you want to drop and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️  Dropping existing database..."
        dropdb $DB_NAME
    else
        echo "ℹ️  Using existing database."
        exit 0
    fi
fi

# Create database
echo "📦 Creating database '$DB_NAME'..."
createdb $DB_NAME

if [ $? -eq 0 ]; then
    echo "✅ Database created successfully"
else
    echo "❌ Failed to create database"
    exit 1
fi

# Import schema
echo "📋 Importing database schema..."
psql -d $DB_NAME -f "$(dirname "$0")/../db/company_db.sql"

if [ $? -eq 0 ]; then
    echo "✅ Schema imported successfully"
else
    echo "❌ Failed to import schema"
    exit 1
fi

echo "🎉 Database setup completed successfully!"
echo "📊 Database: $DB_NAME"
echo "👤 User: $DB_USER"
echo ""
echo "To connect to the database, run:"
echo "  psql -d $DB_NAME"
