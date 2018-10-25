

function getProfs() {

  var profNames = document.getElementsByClassName('dddefault');
  var length = profNames.length;
  var originalName = "";
  var professors = [];

  for (var i = 19; i < length; i += 27) {

    var profName = document.getElementsByClassName('dddefault')[i];
    if (profName.innerText != 'TBA' && profName.innerText != '') {
      originalName = profName.innerText;
      profName.innerText = profName.innerText.substring(0,profName.innerText.length-4);

      //Hubert Dunsmore is known by Buster Dunsmore
      if(profName.innerText.includes("Hubert") && profName.innerText.includes("Dunsmore")) {
        profName.innerText = "Buster Dunsmore";
      }

    var words = profName.innerText.split(' ');
    if(words.length > 2) {
      profName.innerText = words[0] + ' ' + words[words.length-1];
    }

    if(profName.innerText.includes('-') == true) {
      profName.innerText = profName.innerText.split('-')[0];
    }

    professors.push(profName.innerText);
    profName.innerText = originalName;
    } else {
      professors.push("No Rating");
    }

  }
  return professors;
}

function headingCell(cellNum, heading) {
  var tableRef = document.getElementsByClassName("datadisplaytable")[0];
  var tableBody = tableRef.getElementsByTagName("tbody")[0];
  var tableRow = tableBody.getElementsByTagName("tr")[1];

  //Add the Rating Heading cell
  var headCell = tableRow.insertCell(cellNum);
  var headText = document.createTextNode(heading);
  headCell.appendChild(headText);

  headCell.style.backgroundColor = "#E3E5EE";
  headCell.style.fontWeight = "bold";
  headCell.style.fontFamily = "Verdana";
  headCell.style.fontSize = "90%";
  headCell.style.border = "2px solid white";
}

function addCell(rating, rowNumber,cellNumber) {

  var tableRef = document.getElementsByClassName("datadisplaytable")[0];
  var tableBody = tableRef.getElementsByTagName("tbody")[0];
  var tableRow = tableBody.getElementsByTagName("tr")[1];

  //Add rest of the rating cells
  var length = tableBody.getElementsByTagName("tr").length;
  var tableRow1 = tableBody.getElementsByTagName("tr")[rowNumber];
  var newCell = tableRow1.insertCell(cellNumber);
  var newText = document.createTextNode(rating);
  newCell.appendChild(newText);

  newCell.style.fontFamily = "Verdana";
  newCell.style.fontSize = "90%";
  newCell.style.backgroundColor = "white";


}

function firstXHRCall(name, rowNumber) {
  var url = "https://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=purdue+university+-+west+lafayette&queryoption=HEADER&query=" + name + "&facetSearch=true";
  chrome.runtime.sendMessage(url,function(responseText) {
    var tmp = document.createElement('div');
    tmp.innerHTML = responseText;
    var profList = tmp.getElementsByClassName('listing PROFESSOR');

    if(profList.length == 0) {
      addCell('No Rating', rowNumber,20);
      addCell("0", rowNumber,21);

    } else {

    var pName = profList[0].innerHTML;
    tmp = document.createElement('div');
    tmp.innerHTML = pName;
    var link = tmp.getElementsByTagName("a")[0].getAttribute("href");
    var url2 = 'http://www.ratemyprofessors.com/' + link;
    secondXHRCall(url2,name, rowNumber);
  }

  });

}

function secondXHRCall(url,name, rowNumber) {

  chrome.runtime.sendMessage(url,function(responseText) {

    var tmp = document.createElement('div');
    tmp.innerHTML = responseText;
    var tCount = tmp.getElementsByClassName("tftable");
    if(tCount.length == 0) {
      addCell('No Rating', rowNumber,20);
      addCell("0", rowNumber,21);
    } else {

    var rating = tmp.getElementsByClassName("grade")[0].innerHTML + "/5.0";
    var ratingCount = tmp.getElementsByClassName("table-toggle rating-count active")[0].innerText.split(" ");

    addCell(rating, rowNumber,20);
    addCell(ratingCount[8], rowNumber,21);
  }
  });
}

function main() {
  headingCell(20,"Professor Rating");
  headingCell(21,"Number of Ratings");
  var profNames = getProfs();

  var length = profNames.length;

  for (var i = 0; i < length; i++) {
    firstXHRCall(profNames[i],i+2);

  }
}


main();
