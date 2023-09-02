<template>
    <div class="card flex flex-column profile" >
        <div class="text-center mb-5">
            <img src="../../Groupomania_Logos/icon.svg" alt="Image" class="logo" />
            <h1 class="welcome">Edit your Profile!</h1>
        </div>

        <div class="p-inputgroup flex-1 input">
                <InputText placeholder="username" v-model="user" />
        </div>

        <Button label="Submit" class="submit" @click="submit"/>
        <p class="back" @click="$emit('back')">Go Back</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: this.username,
            id: this.userId
        }
    },
    props: {
        username: '',
        userId: ''
    },
    emits: [
        'back',
        'newUser'
    ],
    methods: {
        submit($event) {
            $event.preventDefault();
            console.log('submitting...');
            return new Promise((resolve, reject) => {
                    let key = 'eyJhbGciOiJIUzI1NiJ9.e30.QXKHqZhQAO4ZOTEDRNAxc4CD1jblcF_BakFSjA3srJc';
                    let request = new XMLHttpRequest();
                    request.open('PUT', `http://localhost:3000/api/${this.id}/edit`);
                    request.setRequestHeader('Authorization', 'Bearer ' + key);
                    request.setRequestHeader('Content-Type', 'application/json');
                    request.send(JSON.stringify({
                        username: this.user
                    }))
                    request.onreadystatechange = () => {
                        if (request.readyState == 4) {
                            if (request.status === 200 || request.status === 201) {
                                resolve(JSON.parse(request.response));
                                console.log(JSON.parse(request.response));
                                this.$emit('newUser', JSON.parse(request.response).username);
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
    .profile {
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

    .delete {
        margin: 4% 0;
    }
</style>