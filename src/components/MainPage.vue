<template>
    <ScrollTop />

    <MegaMenu orientation="horizontal" class="nav mx-auto">
        <template #start>
            <img alt="logo" src="../../Groupomania_Logos/icon-left-font-monochrome-black.svg" class="mr-2 navlogo" />
        </template>
        <template #end>
            <Avatar :label="avatarLabel" :image="profilePicture" :class="avatarClass" size="large" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"/>
            <Menu ref="profileMenu" :popup="true" :model="profileMenuItems"/>
            <!-- <Toast /> -->
        </template>
    </MegaMenu>
    <div class="cardcontainer">
        <div class="surface-card p-4 border-round flex flex-column card">
            <div class="text-3xl font-medium text-900 mb-3">Card Title</div>
            <div class="font-medium text-500 mb-3">Vivamus id nisl interdum, blandit augue sit amet, eleifend mi.</div>
            <div style="height: 150px" class="border-2 border-dashed surface-border"></div>
        </div>
    </div>
</template>

<script>


export default {
    data() {
        return {
            profilePicture: null,
            profileMenuItems: [
                {
                    label: 'Options',
                    items: [
                        {
                            label: 'Edit Account',
                            icon: 'pi pi-user',
                            // command: () => {
                            //         this.$toast.add({ severity: 'success', summary: 'Updated', detail: 'Data Updated', life: 3000 });
                            //     }
                        },
                        {
                            label: 'Delete Account',
                            icon: 'pi pi-times'
                        }
                    ]
                }
            ]
        }
    },
    props: {
        username: ''
    },
    computed: {
        avatarLabel() {
            if (this.profilePicture) {
                // If profile picture exists, show the full image
                return null;
            } else {
                // If no profile picture, show the first letter of the username
                return this.username.charAt(0).toUpperCase();
            }
        },
        avatarClass() {
        // Add 'p-avatar-with-image' class if profilePicture exists
        return this.profilePicture ? 'p-avatar-image' : '';
        }
    },
    methods: {
        toggle(event) {
            this.$refs.profileMenu.toggle(event);
        }
    }
}
</script>

<style scoped>
.cardcontainer {
    margin-top: 10vh;
}

.card {
    box-shadow: 0px 0px 30px 0px rgba(255,255,255,1);
    width: 90%;
    min-width: 300px;
    margin: 0 auto;
}

.nav {
    position: fixed;
    top: 0;
    left: 2.5%;
    right: 2.5%;
    top: 1%;
}

.navlogo {
    width: 40vw;
    min-width: 200px;
    max-width: 350px;
}

.profile {
    width: 95%;
}

.p-megamenu {
    border-radius: 32px;
    padding: 1rem 2rem;
}

.p-megamenu-end {
    height: 100%;
}
</style>