<template>
    <div class="card flex flex-column main" >
        <div class="text-center mb-5">
            <img src="../../Groupomania_Logos/icon.svg" alt="Image" class="logo" />
            <h1 class="welcome">Create your Post!</h1>
        </div>

        <div class="p-inputgroup flex-1 input">
                <InputText placeholder="Title" v-model="title" @input="validate" />
        </div>
        <div class="p-inputgroup flex-2 input">
                <textarea v-model="caption" placeholder="Caption" rows="5" cols="50" class="w-full line-height-2 captionInput" @input="validate"/>
        </div>

        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" style="margin: 2vh auto" chooseLabel="Choose Image" @input="handleFileUpload"></FileUpload>
        <div class="card flex justify-content-left align-items-center" >
            <h3 class="mr-2">Enable Likes?</h3>
            <Checkbox v-model="likesEnabled" :binary="true" />
        </div>

        <Button label="Submit" class="submit p-disabled" @click="submitPost" id="submit"/>
        <p class="back" @click="$emit('back')">Go Back</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: '',
            caption: '',
            image: '',
            likesEnabled: true
        }
    },
    props: {
        author: '',
        authorId: ''
    },
    emits: [
        'back',
        'createdPost'
    ],
    methods: {
        handleFileUpload($event) {
                this.image = $event.target.files[0];
        },
        submitPost($event) {
                $event.preventDefault();
                const formData = new FormData();

                let post = JSON.stringify({
                    title: this.title,
                    author: this.author,
                    caption: this.caption,
                    authorId: this.authorId,
                    likesEnabled: this.likesEnabled
                });

                formData.append("post", post);
                if (this.image) {
                    formData.append("image", this.image); 
                }

                return new Promise((resolve, reject) => {
                    let key = 'eyJhbGciOiJIUzI1NiJ9.e30.QXKHqZhQAO4ZOTEDRNAxc4CD1jblcF_BakFSjA3srJc';
                    let request = new XMLHttpRequest();
                    request.open('POST', 'http://localhost:3000/api/');
                    request.setRequestHeader('Authorization', 'Bearer ' + key);
                    // request.setRequestHeader('Content-Type', 'multipart/form-data');
                    request.send(formData);
                    request.onreadystatechange = () => {
                        if (request.readyState == 4) {
                            if (request.status === 200 || request.status === 201) {
                                resolve(JSON.parse(request.response));
                                this.$emit('createdPost');
                            } else {
                                reject(JSON.parse(request.response));
                            }
                        }
                    }
                })
        },
        validate() {
            if (this.title && this.caption) {
                document.getElementById('submit').classList.remove('p-disabled');
            } else {
                document.getElementById('submit').classList.add('pdisabled');
            }
        }
    }
}
</script>

<style scoped>
    .main {
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