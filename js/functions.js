function addStudent(student) {
	validateStudent(student);
	// studentsData.push(student);
	console.log(student);
}

function validateStudent(student){
	let regexInputs = {
		firstName : /^[A-Za-z]+$/,
		lastName : /^[A-Za-z]+$/,
		email : /^[A-Za-z_][A-Za-z0-9_\.]+@(gmail|yahoo)\.(com|org)$/,
		age : /^[0-9]{2}$/,
		phone : /^(02)?01(0|1|2|5)[0-9]{8}$/,
	};

	let inputName,
		inputValue;
	for(let field in student){
		inputName = field;
		inputValue = student[field];
		console.log(regexInputs[inputName].test(inputValue));
	}

}