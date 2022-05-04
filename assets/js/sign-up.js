$(document).ready(() => {
	// alert('We are here');
	$('#iSignupBtn').on('click', () => {
		$('#ierrorHolder').html('');
		if (isEmptyInput('.iClassChecker')) {
			instructorSignUp();
		}
	});

	$('#sSignupBtn').on('click', () => {
		$('#serrorHolder').html('');
		if (isEmptyInput('.sClassChecker')) {
			studentSignUp();
		}
	});
});

function instructorSignUp() {
	if ($('#ipassword').val() !== $('#ipasswordCon').val()) {
		$('#ierrorHolder').html('Please confirm password');
		return false;
	} else {
		$('#ierrorHolder').html('');
	}

	let firstName = $('#ifirstName').val();
	let lastName = $('#ilastName').val();
	let email = $('#iemail').val();
	let password = $('#ipassword').val();

	let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
	if (strongPassword.test(password)) {
		$('#ierrorHolder').html('');
	} else {
		$('#ierrorHolder').html(
			'Password must contain at least 8 characters comprising of 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character ',
		);
		return false;
	}

	$('#iSignupBtn').hide();
	$('#iSignupLoader').show();

	axios
		.post(`${apiPath}api/v1/registerInstructor`, {
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: password,
		})
		.then(function(response) {
			console.log(response);
			$('#iSignupLoader').hide();
			$('#iSignupBtn').show();
			Swal.fire({
				title: 'Success',
				text: `Thank you for signing up`,
				icon: 'success',
				confirmButtonText: 'Okay',
				onClose: reload(),
			});
			$('#iSignupLoader').hide();
			$('#iSignupBtn').hide();
		})
		.catch(function(error) {
			console.log(error.response);
			$('#iSignupLoader').hide();
			$('#iSignupBtn').show();
			Swal.fire({
				title: 'Error!',
				text: `${error.response.data.error}`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		});
}

function studentSignUp() {
	if ($('#spassword').val() !== $('#spasswordCon').val()) {
		$('#serrorHolder').html('Please confirm password');
		return false;
	} else {
		$('#serrorHolder').html('');
	}

	let firstName = $('#sfirstName').val();
	let lastName = $('#slastName').val();
	let email = $('#semail').val();
	let password = $('#spassword').val();

	let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
	if (strongPassword.test(password)) {
		$('#serrorHolder').html('');
	} else {
		$('#serrorHolder').html(
			'Password must contain at least 8 characters comprising of 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character ',
		);
		return false;
	}

	$('#sSignupBtn').hide();
	$('#sSignupLoader').show();

	axios
		.post(`${apiPath}api/v1/register`, {
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: password,
		})
		.then(function(response) {
			console.log(response);
			$('#sSignupLoader').hide();
			$('#sSignupBtn').show();
			Swal.fire({
				title: 'Success',
				text: `Thank you for signing up`,
				icon: 'success',
				confirmButtonText: 'Okay',
				onClose: reload(),
			});
			$('#sSignupLoader').hide();
			$('#sSignupBtn').hide();
		})
		.catch(function(error) {
			console.log(error.response);
			$('#sSignupLoader').hide();
			$('#sSignupBtn').show();
			Swal.fire({
				title: 'Error!',
				text: `${error.response.data.error}`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		});
}

function reload() {
	setTimeout(() => {
		window.location.reload();
	}, 2000);
}
