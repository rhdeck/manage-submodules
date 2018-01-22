const cp = require("child_process");
const Path = require("path");
const rimraf = require("rimraf");
const ini = require("ini");
const fs = require("fs");
const baseOptions = {
  stdio: "inherit"
};
function checkForGit() {
  const out = exec("git");
  if (out) return true;
  return false;
}
function list() {
  const gitmodulesfile = Path.join(process.cwd(), ".gitmodules");
  if (!fs.existsSync(gitmodulesfile)) return {};
  const txt = fs.readFileSync(gitmodulesfile, "utf8");
  if (!txt) return {};
  const l = ini.parse(txt);
  if (!l) return {};
  var out = {};
  Object.keys(l).forEach(k => {
    const v = l[k];
    const path = v.path;
    const URL = v.url;
    out[path] = URL;
  });
  return out;
}
function add(path, url, branch, version) {
  if (!path) return;
  var options = [];
  if (branch) {
    options.push("-b");
    options.push(branch);
  }
  const fullPath = resolvePath(path);
  cp.spawnSync(
    "git",
    ["submodule", "add", ...options, url, fullPath],
    baseOptions
  );
  return path;
}
function remove(path) {
  if (!path) return;
  const fullPath = resolvePath(path);
  cp.spawnSync(
    "git",
    ["submodule", "deinit", "--force", fullPath],
    baseOptions
  );
  cp.spawnSync("git", ["rm", "-f", fullPath], baseOptions);
  rimraf.sync(fullPath);
  if (
    fs.existsSync(resolvePath()) &&
    fs.readdirSync("submodules").length == 0
  ) {
    cp.spawnSync("git", ["rm", "-f", resolvePath()], baseOptions);
    rimraf.sync(resolvePath());
  }
}
function update(path) {
  if (!path) return;
  const fullPath = resolvePath(path);
  cp.spawnSync("git", ["submodule", "update", "--init", fullPath], baseOptions);
}
function resolvePath(path) {
  const base = "submodules";
  if (!path) return base;
  if (path.startsWith(base)) return path;
  return Path.join(base, path);
}
function spawn(path, command, args, options) {
  if (!path) return spawnAll(command, args, options);
  if (options && typeof options == "object") {
    Object.keys(baseOptions).forEach(key => {
      if (typeof options[key] == "undefined") options[key] = baseOptions[key];
    });
  }
  const oldcwd = process.cwd();
  const fullPath = resolvePath(path);
  process.chdir(fullPath);
  cp.spawnSync(command, args, options);
  process.chdir(oldcwd);
}
function spawnAll(command, args, options) {
  Object.keys(list()).forEach(key => {
    spawn(key, command, args, options);
  });
}
function exec(path, command, options) {
  if (!path) return execAll(command, options);
  if (options && typeof options == "object") {
    Object.keys(baseOptions).forEach(key => {
      if (typeof options[key] == "undefined") options[key] = baseOptions[key];
    });
  }
  const oldcwd = process.cwd();
  const fullPath = resolvePath(path);
  process.chdir(fullPath);
  cp.execSync(command, options);
  process.chdir(oldcwd);
}
function execAll(command, options) {
  Object.keys(list()).forEach(key => {
    exec(key, command, options);
  });
}
function walkAll(cb) {
  const oldcwd = process.cwd();
  Object.keys(list()).forEach(key => {
    const fullPath = resolvePath(key);
    process.chdir(fullPath);
    cb(key);
    process.chdir(oldcwd);
  });
}
function updateAll() {
  Object.keys(list()).forEach(key => {
    update(key);
  });
}
function removeAll() {
  Object.keys(list()).forEach(key => {
    remove(key);
  });
}
module.exports = {
  list: list,
  add: add,
  remove: remove,
  removeAll: removeAll,
  spawn: spawn,
  spawnAll: spawnAll,
  exec: exec,
  execAll: execAll,
  update: update,
  updateAll: updateAll,
  resolvePath: resolvePath,
  walkAll: walkAll
};
