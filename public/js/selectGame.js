function selectGame(home_id, away_id, game_date) {
    var date = new Date(game_date);
    var datestr = date.getFullYear() + '-';
    if (date.getMonth()+1 < 10) {
        datestr += '0';
    }
    datestr += (date.getMonth()+1) + '-';
    if (date.getDay()+1 < 10) {
        datestr += '0';
    } 
    datestr += (date.getDay()+1);
    $("#home_team").val(home_id);
    $("#away_team").val(away_id);
    $("#game_date").val(datestr);
}