<template>
    <div class="card flex flex-column login" >
        <div class="text-center mb-5">
            <img src="../../Groupomania_Logos/icon.svg" alt="Image" class="logo" />
            <h1 class="welcome">Welcome Back</h1>
            <p>Don't have an account? <strong class="createBtn" @click="signup">  Create Today!</strong></p>
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
                <Password v-model="password" placeholder="Password" />
        </div>
        <div class="card flex justify-content-left align-items-center" >
            <h3 class="mr-2">Remember Me?</h3>
            <Checkbox v-model="remember" :binary="true" />
        </div>
        <Button label="Submit" class="submit"/>
    </div>
</template>

<script>
export default {
    data() {
        return {
            password: null,
            remember: false
        }
    },
    methods: {
        signup() {
            this.$emit('Signup');
        }
    }
};
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
</style>