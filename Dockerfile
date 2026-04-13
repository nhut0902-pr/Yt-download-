FROM node:20-slim

# Cài đầy đủ tools + phá khóa pip
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    && apt-get clean && rm -rf /var/lib/apt/lists/* \
    && pip3 install --no-cache-dir --break-system-packages yt-dlp

# Set up app
WORKDIR /app

# Copy package.json trước để cache
COPY package.json ./
RUN npm install

# Copy code
COPY server.js ./
COPY public ./public

EXPOSE 3000

CMD ["node", "server.js"]
