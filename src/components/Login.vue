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
                <InputText placeholder="Email" v-model="email" @input="validate" />
        </div>
        <div class="p-inputgroup flex-2 input">
                <span class="p-inputgroup-addon">
                    <i class="pi pi-key"></i>
                </span>
                <Password v-model="password" placeholder="Password" @input="validate" />
        </div>
        <div class="card flex justify-content-left align-items-center" >
            <h3 class="mr-2">Remember Me?</h3>
            <Checkbox v-model="remember" :binary="true" />
        </div>
        <Button label="Submit" class="submit" id="submit" @click="login"/>
    </div>
</template>

<script>
export default {
    data() {
        return {
            email: '',
            password: '',
            remember: false
        }
    },
    methods: {
        signup() {
            this.$emit('signup');
        },
        validate() {
            // Regular expression for email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (this.email === '' || !this.password) {
                document.getElementById('submit').classList.add('p-disabled');
            } else if (!emailPattern.test(this.email) || !this.password) {
                document.getElementById('submit').classList.add('p-disabled');
            } else if (emailPattern.test(this.email) && this.password) {
                document.getElementById('submit').classList.remove('p-disabled');
            };
        },
        login($event) {
            $event.preventDefault();
            let user = JSON.stringify({ email: this.email, password: this.password });
            return new Promise((resolve, reject) => {
                let request = new XMLHttpRequest();
                request.open('POST', 'http://localhost:3000/api/login');
                request.setRequestHeader('Content-Type', 'application/json');
                request.send(user);
                request.onreadystatechange = () => {
                    if (request.readyState == 4) {
                        if (request.status === 200 || request.status === 201) {
                            if (this.remember) {
                                this.$emit('login', JSON.parse(request.response).userId, JSON.parse(request.response).username, JSON.parse(request.response).token);
                                resolve(JSON.parse(request.response));
                            } else {
                                this.$emit('login', JSON.parse(request.response).userId, JSON.parse(request.response).username);
                                resolve(JSON.parse(request.response));
                            }
                            
                        }
                    }
                }
            });
        }
    },
    emits: [
        'signup',
        'login'
    ]
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