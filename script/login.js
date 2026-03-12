const VALID_CREDENTIALS = {
    username: 'admin',
    password: 'admin123',
};

const loginForm     = document.getElementById('loginForm');
const usernameField = document.getElementById('usernameField');
const passwordField = document.getElementById('passwordField');

function isValidLogin(username, password) {
    return (
        username === VALID_CREDENTIALS.username &&
        password === VALID_CREDENTIALS.password
    );
}

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = usernameField.value.trim();
    const password = passwordField.value.trim();

    if (isValidLogin(username, password)) {
        window.location.href = './home.html';
    } else {
        alert('Invalid username or password. Please try again.');
    }
});
