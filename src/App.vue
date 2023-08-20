<template>
  <Login v-if="!loggedIn && !remember && !signup" @signup="this.signup = true" @login="login"></Login>
  <Signup v-if="!loggedIn && !remember && signup" @back="this.signup = false"></Signup>
  <MainPage 
  v-if="loggedIn && !signup && !creatingPostNow && !editingPostNow && !editingProfile" 
  @logout="this.loggedIn = false"
  :username="this.username"
  :userId="this.userId"
  @create="this.creatingPostNow = true;"
  @edit="edit"
  @editProfile="profile"
  ></MainPage>
  <CreatePost v-if="creatingPostNow" @back="creatingPostNow = false"></CreatePost>
  <EditPost v-if="editingPostNow" :post="editingThisPost" @back="editingPostNow = false; editingThisPost = {}"></EditPost>
  <Profile v-if="editingProfile" :username="username" @back="editingProfile = false;"></Profile>
</template>

<script>
import Login from './components/Login.vue';
import Signup from './components/Signup.vue';
import MainPage from './components/MainPage.vue';
import CreatePost from './components/CreatePost.vue';
import EditPost from './components/EditPost.vue';
import Profile from './components/Profile.vue';

export default {
  name: 'App',
  components: {
    Login,
    Signup,
    MainPage,
    CreatePost,
    EditPost,
    Profile
  },
  data() {
    return {
      loggedIn: true,
      signup: false,
      remember: false,
      userId: '12345678',
      username: 'Julianne',
      creatingPostNow: false,
      editingPostNow: false,
      editingThisPost: {},
      editingProfile: false
    }
  },
  methods: {
    edit(obj) {
      this.editingPostNow = true;
      this.editingThisPost = obj;
    },
    profile() {
      this.editingProfile = true;
    }
  }
}
</script>

<style>

html {
  background-color: rgb(15, 31, 65, 0.6);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
</style>
