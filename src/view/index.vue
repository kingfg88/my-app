<template>
    <div class='index'>
        <Header />
    </div>
</template>
<script>
    import Header from '../components/header'
    export default {
        name: 'index',
        components:{Header},
        data () {
            return {
                
            }
        },
        created(){
            localStorage.getItem('userInfo')?this.$router.push('/home'):this.$router.push('/login')
        },
        methods:{
            
        }
    }
</script>
<style scoped lang='scss'>

</style>