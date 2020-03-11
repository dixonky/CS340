var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 6749);

var path = require('path'); 
app.use('/static', express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

var path = require('path'); 
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/',function(req,res){
  res.render('home');
});

app.get('/game',function(req,res,next){
    var context = {};
    var callbackCount = 0;
    context.jsscripts = ["deleteGame.js"];
    getTeams(res, mysql, context, complete);
    getGames(res, req, mysql, context, complete);
    function complete()
    {
        callbackCount++;
        if (callbackCount >= 2)
        {
            res.render('game',context);
        }
    }
});

app.get('/game/:id', function(req,res,next) {
    var context = {};
    var callbackCount = 0;
    context.jsscripts = ["updateGame.js", "selectGame.js"]
    getTeams(res, mysql, context, complete);
    getGame(res, mysql, context, req.params.id, complete)
    function complete()
    {
        callbackCount++;
        if (callbackCount >= 2)
        {
            res.render('update-game',context);
        }
    }
});

app.put('/game/:id', function(req, res) {
    mysql.pool.query("UPDATE game SET home_team=?, away_team=?, game_date=? WHERE id=?", [req.body.home_team, req.body.away_team, req.body.game_date, req.params.id],
    function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        res.status(200);
        res.end();
    });
});

app.post('/game', function(req, res, next) {
    var context = {};
    mysql.pool.query(
        'INSERT INTO game (home_team, away_team, game_date) VALUES (?,?,?)',
        [req.body.home_team, req.body.away_team, req.body.game_date], function(err, rows, fields) {
            if (err) {
                next(err);
                return;
            }
            res.redirect('/game');
        }
    )
});

app.delete('/game/:id', function(req, res) {
    mysql.pool.query(
        'DELETE FROM game WHERE id=?', [req.params.id], function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }
            res.status(202).end();
        }
    )
});

app.get('/position',function(req,res,next){
    var context = {};
    var callbackCount = 0;
    context.jsscripts = ["deletePosition.js"];
    getPositions(res, mysql, context, complete);
    function complete()
    {
        callbackCount++;
        if (callbackCount >= 1)
        {
            res.render('position',context);
        }
    }
});

app.get('/position/:id', function(req,res,next) {
    var context = {};
    var callbackCount = 0;
    context.jsscripts = ["updatePosition.js"]
    getPosition(res, mysql, context, req.params.id, complete)
    function complete()
    {
        callbackCount++;
        if (callbackCount >= 1)
        {
            res.render('update-position',context);
        }
    }
});

app.put('/position/:id', function(req, res) {
    console.log(req.body);
    mysql.pool.query("UPDATE position SET pname=?, abbreviation=? WHERE id=?", [req.body.pname, req.body.abbreviation, req.params.id],
    function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        res.status(200);
        res.end();
    });
});

app.post('/position', function(req, res, next) {
    var context = {};
    var sql = "INSERT INTO position (pname, abbreviation) VALUES (?,?)";
    mysql.pool.query(sql,[req.body.pname, req.body.abbreviation], function(err, rows, fields) {
            if (err) {
                next(err);
                return;
            }
            res.redirect('/position');
        }
    )
});

app.delete('/position/:id', function(req, res) {
    mysql.pool.query(
        'DELETE FROM position WHERE id=?', [req.params.id], function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }
            res.status(202).end();
        }
    )
});

app.get('/player',function(req,res,next){
    var context = {};
    var callbackCount = 0;
    getTeams(res, mysql, context, complete);
    getPlayers(res, req, mysql, context, complete);
    getPositions(res, mysql, context, complete);
    function complete()
    {
        callbackCount++;
        if (callbackCount >= 3)
        {
            console.log(context.players);
            res.render('player',context);
        }
    }
});

app.post('/player', function(req, res, next) {
    var context = {};
    mysql.pool.query(
        'INSERT INTO player (pfname, plname, position, number, league_entry, home_city, home_state, home_country, college, team) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [req.body.pfname, req.body.plname, req.body.position, req.body.number, req.body.league_entry, req.body.home_city, req.body.home_state, req.body.home_country, req.body.college, req.body.teamx],
         function(err, rows, fields) {
            if (err) {
                next(err);
                return;
            }
            res.redirect('/player');
        }
    )
});

app.get('/player/:id', function(req,res,next) {
    var context = {};
    var callbackCount = 0;
    context.jsscripts = ["selectTeamx.js", "updatePlayer.js"]
    getTeams(res, mysql, context, complete);
    getPositions(res, mysql, context, complete);
    getPlayer(res, mysql, context, req.params.id, complete);
    function complete()
    {
        callbackCount++;
        if (callbackCount >= 3)
        {
            console.log(context.players);
            res.render('update-player',context);
        }
    }
});

app.put('/player/:id', function(req, res) {
mysql.pool.query('UPDATE player SET pfname = ?, plname = ?, position = ?, number = ?, league_entry = ?, home_city = ?, home_state = ?, home_country = ?, college = ?, team = ? WHERE id=?',[req.body.pfname, req.body.plname, req.body.positionx, req.body.number, req.body.league_entry, req.body.home_city, req.body.home_state, req.body.home_country, req.body.college, req.body.teamx, req.params.id], function(error, result){
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        res.status(200);
        res.end();
    });
});

app.delete('/player/:id', function(req, res) {
    mysql.pool.query(
        'DELETE FROM player WHERE id=?', [req.params.id], function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }
            res.status(202).end();
        }
    )
});

app.get('/team',function(req,res,next){
    var context = {};
    var callbackCount = 0;
    getTeams(res, mysql, context, complete);
    function complete()
    {
        callbackCount++;
        if (callbackCount >= 1)
        {
            res.render('team',context);
        }
    }
});

app.post('/team', function(req, res, next) {
    var context = {};
    mysql.pool.query(
        'INSERT INTO team (region, name, stadium) VALUES (?,?,?)',
        [req.body.region, req.body.name, req.body.stadium], function(err, rows, fields) {
            if (err) {
                next(err);
                return;
            }
            res.redirect('/team');
        }
    )
});

app.get('/team/:id', function(req,res,next) {
var context = {};
    var callbackCount = 0;
    getTeam(res, mysql, context, req.params.id, complete);
    function complete()
    {
        callbackCount++;
        if (callbackCount >= 1)
        {
            res.render('update-team',context);
        }
    }
});

app.put('/team/:id', function(req, res) {
     mysql.pool.query('UPDATE team SET region = ?, name = ?, stadium = ? WHERE id=?',[req.body.region, req.body.name, req.body.stadium, req.params.id],function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        res.status(200);
        res.end();
    });
});

app.delete('/team/:id', function(req, res) {
    mysql.pool.query(
        'DELETE FROM team WHERE id=?', [req.params.id], function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }
            res.status(202).end();
        }
    )
});

app.get('/coach',function(req,res){
    var context = {};
    var callbackCount = 0;
    getTeams(res, mysql, context, complete);
    getCoaches(res, mysql, context, complete);
    function complete()
    {
        callbackCount++;
        if (callbackCount >= 2)
        {
            res.render('coach',context);
        }
    }
});

app.post('/coach', function(req, res, next) {
    var context = {};
    mysql.pool.query(
        'INSERT INTO coach (fname, lname, team) VALUES (?,?,?)',
        [req.body.fname, req.body.lname, req.body.team], function(err, rows, fields) {
            if (err) {
                next(err);
                return;
            }
            res.redirect('/coach');
        }
    )
});

app.get('/coach/:id', function(req,res,next) {
var context = {};
    var callbackCount = 0;
    getTeams(res, mysql, context, complete);
    getCoach(res, mysql, context, req.params.id, complete);
    function complete()
    {
        callbackCount++;
        if (callbackCount >= 2)
        {
            res.render('update-coach',context);
        }
    }
});

app.put('/coach/:id', function(req, res) {
     mysql.pool.query('UPDATE coach SET fname = ?, lname = ?, team = ? WHERE id=?',[req.body.fname, req.body.lname, req.body.team, req.params.id],function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        res.status(200);
        res.end();
    });
});

app.delete('/coach/:id', function(req, res) {
    mysql.pool.query(
        'DELETE FROM coach WHERE id=?', [req.params.id], function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }
            res.status(202).end();
        }
    )
});

app.use(function(req,res){
    res.status(404);
    res.render('404');
});
  
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});
  
app.listen(app.get('port'), function(){
    console.log('Express started on http://flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});


function getTeam(res, mysql, context, id, complete)  {
    mysql.pool.query("SELECT * FROM team WHERE id=?", [id], function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.team = results[0];
        console.log(context.team);
        complete();
})}


function getTeams(res, mysql, context, complete)
{
    mysql.pool.query("SELECT * FROM team", function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.teams = results;
        complete();
    })
}

function getGames(res, req, mysql, context, complete)
{
    var params = [];
    if (req.query.team != "All" && req.query.week != "All" && req.query.team != null && req.query.week != null) {
        dates = getDatesFromWeek(req.query.week);
        first = dates[0];
        last = dates[1];
        mysql.pool.query(
            'SELECT G.id, HT.name AS home_team, AT.name AS away_team, G.game_date FROM game G INNER JOIN team HT ON HT.id = G.home_team INNER JOIN team AT ON AT.id = G.away_team WHERE game_date>=? AND game_date<? AND (home_team=? OR away_team=?);'
            ,[first,last, req.query.team, req.query.team],function(err, rows, fields){
          if(err)
          {
            res.write(JSON.stringify(err));
            res.end();
          }
          var params = [];                   
          for(var row in rows){
              var addItem = {'id':rows[row].id, 'home_team':rows[row].home_team,'away_team':rows[row].away_team,'game_date':rows[row].game_date};
              params.push(addItem);                
          }
          context.games = params;
          complete();
        })
    } else if (req.query.team != "All" && req.query.week == "All" && req.query.team != null) {
        mysql.pool.query(
            'SELECT G.id, HT.name AS home_team, AT.name AS away_team, G.game_date FROM game G INNER JOIN team HT ON HT.id = G.home_team INNER JOIN team AT ON AT.id = G.away_team WHERE home_team=? OR away_team=?;'
            ,[req.query.team, req.query.team],function(err, rows, fields){
          if(err)
          {
            res.write(JSON.stringify(err));
            res.end();
          }
          var params = [];                      
          for(var row in rows){
              var addItem = {'id':rows[row].id, 'home_team':rows[row].home_team,'away_team':rows[row].away_team,'game_date':rows[row].game_date};
              params.push(addItem);                
          }
          context.games = params;  
          complete();
        })
    } else if (req.query.team == "All" && req.query.week != "All" && req.query.week != null) {
        dates = getDatesFromWeek(req.query.week);
        first = dates[0];
        last = dates[1];
        mysql.pool.query(
            'SELECT G.id, HT.name AS home_team, AT.name AS away_team, G.game_date FROM game G INNER JOIN team HT ON HT.id = G.home_team INNER JOIN team AT ON AT.id = G.away_team WHERE game_date>=? AND game_date<?;'
            ,[first,last],function(err, rows, fields){
          if(err)
          {
            res.write(JSON.stringify(err));
            res.end();
          }
          var params = [];                       
          for(var row in rows){
              var addItem = {'id':rows[row].id, 'home_team':rows[row].home_team,'away_team':rows[row].away_team,'game_date':rows[row].game_date};
              params.push(addItem);                
          }
          context.games = params; 
          complete();
        })
    } else {
        mysql.pool.query(
            'SELECT G.id, HT.name AS home_team, AT.name AS away_team, G.game_date FROM game G INNER JOIN team HT ON HT.id = G.home_team INNER JOIN team AT ON AT.id = G.away_team;'
            ,[req.query.id],function(err, rows, fields){
          if(err)
          {
            res.write(JSON.stringify(err));
            res.end();
          }
          var params = [];                      
          for(var row in rows){
              var addItem = {'id':rows[row].id, 'home_team':rows[row].home_team,'away_team':rows[row].away_team,'game_date':rows[row].game_date};
              params.push(addItem);                
            }
            context.games = params;  
            complete();
        })
    }
}

function getGame(res, mysql, context, id, complete)
{
    mysql.pool.query("SELECT * FROM game WHERE id=?", [id], function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        context.game=results[0];
        complete();
    });
}

function getCoaches(res, mysql, context, complete)
{
    mysql.pool.query("SELECT coach.fname, coach.lname, coach.id, team.name AS team FROM coach INNER JOIN team ON coach.team=team.id", function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.coaches = results;
        complete();
    })
}

function getCoach(res, mysql, context, id, complete) {
    mysql.pool.query("SELECT * FROM coach WHERE id=?", [id], function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.coach = results[0];
        console.log(context.coach);
        complete();
})
}
                                       
function getPlayers(res, req, mysql, context, complete)
{
    var params = [];
    if (req.query.team != "All" && req.query.team != null) {
            console.log(req.query);
            mysql.pool.query("SELECT pfname, plname, number, league_entry, home_city, home_state, home_country, college, player.id, position.abbreviation AS position, team.name AS team FROM player INNER JOIN team ON player.team=team.id INNER JOIN position ON player.position=position.id WHERE team=?", [req.query.team], 
            function(error, results, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                context.players = results;
                complete();
            })
    }
    else {
            console.log(req.query);
            mysql.pool.query("SELECT pfname, plname, number, league_entry, home_city, home_state, home_country, college, player.id, position.abbreviation AS position, team.name AS team FROM player INNER JOIN team ON player.team=team.id INNER JOIN position ON player.position=position.id",
            function(error, results, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                context.players = results;
                complete();
            })
    }
}

function getPlayer(res, mysql, context, id, complete) {
    console.log("get player");
    mysql.pool.query("SELECT * FROM player WHERE id=?", [id], function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.playerx = results[0];
        console.log(context.playerx);
        complete();
})
}

function getPositions(res, mysql, context, complete)
{
    console.log("get positions");
    mysql.pool.query("SELECT * FROM position", function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.positions = results;
        console.log(context.positions);
        complete();
    })
}

function getPosition(res, mysql, context, id, complete) {
    console.log("get position");
    mysql.pool.query("SELECT * FROM position WHERE id=?", [id], function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.position = results[0];
        console.log(context.position);
        complete();
    })
}

function getDatesFromWeek(week) {
    //assumes base date of september 1st
    var last = new Date(2019, 8, 1);
    var first = new Date(2019, 8, 1);
    const DAY_PER_WEEK = 7;
    first.setDate(first.getDate() + DAY_PER_WEEK * (week - 1));
    last.setDate(last.getDate() + DAY_PER_WEEK * week);
    return [first, last];
}