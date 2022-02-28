let express = require("express");
let sqlite3 = require("sqlite3");
let { open } = require("sqlite");
let path = require("path");
let app = express();

let dbpath = path.join(__dirname, "cricketTeam.db");
let db = null;

let database = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3002, () => {
      console.log("iam");
    });
  } catch (e) {
    console.log(`${e.message}`);
    proccess.exit(1);
  }
};
database();
function convert(obj) {
  return {
    playerId: obj.player_id,
    playerName: obj.player_name,
    jerseyNumber: obj.jersey_number,
    role: obj.role,
  };
}

app.get("/players/", async (request, response) => {
  let query = `SELECT * FROM cricket_team;`;
  let k = await db.all(query);
  response.send(k.map((k_) => convert(k_)));
});

app.get("/players/:playerId/", async (request, response) => {
  let p = request.params;
  console.log(p);
  let query = `SELECT * FROM cricket_team WHERE player_id=${p.playerId};`;
  let k = await db.get(query);
  console.log(convert(k));
  response.send(convert(k));
});

app.use(express.json());
app.post("/players/", async (request, response) => {
  let player = request.body;

  let query = `INSERT INTO cricket_team (player_name,jersey_number,role)
  VALUES ('${player.playerName}',${player.jerseyNumber},'${player.role}');`;
  let k = await db.run(query);
  response.send("Player Added to Team");
});

app.put("/players/:playerId", async (request, response) => {
  let player = request.body;
  let id = request.params;
  //console.log(id);
  let query = `UPDATE cricket_team 
  SET player_name='${player.playerName}',
      jersey_number=${player.jerseyNumber},
      role='${player.role}';
  WHERE player_id=${id.playerId}`;
  let k = await db.run(query);

  response.send("Player Details Updated");
});

app.delete("/players/:playerId", async (request, response) => {
  let id = request.params;

  let query = `DELETE FROM cricket_team 
  WHERE player_id=${id.playerId}`;
  await db.run(query);
  response.send("Player Removed");
});

module.exports = app;
