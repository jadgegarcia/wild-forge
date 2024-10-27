FROM python:3.10.6

# Set the working directory
WORKDIR /app

# Copy requirements.txt first to leverage Docker caching
COPY ./requirements.txt /requirements.txt

# Install dependencies
RUN pip install --no-cache-dir -r /requirements.txt

# Copy the rest of the application code
COPY ./backend /app

# Make the entrypoint script executable
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose the port for Gunicorn
EXPOSE 8000

# Start Gunicorn to serve the application
CMD ["gunicorn", "wildforge.wsgi:application", "--bind", "0.0.0.0:8000"]

# Set the entrypoint
ENTRYPOINT ["/entrypoint.sh"]
