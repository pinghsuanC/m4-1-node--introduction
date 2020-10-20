// here there be JS, yarrr ☠️
// retrieve the elements
const messageInput = document.querySelector("#user-input"); // id of user input
const conversationElem = document.querySelector("#conversation-container"); // id of the box which shows messages
// helper methods
const handleFocus = () => {
  messageInput.focus();
};

// fonted js
const sendMessage = (event) => {
  // onSubmit functino of form element
  // prevent the default "page reload" from occurring.
  event.preventDefault();
  //console.log(messageInput.value);
  // update conversation
  const message = { author: "user", text: messageInput.value };
  updateConversation(message);

  // fetch the response form cat
  // This is a 'GET' call to the /cat-message endpoint.
  fetch("/cat-message")
    .then((res) => res.json())
    .then((data) => {
      updateConversation(data.message);
    });
};

// updateConversation expects an object with 'user' and 'text'
const updateConversation = (message) => {
  // message format:
  //    {
  //      author: '', // 'user' or 'cat'
  //      text: ''    } // the actual message
  // deconstruct the message object
  const { author, text } = message;

  // render the message into the msg box
  conversationElem.scrollTop = conversationElem.scrollHeight;
  // create a <p> element
  const messageElem = document.createElement("p");
  // add class
  messageElem.classList.add("message", author);
  // add the text message to the element
  messageElem.innerHTML = `<span>${text}</span>`;
  // append the element to the conversation
  conversationElem.appendChild(messageElem);

  // clear input
  if (author === "user") {
    messageInput.value = "";
  }

  // autofocus
  handleFocus();
};

handleFocus();
