$(document).ready(() => {
	$('#dLoginBtn').on('click', () => {
		if (isEmptyInput('.dClassChecker')) {
			loginAsDean();
		}
	});
	$('#iLoginBtn').on('click', () => {
		if (isEmptyInput('.iClassChecker')) {
			loginAsInstructor();
		}
	});
	$('#sLoginBtn').on('click', () => {
		if (isEmptyInput('.sClassChecker')) {
			loginAsStudent();
		}
	});
});

function loginAsDean() {
	$('#dLoginBtn').hide();
	$('#dLoginLoader').show();

	let email = $('#dEmail').val();
	let password = $('#dPassword').val();

	axios
		.post(`${apiPath}api/v1/loginDean`, {
			email: email,
			password: password,
		})
		.then(function(response) {
			console.log(response);
			$('#dLoginLoader').hide();
			$('#dLoginBtn').show();

			const {
				department,
				email,
				firstName,
				lastName,
				password,
				position,
				profilePic,
				_id,
			} = response.data.data;

			let date = new Date();
			date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
			const expires = 'expires=' + date.toUTCString();
			document.cookie = `HTAtoken=${response.data.token};path=/;${expires}`;

			localStorage.setItem('hta_firstName', firstName);
			localStorage.setItem('hta_lastName', lastName);
			localStorage.setItem('hta_email', email);
			localStorage.setItem('hta_position', position);
			localStorage.setItem('hta_profilePic', profilePic);

			Swal.fire({
				title: 'Success',
				text: `Thank you for loging in`,
				icon: 'success',
				confirmButtonText: 'Okay',
				onClose: redirect(dean),
			});
			$('#dLoginLoader').hide();
			$('#dLoginBtn').hide();
		})
		.catch(function(error) {
			console.log(error.response);
			$('#dLoginLoader').hide();
			$('#dLoginBtn').show();
			Swal.fire({
				title: 'Error!',
				text: `${error.response.data.error}`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		});
}

function loginAsInstructor() {
	$('#iLoginBtn').hide();
	$('#iLoginLoader').show();

	let email = $('#iEmail').val();
	let password = $('#iPassword').val();

	axios
		.post(`${apiPath}api/v1/loginInstructor`, {
			email: email,
			password: password,
		})
		.then(function(response) {
			console.log(response);
			$('#iLoginLoader').hide();
			$('#iLoginBtn').show();

			const {
				department,
				email,
				firstName,
				lastName,
				password,
				position,
				profilePic,
				_id,
			} = response.data.data;

			let date = new Date();
			date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
			const expires = 'expires=' + date.toUTCString();
			document.cookie = `HTAtoken=${response.data.token};path=/;${expires}`;

			localStorage.setItem('hta_firstName', firstName);
			localStorage.setItem('hta_lastName', lastName);
			localStorage.setItem('hta_email', email);
			localStorage.setItem('hta_position', position);
			localStorage.setItem('hta_profilePic', profilePic);

			Swal.fire({
				title: 'Success',
				text: `Thank you for loging in`,
				icon: 'success',
				confirmButtonText: 'Okay',
				onClose: redirect(instructor),
			});
		})
		.catch(function(error) {
			console.log(error.response);
			$('#iLoginLoader').hide();
			$('#iLoginBtn').show();
			Swal.fire({
				title: 'Error!',
				text: `${error.response.data.error}`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		});
}

function loginAsStudent() {
	$('#sLoginBtn').hide();
	$('#sLoginLoader').show();

	let email = $('#sEmail').val();
	let password = $('#sPassword').val();

	axios
		.post(`${apiPath}api/v1/login`, {
			email: email,
			password: password,
		})
		.then(function(response) {
			const {
				department,
				email,
				firstName,
				lastName,
				password,
				position,
				profilePic,
				_id,
			} = response.data.data;

			$('#sLoginLoader').hide();
			$('#sLoginBtn').show();

			let date = new Date();
			date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
			const expires = 'expires=' + date.toUTCString();
			document.cookie = `HTAtoken=${response.data.token};path=/;${expires}`;

			localStorage.setItem('hta_firstName', firstName);
			localStorage.setItem('hta_lastName', lastName);
			localStorage.setItem('hta_email', email);
			localStorage.setItem('hta_position', position);
			localStorage.setItem('hta_profilePic', profilePic);

			Swal.fire({
				title: 'Success',
				text: `Thank you for loging in`,
				icon: 'success',
				confirmButtonText: 'Okay',
				onClose: redirect(student),
			});
		})
		.catch(function(error) {
			console.log(error.response);
			$('#sLoginLoader').hide();
			$('#sLoginBtn').show();
			Swal.fire({
				title: 'Error!',
				text: `${error.response.data.error}`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		});
}

function redirect(where) {
	setTimeout(() => {
		window.location = `/${where}`;
	}, 2000);
}

let username = 'Max Brown';

// Set a Cookie
function setCookie(cName, cValue, expDays) {
	let date = new Date();
	date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
	const expires = 'expires=' + date.toUTCString();
	document.cookie = cName + '=' + cValue + '; ' + expires + '; path=/';
}

// Apply setCookie
// setCookie('username', username, 30);
