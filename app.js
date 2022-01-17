const https = require('http');
const fs = require('fs');
const { nanoid } = require('nanoid');

const server = https.createServer((req, res, next) => {
    let { url, method } = req;

    if (url == '/getAllUsers' && method == 'GET') {
        const fileData = JSON.parse(fs.readFileSync('myDb.json'));
        res.write(JSON.stringify(fileData));
        res.end();
    }
    else if (url == '/addUser' && method == 'POST') {
        let bodyData;
        req.on('data', (chunk) => {
            bodyData = JSON.parse(chunk)
        })
        req.on('end', () => {
            bodyData.id = nanoid();
            const fileData = JSON.parse(fs.readFileSync("myDb.json"));
            const findUser = fileData.find((el) => {
                return el.email == bodyData.email
            })
            if (findUser) {
                res.write("in-valid email");
                res.end();
            }
            else {
                fileData.push(bodyData)

                fs.writeFileSync("myDb.json", JSON.stringify(fileData));
                res.write("added Success");
                res.end();

            }
        })

    }
    else if (url == '/updateUser' && method == 'PUT') {
        let bodyData;
        req.on('data', (chunck) => {
            bodyData = JSON.parse(chunck);
        })
        req.on('end', () => {
            const fileData = JSON.parse(fs.readFileSync('myDb.json'));

            let userExist = false;
            let userIndex;

            // const updteUser = fileData.find((el, i) => {
            //     userIndex = i
            //     return el.id == bodyData.id
            // })
            const findUser = fileData.find((el, i) => {
                if (el.id == bodyData.id) {
                    userExist = true;
                    userIndex = i;
                    return el;
                }
            })
            if (userExist) {
                fileData[userIndex].id = bodyData.id;
                fileData[userIndex].name = bodyData.name;
                fileData[userIndex].password = bodyData.password;
                fileData[userIndex].age = bodyData.age;
                fs.writeFileSync('myDb.json', JSON.stringify(fileData));
                res.write("Updated Success")
                res.end();
            }
            else {
                res.write('in-valid user');
                res.end();
            }

        })
    }
    else if (url == '/searchUser' && method == 'POST') {

        let bodyData;

        req.on('data', (chunk) => {
            bodyData = JSON.parse(chunk);
        });

        req.on('end', () => {
            let { searchKey } = bodyData;
            const fileData = JSON.parse(fs.readFileSync('myDb.json'));
            const userList = fileData.find((el) => {
                return el.id == searchKey || el.name == searchKey ||
                    el.email == searchKey || el.password == searchKey ||
                    el.age == searchKey
            })
            // console.log(userList)
            if (userList) {
                res.write(JSON.stringify(userList));
                res.end();
            }
            else {
                res.write("searchKey is not found");
                res.end();
            }
        })
    }
    else if (url == '/deleteUser' && method == 'DELETE') {
        let bodyData;
        req.on('data', (chunk) => {
            bodyData = JSON.parse(chunk);
        })
        req.on("end", () => {
            let userIndex;
            const fileData = JSON.parse(fs.readFileSync('myDb.json'));
            const findUser = fileData.find((el, i) => {
                if (el.id == bodyData.id) {
                    userIndex = i
                    return el;
                }
            })
            if (findUser) {

                fileData.splice(userIndex,1);
                console.log("fileData==", fileData);
                fs.writeFileSync('myDb.json', JSON.stringify(fileData));
                res.write(JSON.stringify(fileData))
                res.end();
            } else {
                res.write("in-valid id")
                res.end();
            }
        })
    } 
    else if (url == '/getUserReveres' && method == 'GET') {
        const fileData = JSON.parse(fs.readFileSync('myDb.json'));
        fileData.reverse();
        res.write(JSON.stringify(fileData));
        res.end();
    }
});

server.listen(5000, () => {
    console.log('server running ')
})