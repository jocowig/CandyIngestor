function retrieveJSON(){
	var url = 'http://localhost:3000/company';
	$.getJSON(url, function(data) {
        console.log(data)
		populateCompanies(data);
    });
}

populateCompanies = function(companies){
	var list = document.getElementById('companyList');
	companies.data.forEach(function(company){
		var entry = document.createElement('li');
		entry.appendChild(document.createTextNode(company.company+" "));
		entry.appendChild(document.createTextNode(company.first_name+" "));
		entry.appendChild(document.createTextNode(company.last_name+" "));
		entry.appendChild(document.createTextNode(company.web_address+" "));
		list.appendChild(entry);
	});
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}