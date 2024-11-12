# Use an official Python runtime as a parent image
FROM python:3.8-slim

# Set the working directory
WORKDIR /usr/src/app

# Install gcc and other necessary packages
RUN apt-get update && apt-get install -y gcc libsqlite3-dev

# Copy the requirements file and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Start the application
CMD ["python", "server.py"]