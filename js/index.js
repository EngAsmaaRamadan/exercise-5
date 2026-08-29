let registerForm = document.querySelector("#Register form"),
	registerInputs = registerForm.querySelectorAll("input"),
	students = [],
	student = {},
	inputName,
	inputValue,
	id = 0,
	regexInputs = {
		firstName : /^[A-Za-z]+$/,
		lastName : /^[A-Za-z]+$/,
		email : /^[A-Za-z_][A-Za-z0-9_\.]+@(gmail|yahoo)\.(com|org)$/,
		age : /^[0-9]{2}$/,
		phone : /^(02)?01(0|1|2|5)[0-9]{8}$/,
	},
	tableBody = document.querySelector("table tbody");


registerForm.addEventListener('submit',function(e){
	e.preventDefault();

	let inputFocus = registerForm.querySelector("input:focus");
	//to blur on last input focus when i press enter while i am focus on this input
	inputFocus?.blur();

	let invalidInput = registerForm.querySelector("input.invalid"),//select first input that invalid
		invalidInputDataSet = registerForm.querySelector('input[data-valid="false"]');

	//if invalid input design or empty input return
	if(invalidInput != null || invalidInputDataSet != null){
		return;
	}

	student = getStudent(student,++id);
	students.push(student);
	
	showStudent(student);
	resetForm(this);
});

