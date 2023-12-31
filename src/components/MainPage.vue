<template>
    <ScrollTop />
    <ConfirmPopup></ConfirmPopup>

    <MegaMenu orientation="horizontal" class="nav mx-auto">
        <template #start>
            <img alt="logo" src="../../Groupomania_Logos/icon-left-font-monochrome-black.svg" class="mr-2 navlogo" />
        </template>
        <template #end>
            <Avatar class="profilePic p-overlay-badge" v-badge="unseenPosts" :label="avatarLabel" :image="profilePicture" :class="avatarClass" size="large" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" id="avatar"/>
            <Menu ref="profileMenu" :popup="true" :model="profileMenuItems"/>
            <!-- <Toast /> -->
        </template>
    </MegaMenu>
    <div class="cardcontainer flex flex-column-reverse">
        <Post v-for="post in postArray.length" :key="postArray[post - 1].id" :post="postArray[post - 1]" :userId="this.userId" @edit="edit" @deletePost="deletePost" @unseen="this.unseenPosts++" @seen="seePost"></Post>
    
        <div class="surface-card p-4 border-round flex flex-column card">
            <div class="text-3xl font-medium text-900 mb-3">Create A Post Here</div>
            <div class="font-medium text-500 mb-3">Your Username Here</div>
            <div style="height: 100px" class="border-2 border-dashed text-center cursor-pointer text-2xl font-semibold align-content-center createBtn" @click="create()">Click Here to Create a New Post!</div>
        </div>
    </div>
</template>

<script>
import Post from './Post.vue'
import CreatePost from './CreatePost.vue'

export default {
    components: {
        Post,
        CreatePost
    },
    data() {
        return {
            postArray: [],
            creatingPostNow: false,
            editingPostNow: false,
            profilePicture: null,
            profileMenuItems: [
                {
                    label: 'Options',
                    items: [
                        {
                            label: 'Edit Account',
                            icon: 'pi pi-user',
                            command: () => {
                                    this.$emit('editProfile', this.userId);
                                }
                        },
                        {
                            label: 'Logout',
                            icon: 'pi pi-sign-out',
                            command: () => {
                                this.$emit('logout');
                            }
                        },
                        {
                            label: 'Delete Account',
                            icon: 'pi pi-times',
                            command: () => {
                                this.$confirm.require({
                                    target: event.currentTarget,
                                    message: 'Do you want to delete your account?',
                                    icon: 'pi pi-info-circle',
                                    acceptClass: 'p-button-danger',
                                    accept: () => {
                                        this.deleteAccount();
                                    }
                                });
                            }
                        }
                    ]
                }
            ],
            unseenPosts: 0
        }
    },
    emits: [
        'logout',
        'create',
        'edit',
        'editProfile'
],
    props: {
        username: '',
        userId: '',
        newPost: false
    },
    computed: {
        avatarLabel() {
            if (this.profilePicture) {
                // If profile picture exists, show the full image
                return null;
            } else {
                // If no profile picture, show the first letter of the username
                return this.username.charAt(0).toUpperCase();
            }
        },
        avatarClass() {
        // Add 'p-avatar-with-image' class if profilePicture exists
        return this.profilePicture ? 'p-avatar-image' : '';
        }
    },
    watch: {
        newPost : function(post) {
            postArray.push(post);
        }
    },
    methods: {
        toggle(event) {
            this.$refs.profileMenu.toggle(event);
        },
        create() {
            this.$emit('create');
        },
        edit(obj) {
            this.$emit('edit', obj);
        },
        seePost() {
            this.unseenPosts--;
        },
        deletePost(uid) {
            const index = this.postArray.findIndex(item => {
                return item.id === uid;
            });
            if (index !== -1) {
                let idKeyStart = index;
                let idKeyEnd = idKeyStart + 1;
                this.postArray.splice(idKeyStart, idKeyEnd);
            } else {
                console.log('Index not found.');
            }
        },
        deleteAccount() {
            return new Promise((resolve, reject) => {
                let key = localStorage.getItem('validToken');
                let uid = this.userId;
                let request = new XMLHttpRequest();
                request.open('DELETE', `http://localhost:3000/api/${uid}/delete`);
                request.setRequestHeader('Content-Type', 'application/json');
                request.setRequestHeader('Authorization', 'Bearer ' + key);
                request.send();
                request.onreadystatechange = () => {
                    if (request.readyState == 4) {
                        if (request.status === 200 || request.status === 201) {
                            this.$emit('logout');
                            resolve(JSON.parse(request.response));
                        } else {
                            reject(JSON.parse(request.response));
                        }
                    }
                }
            }) 
        }
    },
    created: function() {
        let key = localStorage.getItem('validToken');
            return new Promise((resolve, reject) => {
                let request = new XMLHttpRequest();
                request.open('GET', 'http://localhost:3000/api/');
                request.setRequestHeader('Authorization', 'Bearer ' + key);
                request.send();
                request.onreadystatechange = () => {
                    if (request.readyState == 4) {
                        if (request.status === 200 || request.status === 201) {
                            this.postArray = (JSON.parse(request.response));
                            resolve(JSON.parse(request.response));
                        } else {
                            reject(JSON.parse(request.response));
                        }
                    }
                }
            });
    }
}
</script>

<style scoped>
.cardcontainer {
    margin-top: 15vh;
}

.card {
    box-shadow: 0px 0px 30px -5px rgba(255,255,255,1);
    width: 90%;
    min-width: 300px;
    margin: 0 auto 4vh auto;
}

.nav {
    position: fixed;
    top: 0;
    left: 2.5%;
    right: 2.5%;
    top: 1%;
    box-shadow: 0px 5px 10px -5px rgba(255,255,255,1);
    border: none;
    z-index: 10;
}

.navlogo {
    width: 40vw;
    min-width: 200px;
    max-width: 350px;
}

.profile {
    width: 95%;
}

.createBtn {
    border-color: var(--surface-100);
}

.createBtn:hover {
    border-color: var(--surface-400);
    background-color: var(--surface-100);
    transition: 0.3s;
}

.createBtn:active {
    background-color: var(--surface-200);
}

.p-megamenu {
    border-radius: 32px;
    padding: 1rem 2rem;
}

.p-megamenu-end {
    height: 100%;
}

.profilePic {
    cursor: pointer;
}

.pi-times::before {
    color: var(--red-500);
}
</style>