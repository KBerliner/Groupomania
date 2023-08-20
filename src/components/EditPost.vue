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

        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" style="margin: 2vh auto" chooseLabel="Choose Image"></FileUpload>

        <Button label="Submit" class="submit"/>
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
        'back'
    ]
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