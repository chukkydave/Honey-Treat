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
	let data = JSON.parse(localStorage.getItem('studentData'));

	axios
		.get(`${apiPath}api/v1/getStudentLectures/${data.email}`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			//             department: "Welding/Fabrication and Steel fixing"
			// department_id: "1"
			// duration: "60"
			// hostId: "_Pj_NfwQQry6GLXBYWfRwA"
			// lecture_assigned_by: "6273654b326b8815c2f3f6b7"
			// lecturer: "teejohn247@gmail.com"
			// meetingId: 83941573393
			// students: ["teedev247@gmail.com"]
			// time: "2022-07-06T13:53:00.000Z"
			// topic: "Test"
			// __v: 0
			// _id: "6276d3c6d326a7ebfd5a77a0"
			const { data } = response.data;
			let res = '';
			data.map((item, indx) => {
				// res += `<div class="card" id="row_${item._id}"><i style="display:none;" class="fa fa-spinner fa-spin fa-fw fa-2x" id="deleteSpinner_${item._id}"></i>
				//     <div class="card-header bg-white" id="block_${item._id}">
				//         <div class="media">
				//             <div class="media-left media-middle">
				//                 <a href="edit_course.html?${item._id}">
				//                     <img src="assets/images/vuejs.png" alt="Card image cap" width="100"
				//                         class="img-rounded">
				//                 </a>
				//             </div>
				//             <div class="media-body media-middle">
				//                 <h4 class="card-title"><a href="#">${item.topic}</a></h4>
				//                 <span class="label label-primary">${item.department}</span>
				//             </div>
				//             <div class="media-right media-middle">
				//                 <a href="edit_course.html?${item._id}" class=""><i class="fa fa-pencil"></i></a>
				//                 <a class="delete" id="delete_${item._id}" dir=""><i class="fa fa-trash" style="color:red;"></i></a>
				//             </div>
				//         </div>
				//     </div>
				// </div>`;

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
