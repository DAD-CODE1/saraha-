document.getElementById('loginButton').addEventListener('click', function() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        sessionStorage.setItem('loggedInUser', JSON.stringify(user));
        window.location.href = `receive.html?user=${user.username}`;
    } else {
        alert('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    }
});
