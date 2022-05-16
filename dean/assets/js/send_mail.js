$(document).ready(() => {
	$('#userz').select2();
	$('#rolez').on('change', () => {
		let res = $('#rolez').val();
		if (res === 'instructor') {
			loadInstructors();
		} else if (res === 'student') {
			loadStudents();
		}
	});
	$('#sendMailBtn').on('click', () => {
		if (isEmptyInput('.classChecker')) {
			sendMail();
		}
	});
});

function sendMail() {
	$('#sendMailBtn').hide();
	$('#scheduleLoader').show();

	let users = $('#userz').val();
	let mail = $('#messagez').val();

	axios
		.post(
			`${apiPath}api/v1/sendMail`,
			{
				addresses: users,
				email: mail,
				// students: students,
			},
			{
				headers: {
					Authorization: token,
				},
			},
		)
		.then(function(response) {
			// const {} = response.data.data;

			$('#scheduleLoader').hide();
			$('#sendMailBtn').show();

			Swal.fire({
				title: 'Success',
				text: `Mail Sent Successfully`,
				icon: 'success',
				confirmButtonText: 'Okay',
				onClose: window.location.reload,
			});
		})
		.catch(function(error) {
			console.log(error.response);
			$('#scheduleLoader').hide();
			$('#sendMailBtn').show();
			Swal.fire({
				title: 'Error!',
				text: `${error.response.data.error}`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		});
}

function loadInstructors() {
	$('#userz').hide();
	$('#userzLoader').show();
	axios
		.get(`${apiPath}api/v1/instructors`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
			let res = '<option>-- Select users --</option>';
			data.map((item, indx) => {
				res += `<option value="${item.email}">${item.firstName} ${item.lastName}</option>`;
			});
			$('#userz').html(res);
			$('#userzLoader').hide();
			$('#userz').show();
		})
		.catch(function(error) {
			console.log(error);
			$('#userzLoader').hide();
			$('#userz').show();
			$('#userz').html('<option style="color:red;">Error loading result</option>');
		})
		.then(function() {
			// always executed
		});
}

function loadStudents() {
	$('#userz').hide();
	$('#userzLoader').show();
	axios
		.get(`${apiPath}api/v1/getStudents`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
			let res = '<option>-- Select users --</option>';
			data.map((item, indx) => {
				res += `<option value="${item.email}">${item.firstName} ${item.lastName}</option>`;
			});
			$('#userz').html(res);
			$('#userzLoader').hide();
			$('#userz').show();
		})
		.catch(function(error) {
			console.log(error);
			$('#userzLoader').hide();
			$('#userz').show();
			$('#userz').html('<option style="color:red;">Error loading result</option>');
		})
		.then(function() {
			// always executed
		});
}
