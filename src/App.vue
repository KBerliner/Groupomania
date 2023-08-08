<template>
  <Login v-if="!loggedIn && !remember && !signup" @signup="this.signup = true" @login="login"></Login>
  <Signup v-if="!loggedIn && !remember && signup" @back="this.signup = false"></Signup>
  <MainPage v-if="loggedIn && !signup" @logout="this.loggedIn = false"></MainPage>
</template>

<script>
import Login from './components/Login.vue';
import Signup from './components/Signup.vue';
import MainPage from './components/MainPage.vue';

export default {
  name: 'App',
  components: {
    Login,
    Signup,
    MainPage
  },
  data() {
    return {
      loggedIn: true,
      signup: false,
      remember: false,
      userId: '',
      username: ''
    }
  }
}
</script>

<style>

html {
  background-color: rgb(15, 31, 65, 0.4);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 15vh;
  height: 100%;
}
</style>
