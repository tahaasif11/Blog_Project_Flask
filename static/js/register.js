document.addEventListener("DOMContentLoaded", function () {
	CKEDITOR.replace("text_editor", {
		height: "100px",
		// width: "500px", // Adjust the height value
	});
});

$(document).ready(function () {
	initializeDateRangePicker();
});

$(document).ready(function () {
    $('#password_reset_modal').modal('show');
});


function resetPasswordFunction() {
    var Email = document.getElementById('user_email').value;
    var newPassword = document.getElementById('resetPassword').value;
    var confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        alert('Passwords do not match. Please check and try again.');
        return;
    }

    var UserData = {
    email: Email,
    password: newPassword,
	};
     fetch('/update_reset_password', {
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
    console.log('update password  successful');
    window.location.href = '/';
  } else {
    console.error('update password failed:', data.error);
    window.location.href = '/';
  }
})
  .catch(error => {
    console.error('Error:', error);
  });
}

var forgetPasswordLink = document.getElementById("forgetPasswordLink");

forgetPasswordLink.addEventListener("click", function () {
    $("#login_modal").modal("hide");
    $("#email_modal").modal("show");
});

function sendEmailFunction()
{
    var Email = document.getElementById("sendEmail").value;

    var UserData = {
    email: Email,
	};

     fetch('/forgot_password', {
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
    console.log('email sent successful');
    window.location.href = '/';
  } else {
    console.error('email sent failed:', data.error);
    window.location.href = '/';
  }
})
  .catch(error => {
    console.error('Error:', error);
  });

}
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

    const userName = getCookie('user_name');
    const user_email = getCookie('user_email');

    console.log('User Name:', userName);
    console.log('User user_email:', user_email);

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

function getCookie(name) {
    const cookieValue = document.cookie.match('(^|[^;]+)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}