"use strict";

const { response } = require("express");
// import the needed node_modules.
const express = require("express");
const morgan = require("morgan");
let JOKEMODE = 0;
// 0 = cleared joke request, 1 = wait for answer

// global variables
const commonGreetings = ["hi", "hello", "howdy"];
const commonGoodbyes = ["goodbye", "bye", "seeya", "salut"];
const jokes = [
  'A teacher asked her students to use the word "beans" in a sentence. "My father grows beans," said one girl. "My mother cooks beans," said a boy. A third student spoke up, "We are all human beans."',
  "Q: Is Google male or female?\nA: Female, because it doesn't let you finish a sentence before making a suggestion.",
  "My friend thinks he is smart. He told me an onion is the only food that makes you cry, so I threw a coconut at his face.",
  "What happens to a frog's car when it breaks down? It gets toad away.",
  "Q: Why did the can crusher quit his job?\nA: Because it was soda pressing.",
  "Q: If you have 13 apples in one hand and 10 oranges in the other, what do you have?\nA: Big hands.",
  "Q: Why did the school kids eat their homework?\nA: Because their teacher told them it was a piece of cake.",
]; // from http://www.laughfactory.com/jokes/clean-jokes

express()
  // Below are methods that are included in express(). We chain them for convenience.
  // --------------------------------------------------------------------------------
  // more common way:
  // const app = express();
  // and use app as prefix

  // This will give us will log more info to the console. see https://www.npmjs.com/package/morgan
  .use(morgan("tiny"))

  // Any requests for static files will go into the public folder
  .use(express.static("public"))

  // Nothing to modify above this line
  // ---------------------------------
  // add new endpoints here 👇
  // cat message
  .get("/cat-message", (req, res) => {
    // .get(PATH, callback function)
    const message = { author: "cat", text: "meow" };
    const randomTime = Math.floor(Math.random() * 3000);
    setTimeout(() => {
      res.status(200).json({ status: 200, message });
    }, randomTime);
  })
  // monkey message
  .get("/monkey-message", (req, res) => {
    const messages = [
      "Don’t monkey around with me.",
      "If you pay peanuts, you get monkeys.",
      "I fling 💩 at you!",
      "🙊",
      "🙈",
      "🙉",
    ];
    // construct a return message
    const message = {
      author: "monkey",
      text: messages[Math.floor(Math.random() * messages.length)],
    };
    // add settimeout and call json
    const randomTime = Math.floor(Math.random() * 3000);
    setTimeout(() => {
      res.status(200).json({ status: 200, message });
    }, randomTime);
  })
  // parot message
  .get("/parrot-message", (req, res) => {
    //console.log("This is the quert: ", req.query); // passing from front-end to backend
    // construct a return message
    const message = {
      author: "parrot",
      text: req.query.text,
    };
    const randomTime = Math.floor(Math.random() * 3000);
    setTimeout(() => {
      res.status(200).json({ status: 200, message });
    }, randomTime);
  })

  // bot message
  .get("/bot-message", (req, res) => {
    const getBotMessage = (text) => {
      // it wasn't specified so just append all the answers at the end I guess?
      // If someone puts "hi bye" in the text, then the output would be "Hello Goodbye"
      let botMsg = "";

      // ============ match for greeting ============
      let reg_str = "("; // append greeting ( and all other expressions)
      commonGreetings.forEach((element) => {
        reg_str += `(${element})|`;
      });
      reg_str += ")"; // close bracket

      // use regular expression
      // solved:
      // find exact match for all tokens  e.g. won't match this, helloween, thowdy!
      // match multiple strings: e.g. hello howdy will not be recognized
      // match to space " "
      // current problem:
      let reg = new RegExp("(\\b" + reg_str + "\\b\\s*)", "ig"); // ig: i=>ignore case; g=>return all matches
      console.log(reg);
      console.log(text.match(reg));
      let count = 0;
      text.match(reg).forEach((ele) => {
        if (ele !== "" && ele !== " " && count === 0) {
          console.log(ele);
          botMsg += "Hello "; // add hello at the end
          count++;
        }
      });

      // ============ match for boodbye ============
      reg_str = "("; // append greeting ( and all other expressions)
      commonGoodbyes.forEach((element) => {
        reg_str += `(${element})|`;
      });
      reg_str += ")"; // close bracket

      // use regular expression
      // solved:
      // current problem:
      // will match good-bye which make sense but not desirable may be?...
      // check with TA
      reg = new RegExp("(\\b" + reg_str + "\\b\\s*)", "ig"); // ig: i=>ignore case; g=>return all matches
      console.log(reg);
      console.log(text.match(reg));
      count = 0;
      text.match(reg).forEach((ele) => {
        if (ele !== "" && ele !== " " && count === 0) {
          botMsg += "goodBye"; // add bye at the end
          count++;
        }
      });

      // ============ match for something funny and call back to input ============
      let t = text.toLowerCase();
      if (t === "something funny") {
        botMsg = "Do you want a joke?(yes/no)";
        JOKEMODE++; // shift to 1;
      } else if (t === "yes" && JOKEMODE === 1) {
        // problem: I tried nested request, but it won't work as usual
        botMsg = jokes[Math.floor(Math.random() * jokes.length)];
        JOKEMODE = 0; // decrement joke mode
      } else if (t === "no" && JOKEMODE === 1) {
        botMsg = "Goodbye :(";
      }

      if (botMsg === "") {
        botMsg = `"${text}"`;
      }

      return botMsg;
    };

    //console.log(getBotMessage(req.query.text));
    const message = {
      author: "bot",
      text: `Bzzt ${getBotMessage(req.query.text)}`,
    };
    const randomTime = Math.floor(Math.random() * 3000);
    setTimeout(() => {
      res.status(200).json({ status: 200, message });
    }, randomTime);
  })
  // add new endpoints here ☝️
  // ---------------------------------
  // Nothing to modify below this line

  // this serves up the homepage
  .get("/", (req, res) => {
    res
      .status(200)
      .json({ status: 200, message: "This is the homepage... it's empty :(" });
  })

  // this is our catch all endpoint. If a user navigates to any endpoint that is not
  // defined above, they get to see our 404 page.
  .get("*", (req, res) => {
    res.status(404).json({
      status: 404,
      message: "This is obviously not the page you are looking for.",
    });
  })

  // Node spins up our server and sets it to listen on port 8000.
  .listen(8000, () => console.log(`Listening on port 8000`));
