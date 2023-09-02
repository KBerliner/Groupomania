<template>
    <div class="surface-card p-4 border-round flex flex-column card" @mouseover="seeing">
        <Tag value="New" v-if="!seen" class="w-1"></Tag>
        <div class="text-3xl font-medium text-900 mb-3">{{ title }}</div>
        <div class="font-medium text-500 mb-3">{{ author }}</div>
        <article class="content">
            
            <img v-if="post.image" :src="image" class="postImg"/>
            <div>{{ caption }}</div>
        </article>
        <section v-if="likesenabled">
            <Button icon="pi pi-thumbs-up" :label="displayLikes" class="likesbuttons" @click="like" text raised rounded severity="success"></Button>
            <Button icon="pi pi-thumbs-down" :label="displayDislikes" class="likesbuttons" iconPos="left" @click="dislike" text raised rounded severity="danger"></Button>
        </section>
        <ConfirmPopup></ConfirmPopup>
        <section v-if="owner">
            <Button label="Edit" icon="pi pi-pencil" class="modBtn" @click="edit"/>
            <Button label="Delete" icon="pi pi-times" class="modBtn bg-red-500 border-red-500" @click="confirmDelete"/>
        </section>
    </div>
</template>

<script>
export default {
    data() {
        return {
            id: this.post.id,
            title: this.post.title,
            caption: this.post.caption,
            author: this.post.author,
            authorid: this.post.authorid,
            likes: this.post.likes,
            dislikes: this.post.dislikes,
            usersliked: this.post.usersliked,
            usersdisliked: this.post.usersdisliked,
            usersseen: this.post.usersseen,
            likesenabled: this.post.likesenabled
        }
    },
    emits: [
        'edit',
        'seen',
        'unseen',
        'deletePost'
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
            if (this.authorid === this.userId) {
                return true;
            } else {
                return false;
            }
        },
        seen() {
            if (this.post.usersseen && this.post.usersseen != undefined) {
                if (this.post.usersseen.includes(this.userId)) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    },
    methods: {
        edit() {
            this.$emit('edit', {
                id : this.id,
                title: this.title,
                caption: this.caption,
                image: this.image
            });
        },
        like() {
            console.log(this.id);
                if (!this.post.usersliked.includes(this.userId) && !this.post.usersdisliked.includes(this.userId)) {
                    this.likes++;
                    this.usersliked.push(this.userId);

                    return new Promise((resolve, reject) => {
                        let uid = this.id;
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
                } else if (this.post.usersliked.includes(this.userId) && !this.post.usersdisliked.includes(this.userId)) {
                    this.likes--;
                    let idKeyStart = this.usersliked.indexOf(this.userId);
                    let idKeyEnd = idKeyStart + 1;
                    this.usersliked.splice(idKeyStart, idKeyEnd);

                    return new Promise((resolve, reject) => {
                        let uid = this.id;
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
                if (!this.post.usersliked.includes(this.userId) && !this.post.usersdisliked.includes(this.userId)) {
                    this.dislikes++;
                    this.usersdisliked.push(this.userId);

                    return new Promise((resolve, reject) => {
                        let uid = this.id;
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
                } else if (!this.post.usersliked.includes(this.userId) && this.post.usersdisliked.includes(this.userId)) {
                    this.dislikes--;
                    let idKeyStart = this.usersdisliked.indexOf(this.userId);
                    let idKeyEnd = idKeyStart + 1;
                    this.usersdisliked.splice(idKeyStart, idKeyEnd);

                    return new Promise((resolve, reject) => {
                        let request = new XMLHttpRequest();
                        let uid = this.id;
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
        seeing() {
                if (this.post.usersseen) {
                    if (!this.post.usersseen.includes(this.userId)) {
                        this.post.usersseen.push(this.userId);
                        return new Promise((resolve, reject) => {
                            let request = new XMLHttpRequest();
                            let uid = this.id;
                            request.open('POST', `http://localhost:3000/api/${uid}/see`);
                            request.setRequestHeader('Content-Type', 'application/json');
                            request.send(JSON.stringify({
                                userId: this.userId,
                                usersSeen: this.usersseen
                            }));
                            request.onreadystatechange = () => {
                                if (request.readyState == 4) {
                                    if (request.status === 200 || request.status === 201) {
                                        this.$emit('seen');
                                        resolve(JSON.parse(request.response));
                                    } else {
                                        reject(JSON.parse(request.response));
                                    }
                                }
                            }
                        })
                    }
                }
        },
        delete() {
            return new Promise((resolve, reject) => {
                let key = localStorage.getItem('validToken');
                let uid = this.id;
                let request = new XMLHttpRequest();
                request.open('DELETE', `http://localhost:3000/api/${uid}`);
                request.setRequestHeader('Content-Type', 'application/json');
                request.setRequestHeader('Authorization', 'Bearer ' + key);
                request.send();
                request.onreadystatechange = () => {
                    if (request.readyState == 4) {
                        if (request.status === 200 || request.status === 201) {
                            this.$emit('deletePost', uid)
                            resolve(JSON.parse(request.response));
                        } else {
                            reject(JSON.parse(request.response));
                        }
                    }
                }
            }) 
        },
        confirmDelete(event) {
            this.$confirm.require({
                target: event.currentTarget,
                message: 'Do you want to delete this post?',
                icon: 'pi pi-info-circle',
                acceptClass: 'p-button-danger',
                accept: () => {
                    this.delete();
                }
            });
        },
    },
    created() {
        if (this.post.usersseen && this.post.usersseen != undefined) {
            if (!this.post.usersseen.includes(this.userId)) {
                this.$emit('unseen');
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
    margin: 3% 2% 0 0;
}

.likesbuttons {
    margin: 2em 1em 0 0;
}
</style>