function selectTeamx(team, position, game_date){
    var valTeam = team;
    var selTeam = document.getElementById('teamx');
    var valPos = position;
    var selPos = document.getElementById('positionx');
    window.onload = function() 
    {
      var optsTeam = selTeam.options;
      var optsPos = selPos.options;
      for (var opt, j = 0; opt = optsTeam[j]; j++) 
      {
        if (opt.value == valTeam) 
        {
          selTeam.selectedIndex = j;
          break;
        }
      }
      for (var opt, j = 0; opt = optsPos[j]; j++) 
      {
        if (opt.value == valPos) 
        {
          selPos.selectedIndex = j;
          break;
        }
      }
    }
    var date = new Date(game_date);
    var datestr = date.getFullYear()+ '-';
    if (date.getMonth()+1 < 10) {
        datestr += '0';
        datestr += (date.getMonth()+1) + '-';
    }
    else {
        datestr += (date.getMonth()+1) + '-';
    }
    if (date.getDay()+1 < 10) {
        datestr += '0';
    } 
    datestr += (date.getDay()+1);
    selDate = document.getElementById('datex'); 
    console.log(datestr);
    selDate.value = datestr;
}