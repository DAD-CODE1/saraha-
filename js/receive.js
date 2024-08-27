document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');

    if (!username) {
        alert('اسم المستخدم غير محدد.');
        return;
    }

    // عرض الرسائل للمستخدم
    displayMessages(username);

    // عرض رابط إرسال الرسائل مع زر نسخ
    const sendLinkContainer = document.getElementById('sendLinkContainer');
    const sendLink = `${window.location.origin}/send.html?user=${username}`;
    sendLinkContainer.innerHTML = `
        <p>إرسال رسالة إلى <strong>${username}</strong>:</p>
        <p>
            <strong>الرابط:</strong> <span id="sendLink">${sendLink}</span>
            <button id="copyButton" class="btn-copy" onclick="copyLink()">
                <i class="fas fa-copy"></i>
            </button>
        </p>
    `;
});

function copyLink() {
    const sendLink = document.getElementById('sendLink').innerText;
    navigator.clipboard.writeText(sendLink).then(() => {
        Swal.fire({
            icon: 'success',
            title: 'تم النسخ',
            text: 'تم نسخ الرابط إلى الحافظة.'
        });
    }).catch(err => {
        Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'تعذر نسخ الرابط.'
        });
    });
}

function getMessages(username) {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    return messages.filter(msg => msg.receiver === username);
}

function deleteMessage(index) {
    Swal.fire({
        title: 'هل أنت متأكد؟',
        text: "لن تتمكن من استعادة هذه الرسالة بعد حذفها!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d2b48c',
        cancelButtonColor: '#d2b48c',
        confirmButtonText: 'نعم، احذفها!',
        cancelButtonText: 'إلغاء'
    }).then((result) => {
        if (result.isConfirmed) {
            const username = new URLSearchParams(window.location.search).get('user');
            const messages = JSON.parse(localStorage.getItem('messages')) || [];
            const filteredMessages = messages.filter(msg => msg.receiver === username);

            if (index >= 0 && index < filteredMessages.length) {
                messages.splice(messages.indexOf(filteredMessages[index]), 1);
                localStorage.setItem('messages', JSON.stringify(messages));
                displayMessages(username);
                Swal.fire('تم الحذف!', 'تم حذف رسالتك بنجاح.', 'success');
            } else {
                Swal.fire('خطأ!', 'تعذر العثور على الرسالة للحذف.', 'error');
            }
        }
    });
}

function displayMessages(username) {
    const messages = getMessages(username);
    const messageList = document.getElementById('messageList');

    if (messages.length === 0) {
        messageList.innerHTML = '<li>لا توجد رسائل حتى الآن.</li>';
    } else {
        messageList.innerHTML = '';
        messages.reverse().forEach((msg, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <p><strong>من:</strong> ${msg.username}</p>
                <p><strong>الرسالة:</strong> ${msg.message}</p>
                <p><strong>الوقت:</strong> ${msg.timestamp}</p>
                <p><strong>إظهار الاسم:</strong> ${msg.showUser ? 'نعم' : 'لا'}</p>
                <div><strong>أسئلة:</strong></div>
                <ul>
                    ${msg.answers.map(a => `
                        <li><strong>سؤال:</strong> ${a.question} - <strong>إجابة:</strong> ${a.answer} - <strong>ملاحظة:</strong> ${a.note}</li>
                    `).join('')}
                </ul>
                <button onclick="deleteMessage(${messages.length - 1 - index})">حذف</button>
            `;
            messageList.appendChild(li);
        });
    }
}
