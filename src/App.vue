<template>
  <Login v-if="!loggedIn && !remember && !signup" @signup="this.signup = true" @login="login"></Login>
  <Signup v-if="!loggedIn && !remember && signup" @back="this.signup = false" @login="login"></Signup>
  <MainPage 
  v-if="loggedIn && !signup && !creatingPostNow && !editingPostNow && !editingProfile" 
  :newPost="newPost"
  @logout="logout"
  :username="this.username"
  :userId="this.userId"
  @create="this.creatingPostNow = true;"
  @edit="edit"
  @editProfile="profile"
  ></MainPage>
  <CreatePost v-if="creatingPostNow" @back="creatingPostNow = false" @createdPost="creatingPostNow = false; this.newPost = true" :author="username" :authorId="userId"></CreatePost>
  <EditPost v-if="editingPostNow" :post="editingThisPost" @back="editingPostNow = false; editingThisPost = {}" @editedPost="this.updatedPost = true; editingPostNow = false; editingThisPost = {}"></EditPost>
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
      loggedIn: false,
      signup: false,
      remember: true,
      userId: '',
      username: '',
      creatingPostNow: false,
      editingPostNow: false,
      editingThisPost: {},
      editingProfile: false,
      newPost: false,
      updatedPost: false
    }
  },
  methods: {
    edit(obj) {
      this.editingPostNow = true;
      this.editingThisPost = obj;
    },
    profile() {
      this.editingProfile = true;
    },
    login(uid, username, token) {
      this.loggedIn = true;
      this.userId = uid;
      this.username = username;
      if (token)  {
        this.remember = true;
          if (localStorage) {
          localStorage.setItem('validToken', token);
        }
      }
      this.signup = false;
    },
    logout() {
      this.loggedIn = false;
      this.username = '';
      this.userId = '';
      this.remember = false;
      localStorage.removeItem('validToken');
    }
  },
  created() {

    // This is to implement "User Persistence"

    if (localStorage) {
        if (localStorage.getItem('validToken')  && localStorage.getItem('validToken') !== undefined) {
            let key = JSON.stringify({ key: localStorage.getItem('validToken') });
            return new Promise((resolve, reject) => {
                let request = new XMLHttpRequest();
                request.open('POST', 'http://localhost:3000/api/persist');
                request.setRequestHeader('Content-Type', 'application/json');
                request.send(key);
                request.onreadystatechange = () => {
                    if (request.readyState == 4) {
                        if (request.status === 200 || request.status === 201) {
                            this.login(JSON.parse(request.response).userId, JSON.parse(request.response).username, JSON.parse(request.response).token);
                            resolve(JSON.parse(request.response));
                        } else {
                          console.log('not persisting');
                          this.logout();
                        }
                    }
                }
            });
        } else {
          this.remember = false;
        }
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
