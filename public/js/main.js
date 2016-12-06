var insertCount = 0;
var errors = [];
var successfulEntries = 0;
var totalElems = 0;
var table;
var keys;
var rows;

function retrieveJSON(){
	var companyURL = 'http://localhost:3000/company';
	var candyURL = 'http://localhost:3000/candyItems';
	$.getJSON(companyURL, function(data) {
        console.log(data)
		populateCompanies(data);
    });
	$.getJSON(candyURL, function(data) {
        console.log(data)
		populateCandies(data);
    });
}

populateCompanies = function(companies){
	var companyTableSpace = document.getElementById('companyTable');
	companyTableSpace.appendChild(document.createTextNode("Companies:"));
	var companyTable = document.createElement("table"); 
	companies.data.forEach(function(company){
		var companyRow = companyTable.insertRow(-1);
		companyRow.insertCell(-1).innerHTML = company.company;
		companyRow.insertCell(-1).innerHTML = company.web_address;
		companyRow.insertCell(-1).innerHTML = company.first_name;
		companyRow.insertCell(-1).innerHTML = company.last_name;
		companyRow.insertCell(-1).innerHTML = company.phone_number;
		companyRow.insertCell(-1).innerHTML = company.email;
		companyRow.insertCell(-1).innerHTML = company.date;
		companyRow.insertCell(-1).innerHTML = company.ip_address;
	});
	companyTableSpace.appendChild(companyTable);
}

populateCandies = function(candyItems){
	var candyTableSpace = document.getElementById('candyItemsTable');
	candyTableSpace.appendChild(document.createTextNode("Candy Items:"));
	var candyTable = document.createElement("table"); 
	candyItems.data.forEach(function(candyItem){
		var candyRow = candyTable.insertRow(-1);
		candyRow.insertCell(-1).innerHTML = candyItem.company;
		candyRow.insertCell(-1).innerHTML = candyItem.web_address;
		candyRow.insertCell(-1).innerHTML = candyItem.candy_one;
		candyRow.insertCell(-1).innerHTML = candyItem.candy_two;
		candyRow.insertCell(-1).innerHTML = candyItem.candy_three;
	});
	candyTableSpace.appendChild(candyTable);
}

function Upload() {
	increment = 1;
	var fileUpload = document.getElementById("fileUpload");
	var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                table = document.createElement("table");
                rows = e.target.result.split("\n");
				keys = rows[0].split(",")
                totalElems = rows.length;
				addToTable(rows[increment]);
				var dvCSV = document.getElementById("dvCSV");
                dvCSV.innerHTML = "";
                dvCSV.appendChild(table);
			}
            reader.readAsText(fileUpload.files[0]);
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid CSV file.");
    }
}

function postCSVToDatabase(parsedRow){
	console.log({parsedRow : parsedRow})
	$.ajax({
	  url: 'http://localhost:3000/company',
	  type: 'post',
	  dataType: 'json',
	  data: parsedRow,
	  success: function(data) {
			successfulEntries += 1;
			increment += 1;
			if(increment>=totalElems-1){
				giveFeedback();
			}
			else{
				addToTable(rows[increment]);
			}
	}})
	  .fail(function($xhr) {
		increment += 1;
		errors.push($xhr.responseJSON.data);
		console.log(errors);
		if(increment>=totalElems-1){
			giveFeedback();
		}
		else{
			addToTable(rows[increment]);
		}
	});
}

function addToTable(nextRow){
	var outputArray = {};
	var row = table.insertRow(-1);
	var cells = nextRow.split(",");
	for (var j = 0; j < cells.length; j++) {
	   var cell = row.insertCell(-1);
	   cell.innerHTML = cells[j];
	   outputArray[keys[j]] = cells[j]
	}
	console.log(outputArray);
	postCSVToDatabase(outputArray);
}

function giveFeedback(){
	if(errors.length > 0){
		document.getElementById("status").innerHTML = document.getElementById("status").innerHTML + 
		("<p>Ingestion and data transfer process successfully completed - please review report as possible duplicative data was found.</p><br/><p>"
		+ successfulEntries + " items added!</p> <br/> <p> Errors: </p>" + errors );
	}
	else{
		console.log(errors);
		document.getElementById("status").innerHTML = document.getElementById("status").innerHTML +
		("<p>Ingestion and data transfer process successfully completed!</p><br/><p>" 
		+ successfulEntries + " items added!</p>");
	}
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