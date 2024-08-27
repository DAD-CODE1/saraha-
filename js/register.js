document.getElementById('registerButton').addEventListener('click', function() {
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();

    if (username === '' || email === '' || password === '') {
        alert('يرجى ملء جميع الحقول.');
        return;
    }

    if (!validateEmail(email)) {
        alert('يرجى إدخال بريد إلكتروني صالح.');
        return;
    }

    if (password.length < 8) {
        alert('يجب أن تكون كلمة المرور 8 أحرف على الأقل.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));

    alert('تم التسجيل بنجاح! الآن يمكنك تسجيل الدخول.');
    window.location.href = 'login.html';
});

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}
