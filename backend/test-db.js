const oracledb = require("oracledb");

async function run() {
  try {
    const conn = await oracledb.getConnection({
      user: "c##hrtester",
      password: "123",
      connectString: "localhost:1521/iba"
    });

    console.log("Connected! 🎉");

    const result = await conn.execute("SELECT 'Hello Oracle!' AS msg FROM dual");
    console.log(result.rows);

    await conn.close();
  } catch (err) {
    console.error(err);
  }
}

run();
