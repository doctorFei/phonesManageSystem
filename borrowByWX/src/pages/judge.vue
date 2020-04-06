<template>
    <div class="judge"></div>
</template>

<script>
    import api from '@/api/api'
    import { mapGetters, mapMutations } from 'vuex'
    import { MessageBox, Indicator, Toast } from 'mint-ui';
    export default {
        name: 'judgeID',
        created() {
            this.judge()
        },
        data() {
            return {
            }
        },
        methods: {
            async judge() {
                if (!!borrowAccount) {
                    this.$router.replace({ path: '/transfer' });
                }else{
                    this.$router.replace({ path: '/judgeId' });
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import "../style/mixin";
    .judge {
        width: 100%;
        height: 100%;
        background: url(../assets/login-bg.png) no-repeat;
        background-size: cover;
        position: fixed;
        z-index: 1000;
    }
</style>