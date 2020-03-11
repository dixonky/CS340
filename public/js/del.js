var docu = document.getElementById('addPlayer');
if (docu){
docu.addEventListener('click',function(event){   
	var newPlayer = document.getElementById("addPlayer");               
	var req = new XMLHttpRequest();
	var param = "pfname="+addPlayer.elements.pfname.value+ "&plname="+addPlayer.elements.plname.value+"&number="+addPlayer.elements.number.value+"&home_city="+addPlayer.elements.home_city.value+"&home_state="+addPlayer.elements.home_state.value+"&home_country="+addPlayer.elements.home_country.value+"&college="+addPlayer.elements.college.value+"&league_entry="+addPlayer.elements.league_entry.value+"&position="+addPlayer.elements.position.value+"&team="+addPlayer.elements.team.value;

	req.open("GET", "/insert?" + param, true);                
	req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');	
	req.addEventListener('load', function(){                        
        if(req.status >= 200 && req.status < 400)
        {
			var response = JSON.parse(req.responseText);           
			var id = response.inserted;
			var table = document.getElementById("playerTab"); 
			var row = table.insertRow();
			var pfname = document.createElement('td'); 
            var plname = document.createElement('td'); 
            var number = document.createElement('td'); 
            var league_entry = document.createElement('td'); 
            var home_city = document.createElement('td'); 
            var home_state = document.createElement('td');
            var home_country = document.createElement('td');
            var college= document.createElement('td');
            var position = document.createElement('td');
            var team = document.createElement('td');
            
            pfname.textContext = addPlayer.elements.pfname.value;
            plname.textContext = addPlayer.elements.plname.value;
            number.textContext = addPlayer.elements.number.value;
            league_entry.textContext = addPlayer.elements.league_entry.value;
            home_city.textContext = addPlayer.elements.home_city.value;
            home_state.textContext = addPlayer.elements.home_state.value;
            home_country.textContext = addPlayer.elements.home_country.value;
            college.textContext = addPlayer.elements.college.value;
            position.textContext = addPlayer.elements.position.value;
            team.textContext = addPlayer.elements.team.value;

            row.appendChild(pfname);
            row.appendChild(plname);
            row.appendChild(number);
            row.appendChild(league_entry);
            row.appendChild(home_city);
            row.appendChild(home_state);
            row.appendChild(home_country);
            row.appendChild(college);
            row.appendChild(position);
            row.appendChild(team);
         
			var updateData = document.createElement('td');              
			var updateLink = document.createElement('a');
			updateLink.setAttribute('href','/update?id=' + id +"&mode=p");
            var updateButton = document.createElement('input');         
            setAttributes(updateButton,{"type":"button", "value":"Modify"});
			updateLink.appendChild(updateButton);
			updateData.appendChild(updateLink);
			row.appendChild(updateData);                                   
            
            var deleteCell = document.createElement('td');  
            var deleteLink = document.createElement('a');
			var deleteButton = document.createElement('input'); 
            var deleteHidden = document.createElement('input');
            setAttributes(deleteButton,{"type":"button", "name":"delete","value":"Delete Row", "onClick":"deleteDataButton("+id+")"});
            setAttributes(deleteHidden,{"type":"hidden", "id":id});
            deleteLink.appendChild(deleteButton);
            deleteCell.appendChild(deleteLink); 
            deleteCell.appendChild(deleteHidden);
            row.appendChild(deleteCell);                                    
        }
		else 
        {
	    	console.log("error: " + req.statusText);
		}
	});
	
	req.send("/insert?" + param);                              
	event.preventDefault();                                     
});
}

function deleteDataButton(id){                         
    var deleteItem = "delete" + id;	
	var table = document.getElementById("playerTab");     
	var numRows = table.rows.length;
    console.log(deleteItem);
    for(var i = 1; i < numRows; i++){                           
		var row = table.rows[i];
		var findData = row.getElementsByTagName("td");		    
		var erase = findData[findData.length -1];	
        console.log(erase.children[1].id);
		if(erase.children[1].id === deleteItem)
        {                
			table.deleteRow(i);
            console.log('Found');
            break;
		}
        if( erase.children[1].id == id)
        {                
			table.deleteRow(i);
            console.log('Found');
            break;
		}
	}
    var req = new XMLHttpRequest();
	req.open("GET", "/delete?id=" + id, true);              
	req.addEventListener("load",function(){
		if(req.status >= 200 && req.status < 400)
        {         
	    	console.log('success: '+req.statusText);
		} else 
        {
		    console.log('error: '+req.statusText);
		}
	});
	req.send("/delete?id=" + id);                          
}


var docDate = document.getElementById('date');
if (docDate)
{
    docDate.valueAsDate = new Date();
}

//https://stackoverflow.com/questions/12274748/setting-multiple-attributes-for-an-element-at-once-with-javascript
function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}