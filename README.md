# Wondering if the CrowdProcess Platform is running?

## About

This script allows you to quickly determine if the CrowdProcess Platform, which is currently in closed beta, is up and running properly.

Make sure to replace `email` and `password` in the `index.js` file with your CrowdProcess credentials.

```javascript
//Authentication using your CrowdProcess login information
AuthClient.login('email', 'password', function(err, credential) {
```

## Install & Run

To install:

```bash
git clone https://github.com/stigdreyer/crp-platform-test.git
npm install
```

Run the script either by excecuting.

```bash
node index.js
```

or

```bash
npm test
```

## About CrowdProcess

CrowdProcess is a distributed computing platform that runs on top of web browsers. Its much simpler than existing platforms, with the potential to be much more powerful.