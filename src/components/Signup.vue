<template>
        <div class="card flex flex-column signup" >
        <div class="text-center mb-5">
            <img src="../../Groupomania_Logos/icon.svg" alt="Image" class="logo" />
            <h1 class="welcome">Create Account</h1>
        </div>

        <div class="p-inputgroup flex-1 input">
                <span class="p-inputgroup-addon">
                    <i class="pi pi-user"></i>
                </span>
                <InputText placeholder="Username" />
        </div>
        <div class="p-inputgroup flex-1 input">
                <span class="p-inputgroup-addon">
                    <i class="pi pi-at"></i>
                </span>
                <InputText placeholder="Email" />
        </div>
        <div class="p-inputgroup flex-2 input">
                <span class="p-inputgroup-addon">
                    <i class="pi pi-key"></i>
                </span>
                <Password placeholder="Password" />
        </div>
        <Button label="Submit" class="submit"/>
        <p>Already have an account? <strong class="createBtn" @click="back">  Login here</strong></p>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        back() {
            this.$emit('back');
        }
    }
}
</script>

<style scoped>

.signup {
        box-shadow: 0px 5px 25px -5px rgba(0,0,0,0.75);
        padding: 32px 40px;
        border-radius: 8px;
        width: 85%;
        max-width: 500px;
        margin: 0 auto;
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

    .p-button {
        margin: 32px 0;
    }

    p {
        margin: 0;
    }
</style>