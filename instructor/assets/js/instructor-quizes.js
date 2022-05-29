$(document).ready(() => {
	listQuizes();
	$(document).on('click', '.showSwal', function() {
		var id = $(this).attr('id').replace(/show_/, '');

		// if (confirm('Are you sure you want to delete this record')) {
		showSwal(id);
		// } else {
		// 	return false;
		// }
	});
	$(document).on('click', '.delete', function() {
		var id = $(this).attr('id').replace(/delete_/, '');
		if (confirm('Are you sure you want to delete this record')) {
			delete_quiz(id);
		} else {
			return false;
		}
	});
});

function listQuizes() {
	$('#errorHandler').html('');
	// $('#departmentLoader').show();
	let data = JSON.parse(localStorage.getItem('studentData'));
	let level = data.level;
	let department_id = data.department_id;

	console.log(level, department_id);

	axios
		.get(`${apiPath}api/v1/fetchQuiz`, {
			params: {
				department_id: department_id,
				level: level,
			},
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
			let res = '';
			if (data.length) {
				data.map((item, indx) => {
					let id = item._id;
					res += `<div class="card" id="row_${item._id}>
                            <div class="card-block">
                                <div class="media m-b-05">
                                    <div class="media-left media-middle">
                                        <a>
                                            <img src="assets/images/vuejs.png" alt="Card image cap" width="80"
                                                class="img-rounded">
                                        </a>
                                    </div>
                                    <div class="media-body media-middle">
                                        <h4 class="card-title m-b-0">${item.topic}</h4>
                                        <small class="text-muted">${item.department}</small>
                                        <i class="material-icons pull-xs-right" style="color:blue;">edit</i> 
                                        <i class="material-icons pull-xs-right delete" style="color:red;" id="delete_${item._id}">delete</i>
                                    </div>
                                </div>
                                 
                            </div>
                            
                        </div>`;
				});
			} else {
				res += `<p>No Quizes available</p>`;
			}

			$('#quiz').html(res);
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

function showSwal(id) {
	// alert('Ok');
	Swal.fire({
		title: 'Be sure you are ready to take the quiz as countdown starts immediately',
		showDenyButton: true,
		// showCancelButton: true,
		confirmButtonText: 'Take Quiz',
		denyButtonText: `Not now!`,
	}).then((result) => {
		/* Read more about isConfirmed, isDenied below */
		if (result.isConfirmed) {
			// Swal.fire('Saved!', '', 'success')
			window.location.href = `take-quiz.html?${id}`;
		} else if (result.isDenied) {
			// Swal.fire('Changes are not saved', '', 'info')
			swal.close();
		}
	});
}

function delete_quiz(id) {
	$(`#block_${id}`).hide();
	$(`#deleteSpinner_${id}`).show();

	axios
		.delete(`${apiPath}api/v1/deleteQuiz/${id}`, {
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
			if (res.data.status == '200' || res.data.status == 200) {
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
