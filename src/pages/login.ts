import { router } from "../router";
import { Page, Profile } from "../types";

(window as any).handleLoginSubmit = function handleLoginSubmit(event: Event) {
	event.preventDefault();

	const email = (document?.getElementById('user-email-input') as HTMLInputElement)?.value;
	const password = (document?.getElementById('user-pass-input') as HTMLInputElement)?.value;
	const profile: Profile = {
		firstName: '',
		firstLastName: '',
		secondName: '',
		secondLastName: '',
		email,
		password,
		contactNumber: ''
	}

	localStorage.setItem('profile', JSON.stringify(profile));

	router.navigate(localStorage.getItem('lastUrl') || '/');
}

const Login: Page = async() => {
	return `
		<div class="row justify-content-center">
			<div class="login-container">
				<div>
					<h2>Inicio de sesión</h2>
				</div>
				<div>
					<form class="login-form" id="login-form" onsubmit="handleLoginSubmit(event)">
						<div class="form-group">
						<label for="user-email">Email</label>
						<input type="email" class="form-control" name="user-email" id="user-email-input" aria-describedby="emailHelpId" placeholder="john@doe.com" required>
						</div>
						<div class="form-group">
						<label for="user-pass">Contraseña</label>
						<input type="password" validate="" class="form-control" name="user-pass" id="user-pass-input" minlength="6" placeholder="password" required>
						</div>
			
						<button type="submit" class="btn btn-primary">Ingresar</button>
					</form>
				</div>
			</div>
		</div>
	`;
}

export default Login