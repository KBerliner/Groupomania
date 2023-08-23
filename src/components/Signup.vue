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
                <InputText placeholder="Username" v-model="username" @input="validate" />
        </div>
        <div class="p-inputgroup flex-1 input">
                <span class="p-inputgroup-addon">
                    <i class="pi pi-at"></i>
                </span>
                <InputText placeholder="Email" @input="validate" id="emailInput" v-model="email" />
        </div>
        <div class="p-inputgroup flex-2 input">
                <span class="p-inputgroup-addon">
                    <i class="pi pi-key"></i>
                </span>
                <Password placeholder="Password" v-model="password" @input="validate" />
        </div>
        <Button label="Submit" class="submit p-disabled" @click="submit" id="submit" />
        <p>Already have an account? <strong class="createBtn" @click="back">  Login here</strong></p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            "username": "",
            "email": "",
            "password": "",
            emailError: ''
        }
    },
    methods: {
        back() {
            this.$emit('back');
        },
        submit($event) {
            let user = JSON.stringify({
                username: this.username,
                email: this.email,
                password: this.password
            });
            $event.preventDefault;
            
            return new Promise((resolve, reject) => {
                let request = new XMLHttpRequest();
                request.open('POST', 'http://localhost:3000/api/signup');
                request.setRequestHeader('Content-Type', 'application/json');
                console.log('Line 44: ', JSON.parse(user));
                request.send(user);
                request.onreadystatechange = () => {
                    if (request.readyState == 4) {
                        if (request.status === 200 || request.status === 201) {
                            location.reload();
                            resolve(JSON.parse(request.response));
                        } else {
                            reject(JSON.parse(request.response));
                        }
                    }
                }
            });
        },
        validate() {
            // Regular expression for email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (this.email === '' || !this.username || !this.password) {
                document.getElementById('submit').classList.add('p-disabled');
                document.getElementById('emailInput').classList.add('p-invalid');
            } else if (!emailPattern.test(this.email) || !this.username || !this.password) {
                document.getElementById('submit').classList.add('p-disabled');
                document.getElementById('emailInput').classList.add('p-invalid');
            } else if (emailPattern.test(this.email) && this.username && this.password) {
                document.getElementById('submit').classList.remove('p-disabled');
                document.getElementById('emailInput').classList.remove('p-invalid');
            };
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

    .p-button {
        margin: 32px 0;
    }

    p {
        margin: 0;
    }
</style>