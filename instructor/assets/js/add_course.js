$(document).ready(function() {
	$('#students').select2();
	getDepartment();
	// $('#department').on('change', () => {
	// 	$('#students').val(null).trigger('change');
	// 	let id = $('#department').val();
	// 	getInstructorByDepartment(id);
	// 	getStudentsByDepartment(id);
	// });
	$('#scheduleBtn').on('click', () => {
		if (isEmptyInput('.classChecker')) {
			scheduleLecture();
		}
	});
});

function scheduleLecture() {
	$('#scheduleBtn').hide();
	$('#scheduleLoader').show();

	//     {
	//   "department": "string",
	//   "department_id": "string",
	//   "lecturer": "string",
	//   "time": "string",
	//   "lecture_url": "string",
	//   "description": "string",
	//   "topic": "string"
	// }

	let department_id = $('#department').val();
	// let students = $('#students').val();
	let data = JSON.parse(localStorage.getItem('instructorData'));
	let lecturer = data.email;
	let description = $('#description').val();
	let topic = $('#topic').val();
	let time = document.querySelector('#time').value + ':00';
	let sel = document.querySelector('#department');
	let department = sel.options[sel.selectedIndex].text;
	let lecture_url = '';

	axios
		.post(
			`${apiPath}api/v1/createCourse`,
			{
				department: department,
				department_id: department_id,
				lecturer: lecturer,
				lecture_url: lecture_url,
				time: time,
				description: description,
				topic: topic,
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
			$('#scheduleBtn').show();

			Swal.fire({
				title: 'Success',
				text: `Course Created successfully`,
				icon: 'success',
				confirmButtonText: 'Okay',
				// onClose: redirect('instructor-courses.html'),
			});
		})
		.catch(function(error) {
			console.log(error.response);
			$('#scheduleLoader').hide();
			$('#scheduleBtn').show();
			Swal.fire({
				title: 'Error!',
				text: `${error.response.data.error}`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		});
}

function getDepartment() {
	$('#department').hide();
	$('#departmentLoader').show();
	axios
		.get(`${apiPath}api/v1/department`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
			let res = '<option>-- Select Department --</option>';
			data.map((item, indx) => {
				res += `<option value="${item.id}">${item.department}</option>`;
			});
			$('#department').html(res);
			$('#departmentLoader').hide();
			$('#department').show();
		})
		.catch(function(error) {
			console.log(error);
			$('#departmentLoader').hide();
			$('#department').show();
			$('#department').html('<option style="color:red;">Error loading result</option>');
		})
		.then(function() {
			// always executed
		});
}

function getInstructorByDepartment(id) {
	$('#lecturer').hide();
	$('#lecturerLoader').show();
	axios
		.get(`${apiPath}api/v1/departmentalInstructors`, {
			params: {
				department: id,
			},
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
			let res = '<option>-- Select Instructor --</option>';
			data.map((item, indx) => {
				res += `<option value="${item.email}">${item.firstName} ${item.lastName}</option>`;
			});
			$('#lecturer').html(res);
			$('#lecturerLoader').hide();
			$('#lecturer').show();
		})
		.catch(function(error) {
			console.log(error);
			$('#lecturerLoader').hide();
			$('#lecturer').show();
			$('#lecturer').html('<option style="color:red;">Error loading result</option>');
		})
		.then(function() {
			// always executed
		});
}

function getStudentsByDepartment(id) {
	$('#students').hide();
	$('#studentsLoader').show();

	axios
		.get(`${apiPath}api/v1/departmentalstudents`, {
			params: {
				department: id,
			},
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
			let res = '<option>-- Select Student --</option>';
			data.map((item, indx) => {
				res += `<option value="${item.email}">${item.firstName} ${item.lastName}</option>`;
			});
			$('#students').html(res);
			$('#studentsLoader').hide();
			$('#students').show();
		})
		.catch(function(error) {
			console.log(error);
			$('#studentsLoader').hide();
			$('#students').show();
			$('#students').html('<option style="color:red;">Error loading result</option>');
		})
		.then(function() {
			// always executed
		});
}
