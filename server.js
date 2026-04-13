const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

console.log('🚀 Hacker YT Docker Backend - Phá mẹ YouTube 2026!');

app.get('/hack-info', (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "Đụ mày dán link YT vô!" });

    const command = `yt-dlp --dump-json --no-warnings "${url}"`;

    exec(command, { maxBuffer: 1024 * 1024 * 100 }, (err, stdout, stderr) => {
        if (err) {
            console.error(stderr);
            return res.status(500).json({ error: "YouTube chống hack: " + (stderr || err.message) });
        }
        try {
            const data = JSON.parse(stdout);
            res.json({
                title: data.title,
                formats: data.formats
                    .filter(f => (f.ext === 'mp4' || f.ext === 'webm') && f.url)
                    .map(f => ({
                        resolution: f.resolution || f.format_note || 'unknown',
                        filesize: f.filesize ? (f.filesize / 1048576).toFixed(1) : '?',
                        url: f.url
                    }))
            });
        } catch (e) {
            res.status(500).json({ error: "Parse lỗi vl" });
        }
    });
});

app.get('/download', (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send("Link đâu thằng ngu?");

    res.setHeader('Content-Type', 'text/plain');
    res.write('🔥 Đang hack link tải nguyên bản cao nhất...\n\n');

    // Lấy link tốt nhất (bestvideo + bestaudio)
    const command = `yt-dlp -f "bestvideo+bestaudio/best" --get-url --no-warnings "${url}"`;

    exec(command, (err, stdout, stderr) => {
        if (err) {
            res.end('Hack fail: ' + (stderr || err.message));
            return;
        }
        const directUrl = stdout.trim();
        res.write(`✅ Link tải mạnh nhất (copy dán vào trình duyệt tải ngay):\n${directUrl}\n\n`);
        res.end('Phá thành công! Nếu link die nhanh thì rep tao thêm cookie.');
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server chạy trên Docker Render port ${PORT}`);
});
