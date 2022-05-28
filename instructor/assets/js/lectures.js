$(document).ready(() => {
	listLectures();
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

function listLectures() {
	$('#errorHandler').html('');
	// $('#departmentLoader').show();
	let data = JSON.parse(localStorage.getItem('instructorData'));

	axios
		.get(`${apiPath}api/v1/getInstructorLectures/${data.email}`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
			let res = '';
			if (data.length) {
				data.map((item, indx) => {
					res += `<div class="card" id="row_${item._id}"><i style="display:none;" class="fa fa-spinner fa-spin fa-fw fa-2x" id="deleteSpinner_${item._id}"></i>
                            <div class="card-header bg-white center">
                                <h4 class="card-title"><a href="take-course.html">${item.topic}</a></h4>
                                <div>
                                <i class="material-icons text-warning md-18">star</i>
                                <i class="material-icons text-warning md-18">star</i>
                                <i class="material-icons text-warning md-18">star</i>
                                <i class="material-icons text-warning md-18">star</i>
                                <i class="material-icons text-warning md-18">star_border</i>
                                </div>
                            </div>
                            <a href="take-course.html">
                                <img src="assets/images/vuejs.png" alt="Card image cap" style="width:100%;">
                            </a>
                            <div class="card-block">
                                <small class="text-muted">ADVANCED</small>
                                <p class="m-b-0">
                                	Let’s start with a quick tour of Vue’s data binding features. If you are more interested in ...
                                </p>
                                <p><span class="label label-primary">${item.department}</span></p>
                            </div>
                        </div>`;
				});
			} else {
				res += `<p>No live lectures available</p>`;
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
