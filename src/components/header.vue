<template>
    <div class='home'>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-submenu index="0" class='rightMnue' style="float:right">
                <template slot="title">
                    <img :src="avatarUrl" alt="">
                </template>
                
                <template slot="title">欢迎你，{{realname?realname:username}}</template>
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
        <el-drawer
        :visible.sync="drawer"
        :before-close="handleClose">
            <div>
                <el-avatar :size="60" :src="avatarUrl">
                    <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                </el-avatar>
                <p>
                    <span>{{realname}}</span>        
                </p>
                <p v-if="!(realname == '未登陆')">
                    <span class="fileinput-button">
                        <span>更换头像 </span>  
                        <input type="file" @change="changeDrawer">
                    </span>        
                </p>
                <el-dialog
                    class="imgdialog"
                    title="裁剪新的图片"
                    :visible.sync="imgdialogVisible"
                    width="30%"
                    :append-to-body=true
                    :before-close="handleClose">
                    <div class="cropper-content">
                        <div class="cropper" style="text-align:center">
                            <vueCropper
                                ref="cropper"
                                :img="option.img"
                                :outputSize="option.outputSize"
                                :outputType="option.outputType"
                                :info="true"
                                :full="option.full"
                                :canMove="option.canMove"
                                :canMoveBox="option.canMoveBox"
                                :original="option.original"
                                :autoCrop="option.autoCrop"
                                :fixed="option.fixed"
                                :fixedNumber="option.fixedNumber"
                                :centerBox="option.centerBox"
                                :infoTrue="option.infoTrue"
                                :fixedBox="option.fixedBox"
                            ></vueCropper>
                        </div>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button  @click="imgdialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="imgSubmit">确 定</el-button>
                    </span>
                </el-dialog>
                <div class="submitform">
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="用户名">
                            <el-input v-model="username" disabled></el-input>
                        </el-form-item>
                         <el-form-item label="姓名">
                            <el-input v-model="realname"></el-input>
                        </el-form-item>
                        <el-form-item label="原密码">
                            <el-input v-model="form.oldpassword"></el-input>
                        </el-form-item>
                        <el-form-item label="新密码">
                            <el-input v-model="form.newpassword"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">提交</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-drawer>
        <router-view/>
    </div>
</template>
<script>
    import { upload } from '../api/upload'
    export default {
        name: 'home',
        data () {
            return {
                imgUrl:'http://127.0.0.1:3000/public/image/',
                avatarUrl: require("@/assets/timg.jpg"),
                activeIndex:'1',
                realname:'',
                username:null,
                drawer: false,
                form:{},
                imgdialogVisible:false,
                option: {
                    img: '', // 裁剪图片的地址
                    info: true, // 裁剪框的大小信息
                    outputSize: 0.8, // 裁剪生成图片的质量
                    outputType: 'jpeg', // 裁剪生成图片的格式
                    canScale: false, // 图片是否允许滚轮缩放
                    autoCrop: true, // 是否默认生成截图框
                    fixedBox: false, // 固定截图框大小 不允许改变
                    fixed: true, // 是否开启截图框宽高固定比例
                    fixedNumber: [1, 1], // 截图框的宽高比例
                    full: false, // 是否输出原图比例的截图
                    canMoveBox: true, // 截图框能否拖动
                    original: false, // 上传图片按照原始比例渲染
                    centerBox: true, // 截图框是否被限制在图片里面
                    infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
                },
                uploadfile:null,
            }
        },
        created(){
            let userInfo = JSON.parse(localStorage.getItem('userInfo'))[0]
            this.username = userInfo.username?userInfo.username:userInfo.username
            this.realname = userInfo.realname
        },
        methods:{
            handleSelect(key, keyPath) {
                if(key == 'center'){
                    this.drawer = true 
                }
                // if(this.$route.path != `/${key}`){
                //     this.$router.push(key)
                // }
            },
            //更换头像
            changeDrawer(e){
                this.uploadfile = e.target.files[0];
                let reader = new FileReader();
                reader.onload = (e)=>{
                    this.option.img = e.target.result;
                    this.imgdialogVisible = true
                }
                reader.readAsDataURL(this.uploadfile);
            },
            //裁剪并提交
            imgSubmit(){
                // this.$refs.cropper.getCropBlob((data) => {
                //     console.log(data,555)
                //     var params = new FormData();
                //     params.append(data,this.option.img)
                //     upload(params).then(res=>{
                //         console.log(res)
                //     })
                // })
                this.$refs.cropper.getCropData((data) => {
                    let params = {
                        file:data
                    }
                    upload(params).then(res=>{
                        if(res.code == 0){
                            this.avatarUrl = this.imgUrl+res.data.name
                            this.imgdialogVisible = false
                        }
                    })
                })
            },
            onSubmit(){
                
            },
            //关闭侧弹窗
            handleClose(){
                this.drawer = false
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
            },
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
    width:12rem;
    .el-submenu__title{
        img{
            width:30px;
            height:30px;
            border-radius: 50%;
            padding:0 1rem;
        }
    }
}
.fileinput-button{
    position: relative;
    display: inline-block;
    overflow: hidden;
    color:#67C23A;
    input{
        position: absolute;
        right: 0px;
        top: 0px;
        opacity: 0;
        cursor:pointer;
    }
}
.imgdialog{
    z-index:1;
    img{
        width:100%;
        height:auto;
    }
}
.submitform{
    width:64%;
    margin:5rem auto;
}
// 截图
.cropper-content {
    .cropper {
        width: auto;
        height: 300px;
    }
}
</style>