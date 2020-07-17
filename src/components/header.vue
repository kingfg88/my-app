<template>
    <div class='home'>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-submenu index="my" class='rightMnue' style="float:right">
                <template slot="title">
                    <img :src="avatarUrl" alt="">
                </template>
                
                <template slot="title">欢迎你，{{form.realname?form.realname:form.username}}</template>
                <el-menu-item @click="Tologout">退出登录</el-menu-item>
                <el-menu-item index="center">个人中心</el-menu-item>
            </el-submenu>
            <el-menu-item class='logo'>
                <img src="../assets/logo.jpg" alt="">
            </el-menu-item>
            <el-menu-item index="home">首页</el-menu-item>
            <el-submenu index="workbench">
                <template slot="title">我的工作台</template>
                <el-menu-item index="articleManagement">文章管理</el-menu-item>
                <el-submenu index="material">
                <template slot="title">素材管理</template>
                <el-menu-item index="imageManagement">图片管理</el-menu-item>
                <el-menu-item index="videoManagement">视频管理</el-menu-item>
                <el-menu-item index="audioManagement">音频管理</el-menu-item>
                </el-submenu>
            </el-submenu>
            <el-menu-item index="person">人员管理</el-menu-item>
        </el-menu>
        <el-drawer
        :visible.sync="drawer"
        :before-close="handleClose">
            <div class="myform">
                <el-avatar :size="60" :src="avatarUrl">
                    <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                </el-avatar>
                <p>
                    <span>{{form.realname}}</span>        
                </p>
                <p v-if="!(form.realname == '未登陆')">
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
                    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="form.username" disabled></el-input>
                        </el-form-item>
                         <el-form-item label="姓名" prop="realname">
                            <el-input v-model="form.realname"></el-input>
                        </el-form-item>
                        <el-form-item label="原密码" prop="oldpassword">
                            <el-input type="password" v-model="form.oldpassword"></el-input>
                        </el-form-item>
                        <el-form-item label="新密码" prop="newpassword">
                            <el-input type="password" v-model="form.newpassword"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="againnewpassword">
                            <el-input type="password" v-model="form.againnewpassword"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit('form')">提交</el-button>
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
    import { userInfo,editInformation } from '../api/user'
    const sha256 = require('js-sha256').sha256
    export default {
        name: 'home',
        data () {
            var validatenew = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码'));
                }else if(value == this.form.oldpassword){
                    callback(new Error('不能与原密码相同'));
                } else {
                    callback();
                }
            };
            var validateagain = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入确认密码'));
                }else if(value != this.form.newpassword){
                    callback(new Error('两次输入密码不相同'));
                } else {
                    callback();
                }
            };
            return {
                imgUrl:'http://127.0.0.1:3000/public/image/',
                activeIndex:'1',
                drawer: false,
                avatarUrl: require("@/assets/timg.jpg"),
                form:{
                    realname:'',
                    username:null
                },
                rules:{
                    oldpassword: [
                        { required: true, message: '请输入原密码', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    newpassword: [
                        { required: true,validator: validatenew, trigger: 'blur' }
                    ],
                    againnewpassword: [
                        { required: true,validator: validateagain, trigger: 'blur' }
                    ],
                },
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
            if(localStorage.getItem('userInfo')){
                this.form = JSON.parse(localStorage.getItem('userInfo'))[0]
                if(this.form.headportrait){
                    this.avatarUrl = this.imgUrl+this.form.headportrait
                }
            }
        },
        methods:{
            handleSelect(key, keyPath) {
                let url = `/${keyPath.join('/')}`
                if(url && this.$route.path != url){
                    if(url.indexOf('/my') == -1){
                        this.$router.push(url)
                    }else if(url == '/my/center'){
                        this.drawer = true
                    }else{
                        return
                    }
                }
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
                this.$refs.cropper.getCropData((data) => {
                    let params = {
                        file:data,
                        uid:this.form.uid
                    }
                    upload(params).then(res=>{
                        if(res.code == 0){
                            this.avatarUrl = this.imgUrl+res.data.name
                            this.$message({
                                type:'success',
                                message:res.msg
                            })
                            this.imgdialogVisible = false
                        }
                    })
                })
            },
            //修改提交
            onSubmit(formName){
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        let params = {
                            uid:this.form.uid,
                            headportrait:this.form.avatarUrl,
                            realname:this.form.realname,
                            password:this.form.oldpassword?sha256(this.form.oldpassword):null,
                            newpword:this.form.newpassword?sha256(this.form.newpassword):null
                        }
                        editInformation(params).then(res=>{
                            if(res.code == 0){
                                this.$alert(`${res.msg}，请重新登陆！`, '提示', {
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        localStorage.removeItem('accessToken')
                                        localStorage.removeItem('userInfo')
                                        this.$router.push('/login')
                                        this.$message({
                                            type: 'success',
                                            message: '退出成功!'
                                        });
                                    }
                                });
                            }else if(res.code == -1){
                                this.$message.error(res.msg)
                            }
                        })
                    }else{
                        console.log('error submit!!');
                        return false;
                    }
                })
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
                    this.$router.push('/login')
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
    height:60px;
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
.myform{
    text-align:center;
}
</style>