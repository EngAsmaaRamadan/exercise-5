let registerForm = document.querySelector("#Register form"),
	registerInputs = registerForm.querySelectorAll("input"),
	students = [],
	student = {},
	inputName,
	errorEle,
	isEmpty,
	isInvalid,
	inputValue,
	inputFocus,
	id = 0,
	regexInputs = {
		firstName : /^[\s]*[A-Za-z]{3,}[\s]*$/,
		lastName : /^[\s]*[A-Za-z]{3,}[\s]*$/,
		email : /^[\s]*[A-Za-z_][A-Za-z0-9_\.]*@(gmail|yahoo)\.(com|org)[\s]*$/,
		age : /^[\s]*[0-9]{2}[\s]*$/,
		phone : /^[\s]*(02)?01(0|1|2|5)[0-9]{8}[\s]*$/,	
	},
	resetIcon = registerForm.querySelector('.reset-icon'),
	resetButton = registerForm.querySelector('.clear'),
	tableBody = document.querySelector("table tbody"),
	searchInput = document.querySelector('input#Search');

if(localStorage.getItem("students") === null){
	updateLocalStorage();
}else{
	students = JSON.parse(localStorage.getItem('students'));
	id = students[students.length - 1]?.id ?? 0;
	showStudents(students);
	isNoData(students);
}

if(registerForm.getAttribute('data-type') == 'add'){
	registerInputs.forEach(function(input){
		input.addEventListener('focus',function(){
			resetButton.classList.remove('d-none');
		});
		input.addEventListener('blur',function(){
			resetButton.classList.remove('d-none');
		});
	});
}

registerInputs.forEach(function(input){
	input.addEventListener('blur',function(){
		checkInput(input);
	});
});


registerForm.addEventListener('submit',function(e){
	e.preventDefault();
	let formType = registerForm.getAttribute('data-type');
	if(formType == 'add'){
		addStudent();
	}else if(formType == 'edit'){
		editStudent();
		let formButton = registerForm.querySelector('button');
		convertButton(formButton,"Add");
	}
	resetButton.classList.add('d-none');
});

searchInput.addEventListener('keyup',function(){
	console.log(this.value);
	search(this.value);
});

resetButton.addEventListener('click',function(e){
	console.log('hi');
	e.preventDefault(e);
		resetForm();
		resetButton.classList.add('d-none');
});