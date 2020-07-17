<template>
    <div class='person'>
        <div class="serchBox">
            <el-input placeholder="请输入用户名" v-model="serchData.name" clearable></el-input>
            <el-select v-model="serchData.role" placeholder="请选择角色" clearable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-date-picker
                v-model="serchData.time"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="searchPicker"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right">
            </el-date-picker>
            <el-button class="btn" type="success" @click="Tosearch" style="margin-left:10px;">查询</el-button>
            <el-button class="btn" type="primary" @click="Toadd">新增</el-button>
        </div>
        <plugTable :headData="headData" :tableData="tableData" :btnData="btnData" @func="getMsgFormSon"/>
        <plugPage :pageData="pageData" @pagefun="getpageSon" />
        <!-- 新增编辑弹窗 -->
        <el-dialog :title="dialogTitle" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" class="diologform" width="40%" :before-close="handleClose">
            <el-form :model="ruleform" ref="refForm" :rules="rules">
                <el-form-item label="用户名" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="ruleform.name" placeholder="选请输入名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="角色" :label-width="formLabelWidth" prop="role">
                    <el-select v-model="ruleform.role" placeholder="请选择区域" clearable>
                        <el-option label="副管理员" value="副管理员"></el-option>
                        <el-option label="编辑员" value="编辑员"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleClose()">取 消</el-button>
                <el-button type="primary" @click="addData('refForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import plugTable from '../../components/table'
    import plugPage from '../../components/pagenation'
    import { getperson,addperson,editperson,delperson } from '../../api/person'
    export default {
        name: 'person',
        components:{plugTable,plugPage},
        data () {
            return {
                headData:[
                    {
                        prop:'time',
                        label:'添加时间'
                    },{
                        prop:'name',
                        label:'姓名'
                    },{
                        prop:'role',
                        label:'角色'
                    },{
                        prop:'addperson',
                        label:'添加人'
                    }
                ],
                tableData: [],
                btnData:[
                    {
                        btnText:'编辑',
                        btnType:'primary'
                    },{
                        btnText:'删除',
                        btnType:'danger'
                    }
                ],
                options: [{
                    value: '副管理员',
                    label: '副管理员'
                    }, {
                    value: '编辑员',
                    label: '编辑员'
                }],
                pageData:{
                    current:1,
                    size:10,
                    total:null
                },
                serchData:{},
                dialogTitle:'新增',
                dialogFormVisible:false,
                ruleform:{},
                formLabelWidth:'120px',
                rules:{
                    time: [
                        { required: true, message: '请选择时间', trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                    ],
                    role: [
                        { required: true, message: '请选择角色', trigger: 'change' }
                    ],
                },
                searchPicker: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                dialogImageUrl:'',
                dialogVisible: false
            }
        },
        created(){
            this.initData()
        },
        methods:{
            initData(){
                let data = {
                    page:this.pageData.current,
                    size:this.pageData.size
                }
                this.getData(data)
            },
            getData(data){
                getperson(data).then((res)=>{
                    if(res.code == 0){
                        this.tableData = []
                        this.pageData.total = res.total
                        res.data.forEach(ele => {
                            this.tableData.push({
                                id:ele.id,
                                time:ele.time,
                                name:ele.name,
                                role:ele.role,
                                addperson:ele.addperson
                            })
                        });
                    }
                })
            },
            Tosearch(){
                let data = this.serchData
                data.page = this.pageData.current,
                data.size = this.pageData.size
                this.getData(data)
            },
            Toadd(){
                this.dialogTitle = '新增'
                this.dialogFormVisible = true;
            },
            addData(formName){
                let data = this.ruleform
                data.addperson = JSON.parse(localStorage.getItem('userInfo'))[0].realname
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.dialogTitle === '新增'){
                            addperson(data).then((res)=>{
                                if(res.code == 0){
                                    this.$message({
                                        message: res.msg,
                                        type: 'success'
                                    });
                                    this.initData()
                                    this.handleClose()
                                    //新增需要刷新跳转第一页
                                    this.pageData = {
                                        current:1,
                                        size:10,
                                        total:null
                                    }
                                }else{
                                    this.$message.error(res.msg);
                                }
                            })
                        }else if(this.dialogTitle === '编辑'){
                            editperson(data).then((res)=>{
                                if(res.code == 0){
                                    this.$message({
                                        message: res.msg,
                                        type: 'success'
                                    });
                                    this.initData()
                                    this.handleClose()
                                }else{
                                    this.$message.error(res.msg);
                                }
                            })
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //获取列表子组件传值
            getMsgFormSon(data){
                let val = data
                if(val.btnText === "编辑"){
                    this.dialogTitle = val.btnText
                    this.dialogFormVisible = true;
                    this.ruleform = val.tableData
                }else if(val.btnText === "删除"){
                    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let data = {
                            id:val.tableData.id
                        }
                        delperson(data).then((res)=>{
                            if(res.code == 0){
                                this.$message({
                                    type: 'success',
                                    message: res.msg
                                });
                                this.dialogFormVisible = false
                                this.initData()
                            }else{
                                this.$message.error(res.msg)
                            }
                        })
                        // this.$message({
                        //     type: 'success',
                        //     message: '删除成功'
                        // });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                    });
                }else if(data.btnText === "详情"){
                    let params = {
                        id:data.tableData.id
                    }
                    let html=`<div style="text-align:center;">
                        <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2162188945,3066929966&fm=11&gp=0.jpg">
                    <div>`
                    this.$alert(html, '二维码', {
                        dangerouslyUseHTMLString: true
                    }).catch(e=>e);;
                }
            },
            //获取分页子组件传值
            getpageSon(data){
                let val = data
                this.pageData.current = val.currentChange?val.currentChange:this.pageData.current,
                this.pageData.size = val.sizeChange?val.sizeChange:this.pageData.size
                let params = {
                    page:this.pageData.current,
                    size:this.pageData.size
                }
                this.getData(params)
            },
            //关闭弹窗
            handleClose(){
                this.ruleform = {}
                this.$refs['refForm'].clearValidate();
                this.dialogFormVisible = false;
            },
            handleRemove(file, fileList) {
                document.getElementsByClassName('.el-upload--picture-card').style.visibility='hidden'
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleSuccess(res, file, fileList){
                // console.log(res)
                // console.log(file)
                // console.log(fileList)
            }
        }
    }
</script>
<style scoped lang='scss'>

    //首页弹出框
    .diologform{
        .el-dialog__body{
            width:70%;
            margin-left:1rem;
            .el-select{
                display: block;
            }
            .el-cascader{
                width:24rem;
            }
            .el-form-item{
                .el-input,.el-select{
                    width:24rem;
                }
            }
        }
    } 
</style>