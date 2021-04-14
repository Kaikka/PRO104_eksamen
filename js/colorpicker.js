
document.addEventListener("DOMContentLoaded", function(event) {


	updateColor(currentUser.background);
	
	document.querySelector("#colorPick").addEventListener("click", function () { 
		document.querySelector('.color-popup').classList.toggle('active');
	});

	var colors =  document.querySelectorAll(".color-select")
	colors.forEach(element => {
		element.addEventListener("click", function () {
			updateBg(element.id);
			updateColor(element.id);
		});
	});

	function updateColor(color) {
		document.querySelector("#topbar").setAttribute("style", `background-color: ${color}`);
		document.querySelector("#sidebar").setAttribute("style", `background-color: ${color}`);
		document.querySelector(".color-popup").setAttribute("style", `background-color: ${color}`);
	}

	document.addEventListener('click', function(event) {
		var clickInside = document.querySelector('.color-select').contains(event.target) || document.querySelector('.color-popup').contains(event.target) || document.querySelector('#colorPick').contains(event.target);
		if (!clickInside) {
			document.querySelector('.color-popup').classList.remove('active');
		}
	  });
	
});