function getStudent(id){
	let student = {id : id};
	registerInputs.forEach(function(input){
		student[input.name] = input.value;
	});
	return student;
}

function checkUnique(input){
	for(let student of students){
		if(student[input.name] == input.value){
			console.log('okay');
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
	input.value = removeSpacesIfFound(input.value);
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

function removeSpacesIfFound(value){
	let spaceRegex = /[\s]/;
	if(spaceRegex.test(value)){
		value.trim();
	}
	return value;
}

function showStudent(student){
	tableBody.innerHTML += `
		<tr data-student-edit-id="${student.id}">
			<th>${student.id}</th>
			<td>${student.firstName}</td>
			<td>${student.lastName}</td>
			<td>${student.email}</td>
			<td>${student.age}</td>
			<td>${student.phone}</td>
			<td>
				<div class="buttons">
					<button class="btn btn-info text-light me-2 edit" onclick="insertStudent(${student.id})">Edit</button>
					<button class="btn btn-danger delete" onclick="deleteStudent(${student.id},this);">Delete</button>
				</div>
			</td>
		</tr>
	`;
	isNoData(students);
}

function addStudent(){
	checkInvalidaityOrEmpty();
	student = getStudent(++id);
	students.push(student);
	updateLocalStorage();
	showStudent(student);
	resetForm();
}

function checkInvalidaityOrEmpty(){
	let inputFocus = registerForm.querySelector("input:focus");
	//to blur on last input focus when i press enter while i am focus on this input
	inputFocus?.blur();

	let invalidInput = registerForm.querySelector("input.is-invalid"),//select first input that invalid
		invalidInputDataSet = registerForm.querySelector('input[data-valid="false"]');

	//if invalid input design or empty input return
	if(invalidInput != null || invalidInputDataSet != null){
		return;
	}
}

function deleteStudent(id,that){
	// if(!confirm("Are you sure?")){
	// 	return;
	// }//will do it as a popup in last, problem, make it not comment if you dont have time to do the popup
	let studentIndex = findStudentIndex(id);
	students.splice(studentIndex,1);
	updateLocalStorage();
	trEle = that.closest('tr');
	trEle.remove();
	isNoData(students);
}

function findStudentIndex(id){
	return students.findIndex((student) => (student.id == id) );
}

function insertStudent(id){
	resetForm();
	let editStudent = students.find((student) => (student.id == id) ),
		formButton = registerForm.querySelector('button.add');

	registerInputs.forEach(function(input){
		input.value = editStudent[input.name];
		input.dataset.valid = true;//because when press edit it doesn't edit or add because of data-valid="false" (because form was empty)
	});

	registerForm.dataset.type = 'edit';
	convertButton(formButton,'Edit');
	registerForm.setAttribute('data-edit-student-id', id);
	
	let otherButtons = document.querySelectorAll('#Data button');
	disabledButtons(otherButtons,1);
	resetIcon.classList.remove('d-none');
	resetButton.classList.add('d-none');
	resetIcon.addEventListener('click',function(){
		registerForm.setAttribute('data-type','add');
		convertButton(formButton,'Add');
		resetForm();
		resetIcon.classList.add('d-none');
		disabledButtons(otherButtons,2);
	});
}

function makeEffectButton(){
	resetButton.classList.remove('d-none');
	resetButton.addEventListener('click',function(){
		resetForm();
		resetButton.classList.add('d-none');
	});
}

function disabledButtons(buttons,num){
	if(num == 1){
		buttons.forEach(function(button){
			button.setAttribute('disabled','');
		});
	}
	
	if(num == 2){
		buttons.forEach(function(button){
			button.removeAttribute('disabled');
		});
	}	
}

function editStudent(){
	let studentId = registerForm.getAttribute('data-edit-student-id'),
		studentIndex = findStudentIndex(studentId),
		student = getStudent(studentId);
	students[studentIndex] = student;
	updateLocalStorage();
	let trEle = tableBody.querySelector(`tr[data-student-edit-id="${studentId}"]`);
	trEle.innerHTML = `
		<th>${student.id}</th>
		<td>${student.firstName}</td>
		<td>${student.lastName}</td>
		<td>${student.email}</td>
		<td>${student.age}</td>
		<td>${student.phone}</td>
		<td>
			<div class="buttons">
				<button class="btn btn-info text-light me-2" onclick="insertStudent(${student.id})">Edit</button>
				<button class="btn btn-danger" onclick="deleteStudent(${student.id},this);">Delete</button>
			</div>
		</td>
	`;
	resetForm();
	checkInvalidaityOrEmpty();
	resetIcon.classList.add('d-none');
	let otherButtons = document.querySelectorAll('#Data button');
	disabledButtons(otherButtons,2);
}

function convertButton(button,word){
	button.textContent = word;
	if(word == 'Edit'){
		button.classList.remove('btn-success');
		button.classList.add('btn-info');
	}else if(word == 'Add'){
		button.classList.remove('btn-info');
		button.classList.add('btn-success');
	}
	button.classList.add('text-light');
}

function updateLocalStorage(){
	localStorage.setItem('students',JSON.stringify(students));
}

function showStudents(data){
	tableBody.innerHTML = `
	<tr>
		<td colspan="7" class="table-alert d-none table-warning text-center rounded-2 py-3">There are no data</td>
	</tr>
	`;
	data.forEach(function(student){
		showStudent(student);
	});
	isNoData(data);
}

function isNoData(data){
	let tableAlert = tableBody.querySelector('.table-alert');
	if(data.length == 0){
		tableAlert.classList.remove('d-none');
	}else{
		tableAlert.classList.add('d-none');
	}
}

function resetForm(){
/*if i add student then press enter or press on Add button(after reset the form) without focus on any input(if i didnt put required) 
	it will store empty row to fix it make the data-valid is false (because after previous add it will be true as previous if i didnt do it)*/
	registerInputs.forEach(function(input){
			input.classList.remove('is-valid');
			input.classList.remove('is-invalid');
			input.dataset.valid = false;
			let errorAlert = document.querySelector(`p.alert[data-error-name="${input.name}"]`);
			errorAlert.classList.add('d-none');
		});
	registerForm.setAttribute('data-type','add');
	registerForm.reset();
}

function search(searchValue){
	let filteredStudents = students.filter(function(student){ 
		return student.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
			student.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
			student.email.toLowerCase().includes(searchValue.toLowerCase()) ||
			student.age.toLowerCase().includes(searchValue.toLowerCase()) ||
			student.phone.toLowerCase().includes(searchValue.toLowerCase());});
	showStudents(filteredStudents);
}