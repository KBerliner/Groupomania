<template>
    <div class="card flex flex-column login" >
        <div class="text-center mb-5">
            <img src="../../Groupomania_Logos/icon.svg" alt="Image" class="logo" />
            <h1 class="welcome">Edit your Post!</h1>
        </div>

        <div class="p-inputgroup flex-1 input">
                <InputText placeholder="Title" v-model="post.title"/>
        </div>
        <div class="p-inputgroup flex-2 input">
                <textarea v-model="post.caption" placeholder="Caption" rows="5" cols="50" class="w-full line-height-2 captionInput"/>
        </div>

        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" style="margin: 2vh auto" chooseLabel="Choose Image" @input="handleImageUpload"></FileUpload>

        <Button label="Submit" class="submit" @click="submitPost"/>
        <p class="back" @click="$emit('back')">Go Back</p>
    </div>
</template>

<script>
export default {
    props: {
        post: {
            _id: String,
            title: String,
            caption: String,
            image: String
        }
    },
    emits: [
        'back',
        'editedPost'
    ],
    methods: {
        handleImageUpload($event) {
            this.image = $event.target.files[0];
        },
        submitPost($event) {
            $event.preventDefault();

            console.log(this);
            const formData = new FormData();

            let post = JSON.stringify({
                title: this.post.title,
                caption: this.post.caption,
                _id: this.post._id
            });

            formData.append("post", post);
            if (this.image) {
                formData.append("image", this.image);
            }

            return new Promise((resolve, reject) => {
                let key = localStorage.getItem('validToken');
                let uid = this.post._id;
                let request = new XMLHttpRequest();
                request.open('PUT', `http://localhost:3000/api/${uid}`);
                request.setRequestHeader('Authorization', 'Bearer ' + key);
                request.send(formData);
                request.onreadystatechange = () => {
                    if (request.readyState == 4) {
                        if (request.status === 200 || request.status === 201) {
                            this.$emit('editedPost');
                            resolve(JSON.parse(request.response));
                        } else {
                            reject(JSON.parse(request.response));
                        }
                    }
                }
            })
        }
    }
}
</script>

<style scoped>
    .login {
        box-shadow: 0px 5px 25px -5px rgba(0,0,0,0.75);
        padding: 32px 40px;
        border-radius: 8px;
        width: 85%;
        max-width: 600px;
        margin: 15vh auto;
        border: 3px solid rgb(174, 174, 174);
        background-color: white;
    }

    .input {
        padding: 16px 0;
    }

    .logo {
        width: 20%;
        /* padding: 16px 0; */
        min-width: 50px;
    }

    .createBtn {
        cursor: pointer;
        color: rgb(43, 92, 198);
    }

    .captionInput {
        padding: 2%;
        font-family: var(--font-family);
    }

    .back {
        cursor: pointer;
        color: rgb(43, 92, 198);
    }
</style>