#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Collect static files for WhiteNoise
# This uses the STATIC_ROOT we added to your settings.py
python manage.py collectstatic --no-input

# Run database migrations
# This will create your Quiz, Question, and Choice tables
python manage.py migrate

# Optional: Run your superuser script if you have one
# python create_admin.py