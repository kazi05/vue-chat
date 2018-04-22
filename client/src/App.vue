<template>
  <v-app>
    <v-toolbar fixed app dark>
      <v-spacer></v-spacer>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 offset-xs0 md6 offset-md3>
            <v-text-field
              name="name"
              label="Ваше имя"
              v-model="name"
              required
              :rules="[() => name.length > 0 || 'Это обязательное поле']"
              color="#E0E0E0"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 offset-xs0 md6 offset-md3>
            <div
              style="height: 45vh; background-color: #E0E0E0"
              class="scroll-y"
              id="scrolling-techniques"
            >
              <v-container style="height: auto;" v-if="isEmtyItems" id="scroll-container" v-scroll:#scrolling-techniques="onScroll">
                <div v-for="message in messages" :key="message" class="message-block">
                  <h4 :style="{ color: message.textColor } ">{{ message.name }}</h4>
                  <span> {{ message.time }} </span>
                  <p> {{ message.text }} </p>
                </div>
              </v-container>
              <v-container v-else style="width: 100%; height: 100%;">
                <h3 style="width: 100%; text-align: center;">Нет сообщений</h3>
              </v-container>
            </div>
          </v-flex>
          <v-flex xs11 offset-xs0 md5 offset-md3>
            <v-text-field
              name="text"
              label="Введите сообщение"
              v-model="text"
              multi-line
              required
              @keyup.enter.prevent="sendMessage"
            ></v-text-field>
          </v-flex>
          <v-flex p>
            <v-btn flat icon :disabled="!formIsValid" @click="sendMessage">
              <v-icon class="primary--text">send</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
      </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        title: 'Супер чат',
        name: '',
        text: '',
        fixed: true,
        color: '',
        messages: [],
        emptyItems: 'Нет сообщений',
        offSet: 0,
        offsetHeight: 0
      }
    },

    sockets:{
      connect: function(){
        this.isConnected = true
        console.log('socket connected')
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        this.color = color;

        this.$socket.emit('recive_history')
      },
      
      add_message(val) {
        const date = new Date(val.time)
        const minutes = ('0' + date.getMinutes()).slice(-2)
        const time = (date.getHours() - 3) + ':' + minutes
        const message = {
            name: val.name,
            text: val.text,
            textColor: val.textColor,
            time: time
        }
        this.messages.push(message)
        const container = document.getElementById('scrolling-techniques')
        this.offsetHeight = container.scrollHeight

        if (this.offSet > (this.offsetHeight - 450)) {
          setTimeout(function() {
            container.scrollTop = container.scrollHeight
          }, 10)
        }
      },

      recive_message(messages) {
        console.log(messages)
        for (let item of messages) {
          const date = new Date(item.time)
          const minutes = ('0' + date.getMinutes()).slice(-2)
          const time = (date.getHours() - 3) + ':' + minutes
          const message = {
            name: item.name,
            text: item.text,
            textColor: item.textColor,
            time: time
          }
          this.messages.push(message)
        }
      }
    },
    computed: {
      formIsValid() {
        return this.name !== '' && this.text !== ''
      },
      isEmtyItems() {
        return this.messages.length > 0
      }
    },
    methods: {
      sendMessage() {
        if (this.text.trim() !== '' && this.name.trim() !== '') {
          const val = {
            name: this.name,
            text: this.text,
            textColor: this.color
          }

          this.$socket.emit('send_message', val)
          this.text = ''
          
        }else {
          this.text = ''
        }
      },
      onScroll (e) {
        this.offSet = e.target.scrollTop
      }
    }
  }
</script>

<style>
  @import './assets/custom.css';
</style>

