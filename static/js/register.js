document.addEventListener("DOMContentLoaded", function () {
	CKEDITOR.replace("text_editor", {
		height: "100px",
		// width: "500px", // Adjust the height value
	});
});

function ckeditor(id)
{
	CKEDITOR.replace(id, {
		height: "100px",
		// width: "500px", // Adjust the height value
	});
}

$(document).ready(function () {
	initializeDateRangePicker();
	getUserData()

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
//    loadStudentData();
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

function getUserData() {

 fetch('/get_all_data', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
    .then(data => {
  if (data.success) {
    console.log('get data successful');
    users = data.users_data

    loadUserData(users)
  } else {
    console.error('get data failed:', data.error);
    window.location.href = '/home';
  }
})
  .catch(error => {
    console.error('Error:', error);
  });

}

function loadUserData(users) {
  var tableBody = $("#userDataTable tbody");
  tableBody.empty();

  for (var i = 0; i < users.length; i++) {
    var user = users[i];
    var newRow = $("<tr>");

    newRow.append(`<td><input type='text' class='form-control' id='nameInput${user.id}' value='${user.name}'></td>`);
    newRow.append(`<td><input type='email' class='form-control' id='emailInput${user.id}' value='${user.email}'></td>`);
    newRow.append(`<td><input type='password' class='form-control' id='passwordInput${user.id}' value='${user.password}'></td>`);
    newRow.append(`<td><input type='text' class='form-control birthday' id='birthdayInput${user.id}' placeholder='Select birthday' required value='${user.birthday}'></td>`);
    newRow.append("<td>" + user.age + "</td>");
    newRow.append("<td >" + user.description + "</td>");
//    newRow.append(`<td><input type='text' class='form-control text_editor' id='text_editor${user.id}' value='${user.description}'></td>`);

    newRow.append(
      `<td><button class='btn btn-success' onclick='saveEdit(${user.id},${false})'>Save</button></td>`
    );
    newRow.append(
      `<td><button class='btn btn-primary' onclick='editStudentData(${user.id})'>Edit</button></td>`
    );

    tableBody.append(newRow);
    initializeDateRangePicker();
//    ckeditor(`text_editor${user.id}`);
  }
}

async  function editStudentData(user_id) {

     try {
        const user = await get_one_User(user_id);

        document.getElementById("Name").value = user.name;
        document.getElementById("birthday").value = user.birthday;
        document.getElementById("age").value = user.age;
        document.getElementById("Password").value = user.password;
        document.getElementById("Email").value = user.email;
        CKEDITOR.instances.text_editor.setData(user.description);
        $("#staticBackdrop").modal("show");

        document.getElementById("saverUserChangesBtn").onclick = function () {
            saveEdit(user_id, true);
        };
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}


async function saveEdit(user_id, flag) {
	$("#staticBackdrop").modal("hide");
	var UserData;
        if (flag)
        {
        var Name = document.getElementById("Name").value;
        var Birthday = document.getElementById("birthday").value;
        var Age = document.getElementById("age").value;
        var Email = document.getElementById("Email").value;
        var Password = document.getElementById("Password").value;
        const Description = CKEDITOR.instances.text_editor.getData();
         UserData = {
            id:user_id,
            name: Name,
            email: Email,
            password: Password,
            birthday: Birthday,
            age: Age,
            description: Description,
            };
        }
         else
        {
            const user = await get_one_User(user_id);

            var Name = document.getElementById(`nameInput${user_id}`).value;
            var Email = document.getElementById(`emailInput${user_id}`).value;
            var Birthday = document.getElementById(`birthdayInput${user_id}`).value;
            var newage = moment().diff(Birthday, "years");
            var Description = user.description;
            var Password = document.getElementById(`passwordInput${user_id}`).value;

            UserData = {
            id:user_id,
            name: Name,
            email: Email,
            password: Password,
            birthday: Birthday,
            age: newage,
            description: Description,
            };

        }
        update_user(UserData);
//        getUserData();

}

async function get_one_User(user_id) {
  try {
    const UserData = { id: user_id };

    const response = await fetch('/get_one_data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(UserData),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (data.success) {
      console.log('Get data successful');
      const user = data.users_data;
      return user

    } else {
      console.error('Get data failed:', data.error);
    }
  } catch (error) {
    console.error('Error:', error);
    // Handle other errors that might occur during the process
  }
}

function update_user(UserData)
{
	 fetch('/update_user', {
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
    console.log('updated successful');
    window.location.href = '/';
  } else {
    console.error('updated failed:', data.error);
    window.location.href = '/';
  }
})
  .catch(error => {
    console.error('Error:', error);
  });
}