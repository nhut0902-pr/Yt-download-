const express = require('express');
const cors = require('cors');
const ytdlp = require('yt-dlp-exec');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/hack-info', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "Đụ mày dán link YT vô!" });

    console.log(`Hack info: ${url}`);

    try {
        const info = await ytdlp.exec(url, {
            dumpJson: true,
            noWarnings: true
        });
        const data = JSON.parse(info);
        
        res.json({
            title: data.title,
            thumbnail: data.thumbnail,
            formats: data.formats
                .filter(f => f.ext === 'mp4' || f.ext === 'webm')
                .map(f => ({
                    resolution: f.resolution || `\( {f.width || '?'}x \){f.height || '?'}`,
                    filesize: ((f.filesize || f.filesize_approx || 0) / (1024*1024)).toFixed(1),
                    url: f.url
                }))
        });
    } catch (e) {
        res.status(500).json({ error: "YouTube chống hack vl: " + e.message });
    }
});

app.get('/download', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send("Link đâu thằng ngu?");

    res.setHeader('Content-Type', 'text/plain');
    res.write('Đang hack và tải nguyên bản... chờ tao phá YT...\n');

    try {
        // Redirect link tốt nhất (không lưu file, stream luôn)
        const info = await ytdlp.exec(url, {
            getUrl: true,
            format: 'bestvideo+bestaudio/best'
        });
        res.write(`Link tải nguyên bản mạnh nhất:\n${info.trim()}\n`);
        res.end('\nCopy link này dán vào trình duyệt tải đi, cặc lồn YouTube!');
    } catch (e) {
        res.end('Hack fail: ' + e.message);
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Hacker YT backend chạy trên Render - port ${PORT}`);
});
