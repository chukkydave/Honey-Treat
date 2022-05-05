const apiPath = 'https://hta-api.herokuapp.com/';
///////////////////////////////////
// Initialize AdminPlus Sidebars //
///////////////////////////////////
AdminPlus.Sidebar.init();

/////////////////////////////////////
// Custom initializers can go here //
/////////////////////////////////////
function isEmptyInput(first) {
	let isEmpty = false;
	$(first).each(function() {
		var input = $.trim($(this).val());
		if (input.length === 0 || input === '0') {
			$(this).addClass('has-error');
			isEmpty = true;
		} else {
			$(this).removeClass('has-error');
			// isEmpty = false;
		}
	});
	if (isEmpty === true) {
		return false;
	} else {
		return true;
	}
}
