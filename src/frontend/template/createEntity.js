const fs = require("fs");
const path = require("path");

const srcTemplateFolder = "./template/templates/src";
const testTemplateFolder = "./template/templates/test";
const manualStepsFolder = "./template/manual-steps";
const srcFolder = "./src";
const testFolder = "./test";
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

function openManualSteps(stepsFolder) {
  const files = fs.readdirSync(stepsFolder);
  return files.map((file) => ({
    name: file.replace(".txt", ""),
    content: fs.readFileSync(path.join(stepsFolder, file)).toString()
  }));
}

const updateTemplate = (templates, entityName) => {
  const classNameRegex = new RegExp("Template", "g");
  const variableNameRegex = new RegExp("template", "g");
  const uppercaseRegex = new RegExp("TEMPLATE", "g");
  const variableName = camelize(entityName);
  const className = snakeize(entityName);
  const upperCaseName = entityName.toUpperCase();
  return templates.map((template) => ({
    name: template.name.replace(classNameRegex, className),
    content: template.content.replace(classNameRegex, className).replace(variableNameRegex, variableName).replace(uppercaseRegex, upperCaseName)
  }));
}

const formatManualSteps = (files) =>
  files.map(file => `----------------------------\n${file.name}\n----------------------------\n\n${file.content}`)

const writeFiles = (targetPath, files) =>
  files.forEach(file => {
    const filePath = path.join(targetPath, file.name);
    fs.writeFileSync(filePath, file.content);
  });

const srcTemplates = openTemplates(srcTemplateFolder);
const srcTargetFiles = updateTemplate(srcTemplates, entityName);
const testTemplates = openTemplates(testTemplateFolder);
const testTargetFiles = updateTemplate(testTemplates, entityName);
const manualSteps = updateTemplate(openManualSteps(manualStepsFolder), entityName);

const targetFolder = path.join(srcFolder, camelize(entityName));
if (fs.existsSync(targetFolder)) {
  console.error(`Folder ${targetFolder} already exists`);
  process.exit(1);
}
fs.mkdirSync(targetFolder);
writeFiles(targetFolder, srcTargetFiles);
writeFiles(testFolder, testTargetFiles);

console.log(`Done. Update those files now:`);
console.log(formatManualSteps(manualSteps).join("\n\n"));