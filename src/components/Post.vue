<template>
    <div class="surface-card p-4 border-round flex flex-column card">
        <div class="text-3xl font-medium text-900 mb-3">{{ title }}</div>
        <div class="font-medium text-500 mb-3">{{ author }}</div>
        <article class="content">
            
            <img v-if="post.image" :src="image" class="postImg"/>
            <div>{{ caption }}</div>
        </article>
        <section v-if="likesEnabled">
            <Button icon="pi pi-thumbs-up" :label="displayLikes" class="likesbuttons" @click="like" text raised rounded severity="success"></Button>
            <Button icon="pi pi-thumbs-down" :label="displayDislikes" class="likesbuttons" iconPos="left" @click="dislike" text raised rounded severity="danger"></Button>
        </section>
        <section v-if="owner">
            <Button label="Edit" icon="pi pi-pencil" class="modBtn" @click="edit"/>
            <Button label="Delete" icon="pi pi-times" class="modBtn bg-red-500 border-red-500" />
            
        </section>
    </div>
</template>

<script>
export default {
    data() {
        return {
            _id: this.post._id,
            title: this.post.title,
            caption: this.post.caption,
            author: this.post.author,
            authorId: this.post.authorId,
            likes: this.post.likes,
            dislikes: this.post.dislikes,
            usersLiked: this.post.usersLiked,
            usersDisliked: this.post.usersDisliked,
            usersSeen: this.post.usersSeen,
            likesEnabled: this.post.likesEnabled
        }
    },
    emits: [
        'edit'
    ],
    props: {
        post: {},
        userId: ''
    },
    computed: {
        image() {
            if (this.post.image || this.post.image !== '') {
                return this.post.image;
            } else {
                return null;
            }
        },
        displayLikes() {
            return this.likes.toString();
        },
        displayDislikes() {
            return this.dislikes.toString();
        },
        owner() {
            if (this.authorId === this.userId) {
                return true;
            } else {
                return false;
            }
        }
    },
    methods: {
        edit() {
            this.$emit('edit', {
                _id : this._id,
                title: this.title,
                caption: this.caption,
                image: this.image
                });
        },
        like() {
            console.log(this._id);
                if (!this.post.usersLiked.includes(this.userId) && !this.post.usersDisliked.includes(this.userId)) {
                    this.likes++;
                    this.usersLiked.push(this.userId);

                    return new Promise((resolve, reject) => {
                        let uid = this._id;
                        let request = new XMLHttpRequest();
                        request.open('POST', `http://localhost:3000/api/${uid}/like`);
                        request.setRequestHeader('Content-Type', 'application/json');
                        request.send(JSON.stringify({
                            like: 1,
                            userId: this.userId
                        }));
                        request.onreadystatechange = () => {
                            if (request.readyState == 4) {
                                if (request.status === 200 || request.status === 201) {
                                    resolve(JSON.parse(request.response));
                                } else {
                                    reject(JSON.parse(request.response));
                                }
                            }
                        }
                    });
                } else if (this.post.usersLiked.includes(this.userId) && !this.post.usersDisliked.includes(this.userId)) {
                    this.likes--;
                    let idKeyStart = this.usersLiked.indexOf(this.userId);
                    let idKeyEnd = idKeyStart + 1;
                    this.usersLiked.splice(idKeyStart, idKeyEnd);

                    return new Promise((resolve, reject) => {
                        let uid = this._id;
                        let request = new XMLHttpRequest();
                        request.open('POST', `http://localhost:3000/api/${uid}/like`);
                        request.setRequestHeader('Content-Type', 'application/json');
                        request.send(JSON.stringify({
                            like: 0,
                            userId: this.userId
                        }));
                        request.onreadystatechange = () => {
                            if (request.readyState == 4) {
                                if (request.status === 200 || request.status === 201) {
                                    resolve(JSON.parse(request.response));
                                } else {
                                    reject(JSON.parse(request.response));
                                }
                            }
                        }
                    });
                }
            },
            dislike() {
                if (!this.post.usersLiked.includes(this.userId) && !this.post.usersDisliked.includes(this.userId)) {
                    this.dislikes++;
                    this.usersDisliked.push(this.userId);

                    return new Promise((resolve, reject) => {
                        let uid = this._id;
                        let request = new XMLHttpRequest();
                        request.open('POST', `http://localhost:3000/api/${uid}/like`);
                        request.setRequestHeader('Content-Type', 'application/json');
                        request.send(JSON.stringify({
                            like: -1,
                            userId: this.userId
                        }));
                        request.onreadystatechange = () => {
                            if (request.readyState == 4) {
                                if (request.status === 200 || request.status === 201) {
                                    resolve(JSON.parse(request.response));
                                } else {
                                    reject(JSON.parse(request.response));
                                }
                            }
                        }
                    });
                } else if (!this.post.usersLiked.includes(this.userId) && this.post.usersDisliked.includes(this.userId)) {
                    this.dislikes--;
                    let idKeyStart = this.usersDisliked.indexOf(this.userId);
                    let idKeyEnd = idKeyStart + 1;
                    this.usersDisliked.splice(idKeyStart, idKeyEnd);

                    return new Promise((resolve, reject) => {
                        let request = new XMLHttpRequest();
                        let uid = this._id;
                        request.open('POST', `http://localhost:3000/api/${uid}/like`);
                        request.setRequestHeader('Content-Type', 'application/json');
                        request.send(JSON.stringify({
                            like: 0,
                            userId: this.userId
                        }));
                        request.onreadystatechange = () => {
                            if (request.readyState == 4) {
                                if (request.status === 200 || request.status === 201) {
                                    resolve(JSON.parse(request.response));
                                } else {
                                    reject(JSON.parse(request.response));
                                }
                            }
                        }
                    });
                }
            }
    }
}
</script>

<style scoped>
.card {
    box-shadow: 0px 0px 30px -5px rgba(255,255,255,1);
    width: 90%;
    min-width: 300px;
    margin: 0 auto;
}

.content {
    display: flex;
}

.postImg {
    width: 20%;
    min-width: 100px;
    padding-right: 2rem;
}

.modBtn {
    margin: 4% 2% 0;
}

.likesbuttons {
    margin: 2em;
}
</style>