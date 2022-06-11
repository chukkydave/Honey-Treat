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
});

function listQuizes() {
	$('#errorHandler').html('');
	// $('#departmentLoader').show();
	let data = JSON.parse(localStorage.getItem('studentData'));
	let level = data.level;
	let department_id = data.department_id;

	console.log(level, department_id);

	axios
		.get(`${apiPath}api/v1/fetchQuizStudent`, {
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
				data.map((item, indx) => {
					let id = item._id;
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
                                        <h4 class="card-title m-b-0">${item.topic}</h4>
                                        <small class="text-muted">${item.department}</small>
                                    </div>
                                </div>
                            </div>
                            <div class="card-footer center">
                                <a class="btn btn-primary btn-sm pull-xs-left showSwal" id="show_${id}"><i
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
