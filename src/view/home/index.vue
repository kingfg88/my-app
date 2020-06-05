<template>
    <div class='home'>
        <!-- <el-button type="primary" @click="Tologout">退出登录</el-button> -->
        
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item class='rightMnue' style="float:right">
                <img src="../../assets/logo.png" alt="">
                <a @click="Tologout">退出登录</a>
            </el-menu-item>
            <el-menu-item class='logo'>
                <img src="../../assets/logo.png" alt="">
            </el-menu-item>
            <el-menu-item index="1">处理中心</el-menu-item>
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
            <el-menu-item index="3">消息中心</el-menu-item>
            <el-menu-item index="4">消息中心</el-menu-item>
            <el-menu-item index="5">消息中心</el-menu-item>
        </el-menu>
    </div>
</template>
<script>
    export default {
        name: 'home',
        data () {
            return {
                activeIndex:'1'
            }
        },
        created(){

        },
        methods:{
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
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
        width:100%;
        height:100%;
    }
}
.rightMnue{
    width:60px;
    height:60px;
    margin-right:3rem;
    img{
        width:100%;
        height:100%;
        border:1px solid #ccc;
        border-radius: 50%;
    }
}
</style>