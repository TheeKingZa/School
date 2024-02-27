const http = require('http');
const fs = require('fs');

// Load user data from JSON file
let userData = [];
fs.readFile('users.json', (err, data) => {
    if (!err) {
        userData = JSON.parse(data);
    }
});

const server = http.createServer((req, res) => {
    const { method, url } = req;
    if (url === '/' || url === '/login.html' || url === '/sign-up.html') {
        fs.readFile(`.${url}`, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('404 Not Found');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (method === 'POST' && url === '/login') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const user = JSON.parse(body);
            const foundUser = userData.find(u => u.username === user.username && u.password === user.password);
            if (foundUser) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Login successful' }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Invalid username or password' }));
            }
        });
    } else if (method === 'POST' && url === '/sign-up') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const newUser = JSON.parse(body);
            const existingUser = userData.find(u => u.username === newUser.username);
            if (existingUser) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Username already exists' }));
            } else {
                userData.push(newUser);
                fs.writeFile('users.json', JSON.stringify(userData), err => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, message: 'Internal server error' }));
                    } else {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, message: 'User signed up successfully' }));
                    }
                });
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('404 Not Found');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
