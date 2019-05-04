"use strict";
const fs = require("fs");
const path = require("path");
const isFile = (f) => fs.statSync(f).isFile();
const isDir = (f) => fs.statSync(f).isDirectory();
const write = (fName, str) => new Promise((res, rej) => {
    fs.writeFile(path.resolve(fName), str, (err) => {
        if (err)
            return rej(err);
        return res(str);
    });
});
const readFolder = (folder, exclude, invisibles) => {
    let fileList = fs.readdirSync(path.resolve(folder));
    let files = [];

    fileList.forEach(f => {
        const fpath = path.join(folder, f);
        if (!invisibles && /^\..*/.test(f)) {
            return;
        }
        if (!isFile(fpath)) {
            return;
        }
        if (exclude) {
            if (Array.isArray(exclude) && !exclude.includes(f)) {
                files.push(fpath)
            } else if (typeof exclude == 'function' && !exclude(f, fpath)) {
                files.push(fpath)
            }
        } else if (!exclude) {
            files.push(fpath)
        }
    });

    if (!invisibles) {
        files = files.filter(f => {
            if (!/^\..*/.test(f)) {
                return f;
            }
        })
    }

    return files;
}


const read = (file, modifier) => new Promise((res, rej) => {
    fs.readFile(path.resolve(file), (err, str) => {
        if (err)
            rej(err);
        if (modifier && typeof modifier == 'function') {
            str = modifier(str, path.basename(file), file)
        }
        res(str);
    });
});

const concat = (config) => new Promise((res, rej) => {
    let { files, delimiter, fileStr } = config;

    return Promise.all(files.map(f => read(f, fileStr)))
        .then(src => res(src.join(delimiter)))
        .catch(rej);
});

const validateFiles = (files, exclude, invisibles) => {
    let validated = [];

    files.forEach((file) => {
        if (isDir(file)) {
            const dirFiles = readFolder(file, exclude, invisibles);
            if (dirFiles) {
                validated = validated.concat(dirFiles);
            }
        } else {
            validated.push(file);
        }
    });
    return validated;
}

module.exports = (config) => new Promise((res, rej) => {
    let {
        files,
        out,
        exclude,
        invisibles,
        outStr,
        fileStr,
        delimiter,
    } = config;

    // true will include invisible files when concat folder
    invisibles = (typeof invisibles == 'undefined' || invisibles === null ? false : invisibles);
    delimiter = (typeof delimiter == 'undefined' || delimiter === null ? '\n' : delimiter);

    files = validateFiles(files, exclude, invisibles)

    concat({ files, delimiter, fileStr }).then(str => {
            if (outStr && typeof outStr == 'function') {
                str = outStr(str);
            }
            return str
        })
        .then(res => {
            if (out) {
                return write(out, res)
            }
            return res;
        })
        .then(res)
        .catch(rej).catch(rej);
});