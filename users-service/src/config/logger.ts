import readline from "readline";


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


const ask = (question:string) => {
  rl.question(question, (answer) => {
    if (!answer) ask(question);
    process.stderr.write("Oh some error occured!");
    process.stdout.write(answer);
    rl.close();
  })
}

ask("What is your name: ")