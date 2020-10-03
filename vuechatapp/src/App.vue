<template>
  <div id="app">
   <!-- Login section -->
   <div class="login mt-5" v-if="!name">
    <h3 class="mt-5">Join Chat</h3>
    <label for="username">Enter Username:</label>
    <br />
    <input @keyup.enter="updateUsername" class="mb-3" type="text" v-model="userName" />
    <br />
    <button class="marsbutton" @click="updateUsername">Join Chat</button>
   </div>

  <!-- Chat section -->
    <div class="message-body mt-3" v-else>
      <div class="chat-window">
        <h3>Project Mars Delayed Chat</h3>
        <h5>Welcome {{ name }}! You are in channel {{ channel }}</h5>
        <div class="card">
          <div class="card-body" id="ChatBox">
          <div v-if="messages.length">
            <div class="border pl-2 pt-1 ml-2 message-text mb-2" v-for="message in messages" :key="message">

              <span class="mg-text">{{ message.username }}</span>
              <p class="message pt-1">{{ message.time }} > {{ message.text }}</p>
            </div>

          </div>

          <div v-else>
          <p>Nothing here, hmm</p>
          </div>

          </div>
        </div>
        <input placeholder="Type here" @keyup.enter="queueMessage" v-model="showMessage" type="text" class="mt-3 mr-2 pl-2 pr-2" />
        <button class="marsbutton" @click="queueMessage">Send</button> 

        <input value="0" placeholder="Delay here" type="number" class="mt-3 mr-2 pl-2 pr-2 w-25" id="timeInput">

        <button class="marsbutton mt-1 mr-2 ml-2" @click="setDelay(182)">Lowest Delay</button>
        <button class="marsbutton mt-1 mr-2 ml-2" @click="setDelay(751)">Average Delay</button>
        <button class="marsbutton mt-1 mr-2 ml-2" @click="setDelay(1342)">Highest Delay</button>

      </div>
    </div>
  </div>
</template>

<script>
document.title = "Project Mars";


import fire from "./fire";
export default {
  name: "App",
  data() {
    return {
      userName: "",
      name: null,
      showMessage: "",
      messages: [],
      channel: "main"
    };
  },
  methods: {
    updateUsername() {
      this.name = this.userName;
      console.log(this.userName);
      this.userName = "";
    },

    setDelay(num) {
      document.getElementById("timeInput").value = num;
    },

    queueMessage() {
      let delay = document.getElementById("timeInput").value * 1000
      console.log("queing")

      //I hate this, I really do.
      var that = this

      setTimeout(function() { that.sendMessage(); }, delay)
    },

    emojiReplace(string)
    {
      //yes this is shit code, but it's a hackathon
      return string.replace(":eyeroll:", "🙄").replace(":thinking:", "🤔").replace(":heart:", "❤️").replace(":joy:", "😂").replace(":happy:", "😀").replace(":thumbsup:", "👍").replace(":wink:", "😉").replace(";)", "😉").replace(":)","😀").replace(":happy:", "😀").replace(":facepalm:", "🤦")
    },

    //yes, this is shitty code, but it's a hackathon
    forceUpdate(text) {
      //push message to random channel nobody reads

      let d = new Date();

      let time = d.getHours() + ":" + d.getMinutes()

      const message = {
        text: text,
        username: "System",
        time: time,
        channel: "logs-channel"
      }

      fire
        .database()
        .ref("messages")
        .push(message);
      this.showMessage = "";
    },

    sendMessage() {
      
      if (this.showMessage.includes("/wipe"))
      {
        this.wipe();

        this.forceUpdate("Wipe")
        return;
      }

      if (this.showMessage.includes("/channel"))
      {
        this.channel = this.showMessage.substr(9, this.showMessage.length)
        this.forceUpdate("Channel move: " + this.channel)
        return;
      }

      let d = new Date();

      let time = d.getHours() + ":" + d.getMinutes()

      const message = {
        text: this.emojiReplace(this.showMessage),
        username: this.name,
        time: time,
        channel: this.channel
      }
      fire
        .database()
        .ref("messages")
        .push(message);
      this.showMessage = "";
    },

    wipe() {
      fire.database().ref("messages").remove();
    },

    scrollToBottom() {
      var elementFuckingWorkYouUselessShit = document.getElementsByClassName("message pt-1");

      elementFuckingWorkYouUselessShit = elementFuckingWorkYouUselessShit[elementFuckingWorkYouUselessShit.length - 1]
      elementFuckingWorkYouUselessShit.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  },

  mounted() {
    let viewMessage = this;
    const itemsRef = fire.database().ref("messages");

    window.scrollToBottom = this.scrollToBottom

    itemsRef.on("value", snapshot => {
      let data = snapshot.val();
      let messages = [];

      Object.keys(data).forEach(key => {
        if (data[key].channel == this.channel)
        messages.push({
          id: key,
          username: data[key].username,
          text: data[key].text,
          time: data[key].time
        });        
      })
      viewMessage.messages = messages;
      window.doScroll = true;
    });
  },
};

//yes, this is shit code. But it works!
window.setInterval(function(){
  if (window.doScroll)
  {
    window.scrollToBottom();
    window.doScroll = false;
  }
}, 100);

</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic|Material+Icons");

#app {
  font-family: "Roboto", sans-serif;
  font-size: 18px;
}

body {
  background-image: Url("assets/mars.png");
}

.marsbutton {
  background-color: #B04C2A;
  border: none;
  color: white;
  padding: 10px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 5px;
  transition: box-shadow 0.2s, -moz-box-shadow 0.2s, -webkit-box-shadow 0.2s;
}

.marsbutton:hover {
  -webkit-box-shadow: 0px 5px 10px 0px rgba(176, 76, 42,1);
  -moz-box-shadow: 0px 5px 10px 0px rgba(176, 76, 42,1);
  box-shadow: 0px 5px 10px 0px rgba(176, 76, 42,1);
  transition: box-shadow 0.4s, -moz-box-shadow 0.4s, -webkit-box-shadow 0.4s;
  text-decoration: none;
}

.chat-window {
  background: #fff;
  padding-left: 50px;
  padding-right: 50px;
  border-radius: 20px;
  opacity: 0.9;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.login {
  background: #fff;
  width: 40%;
  height: 20vh;
  margin: auto;
  padding-left: 20px;
  padding-right: 20px;
  opacity: 0.9;
  border-radius: 20px;
}

.centerDiv {
  width: 190px;
  padding: 10px;
  text-align: center;
  margin: 0 auto;
  color: #fff;
}

h3 {
  font-size: 30px;
  text-align: center;
}
input {
  width: 100%;
  border-radius: 4px;
  border: 1px solid rgb(156, 156, 156);
  padding-left: 2px;
  padding-right: 2px;
}
.message-body {
  width: 40%;
  height: 80vh;
  margin: auto;
}
.message-text {
  min-width: 10%;
  border-radius: 4px;
}
.message {
  font-size: 14px;
}
.mg-text {
  color: rgb(176, 76, 42);
  font-weight: bolder;
}
.message-body input {
  width: 80%;
  border-radius: 4px;
  border: 1px solid rgb(156, 156, 156);
  height: 6vh;
  padding-left: 2px;
  padding-right: 2px;
}
.card {
  width: 100%;
  height: 75vh;
  margin: auto;
}
.card-body {
  min-height: 50vh;
  overflow-x: scroll;
}
</style>