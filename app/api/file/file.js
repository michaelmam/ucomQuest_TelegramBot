const express = require("express");
const File = require("./file.schema");
const fs = require("fs");
const path = require("path");
const router = express.Router()
const FileType = require('file-type');
const http = require('https'); // or 'https' for https:// URLs
router.post('/', async (req, res) => {
  const file = saveFile(req.body)
  res.json(file)
})
router.get('/', async (req, res) => {
  const files = await File.find();
  res.json(files)
})
router.get('/fileData/:fileName', async (req, res) => {
  const data = {
    fileType: await getFileType(req.params.fileName),
    fileData: getFile(req.params.fileName),
  }
  res.json(data)
})
const saveFile = async (data) => {
  const dir = path.join(__dirname, `../../../files/${data.userTeamName}/`)
  if (!fs.existsSync(path.join(__dirname, `../../../files/`))) {
    fs.mkdirSync(path.join(__dirname, `../../../files/`));
  }
  const fileName = `${dir}/${data.userCode}${data.userCode}${data.userCode}__${data.fileName}`
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  if (data.fileHref) {
    const file = fs.createWriteStream(fileName);
    await http.get(data.fileHref, (response) => {
      response.pipe(file);
    }).on('error', function (err) { // Handle errors
      fs.unlink(fileName); // Delete the file async. (But we don't check the result)
    });
    const newFile = new File(data);
    return await newFile.save()
  }
}
const getFile = (filename) => {
  const filePath = `../../../uploads/${filename}`
  return fs.readFileSync(path.join(__dirname, filePath))
}
const getFileType = (filename) => {
  const filePath = `../../../uploads/${filename}`
  return FileType.fromFile(path.join(__dirname, filePath))
}
module.exports = {
  router,
  saveFile,
  getFileType,
  getFile,
}
