document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const recipient = params.get('user');
    if (!recipient) {
        alert('لا يوجد مستلم محدد.');
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('recipientName').textContent = recipient;

    document.getElementById('sendMessageButton').addEventListener('click', function() {
        const message = document.getElementById('messageInput').value.trim();
        if (message === '') {
            alert('يرجى كتابة رسالة!');
            return;
        }

        const sender = JSON.parse(sessionStorage.getItem('loggedInUser')).username;
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages.push({ recipient, sender, message });
        localStorage.setItem('messages', JSON.stringify(messages));

        alert('تم إرسال الرسالة بنجاح!');
        document.getElementById('messageInput').value = '';
    });
});
