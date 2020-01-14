const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db/database.db");

db.serialize(() => {
  db.run(
    `
    insert into promotion values(0,"CHAUSSETTE"),(1,"BOXERSALE"),(2,"JEANBOF"),(3,"SWEATNUL")
  `,
    error => {
      console.log(error);
    }
  );

  db.run(
    `
    insert into qrcode values(0,1),(1,3),(2,0),(3,2)
  `,
    error => {
      console.log(error);
    }
  );
});
db.close();
