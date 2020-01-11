const fs = require("fs");
const path = require("path");

const templateFolder = "./template/templates";
const srcFolder = "./src";
const entityName = process.argv[2];

if (!entityName) {
  console.error("Missing entity name")
  process.exit(1);
}

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
    return index == 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}

function snakeize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word) {
    return word.toUpperCase();
  }).replace(/\s+/g, '');
}

function openTemplates(templateFolder) {
  const files = fs.readdirSync(templateFolder);
  return files.map((file) => ({
    name: file,
    content: fs.readFileSync(path.join(templateFolder, file)).toString()
  }));
}

const updateTemplate = (templates, entityName) => {
  const classNameRegex = new RegExp("Template", "g");
  const variableNameRegex = new RegExp("template", "g");
  const variableName = camelize(entityName);
  const className = snakeize(entityName);
  return templates.map((template) => ({
    name: template.name.replace(classNameRegex, className),
    content: template.content.replace(classNameRegex, className).replace(variableNameRegex, variableName)
  }));
}

const writeFiles = (targetPath, files) =>
  files.forEach(file => {
    const filePath = path.join(targetPath, file.name);
    fs.writeFileSync(filePath, file.content);
  });

const templates = openTemplates(templateFolder);
const targetFiles = updateTemplate(templates, entityName);

const targetFolder = path.join(srcFolder, camelize(entityName));
if (fs.existsSync(targetFolder)) {
  console.error(`Folder ${targetFolder} already exists`);
  process.exit(1);
}
fs.mkdirSync(targetFolder);
writeFiles(targetFolder, targetFiles);