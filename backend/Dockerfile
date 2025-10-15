# --- Base Image ---
# Use an official Python runtime as a parent image.
# 'slim' is a good choice for smaller image size.
FROM python:3.11-slim

# --- Environment Variables ---
# Prevents Python from writing .pyc files to disc.
ENV PYTHONDONTWRITEBYTECODE 1
# Ensures that Python output is sent straight to the terminal without buffering.
ENV PYTHONUNBUFFERED 1

# --- Application Directory ---
# Set the working directory in the container.
WORKDIR /app

# --- Install Dependencies ---
# Copy the requirements file into the container.
COPY requirements.txt .
# Install the dependencies.
RUN pip install --no-cache-dir -r requirements.txt

# --- Copy Application Code ---
# Copy the rest of the application's code into the container.
COPY . .

# --- Expose Port ---
# Expose the port Gunicorn will run on.
EXPOSE 8000

# --- Collect Static Files ---
# This will be run when the image is built.
RUN python manage.py collectstatic --noinput

# --- Command to Run ---
# Run Gunicorn.
# The number of workers is a good starting point. Adjust based on your server's CPU cores.
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "core.wsgi:application"]