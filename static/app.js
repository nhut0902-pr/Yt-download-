document.addEventListener('DOMContentLoaded', () => {
    const videoUrlInput = document.getElementById('video-url');
    const btnPaste = document.getElementById('btn-paste');
    const btnSubmit = document.getElementById('btn-submit');
    const btnText = btnSubmit.querySelector('.btn-text');
    const spinner = btnSubmit.querySelector('.spinner');
    const resultCard = document.getElementById('result-card');
    const resThumbnail = document.getElementById('res-thumbnail');
    const resTitle = document.getElementById('res-title');
    const resDownloadLink = document.getElementById('res-download-link');
    const btnCopyUrl = document.getElementById('btn-copy-url');
    const toastContainer = document.getElementById('toast-container');

    let extractedVideoUrl = '';

    // Show Toast Notification
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerText = message;
        toastContainer.appendChild(toast);

        // Force reflow to trigger CSS transition
        toast.offsetHeight;
        toast.classList.add('show');

        // Automatically remove after 3.5s
        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => {
                toast.remove();
            });
        }, 3500);
    }

    // Handle Paste Button
    btnPaste.addEventListener('click', async () => {
        try {
            if (!navigator.clipboard) {
                showToast('Trình duyệt không hỗ trợ truy cập clipboard tự động', 'error');
                return;
            }
            const text = await navigator.clipboard.readText();
            if (text) {
                videoUrlInput.value = text.trim();
                showToast('Đã dán liên kết từ clipboard', 'success');
            } else {
                showToast('Clipboard trống', 'info');
            }
        } catch (err) {
            console.error('Không thể đọc dữ liệu clipboard:', err);
            showToast('Vui lòng cho phép quyền truy cập clipboard', 'error');
        }
    });

    // Handle Copy Download Link
    btnCopyUrl.addEventListener('click', async () => {
        if (!extractedVideoUrl) {
            showToast('Không tìm thấy link tải để sao chép', 'error');
            return;
        }
        try {
            await navigator.clipboard.writeText(extractedVideoUrl);
            showToast('Đã sao chép link tải trực tiếp!', 'success');
        } catch (err) {
            showToast('Không thể sao chép tự động. Hãy nhấn chuột phải vào nút Tải Xuống và chọn copy', 'error');
        }
    });

    // Submit handler
    btnSubmit.addEventListener('click', async () => {
        const urlValue = videoUrlInput.value.trim();
        if (!urlValue) {
            showToast('Vui lòng nhập liên kết video!', 'error');
            return;
        }

        // Toggle Loading State
        btnSubmit.disabled = true;
        btnText.textContent = 'Đang xử lý...';
        spinner.classList.remove('hidden');
        resultCard.classList.add('hidden');

        try {
            const apiEndpoint = `/download?url=${encodeURIComponent(urlValue)}`;
            const response = await fetch(apiEndpoint);
            const data = await response.json();

            if (data.success) {
                extractedVideoUrl = data.url;
                
                // Set metadata values
                resTitle.textContent = data.title || 'Video Downloader Extracted';
                resThumbnail.src = data.thumbnail || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&auto=format&fit=crop&q=60';
                resDownloadLink.href = data.url;
                
                // Show result wrapper
                resultCard.classList.remove('hidden');
                showToast('Lấy liên kết video thành công!', 'success');
            } else {
                showToast(data.error || 'Đã xảy ra lỗi khi lấy liên kết', 'error');
            }
        } catch (error) {
            console.error('Lỗi khi fetch API:', error);
            showToast('Không thể kết nối đến máy chủ. Vui lòng thử lại!', 'error');
        } finally {
            // Restore Button State
            btnSubmit.disabled = false;
            btnText.textContent = 'Tải Ngay';
            spinner.classList.add('hidden');
        }
    });
});
