function getStudent(student,id){
	student = {id : id};
	registerInputs.forEach(function(input){
		student[input.name] = input.value;
	});
	return student;
}

function checkUnique(input){
	for(let student of students){
		if(student[input.name] == input.value){
			return `this ${input.name} is used before`;//using return with forEach like continue in for loop, that ignore this iteration and start from the next element(iteration)
		}	
	}
}

function decisionOnInCorrect(input,msg){
	errorEle.classList.remove('d-none');
	input.classList.remove('is-valid');
	input.classList.add('is-invalid');
	errorEle.textContent = msg;
	input.dataset.valid = false;
}

function decisionOnCorrect(input){
	errorEle.classList.add('d-none');
	input.classList.remove('is-invalid');
	input.classList.add('is-valid');
	input.dataset.valid = true;
}

function checkInput(input){
	isInvalid = !regexInputs[input.name].test(input.value);
	isEmpty = input.value === '';
	errorEle = document.querySelector(`p.alert[data-error-name="${input.name}"]`);
	errorMsg = '';
	if(isEmpty){
		errorMsg = "This field is required";
	}else if(isInvalid){
		errorMsg = "Invalid Field";
	}

	if(isEmpty || isInvalid){
		//inCorrect input
		decisionOnInCorrect(input,errorMsg);
	}else{
		//Correct input
		if( ( input.name == 'email' || input.name == 'phone' ) && checkUnique(input) !== undefined){
			decisionOnInCorrect(input,checkUnique(input));
		}else{
			decisionOnCorrect(input);
		}
	}
}

function showStudent(student){
	tableBody.innerHTML += `
		<tr>
			<th>${student.id}</th>
			<td>${student.firstName}</td>
			<td>${student.lastName}</td>
			<td>${student.email}</td>
			<td>${student.age}</td>
			<td>${student.phone}</td>
			<td>
				<div class="buttons">
					<button class="btn btn-info text-light me-2">Edit</button>
					<button class="btn btn-danger">Delete</button>
				</div>
			</td>
		</tr>
	`;
	saveInLocalStorage();
}

function saveInLocalStorage(){
	localStorage.setItem('students',JSON.stringify(students));
}

function resetForm(that){
	registerInputs.forEach(function(input){
			input.classList.remove('is-valid');
		});
	that.reset();
}