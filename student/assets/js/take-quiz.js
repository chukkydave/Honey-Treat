$(document).ready(() => {
	$('#exampleModal').modal({
		backdrop: 'static',
		keyboard: false,
	});

	$('#exampleModal').modal('show');

	$(document).on('click', '.delete', function() {
		var id = $(this).attr('id').replace(/delete_/, '');
		var mId = $(this).attr('dir');

		if (confirm('Are you sure you want to delete this record')) {
			delete_lecture(id, mId);
		} else {
			return false;
		}
	});

	$('#next').on('click', next);
	// $('#next').on('click', next);
	$('#previous').on('click', previous);
	$('#submit').on('click', showSwal);

	$(document).on('click', '.answers', handleQuestions);
});

let questionsArr = [];
let departmentG;
let department_idG;
let lecturerG;
let levelG;

// Update the count down every 1 second
let x = setInterval(function() {
	let realtime = parseInt($('#countdown').html());

	let now = realtime - 1;
	$('#countdown').html(now);

	// If the count down is finished, write some text
	if (now === 0) {
		clearInterval(x);
		listQuizes();
		$('#exampleModal').modal('hide');
	}
}, 1000);

let id = window.location.search.split('?')[1];

function listQuizes() {
	$('#errorHandler').html('');
	// $('#departmentLoader').show();
	let data = JSON.parse(localStorage.getItem('studentData'));

	axios
		.get(`${apiPath}api/v1/viewExam/${id}`, {
			// params: {
			// 	department_id: department_id,
			// 	level: level,
			// },
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
			let res = '';
			if (data.length) {
				let totalQuestions = data[0].questions_obj.length;
				$('#totalQuest').html(totalQuestions);
				let duration = data[0].duration;
				$('#topic').html(data[0].topic);
				$('#countDown').attr('data-value', duration);
				$('#department').html(`${data[0].department} department`);
				$('#countDown').tkCountdown();
				if (totalQuestions !== 1) {
					$('#leftQuest').html(totalQuestions - 1);
				}

				departmentG = data[0].department;
				department_idG = data[0].department_id;
				lecturerG = data[0].lecturer;
				levelG = data[0].level;

				data[0].questions_obj.map((item) => {
					questionsArr.push(item);
				});
				res += ` <div class="card-header bg-white p-a-1" data-id="0">
                            <div class="media">
                                <div class="media-left media-middle">
                                <h4 class="m-b-0">
                                    <strong id="numCountt">#1</strong>
                                </h4>
                                </div>
                                <div class="media-body  media-middle">
                                <h4 class="card-title" id="card_title">
                                    ${data[0].questions_obj[0].question}
                                </h4>
                                </div>
                            </div>
                            </div>
                            <div class="card-block p-a-2">`;

				data[0].questions_obj[0].options.map((v, i) => {
					let t;
					if (v.isCorrect) {
						t = 'c';
					} else {
						t = 'f';
					}
					res += `<div class="form-group">
                                <label class="">
                                <input type="radio" value="${t}-${v.option}_${v._id}" class="answers" name="answer_${data[0]
						.questions_obj[0]._id}" id="${v._id}">
                                <span class="c-indicator"></span> ${v.option}
                                </label>
                            </div>`;
				});

				res += `</div>`;
			} else {
				res += `<p>No Quizes available</p>`;
			}

			$('#quiz').html(res);
			$('#quiz').attr('data-id', 0);
			$('#quiz').attr('data', data[0].questions_obj[0]._id);
			$('#quizLoader').hide();
			// $('#department').show();
		})
		.catch(function(error) {
			console.log(error);
			$('#quizLoader').hide();
			// $('#department').show();
			$('#errorHandler').html(error.response.statusText);
		})
		.then(function() {
			// always executed
		});
}

function handleQuestions() {
	// collect answer of curreent question

	let position = parseInt($('#quiz').attr('data-id'));
	let id = $('#quiz').attr('data');
	let question = $('#card_title').html().trim();

	let options = [];

	$(`input[name=answer_${id}]`).each((i, v) => {
		let isCorrectCheck = $(v).val().split('-')[0];
		let isCorrect =

				isCorrectCheck === 'c' ? true :
				false;
		let option = $(v).val().split('_')[0].split('-')[1];
		let ido = $(v).val().split('_')[1];
		if (v.checked) {
			options.push({
				isCorrect: isCorrect,
				option: option,
				_id: ido,
				selected: true,
			});
		} else {
			options.push({
				isCorrect: isCorrect,
				option: option,
				_id: ido,
				selected: false,
			});
		}
	});
	let obj = {
		question: question,
		_id: id,
		options: options,
	};
	questionsArr[position] = obj;

	console.log('handled');
}

function next() {
	let position = parseInt($('#quiz').attr('data-id'));
	let id = $('#quiz').attr('data');
	let question = $('#card_title').html().trim();
	let options = [];
	let leftquest = parseInt($('#leftQuest').html());
	if (leftquest > 0) {
		$('#leftQuest').html(leftquest - 1);
	}
	// insert next question
	let newPosition = position + 1;
	if (newPosition < questionsArr.length) {
		res = '';

		res += ` <div class="card-header bg-white p-a-1" data-id="0">
                <div class="media">
                    <div class="media-left media-middle">
                    <h4 class="m-b-0">
                        <strong>#${newPosition + 1}</strong>
                    </h4>
                    </div>
                    <div class="media-body  media-middle">
                    <h4 class="card-title" id="card_title">
                        ${questionsArr[newPosition].question}
                    </h4>
                    </div>
                </div>
                </div>
                <div class="card-block p-a-2">`;

		questionsArr[newPosition].options.map((v, i) => {
			let t;
			if (v.isCorrect) {
				t = 'c';
			} else {
				t = 'f';
			}
			res += `<div class="form-group">
                    <label class="">
                    <input type="radio" value="${t}-${v.option}_${v._id}" ${
				v.selected ? 'checked' :
				''} class="answers" name="answer_${questionsArr[newPosition]._id}" id="${v._id}">
                    <span class="c-indicator"></span> ${v.option}
                    </label>
                </div>`;
		});

		res += `</div>`;
		$('#quiz').html(res);
		$('#quiz').attr('data-id', newPosition);
		$('#quiz').attr('data', questionsArr[newPosition]._id);
	} else {
		console.log('final question');
	}
}

function previous() {
	let position = parseInt($('#quiz').attr('data-id'));
	let id = $('#quiz').attr('data');
	let question = $('#card_title').html().trim();
	let options = [];
	let leftquest = parseInt($('#leftQuest').html());
	if (leftquest > 0) {
		$('#leftQuest').html(leftquest - 1);
	}
	// insert next question
	let newPosition = position - 1;
	if (newPosition < 0) {
		console.log('final question');
	} else {
		res = '';

		res += ` <div class="card-header bg-white p-a-1" data-id="0">
                <div class="media">
                    <div class="media-left media-middle">
                    <h4 class="m-b-0">
                        <strong>#${newPosition + 1}</strong>
                    </h4>
                    </div>
                    <div class="media-body  media-middle">
                    <h4 class="card-title" id="card_title">
                        ${questionsArr[newPosition].question}
                    </h4>
                    </div>
                </div>
                </div>
                <div class="card-block p-a-2">`;

		questionsArr[newPosition].options.map((v, i) => {
			let t;
			if (v.isCorrect) {
				t = 'c';
			} else {
				t = 'f';
			}
			res += `<div class="form-group">
                    <label class="">
                    <input type="radio" value="${t}-${v.option}_${v._id}" ${
				v.selected ? 'checked' :
				''} class="answers" name="answer_${questionsArr[newPosition]._id}" id="${v._id}">
                    <span class="c-indicator"></span> ${v.option}
                    </label>
                </div>`;
		});

		res += `</div>`;
		$('#quiz').html(res);
		$('#quiz').attr('data-id', newPosition);
		$('#quiz').attr('data', questionsArr[newPosition]._id);
	}
}

function showSwal() {
	// alert('Ok');
	Swal.fire({
		title: 'Confirm Submission',
		showDenyButton: true,
		// showCancelButton: true,
		confirmButtonText: 'Confirm',
		denyButtonText: `Hold On!`,
	}).then((result) => {
		/* Read more about isConfirmed, isDenied below */
		if (result.isConfirmed) {
			// Swal.fire('Saved!', '', 'success')
			// window.location.href = `take-quiz.html?${id}`;
			submit();
		} else if (result.isDenied) {
			// Swal.fire('Changes are not saved', '', 'info')
			swal.close();
		}
	});
}

function submit() {
	let correct = 0;
	let wrong = 0;
	questionsArr.map((item) => {
		item.options.map((itm) => {
			if (itm.selected === true && itm.isCorrect === true) {
				correct += 1;
			}
		});
	});
	wrong = questionsArr.length - correct;
	if (correct === 0) {
		wrong = questionsArr.length;
	} else {
		wrong = questionsArr.length - correct;
	}
	$('#quiz').remove();
	$('#card-footer').remove();
	$('#countDown').remove();
	// $('#countDown').tkCountdown();
	$('#correctQuest').html(correct);
	$('#wrongQuest').html(wrong);

	let totalQuest = parseInt($('#totalQuest').html());
	let data = JSON.parse(localStorage.getItem('studentData'));
	let student_email = data.email;

	let percent = parseInt(correct) / totalQuest * 100;

	console.log(percent);

	axios
		.post(
			`${apiPath}api/v1/saveScore`,
			{
				department: departmentG,
				department_id: department_idG,
				lecturer: lecturerG,
				student_email: student_email,
				level: levelG,
				score: percent,
				questions_obj: questionsArr,
			},
			{
				headers: {
					Authorization: token,
				},
			},
		)
		.then(function(response) {
			// const {} = response.data.data;

			// $('#scheduleLoader').hide();
			// $('#scheduleBtn').show();
			$('#exampleModal2').modal('hide');
			Swal.fire({
				title: 'Success',
				text: `Quiz submitted successfully`,
				icon: 'success',
				confirmButtonText: 'Okay',
				// onClose: ,
			});

			setTimeout(() => {
				redirect('student-quizes.html');
			}, 5000);
		})
		.catch(function(error) {
			console.log(error);

			// $('#scheduleLoader').hide();
			// $('#scheduleBtn').show();
			// if (
			// 	error.response.data.error == 'Score already saved' ||
			// 	error.message != 'Network Error'
			// ) {
			// 	Swal.fire({
			// 		title: 'Error!',
			// 		text: `${error.response.data.error}`,
			// 		icon: 'error',
			// 		confirmButtonText: 'Close',
			// 	});
			// 	setTimeout(() => {
			// 		redirect('student-quizes.html');
			// 	}, 5000);
			// } else {
			// 	$('#exampleModal2').modal({
			// 		backdrop: 'static',
			// 		keyboard: false,
			// 	});
			// 	$('#exampleModal2').modal('show');
			// 	submit();
			// }

			if (error.response) {
				if (error.response.data.error == 'Score already saved') {
					Swal.fire({
						title: 'Error!',
						text: `${error.response.data.error}`,
						icon: 'error',
						confirmButtonText: 'Close',
					});
					setTimeout(() => {
						redirect('student-quizes.html');
					}, 5000);
				} else {
					$('#exampleModal2').modal({
						backdrop: 'static',
						keyboard: false,
					});
					$('#exampleModal2').modal('show');
					submit();
				}
			} else {
				$('#exampleModal2').modal({
					backdrop: 'static',
					keyboard: false,
				});
				$('#exampleModal2').modal('show');
				submit();
			}
		});
}
