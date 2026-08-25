let registerForm = document.querySelector("#Register form"),
	registerInputs = registerForm.querySelectorAll("input");
console.log(registerInputs);
registerForm.addEventListener('submit',function(e){
	e.preventDefault();
	let studentData={},
		itemValue;
	registerInputs.forEach(function(registerInput){
	let itemName = registerInput.name,
		itemValue = registerInput.value;
	studentData[itemName] = itemValue;
	});
	addStudent(studentData)
});
