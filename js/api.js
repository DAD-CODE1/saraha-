// Retrieves all messages from local storage
function getMessages() {
    return JSON.parse(localStorage.getItem('messages')) || [];
}

// Function to delete a message
function deleteMessage(index) {
    Swal.fire({
        title: 'هل أنت متأكد؟',
        text: "لن تتمكن من استعادة هذه الرسالة بعد حذفها!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'نعم، احذفها!',
        cancelButtonText: 'إلغاء'
    }).then((result) => {
        if (result.isConfirmed) {
            const messages = getMessages();
            messages.splice(index, 1); // Remove the message at the specified index
            localStorage.setItem('messages', JSON.stringify(messages));
            displayMessages(); // Refresh the message list

            Swal.fire('تم الحذف!', 'تم حذف رسالتك بنجاح.', 'success');
        }
    });
}

// Function to display all messages
function displayMessages() {
    const messages = getMessages();
    const messageList = document.getElementById('messageList');

    if (messages.length === 0) {
        messageList.innerHTML = '<li>لا توجد رسائل حتى الآن.</li>';
    } else {
        messageList.innerHTML = '';
        messages.reverse().forEach((msg, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'message-item';

            const icon = msg.showUser ? '<i class="fas fa-check text-success"></i>' : '<i class="fas fa-times text-danger"></i>';
            listItem.innerHTML = `
                <div class="position">
                    ${icon} <strong>الاسم: ${msg.username}</strong><br/><br/>
                    الرسالة: ${msg.message}<br/><br/>
                    ${msg.answers && msg.answers.length > 0 ? msg.answers.map(answer => `<p>${answer.question}: ${answer.answer} <br/> ملاحظة: ${answer.note}</p>`).join('<br/>') : ''}
                </div>
                <p class="message-timestamp">وقت الإرسال: ${msg.timestamp}</p>
            `;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'حذف';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', function() {
                deleteMessage(messages.length - 1 - index); // Adjust index for deletion
            });

            listItem.appendChild(deleteButton);
            messageList.appendChild(listItem);
        });
    }
}

document.addEventListener('DOMContentLoaded', displayMessages);
