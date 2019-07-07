<script>
  import axios from 'axios';
  import { StreamChat } from 'stream-chat'

  let hasJoinedChat = false;
  let token = '';
  let username = '';
  let user = '';
  let channel = '';
  let client = '';
  let messages = [];
  let newMessage = '';

  function joinChat(event) {
    event.preventDefault();
    axios.post('http://localhost:3000/join', {
      username,
    })
      .then(response => {
        const { data } = response;
        username = "";
        user = data.user;
        token = data.token;

        return initializeStream();
      })
      .then(() => initializeChannel())
      .then(room => {
        hasJoinedChat = true;
        messages = room.messages
        channel.on("message.new", event => {
          messages = [...messages, {
            text: event.message.text,
            user: event.message.user
          }]
        });
      })
      .catch(console.error)
  }

  function initializeStream() {
    const { username } = user;

    client = new StreamChat('<your stream app access key>');

    return client.setUser({ id: username, name: username }, token);
  }

  function initializeChannel() {
    channel = client.channel("messaging", "svelte-chat", {
      name: "Svelte Chat"
    });

    return channel.watch();
  }

  function sendMessage(event) {
    event.preventDefault();

    channel.sendMessage({
      text: newMessage
    });

    newMessage = "";
  }
</script>

<style>
  html {
    box-sizing: border-box;
  }

  *, *::before, *::after {
    box-sizing: inherit;
    margin: 0;
    padding: 0;
  }

  .login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid #ddd;
    padding: 20px;
  }

  .login-form h2 {
    margin-bottom: 20px;
  }

  button[type="submit"] {
    width: 100%;
    padding: 10px;
    font-size: 18px;
    color: #fff;
    background-color: #000;
    cursor: pointer;
  }

  button[type="submit"]:hover {
    color: #000;
    background-color: #fff;
  }

  input {
    width: 100%;
    margin-bottom: 20px;
    padding: 10px;
  }

  label {
    margin-bottom: 20px;
  }

  .chat {
    position: absolute;
    bottom: 50px;
    right: 50px;
    height: 400px;
    display: flex;
    flex-direction: column;
    width: 300px;
    border: 1px solid #dcc;
  }

  .chat header {
    border-bottom: 1px solid #dcc;
    padding: 20px;
  }

  .messages {
    padding: 10px;
    flex-grow: 1;
    list-style: none;
  }

  .message {
    display: block;
    text-align: left;
    margin-bottom: 20px;
  }

  .message span {
    border-radius: 5px;
    color: #333;
    background-color: #dcc;
    display: inline-block;
    padding: 10px;
  }

  .message.current-user {
    text-align: right;
  }

  .message.current-user span {
    color: #fff;
    background-color: #1e87f0;
  }

  .message-form {
    border-top: 1px solid #dcc;
    position: relative;
    bottom: 0;
  }

  .message-form input {
    border: none;
    margin-bottom: 0;
  }
</style>

<div class="App">
  {#if hasJoinedChat}
    <div class="chat">
      <header>
        <h2>Chat</h2>
        <p>Logged in as <strong>{user.username}</strong></p>
      </header>
      <ul class="messages">
        {#each messages as message}
          <li class="message {message.user.id === user.username ? 'current-user' : ''}">
            <span>
              {message.text}
            </span>
          </li>
        {/each}
      </ul>
      <form class="message-form" on:submit={sendMessage}>
        <input type="text" bind:value={newMessage} name="newMessage"
        placeholder="Enter your message">
      </form>
    </div>
  {:else}
    <div class="login-form">
      <h2>Sign in to Chat</h2>
      <form on:submit={joinChat}>
        <label for="username">Enter your username</label>
        <input type="text" bind:value={username} id="username" name="username"
        placeholder="Username">
        <button type="submit">Join Chat</button>
      </form>
    </div>
  {/if}
</div>
