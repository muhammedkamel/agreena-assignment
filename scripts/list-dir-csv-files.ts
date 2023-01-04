import fs from "fs"
import path from "path"

const ls = (dirPath: string, csvFiles: string[] = []) : string[] => {
  const files = fs.readdirSync(dirPath)

  for (const file of files) {
    if(fs.statSync(path.join(dirPath, file)).isDirectory()) {
      csvFiles = ls(path.join(dirPath, file), csvFiles)
    } else if (file.split(".").pop() == "csv") {
      csvFiles.push(path.join(dirPath, file))
    }
  }

  return csvFiles
}

console.log(ls(path.join(__dirname, "..", "files")));
