FROM python:3.12-slim

# Cài yt-dlp + ffmpeg + dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    curl \
    && pip install --no-cache-dir yt-dlp \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Tạo thư mục app
WORKDIR /app

# Copy package.json và install express + cors
COPY package.json ./
RUN npm install

# Copy code
COPY server.js ./
COPY public ./public

# Expose port
EXPOSE 3000

# Chạy server
CMD ["node", "server.js"]
