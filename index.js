const { resolve } = require("path");
const { readdir, writeFile } = require("fs").promises;

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);

    if (
      dirent.isDirectory() &&
      (res.indexOf("photo") > -1 || res.indexOf("main") > -1)
    ) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

(async () => {
  const manifest = { main: [], photo: [] };
  for await (const f of getFiles(".")) {
    if (f.indexOf("DS_Store") > -1) continue;

    // https://raw.githubusercontent.com/rina-andria/rwt/master/main
    const path = f.replace(
      __dirname,
      "https://raw.githubusercontent.com/rina-andria/rwt/master",
    );
    if (path.indexOf("/main/") > -1) {
      manifest.main.push(path);
    }
    if (path.indexOf("/photo/") > -1) {
      manifest.photo.push(path);
    }
  }

  console.log(manifest);

  await writeFile(
    "manifest.json",
    JSON.stringify(manifest),
    "utf8",
    function (err) {
      if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
      }

      console.log("JSON file has been saved.");
    },
  );
})();
