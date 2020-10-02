<template>
  <div id="app">
   <!-- Login section -->
   <div class="login mt-5" v-if="!name">
    <h3 class="mt-5">Join Chat</h3>
    <label for="username">Enter Username:</label>
    <br />
    <input @keyup.enter="updateUsername" class="mb-3" type="text" v-model="userName" />
    <br />
    <button class="btn btn-primary" @click="updateUsername">Join Chat</button>
   </div>

  <!-- Chat section -->
    <div class="message-body mt-3" v-else>
      <h3>Chat</h3>
      <h5>Welcome {{ name }}!</h5>
      <div class="card">
        <div class="card-body" id="ChatBox">
        <div v-if="messages.length">
          <div class="border pl-2 pt-1 ml-2 message-text mb-2" v-for="message in messages" :key="message">

            <span class="mg-text">{{ message.username }}</span>
            <p class="message pt-1">{{ message.time }} : {{ message.text }}</p>
          </div>

        </div>

        <div v-else>
        <p>Nothing here, hmm</p>
        </div>

        </div>
      </div>
      <input @keyup.enter="sendMessage" v-model="showMessage" type="text" class="mt-3 mr-2 pl-2 pr-2" />
      <button class="btn btn-primary" @click="sendMessage">Send</button> 
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
      messages: []
    };
  },
  methods: {
    updateUsername() {
      this.name = this.userName;
      console.log(this.userName);
      this.userName = "";
    },
    sendMessage() {
      let d = new Date();

      let time = d.getHours() + ":" + d.getMinutes()

      const message = {
        text: this.showMessage,
        username: this.name,
        time: time
      }
      fire
        .database()
        .ref("messages")
        .push(message);
      this.showMessage = "";
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
.login {
  background: #fff;
  width: 40%;
  height: 50vh;
  margin: auto;
  padding-left: 20px;
  padding-right: 20px;
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
  color: rgb(0, 195, 255);
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