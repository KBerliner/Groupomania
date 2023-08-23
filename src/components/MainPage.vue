<template>
    <ScrollTop />

    <MegaMenu orientation="horizontal" class="nav mx-auto">
        <template #start>
            <img alt="logo" src="../../Groupomania_Logos/icon-left-font-monochrome-black.svg" class="mr-2 navlogo" />
        </template>
        <template #end>
            <Avatar class="profilePic" :label="avatarLabel" :image="profilePicture" :class="avatarClass" size="large" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"/>
            <Menu ref="profileMenu" :popup="true" :model="profileMenuItems"/>
            <!-- <Toast /> -->
        </template>
    </MegaMenu>
    <div class="cardcontainer">
        <div class="surface-card p-4 border-round flex flex-column card">
            <div class="text-3xl font-medium text-900 mb-3">Create A Post Here</div>
            <div class="font-medium text-500 mb-3">Your Username Here</div>
            <div style="height: 100px" class="border-2 border-dashed text-center cursor-pointer text-2xl font-semibold align-content-center createBtn" @click="create()">Click Here to Create a New Post!</div>
        </div>

        <Post v-for="post in postArray.length" :key="postArray[post - 1]._id" :post="postArray[post - 1]" :userId="this.userId" @edit="edit"></Post>
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
            postArray: [
            //     // {
            //     //     _id: '12349876',
            //     //     title: 'This is an example Title',
            //     //     caption: 'Example caption here',
            //     //     author: 'KBerliner',
            //     //     authorId: '12345678',
            //     //     image: ''
            //     // }
            ],
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
                            icon: 'pi pi-times'
                        }
                    ]
                }
            ]
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
</style>