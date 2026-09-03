let registerForm = document.querySelector("#Register form"),
	registerInputs = registerForm.querySelectorAll("input"),
	students = [],
	student = {},
	errorEle,
	isEmpty,
	isInvalid,
	trEle,
	inputFocus,
	otherButtons,
	formButton = registerForm.querySelector('button.basic'),
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
	popup = document.querySelector('.popup'),
	popupBox = popup.querySelector('.popup-box'),
	popupCloseIcon = popup.querySelector('.close'),
	searchInput = document.querySelector('input#Search');
if(localStorage.getItem('largestId') === null){
	localStorage.setItem('largestId',JSON.parse(id));
}

if(localStorage.getItem("students") === null ){
	updateLocalStorage();
	isNoData(students);
}else{
	students = JSON.parse(localStorage.getItem('students'));
	id = students[students.length - 1]?.id ?? JSON.parse(localStorage.getItem('largestId'));
	showStudents(students);
	isNoData(students);
}

registerInputs.forEach(function(input){
	input.addEventListener('focus',function(){
		resetButton.classList.remove('d-none');
	});
	input.addEventListener('blur',function(){
		resetButton.classList.remove('d-none');
		checkInput(input);
	});
});

registerForm.addEventListener('submit',function(e){
	e.preventDefault();
	let formType = registerForm.getAttribute('data-type');
	if(formType == 'add'){
		addStudent();
	}else if(formType == 'edit' && registerForm.querySelector('button').className.includes('edit')){
		editStudent();
	}
	
	resetButton.classList.add('d-none');
});

searchInput.addEventListener('keyup',function(){
	search(this.value);
});

searchInput.removeAttribute('disabled');

resetButton.addEventListener('click',function(e){
	e.preventDefault(e);
		resetForm();
		formButton = registerForm.querySelector('button.basic');
		if(formButton.className.includes('edit')){
			registerForm.dataset.type = 'edit';//because resetForm(); make type 'add' so without it when click on resetButton and put data then enter it added as new row not edit existing row			
		}else if(formButton.className.includes('add')){
			registerForm.dataset.type = 'add';
		}
		
		resetButton.classList.add('d-none');
});

popupCloseIcon.addEventListener('click',closePopup);
popup.addEventListener('click',closePopup);
popupBox.addEventListener('click',function(e){
	e.stopPropagation();
})