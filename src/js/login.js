/**
 *  Create form submit handler to log in the user
 *  and redirect to home.html
 */
document.getElementById('login-form').addEventListener('submit', (event) => {
	event.preventDefault();

	const email = document.getElementById('user-email-input').value;
	const password = document.getElementById('user-pass-input').value;

	const username = { email, password };
	localStorage.setItem('profile', JSON.stringify(username));

	router.navigate(localStorage.getItem('lastUrl') || '/');
})