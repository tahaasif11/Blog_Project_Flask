document.addEventListener("DOMContentLoaded", function () {
	CKEDITOR.replace("text_editor", {
		height: "100px",
		// width: "500px", // Adjust the height value
	});
});

$(document).ready(function () {
	initializeDateRangePicker();
});

function initializeDateRangePicker() {
	$(".birthday").daterangepicker(
		{
			singleDatePicker: true,
			showDropdowns: true,
			minYear: 1901,
			maxDate: moment(),
		},
		function (start, end, label) {
			var years = moment().diff(start, "years");
			$("#age").val(years);
		}
	);
}

function openRegisterModal() {
    // Trigger the modal opening
    var myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
    myModal.show();
}


function saveUserData() {
	var Name = document.getElementById("Name").value;
	var Birthday = document.getElementById("birthday").value;
	var Age = document.getElementById("age").value;
	var Email = document.getElementById("Email").value;
	var Password = document.getElementById("Password").value;
	const Description = CKEDITOR.instances.text_editor.getData();

	var UserData = {
		name: Name,
		email: Email,
		password: Password,
		birthday: Birthday,
		age: Age,
		description: Description,
	};
	console.log(UserData)
	$("#staticBackdrop").modal("hide");

	 fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(UserData),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
.then(data => {
  if (data.success) {
    console.log('Registration successful');
    window.location.href = '/profile';
  } else {
    console.error('Registration failed:', data.error);
    window.location.href = '/home';
  }
})
  .catch(error => {
    console.error('Error:', error);
  });
}



function LogInUser() {
	var Email = document.getElementById("loginEmail").value;
	var Password = document.getElementById("loginPassword").value;

	var UserData = {
		email: Email,
		password: Password,
	};
	console.log(UserData)
	$("#login_modal").modal("hide");

	 fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(UserData),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
.then(data => {
  if (data.success) {
    console.log('Login successful');
    window.location.href = '/profile';
  } else {
    console.error('Login failed:', data.error);
    window.location.href = '/login';
  }
})
  .catch(error => {
    console.error('Error:', error);
  });
}