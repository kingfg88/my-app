<template>
    <div class='home'>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-submenu index="0" class='rightMnue' style="float:right">
                <template slot="title">
                    <img src="../assets/timg.jpg" alt="">
                </template>
                
                <template slot="title">{{userName}}</template>
                <el-menu-item @click="Tologout">退出登录</el-menu-item>
                <el-menu-item index="center">个人中心</el-menu-item>
            </el-submenu>
            <el-menu-item class='logo'>
                <img src="../assets/logo.jpg" alt="">
            </el-menu-item>
            <el-menu-item index="home">首页</el-menu-item>
            <el-submenu index="2">
                <template slot="title">我的工作台</template>
                <el-menu-item index="2-1">选项1</el-menu-item>
                <el-menu-item index="2-2">选项2</el-menu-item>
                <el-menu-item index="2-3">选项3</el-menu-item>
                <el-submenu index="2-4">
                <template slot="title">选项4</template>
                <el-menu-item index="2-4-1">选项1</el-menu-item>
                <el-menu-item index="2-4-2">选项2</el-menu-item>
                <el-menu-item index="2-4-3">选项3</el-menu-item>
                </el-submenu>
            </el-submenu>
            <el-menu-item index="form">消息中心</el-menu-item>
        </el-menu>
        <router-view/>
    </div>
</template>
<script>
    export default {
        name: 'home',
        data () {
            return {
                activeIndex:'1',
                userName:'未登陆'
            }
        },
        created(){
            let userInfo = JSON.parse(localStorage.getItem('userInfo'))[0]
            this.userName ='欢迎你，'+ (userInfo.realname?userInfo.realname:userInfo.username)
        },
        methods:{
            handleSelect(key, keyPath) {
                // console.log(`/${key}`);
                if(this.$route.path != `/${key}`){
                    this.$router.push(key)
                }
            },
            Tologout(){
                this.$confirm('确定退出登陆, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '退出成功!'
                    });
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('userInfo')
                    this.$router.push('/')
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });          
                });
            }
        }
    }
</script>
<style scoped lang='scss'>
.logo{
    width:280px;
    height:60px;
    padding:0 6rem;
    img{
        width:70%;
        height:70%;
    }
}
.rightMnue{
    width:60px;
    height:60px;
    padding-right:9rem;
    .el-submenu__title{
        
        img{
            width:30px;
            height:30px;
            border-radius: 50%;
            padding:0 1rem;
        }
    }
    
}
</style>