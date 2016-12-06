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
	var errors = [];
	var successfulEntries = 0;
	var increment = 1;
	var outputArray = {};
	var fileUpload = document.getElementById("fileUpload");
	var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                var table = document.createElement("table");
                var rows = e.target.result.split("\n");
				var keys = rows[0].split(",")
                for (var i = 1; i < rows.length-1; i++) {
                    var row = table.insertRow(-1);
                    var cells = rows[i].split(",");
                    for (var j = 0; j < cells.length; j++) {
                       var cell = row.insertCell(-1);
                       cell.innerHTML = cells[j];
						outputArray[keys[j]] = cells[j];
					}
					$.ajax({
					  url: 'http://localhost:3000/company',
					  data: outputArray,
					  type: 'post',
					  success: function(data) {
							successfulEntries += 1;
							increment +=1
							if(i>=rows.length){
								console.log("got here");
								if(errors.length > 0){
									document.getElementById("status").appendChild(document.createTextNode("Ingestion and data transfer process successfully completed - please review report as possible duplicative data was found."));
								}
								else{
									console.log(errors);
									document.getElementById("status").appendChild(document.createTextNode("Ingestion and data transfer process successfully completed!" + successfulEntries + " items added!"));
								}
							}
					}})
					  .fail(function($xhr) {
						  increment += 1
						errors.push($xhr.responseJSON.data);
					  if(increment>=rows.length-1){
								if(errors.length > 0){
									document.getElementById("status").appendChild(document.createTextNode("Ingestion and data transfer process successfully completed - please review report as possible duplicative data was found.\n\r"+ successfulEntries + " items added!\n\r" + errors ));
								}
								else{
									console.log(errors);
									document.getElementById("status").appendChild(document.createTextNode("Ingestion and data transfer process successfully completed!" + successfulEntries + " items added!"));
								}
							}
					});
				}
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