<template>
    <div class='login'>
        <div class="videocontainer">
            <video class="fullscreenvideo" ref="myVideo" poster="" id="bgvid" playsinline="" autoplay="" muted="" loop="">
                <source src="../../assets/bgvideo.mp4" type="video/mp4">
            </video>
        </div>
        <div class="loginBox">
            <el-form :model="loginForm" :rules="rules" ref="ruleForm" label-width="70px" hide-required-asterisk>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="loginForm.username" clearable></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="loginForm.password" :type="show?'text':'password'" clearable>
                        <i slot="suffix" :class="show ? 'iconfont icon-icon-eye-open' : 'iconfont icon-icon-eye-close'" @click='showWord'></i>
                    </el-input>
                </el-form-item>
                <el-form-item class='btnGroup'>
                    <el-button type="primary" @click="ToLogin('ruleForm',islogin)">{{islogin?'登陆':'注册'}}</el-button>
                    <p>
                        <span>
                            {{islogin?'还没有账号？去':'已有账号，直接'}}
                        </span>
                        <span class="abtn" @click="ToRigete(islogin)">
                            {{islogin?'注册':'登陆'}}
                        </span>
                    </p>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import { login,registe } from '../../api/user'
    const sha256 = require('js-sha256').sha256
    export default {
        name: 'Login',
        data () {
            return {
                loginForm:{
                    username:'',
                    password:''
                },
                islogin:true,//登陆注册状态
                show:false,//密码明文状态
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 3, message: '长度最少为3字符', trigger: 'blur' }
                    ],
                },
            }
        },
        created(){
            // this.$refs.myVideo.playbackRate = 0.5;
            console.log(this.$store.state.title)
        },
        methods:{
            showWord(){
                this.show=!this.show;
            },
            ToLogin(formName,islogin) {
                this.loginForm.password = sha256(this.loginForm.password)
                let data = this.loginForm
                this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(islogin){
                        login(data).then((res)=>{
                            if(res.code == 0){
                                this.$message({
                                    message: res.msg,
                                    type: 'success'
                                });
                            }else{
                                this.$message.error(res.msg)
                            }
                        })
                    }else{
                        registe(data).then((res)=>{
                            if(res.code == 0){
                                this.$message({
                                    message: res.msg,
                                    type: 'success'
                                });
                            }else{
                                this.$message.error(res.msg)
                            }
                        })
                    }
                    this.$refs.ruleForm.resetFields()
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });
            },
            ToRigete(){
                this.islogin = !this.islogin
                this.$refs.ruleForm.resetFields()
                this.$refs.ruleForm.clearValidate()
            }
        }
    }
</script>
<style lang='scss'>
.login{
    height:100%;
    display:flex;
    .videocontainer{
        position: fixed;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: -100; 
        .videocontainer:before{
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            display: block;
            z-index: -1;
            top: 0;
            left: 0;
            background: rgba(25,29,34,.65);
        }
        .fullscreenvideo {
            position: absolute;
            top: 50%;
            left: 50%;
            min-width: 100%;
            min-height: 100%;
            width: auto;
            height: auto;
            z-index: -100;
            -webkit-transform: translateX(-50%) translateY(-50%);
            transform: translateX(-50%) translateY(-50%);
            -webkit-transition: 1s opacity;
            transition: 1s opacity;
        }
    }
    .loginBox{
        color:#fff;
        width:400px;
        margin:auto;
        .el-form-item .el-form-item__label{
            color:#fff!important;
        }
        .el-input__inner{
            color:#fff!important;
        }
    }
}
    
</style>