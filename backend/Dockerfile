# Start with a Python image
FROM python:3.10.6

# Set the working directory in the container
WORKDIR /app

# Copy backend code and requirements to the container
COPY ./backend /app
COPY ./requirements.txt /requirements.txt

# Install Python dependencies
RUN pip install -r /requirements.txt

# Make the entrypoint script executable
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose the port for Gunicorn
EXPOSE 8000

# Command to start Gunicorn for production
CMD ["gunicorn", "wildforge.wsgi:application", "--bind", "0.0.0.0:8000"]

# Set the entrypoint
ENTRYPOINT ["/entrypoint.sh"]
