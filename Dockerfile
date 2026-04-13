# Base Node.js có npm sẵn + cài Python & yt-dlp
FROM node:20-slim

# Cài ffmpeg + python (yt-dlp cần)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Cài yt-dlp bằng pip
RUN pip3 install --no-cache-dir yt-dlp

# Set up app
WORKDIR /app

# Copy package.json trước để cache layer
COPY package.json ./
RUN npm install

# Copy code còn lại
COPY server.js ./
COPY public ./public

EXPOSE 3000

CMD ["node", "server.js"]
