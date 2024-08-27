// انتظار تحميل الـ DOM بالكامل
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من حالة تسجيل الدخول عند تحميل الصفحة
    const username = sessionStorage.getItem('senderUsername');
    const fbUser = sessionStorage.getItem('fbUser');

    if (username || fbUser) {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('messageSection').style.display = 'block';
        if (username) {
            document.getElementById('status').innerText = 'تم تسجيل الدخول بنجاح. يمكنك الآن إرسال رسالة.';
        } else if (fbUser) {
            const user = JSON.parse(fbUser);
            document.getElementById('status').innerText = `تم تسجيل الدخول كـ ${user.name}. يمكنك الآن إرسال رسالة.`;
        }
    }

    // تسجيل الدخول التقليدي
    document.getElementById('loginButton').addEventListener('click', function() {
        const usernameInput = document.getElementById('loginUsername').value.trim();
        console.log("Username entered:", usernameInput); // التحقق من اسم المستخدم

        if (usernameInput === '') {
            alert('يرجى إدخال اسمك.');
            return;
        }

        // تخزين بيانات تسجيل الدخول
        sessionStorage.setItem('senderUsername', usernameInput);
        console.log("Username stored in sessionStorage:", sessionStorage.getItem('senderUsername')); // التحقق من تخزين الاسم

        // عرض قسم إرسال الرسائل
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('messageSection').style.display = 'block';
        document.getElementById('status').innerText = 'تم تسجيل الدخول بنجاح. يمكنك الآن إرسال رسالة.';
    });

    // تسجيل الدخول عبر فيسبوك
    document.getElementById('facebookLoginButton').addEventListener('click', function() {
        facebookLogin();
    });

    // التعامل مع إرسال الرسالة
    document.getElementById('sendMessageButton').addEventListener('click', function() {
        const message = document.getElementById('messageInput').value.trim();
        const showUser = document.getElementById('showUserCheckbox').checked;
        const username = sessionStorage.getItem('senderUsername');
        const fbUser = sessionStorage.getItem('fbUser');
        console.log("Username from sessionStorage:", username); // التحقق من استرجاع الاسم

        if (!username && !fbUser) {
            alert('يرجى تسجيل الدخول أولاً.');
            return;
        }

        if (message === '') {
            alert('يرجى كتابة رسالة!');
            return;
        }

        if (!isAllQuestionsAnswered()) {
            alert('يرجى الإجابة على جميع الأسئلة.');
            return;
        }

        let senderName;
        if (username) {
            senderName = username;
        } else if (fbUser) {
            const user = JSON.parse(fbUser);
            senderName = user.name;
        }

        saveMessage(message, showUser, senderName);
    });
});

// وظيفة تسجيل الدخول عبر فيسبوك
function facebookLogin() {
    FB.login(function(response) {
        if (response.status === 'connected') {
            FB.api('/me', { fields: 'name, email' }, function(response) {
                console.log('Successful login for: ' + response.name);
                // تخزين بيانات المستخدم في sessionStorage
                sessionStorage.setItem('fbUser', JSON.stringify(response));
                // عرض قسم إرسال الرسائل
                document.getElementById('loginSection').style.display = 'none';
                document.getElementById('messageSection').style.display = 'block';
                document.getElementById('status').innerText = `تم تسجيل الدخول كـ ${response.name}. يمكنك الآن إرسال رسالة.`;
            });
        } else {
            console.log('User cancelled login or did not fully authorize.');
            alert('فشل تسجيل الدخول عبر فيسبوك.');
        }
    }, {scope: 'email'});
}

// التحقق من الإجابة على جميع الأسئلة
function isAllQuestionsAnswered() {
    const question1Answered = document.querySelector('input[name="question1"]:checked');
    const question2Answered = document.querySelector('input[name="question2"]:checked');
    console.log("Question 1 answered:", !!question1Answered); // التحقق من الإجابة على السؤال الأول
    console.log("Question 2 answered:", !!question2Answered); // التحقق من الإجابة على السؤال الثاني

    return question1Answered && question2Answered;
}

// حفظ الرسالة في Local Storage
function saveMessage(message, showUser, username) {
    const urlParams = new URLSearchParams(window.location.search);
    const receiver = urlParams.get('user');
    console.log("Receiver from URL:", receiver); // التحقق من وجود المستقبل في الرابط

    if (!receiver) {
        alert('لا يمكن تحديد المستقبل.');
        return;
    }

    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    const timestamp = new Date().toLocaleString('ar-EG'); // الحصول على الوقت الحالي بالتنسيق المحلي
    console.log("Timestamp:", timestamp); // التحقق من الوقت الحالي

    // جمع الإجابات
    const answers = [
        {
            question: "ما رأيك في الخدمة؟",
            answer: document.querySelector('input[name="question1"]:checked')?.value || 'لم يتم الإجابة',
            note: document.getElementById('note1').value || 'لا توجد ملاحظات'
        },
        {
            question: "هل تنصح بالخدمة لآخرين؟",
            answer: document.querySelector('input[name="question2"]:checked')?.value || 'لم يتم الإجابة',
            note: document.getElementById('note2').value || 'لا توجد ملاحظات'
        }
    ];
    console.log("Answers:", answers); // التحقق من الإجابات

    // التأكد من إضافة الوقت بشكل صحيح
    messages.push({ receiver, message, username, timestamp, showUser, answers });
    console.log("Messages array:", messages); // التحقق من تخزين الرسائل

    localStorage.setItem('messages', JSON.stringify(messages));

    // عرض رسالة شكر
    document.getElementById('messageSection').style.display = 'none';
    document.getElementById('status').innerHTML = '<h2>  <span style="font-size:50px;">&#129488;</span> شكرًا لمشاركتك!  </h2><p>تم إرسال رسالتك بنجاح.</p>';

    // إعادة تحميل الصفحة بعد 5 ثوانٍ
    setTimeout(() => location.reload(), 5000);
}
