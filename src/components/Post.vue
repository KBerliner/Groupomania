<template>
    <div class="surface-card p-4 border-round flex flex-column card">
        <div class="text-3xl font-medium text-900 mb-3">{{ title }}</div>
        <div class="font-medium text-500 mb-3">{{ author }}</div>
        <article class="content">
            
            <img v-if="post.image" :src="image" class="postImg"/>
            <div>{{ caption }}</div>
        </article>
        <section v-if="owner">
            <Button label="Delete" icon="pi pi-times" class="modBtn" />
            <Button label="Edit" icon="pi pi-pencil" class="modBtn" @click="edit"/>
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
            usersSeen: this.post.usersSeen
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
}

.modBtn {
    margin: 4% 2% 0;
}
</style>