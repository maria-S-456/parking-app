function save(){
	var value = document.getElementById('search-from-profile').value;
	sessionStorage.setItem('textbox', value);
};