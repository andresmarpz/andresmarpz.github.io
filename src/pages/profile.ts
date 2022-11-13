import addAfterHook from '../lib/hooks/addAfter';
import { Page, Profile } from '../types';

const Profile: Page = async (path: string) => {
	addAfterHook(path, () => {
		const profile: Profile = JSON.parse(localStorage.getItem('profile') ?? '{}');
		for(let key of Object.keys(profile) as (keyof Profile)[]){
			const element = document.getElementById(key) as HTMLInputElement;
			if(element)
				element.value = profile[key];
		}

		const form = document.getElementById('profile-form') as HTMLFormElement;
		form.addEventListener('submit', (event) => {
			if (!form.checkValidity()) {
				event.preventDefault()
				event.stopPropagation()
				form.classList.add('was-validated')
			}

			for(let key of Object.keys(profile) as (keyof Profile)[]){
				const element = document.getElementById(key) as HTMLInputElement;
				if(element)
					profile[key] = element.value;
			}
			localStorage.setItem('profile', JSON.stringify(profile));
		});
	})

  return /*html*/ `
		<div class="container mt-4">
			<h1>Profile</h1>
			<form id="profile-form" novalidate>
				<div class="row">
					<div class="col-6">
						<div class="form-group">
							<label for="firstName">Primer nombre*</label>
							<input required type="text" class="form-control" id="firstName" placeholder="Pedro">
						</div>
						<div class="form-group">
							<label for="firstLastName">Primer apellido*</label>
							<input required type="text" class="form-control" id="firstLastName" placeholder="Rodriguez">
						</div>
						<div class="form-group">
							<label for="email">Email</label>
							<input type="email" class="form-control" id="email" placeholder="Email" disabled>
						</div>
					</div>
					<div class="col-6">
						<div class="form-group">
							<label for="secondName">Segundo nombre</label>
							<input type="text" class="form-control" id="secondName" placeholder="José">
						</div>
						
						<div class="form-group">
							<label for="secondLastName">Segundo apellido</label>
							<input type="text" class="form-control" id="secondLastName" placeholder="Pérez">
						</div>
						
						<div class="form-group">
							<label for="contactNumber">Teléfono de contacto*</label>
							<input required type="text" minlength="8" maxlength="9" class="form-control" id="contactNumber" placeholder="Teléfono de contacto">
							<small id="contactNumberHelp" class="form-text text-muted">Esta información es privada y no será compartida.</small>
						</div>
					</div>
				</div>
				<hr/>
				<button type="submit" class="btn btn-primary">Guardar cambios</button>
			</form>
		</div>
	`;
};

export default Profile;
