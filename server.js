const express = require('express');
const cors = require('cors');
const youtubedl = require('youtube-dl-exec');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

console.log('🚀 Hacker YT Backend đang chạy... Phá mẹ YouTube!');

app.get('/hack-info', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "Đụ mày, dán link YT vô đi thằng ngu!" });

    try {
        console.log(`Đang hack info: ${url}`);
        const info = await youtubedl(url, {
            dumpJson: true,
            noWarnings: true,
            quiet: true
        });

        const data = typeof info === 'string' ? JSON.parse(info) : info;

        res.json({
            title: data.title || "Không biết tên",
            thumbnail: data.thumbnail,
            formats: data.formats
                ?.filter(f => (f.ext === 'mp4' || f.ext === 'webm') && f.url)
                .map(f => ({
                    resolution: f.resolution || f.format_note || `${f.width || '?'}p`,
                    filesize: f.filesize ? (f.filesize / (1024*1024)).toFixed(1) : '?',
                    url: f.url
                })) || []
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "YouTube chống hack vl: " + e.message + " - Thử lại hoặc dùng cookie sau." });
    }
});

app.get('/download', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send("Link đâu thằng ngu?");

    res.setHeader('Content-Type', 'text/plain');
    res.write('🔥 Đang hack link tải nguyên bản cao nhất...\n');

    try {
        const directUrl = await youtubedl(url, {
            getUrl: true,
            format: 'bestvideo+bestaudio/best',
            noWarnings: true
        });

        res.write(`✅ Link tải mạnh nhất (copy dán vào trình duyệt để tải):\n${directUrl.trim()}\n`);
        res.end('\nPhá thành công! Cặc lồn YouTube. Nếu link die nhanh thì rep tao thêm cookie.');
    } catch (e) {
        res.end('Hack fail: ' + e.message);
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server hacker chạy trên Render - https://your-app.onrender.com`);
});
