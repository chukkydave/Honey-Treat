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

let id = window.location.search.split('?')[1];

function scheduleLecture() {
	$('#scheduleBtn').hide();
	$('#scheduleLoader').show();

	//     {
	//   "department": "string",
	//   "department_id": "string",
	//   "lecturer": "string",
	//   "time": "string",
	//   "duration": 0,
	//   "topic": "string",
	//   "meetingId": "string",
	//   "lecture_id": "string"
	// }

	let department_id = $('#department').val();
	// let students = $('#students').val();
	let lecturer = $('#lecturer').val();
	let description = $('#description').val();
	let topic = $('#topic').val();
	let time = document.querySelector('#time').value + ':00';
	let sel = document.querySelector('#department');
	let department = sel.options[sel.selectedIndex].text;

	axios
		.patch(
			`${apiPath}api/v1/editCourse/${id}`,
			{
				// department: department,
				// department_id: department_id,
				// students: students,
				// meetingId: mId,
				// lecture_id: id,
				// lecturer: lecturer,
				// time: time,
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
				text: `Course Update Successful`,
				icon: 'success',
				confirmButtonText: 'Okay',
				onClose: redirect('instructor-courses.html'),
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
			getStudents();
		})
		.catch(function(error) {
			console.log(error);
			$('#departmentLoader').hide();
			$('#department').show();
			$('#department').html('<option style="color:red;">Error loading result</option>');
			getStudents();
		})
		.then(function() {
			// always executed
		});
}

function getInstructor(id) {
	$('#lecturer').hide();
	$('#lecturerLoader').show();
	axios
		.get(`${apiPath}api/v1/instructors`, {
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
			getLecture();
		})
		.catch(function(error) {
			console.log(error);
			$('#lecturerLoader').hide();
			$('#lecturer').show();
			$('#lecturer').html('<option style="color:red;">Error loading result</option>');
			getLecture();
		})
		.then(function() {
			// always executed
		});
}

function getStudents(id) {
	$('#students').hide();
	$('#studentsLoader').show();

	axios
		.get(`${apiPath}api/v1/getStudents`, {
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

			getInstructor();
		})
		.catch(function(error) {
			console.log(error);
			$('#studentsLoader').hide();
			$('#students').show();
			$('#students').html('<option style="color:red;">Error loading result</option>');

			getInstructor();
		})
		.then(function() {
			// always executed
		});
}

function getLecture() {
	$('#scheduleBtn').hide();
	$('#scheduleLoader').show();
	$('#error').html('');

	axios
		.get(`${apiPath}api/v1/course/${id}`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
			let res = '';
			// data.map((item, indx) => {
			// 	res += `<option value="${item.email}">${item.firstName} ${item.lastName}</option>`;
			// });
			$('#department').val(data[0].department_id);
			$('#lecturer').val(data[0].lecturer);
			$('#students').val(data[0].students);
			$('#students').trigger('change');
			$('#duration').val(data[0].duration);
			let timet = data[0].time.split('.')[0];
			console.log(timet);
			$('#time').val(timet);
			$('#topic').val(data[0].topic);
			// $('#students').html(res);
			$('#scheduleLoader').hide();
			$('#scheduleBtn').show();
		})
		.catch(function(error) {
			console.log(error);
			$('#scheduleLoader').hide();
			$('#scheduleBtn').show();
			$('#error').html('Error loading data');
		})
		.then(function() {
			// always executed
		});
}
