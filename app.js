const passwordEl = document.getElementById('password');
const lengthEl = document.getElementById('password-length');
const lengthValueEl = document.getElementById('length-value');
const uppercaseEl = document.getElementById('include-uppercase');
const lowercaseEl = document.getElementById('include-lowercase');
const numbersEl = document.getElementById('include-numbers');
const symbolsEl = document.getElementById('include-symbols');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const refreshBtn = document.getElementById('refresh-btn');
const strengthTextEl = document.getElementById('strength-text');
const strengthSegments = document.querySelectorAll('.strength-segment');
const toast = document.getElementById('toast');

const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const numberChars = '0123456789';
const symbolChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';

lengthEl.addEventListener('input', () => {
    lengthValueEl.textContent = lengthEl.value;
    if (passwordEl.value) {
        updatePasswordStrength(passwordEl.value);
    }
});

generateBtn.addEventListener('click', generatePassword);
refreshBtn.addEventListener('click', generatePassword);

copyBtn.addEventListener('click', () => {
    if (!passwordEl.value) return;
    
    navigator.clipboard.writeText(passwordEl.value).then(() => {
        showToast();
    }).catch(err => {
        console.error('Не удалось скопировать пароль: ', err);
    });
});

[uppercaseEl, lowercaseEl, numbersEl, symbolsEl].forEach(el => {
    el.addEventListener('change', () => {
        if (passwordEl.value) {
            updatePasswordStrength(passwordEl.value);
        }
        
        if (!(uppercaseEl.checked || lowercaseEl.checked || numbersEl.checked || symbolsEl.checked)) {
            el.checked = true;
        }
    });
});

function generatePassword() {
    let charset = '';
    
    if (uppercaseEl.checked) charset += uppercaseChars;
    if (lowercaseEl.checked) charset += lowercaseChars;
    if (numbersEl.checked) charset += numberChars;
    if (symbolsEl.checked) charset += symbolChars;
    
    if (!charset) {
        lowercaseEl.checked = true;
        charset = lowercaseChars;
    }
    
    const length = lengthEl.value;
    let password = '';
    
    let hasRequiredChars = false;
    
    while (!hasRequiredChars) {
        password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        
        hasRequiredChars = validatePassword(password);
    }
    
    passwordEl.value = password;
    updatePasswordStrength(password);
    
    passwordEl.classList.add('active');
    setTimeout(() => {
        passwordEl.classList.remove('active');
    }, 300);
}

function validatePassword(password) {
    let hasUppercase = false;
    let hasLowercase = false;
    let hasNumber = false;
    let hasSymbol = false;
    
    if (uppercaseEl.checked) {
        hasUppercase = /[A-Z]/.test(password);
        if (!hasUppercase) return false;
    }
    
    if (lowercaseEl.checked) {
        hasLowercase = /[a-z]/.test(password);
        if (!hasLowercase) return false;
    }
    
    if (numbersEl.checked) {
        hasNumber = /[0-9]/.test(password);
        if (!hasNumber) return false;
    }
    
    if (symbolsEl.checked) {
        hasSymbol = new RegExp(`[${symbolChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`).test(password);
        if (!hasSymbol) return false;
    }
    
    return true;
}

function updatePasswordStrength(password) {
    if (!password) {
        resetStrengthIndicator();
        return;
    }
    
    let score = 0;
    const length = password.length;
    
    if (length >= 8) score += 1;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
    
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    const uniqueChars = new Set(password).size;
    if (uniqueChars > length * 0.4) score += 1;
    if (uniqueChars > length * 0.6) score += 1;
    
    let strength = '';
    let segments = 0;
    
    if (score <= 3) {
        strength = 'Слабый';
        segments = 1;
    } else if (score <= 6) {
        strength = 'Средний';
        segments = 2;
    } else if (score <= 8) {
        strength = 'Хороший';
        segments = 3;
    } else {
        strength = 'Отличный';
        segments = 4;
    }
    
    strengthTextEl.textContent = `Сложность: ${strength}`;
    
    strengthSegments.forEach((segment, index) => {
        segment.className = 'strength-segment';
        
        if (index < segments) {
            if (segments === 1) {
                segment.classList.add('weak');
            } else if (segments === 2) {
                segment.classList.add('medium');
            } else {
                segment.classList.add('strong');
            }
        }
    });
}

function resetStrengthIndicator() {
    strengthTextEl.textContent = 'Сложность: Нет пароля';
    strengthSegments.forEach(segment => {
        segment.className = 'strength-segment';
    });
}

function showToast() {
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

generatePassword(); 