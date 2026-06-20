FROM python:3.12-slim

WORKDIR /app

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all files from the backend directory into the container
COPY . .

# Expose the port Render expects (defaults to 10000, or use 8000 if you configure it)
EXPOSE 8000

# Production command (removed --reload)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]