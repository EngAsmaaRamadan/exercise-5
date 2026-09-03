function getStudent(id){
	let student = {id : id};
	registerInputs.forEach(function(input){
		student[input.name] = input.value;
	});
	return student;
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

function checkUnique(input,studentId){
	let studentFilter = students;// studentId = 0 (like in addStudent fn)
	
	if(studentId > 0){
		studentFilter = students.filter(function(student){
			return student.id != studentId;
		});
	}

	for(let student of studentFilter){
		if(student[input.name] == input.value){
			return `this ${input.name} is used before`;//using return with forEach like continue in for loop, that ignore this iteration and start from the next element(iteration)
		}	
	}
}

function checkInput(input,studentId = 0){
	isInvalid = !regexInputs[input.name].test(input.value);
	input.value = input.value.trim();
	isEmpty = (input.value === '');
	errorEle = document.querySelector(`p.alert[data-error-name="${input.name}"]`);
	errorMsg = '';
	errorEle.classList.remove('d-none');
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
		if( ( input.name == 'email' || input.name == 'phone' ) && checkUnique(input,studentId) !== undefined){
			
			decisionOnInCorrect(input,checkUnique(input,studentId));
		}else{
			decisionOnCorrect(input);
		}
	}
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
					<button class="btn btn-info text-light me-2 edit" onclick="insertStudent(${student.id},this)" data-type="edit" >Edit</button>
					<button class="btn btn-danger delete" onclick="confirmDelete(${student.id},this);">Delete</button>
				</div>
			</td>
		</tr>
	`;
	isNoData(students);
	let editOrUndoBtn = tableBody.querySelector('button.edit');
	checkEditOrUndo(editOrUndoBtn);
}

function checkEditOrUndo(btn){

	//btn.addEventListener('click',function(e){

		let BtnType = btn.getAttribute('data-type');
		return BtnType;
			
		
}

function addStudent(){
	if(checkInvalidaityOrEmpty()){
		return;
	}
	
	student = getStudent(++id);
	students.push(student);
	updateLocalStorage();
	showStudent(student);
	resetForm();
}

function checkInvalidaityOrEmpty(studentId = 0){
	registerInputs.forEach(function(input){
		input?.blur();
		checkInput(input,studentId);
	});

	inputFocus = registerForm.querySelector("input:focus");
	
	//to blur on last input focus when i press enter while i am focus on this input
	inputFocus?.blur();
	
	let invalidInput = registerForm.querySelector("input.is-invalid"),//select first input that invalid
		invalidInputDataSet = registerForm.querySelector('input[data-valid="false"]');

	//if invalid input design or empty input return
	if(invalidInput != null || invalidInputDataSet != null){
		return true;
	}
}

function deleteStudent(StudentId,that){
	//update the largest id before delete from array students
	if(students[students.length - 1].id > id){
		id =  students[students.length - 1].id;
	}

	let studentIndex = findStudentIndex(StudentId);
	students.splice(studentIndex,1);
	updateLocalStorage();
	trEle = that.closest('tr');
	trEle.remove();
	isNoData(students);
	closePopup();
	return;
}

function confirmDelete(StudentId,that){
	popupEffect('Delete','Are you sure?','yes, delete','btn-danger','btn-info');
	openPopup();
	let btnExecutePopup = popup.querySelector('.do-it'),
		btnIgnore = popup.querySelector('.ignore');
	//must redeclar this buttons because if didn't in second time click on delete button we have more than one of listeners on previous buttons in popup so every button delete random row, so here the best is used onclick property because it execute the current button that we click on now
	btnIgnore.onclick = function(){
		closePopup();
		return;
	};
	btnExecutePopup.onclick = function(){
		deleteStudent(StudentId,that);
	};
}

function openPopup(){
	popup.classList.add('active');
	setTimeout(function(){
		popup.classList.add('show');
		popupBox.classList.add('show');
	},1);
}

function closePopup(){
	popup.classList.remove('show');
	popupBox.classList.remove('show');
	setTimeout(function(){
		popup.classList.remove('active');
	},500);
}

function popupEffect(eventName,question,btnContent,color,prevColor){
	let eventPopup = popup.querySelector('.event span'),
		questionPopup = popup.querySelector('.questionConfirm'),
		btnPopup = popup.querySelector('button.do-it');
	eventPopup.textContent = eventName;
	questionPopup.textContent = question;
	btnPopup.textContent = btnContent;
	btnPopup.classList.remove(prevColor);
	btnPopup.classList.add(color);
}

function findStudentIndex(id){
	return students.findIndex((student) => (student.id == id) );
}

function insertStudent(id,that){
	resetForm();
	let editStudent = students.find((student) => (student.id == id) );
	formButton = registerForm.querySelector('button.add');

	registerInputs.forEach(function(input){
		input.value = editStudent[input.name];
		input.dataset.valid = true;//because when press edit it doesn't edit or add because of data-valid="false" (because form was empty)
	});
	let otherButtons = document.querySelectorAll('#Data button');
	disabledButtons(otherButtons,1);

	registerForm.dataset.type = 'edit';
	convertButton(formButton,'Edit');

	registerForm.setAttribute('data-edit-student-id', id);
	that.removeAttribute('disabled');
	let BtnType = that.getAttribute('data-type');
	if(BtnType == 'edit'){
		that.classList.add('btn-primary');
		that.classList.remove('btn-info');
		that.textContent = 'undo';
		that.dataset.type = 'reset';
		resetIcon.classList.remove('d-none');
		resetIcon.addEventListener('click',function(){
			registerForm.setAttribute('data-type','add');
			convertButton(formButton,'Add');
			resetForm();
			resetIcon.classList.add('d-none');
			disabledButtons(otherButtons,2);
			removeEffectUndo(otherButtons,that);
		});
	}else if(BtnType == 'reset'){
		removeEffectUndo(otherButtons,that);
	}
}

function removeEffectUndo(otherButtons,that){
	that.classList.remove('btn-primary');
	that.classList.add('btn-info');
	that.textContent = 'Edit';
	that.dataset.type = 'edit';
	registerForm.dataset.type = 'add';
	resetForm();
	disabledButtons(otherButtons,2);
	registerForm.dataset.type = 'add';
	convertButton(formButton,'Add');
	resetIcon.classList.add('d-none');
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
	popupEffect('Edit','do you want to save changes?','yes, save','btn-info','btn-danger');
	let studentId = registerForm.getAttribute('data-edit-student-id');
	if(checkInvalidaityOrEmpty(studentId)){
		return;
	}
	openPopup();
	let btnExecutePopup = popup.querySelector('.do-it'),
		btnIgnore = popup.querySelector('.ignore');
	btnIgnore.onclick = function(){
		closePopup();
		return;
	};
	
	btnExecutePopup.onclick = function(){
		let	studentIndex = findStudentIndex(studentId),
			student = getStudent(studentId);
		if(checkInvalidaityOrEmpty(studentId)){
			return;
		}
		students[studentIndex] = student;
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
					<button class="btn btn-info text-light me-2" onclick="insertStudent(${student.id},this)" data-type="edit" >Edit</button>
					<button class="btn btn-danger" onclick="confirmDelete(${student.id},this);">Delete</button>
				</div>
			</td>
		`;
		trEle.classList.add('table-success');
		setTimeout(function(){
			trEle.classList.remove('table-success');
		},1000);
		resetIcon.classList.add('d-none');
		let otherButtons = document.querySelectorAll('#Data button');
		disabledButtons(otherButtons,2);
		resetForm();
		closePopup();
		formButton = registerForm.querySelector('button');
		convertButton(formButton,"Add");
		updateLocalStorage();
	};
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