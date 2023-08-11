const { read } = require('fs');
const { Socket } = require('net');

function error(message) {
    console.log(message);
    process.exit(1);
}

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const END = "END";

function connect(host, port) {
    console.log(`Connecting to ${host}:${port}`);

    const socket = new Socket();

    socket.connect({host, port});
    socket.setEncoding('utf-8');

    socket.on("connect", () => {
        console.log(`Connected`);

        readline.question("Choose your username: ", (username) => {
            socket.write(username);
            console.log(`Type any message to send it. Type ${END} to finish`);
        });

        readline.on("line", (message) => {
            socket.write(message);
            if(message == END) {
                console.log("Disconnected");
                socket.end();
            }
        });

        socket.on("data", (data) => {
            console.log(data);
        });

        socket.on("close", () => { process.exit(0) });

    });


    socket.on("error", (err) => {
        error(err.message);  
    });

}

function main() {
    if(process.argv.length != 4) {
        error(`Usage: node 'filename' host port`);
    }

    let [, , host, port] = process.argv;

    if(isNaN(port)) {
        error(`Invalid port ${port}`);
    }

    port = Number(port);

    connect(host, port);
}

if(require.main === module){
    main();
}
