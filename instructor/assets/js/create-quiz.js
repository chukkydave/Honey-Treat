$(document).ready(() => {
	listLectures();
	getDepartment();
	$(document).on('click', '.delete', function() {
		var id = $(this).attr('id').replace(/delete_/, '');
		var mId = $(this).attr('dir');

		if (confirm('Are you sure you want to delete this record')) {
			delete_lecture(id, mId);
		} else {
			return false;
		}
	});
	$('#save_question').on('click', () => {
		let radiot = document.getElementsByName('option');
		if ($('#question').val() === '') {
			$('#errorQuest').html('Question field blank');
			return false;
		}

		if (!$('input[name=option]:checked').length) {
			$('#errorQuest').html('No option was selected as an answer');
			return false;
		}

		$('#errorQuest').html('');

		handleQuestions();
	});

	$('#edit_question').on('click', () => {
		let radiot = document.getElementsByName('optione');
		if ($('#questione').val() === '') {
			$('#errorQueste').html('Question field blank');
			return false;
		}

		if (!$('input[name=optione]:checked').length) {
			$('#errorQueste').html('No option was selected as an answer');
			return false;
		}

		$('#errorQueste').html('');

		handleQuestionsEdit();
	});

	$('#upload_quiz').on('click', () => {
		if (isEmptyInput('.classChecker')) {
			createQuiz();
		}
	});

	$('#viewQuiz').on('hidden.bs.modal', function() {
		$('.option_texte').val('');
		$('#questione').val('');
		let radiot = document.getElementsByName('optione');
		$(radiot).attr('checked', false);
	});

	$('#editQuiz').on('hidden.bs.modal', function() {
		$('.option_text').val('');
		$('#question').val('');
		let radiot = document.getElementsByName('option');
		$(radiot).attr('checked', false);
	});
});
let questions_obj = [];

function listLectures() {
	$('#errorHandler').html('');
	// $('#departmentLoader').show();
	let data = JSON.parse(localStorage.getItem('instructorData'));

	axios
		.get(`${apiPath}api/v1/lecturerCourses/${data.email}`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
			let res = '';
			if (data.length !== 0) {
				data.map((item, indx) => {
					res += `<div class="card" id="row_${item._id}"><i style="display:none;" class="fa fa-spinner fa-spin fa-fw fa-2x" id="deleteSpinner_${item._id}"></i>
			        <div class="card-header bg-white" id="block_${item._id}">
			            <div class="media">
			                <div class="media-left media-middle">
			                    <a href="edit_course.html?${item._id}">
			                        <img src="assets/images/vuejs.png" alt="Card image cap" width="100"
			                            class="img-rounded">
			                    </a>
			                </div>
			                <div class="media-body media-middle">
			                    <h4 class="card-title"><a href="#">${item.topic}</a></h4>
			                    <span class="label label-primary">${item.department}</span>
			                </div>
			                <div class="media-right media-middle">
			                    <a href="edit_course.html?${item._id}" class=""><i class="fa fa-pencil"></i></a>
			                    <a class="delete" id="delete_${item._id}" dir=""><i class="fa fa-trash" style="color:red;"></i></a>
			                </div>
			            </div>
			        </div>
			    </div>`;
				});
			} else {
				res += '<p>No courses available</p>';
			}

			$('#lectures').append(res);
			$('#lecturesLoader').hide();
			// $('#department').show();
		})
		.catch(function(error) {
			console.log(error);
			$('#lecturesLoader').hide();
			// $('#department').show();
			$('#errorHandler').html(error.response.statusText);
		})
		.then(function() {
			// always executed
		});
}

function delete_lecture(id, mId) {
	$(`#block_${id}`).hide();
	$(`#deleteSpinner_${id}`).show();

	axios
		.delete(`${apiPath}api/v1/deleteCourse/${id}`, {
			// meetingId and lecture_id
			headers: {
				Authorization: token,
			},
			// data: {
			// 	meetingId: mId,
			// 	lecture_id: id,
			// },
		})
		.then((res) => {
			if (res.data.status === 201 || res.data.status === 200) {
				console.log(`#row_${id}`);
				$(`#row_${id}`).remove();
			} else {
				$(`#block_${id}`).show();
				$(`#deleteSpinner_${id}`).hide();
				Swal.fire({
					title: 'Error!',
					text: `Error Deleting Record`,
					icon: 'error',
					confirmButtonText: 'Close',
				});
			}
		})
		.catch((error) => {
			$(`#block_${id}`).show();
			$(`#deleteSpinner_${id}`).hide();
			Swal.fire({
				title: 'Error!',
				text: `Error Deleting Record`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		})
		.then((res) => {});
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

function handleQuestions() {
	$('#save_question').hide();
	$('#save_questionLoader').show();
	let question = $('#question').val();
	let options = [];

	$('.option_text').each((i, v) => {
		if ($(v).val() !== '') {
			if (v.previousElementSibling.checked) {
				options.push({ option: $(v).val(), isCorrect: true });
			} else {
				options.push({ option: $(v).val(), isCorrect: false });
			}
		}
	});

	questions_obj.push({
		question: question,
		options: options,
	});

	console.log(questions_obj);
	$('#save_question').show();
	$('#save_questionLoader').hide();
	$('.option_text').val('');
	$('#question').val('');
	let radiot = document.getElementsByName('option');
	$(radiot).attr('checked', false);
	$('#editQuiz').modal('hide');

	UpdateQuestionsOnScreen();
}

function UpdateQuestionsOnScreen() {
	if (questions_obj.length > 0) {
		$('#list_questLoader').show();
		$('#list_quest').hide();
		let res = '';

		questions_obj.map((v, i) => {
			res += `<li class="list-group-item nestable-item" data-id="${i}">
                    <div class="media">

                        <div class="media-body media-middle">
                            ${v.question}
                        </div>
                        <div class="media-right right">
                            <div style="width:100px">
                                <a data-toggle="modal" data-id="${i}" data-target="#viewQuiz"
                                    class="btn btn-primary btn-sm"><i class="material-icons" onclick="fetchSingleQuest(${i})">edit</i></a>
                                <a data-id="${i}" class="btn btn-danger btn-sm" onclick="removeQuestion(${i})"><i class="material-icons">delete</i></a>
                            </div>
                        </div>
                    </div>
                </li>`;
		});
		$('#list_quest').html(res);
		$('#list_questLoader').hide();
		$('#list_quest').show();
	} else {
		$('#list_quest').html('');
	}
}

function createQuiz() {
	$('#upload_quiz').hide();
	$('#upload_quizLoader').show();

	let department_id = $('#department').val();
	let data = JSON.parse(localStorage.getItem('instructorData'));
	let lecturer = data.email;
	let topic = $('#topic').val();
	let time = document.querySelector('#time').value + ':00';
	let sel = document.querySelector('#department');
	let department = sel.options[sel.selectedIndex].text;
	let duration = $('#duration').val();
	let level = $('#level').val();

	axios
		.post(
			`${apiPath}api/v1/createQuiz`,
			{
				department: department,
				department_id: department_id,
				lecturer: lecturer,
				level: level,
				topic: topic,
				examDate: time,
				duration: parseInt(duration),
				questions_obj: questions_obj,
			},
			{
				headers: {
					Authorization: token,
				},
			},
		)
		.then(function(response) {
			// const {} = response.data.data;

			$('#upload_quizLoader').hide();
			$('#upload_quiz').show();

			Swal.fire({
				title: 'Success',
				text: `Quiz Created successfully`,
				icon: 'success',
				confirmButtonText: 'Okay',
				onClose: redirect('instructor-quizes.html'),
			});
		})
		.catch(function(error) {
			console.log(error.response);
			$('#upload_quizLoader').hide();
			$('#upload_quiz').show();
			Swal.fire({
				title: 'Error!',
				text: `${error.response.data.error}`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		});
}

function fetchSingleQuest(id) {
	// $('#viewQuiz').modal('show');
	$('#edit_question').attr('data', id);

	let one = questions_obj[id];
	$('#questione').val(one.question);
	$('.option_texte').each((i, v) => {
		$(v).val(one.options[i].option);
		if (one.options[i].isCorrect) {
			// $(v.previousElementSibling).attr('checked', true);
			v.previousElementSibling.checked = true;
		}
	});
}

function handleQuestionsEdit() {
	let id = $('#edit_question').attr('data');

	$('#edit_question').hide();
	$('#edit_questionLoader').show();
	let question = $('#questione').val();
	let options = [];

	$('.option_texte').each((i, v) => {
		if ($(v).val() !== '') {
			if (v.previousElementSibling.checked) {
				options.push({ option: $(v).val(), isCorrect: true });
			} else {
				options.push({ option: $(v).val(), isCorrect: false });
			}
		}
	});

	questions_obj[id] = {
		question: question,
		options: options,
	};

	console.log(questions_obj);
	$('#edit_question').show();
	$('#edit_questionLoader').hide();
	$('.option_texte').val('');
	$('#questione').val('');
	let radiot = document.getElementsByName('optione');
	$(radiot).attr('checked', false);
	$('#viewQuiz').modal('hide');

	UpdateQuestionsOnScreen();
}

function removeQuestion(id) {
	if (questions_obj[id]) {
		questions_obj.splice(id, 1);
	}
	UpdateQuestionsOnScreen();
}
