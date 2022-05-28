$(document).ready(() => {
	listQuizes();
	$(document).on('click', '.delete', function() {
		var id = $(this).attr('id').replace(/delete_/, '');
		var mId = $(this).attr('dir');

		if (confirm('Are you sure you want to delete this record')) {
			delete_lecture(id, mId);
		} else {
			return false;
		}
	});
});

function listQuizes() {
	$('#errorHandler').html('');
	// $('#departmentLoader').show();
	let data = JSON.parse(localStorage.getItem('studentData'));

	axios
		.get(`${apiPath}api/v1/fetchQuiz`, {
			headers: {
				Authorization: token,
			},
			data: {
				department_id: data.department_id,
				level: data.level,
			},
		})
		.then(function(response) {
			const { data } = response.data;
			let res = '';
			if (data.length) {
				data.map((item, indx) => {
					res += `<div class="card">
                            <div class="card-block">
                                <div class="media m-b-05">
                                    <div class="media-left media-middle">
                                        <a>
                                            <img src="assets/images/vuejs.png" alt="Card image cap" width="80"
                                                class="img-rounded">
                                        </a>
                                    </div>
                                    <div class="media-body media-middle">
                                        <h4 class="card-title m-b-0">Vue.js Deploy Quiz</h4>
                                        <small class="text-muted">25 Completed</small>
                                    </div>
                                </div>
                            </div>
                            <div class="card-footer center">
                                <a href="instructor-quiz.html" class="btn btn-primary btn-sm pull-xs-left"><i
                                        class="material-icons">playlist_add_check</i> Take Quiz</a>

                                <div class="clearfix"></div>
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
			if (res.data.status == '201') {
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
