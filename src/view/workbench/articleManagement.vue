<template>
  <div class="articleManagement">
        <div class="serchBox">
            <el-input placeholder="请输入文章名称" v-model="serchData.name" clearable></el-input>
            <el-input placeholder="请输入发布人" v-model="serchData.issuer" clearable></el-input>
            <el-date-picker
                v-model="serchData.time"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="searchPicker"
                range-separator="至"
                start-placeholder="发布开始日期"
                end-placeholder="发布结束日期"
                align="right">
            </el-date-picker>
            <el-button class="SerchBtn" type="" @click="Tosearch">查询</el-button>
            <el-button class="SerchBtn" type="primary" @click="Toadd">新增</el-button>
        </div>
        <plugTable :headData="headData" :tableData="tableData" :btnData="btnData" @func="getMsgFormSon"/>
        <plugPage :pageData="pageData" @pagefun="getpageSon" />
        <!-- 新增编辑 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" class="diologform" width="80%" :before-close="handleClose">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="文章名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="文章内容" prop="content">
                    <editor-bar v-model="form.content" :isClear="isClear" @change="change"></editor-bar>
                </el-form-item>
                <el-form-item size="large">
                    <el-button @click="handleClose('form')">取 消</el-button>
                    <el-button type="primary" @click="addData('form')">确 定</el-button>
                </el-form-item>
            </el-form>
            <!-- <div slot="footer" class="dialog-footer">
                <el-button @click="handleClose()">取 消</el-button>
                <el-button type="primary" @click="addData()">确 定</el-button>
            </div> -->
        </el-dialog>
        <!-- 详情 -->
        <el-dialog :title="detailTitle" :visible.sync="detailVisible" class="diologform" width="80%" :before-close="detailClose">
            <div class="detailContent" v-html="detailContent"></div>
        </el-dialog>
  </div>
</template>

<script>
import plugTable from '../../components/table'
import plugPage from '../../components/pagenation'
import EditorBar from '../../components/wangEnduit'
import { getArticleList,addArticle,delArticle,editArticle,detailArticle } from '../../api/article'
export default {
    name:'articleManagement',
    components:{plugTable,plugPage,EditorBar },
    data () {
        return {
            headData:[
                {
                    prop:'name',
                    label:'文章名称'
                },{
                    prop:'issuer',
                    label:'发布人'
                },{
                    prop:'time',
                    label:'发布时间'
                },{
                    prop:'modifier',
                    label:'修改人'
                },{
                    prop:'updatetime',
                    label:'最新修改时间'
                }
            ],
            tableData: [],
            btnData:[
                {
                    btnText:'详情',
                    btnType:'success'
                },
                {
                    btnText:'编辑',
                    btnType:'primary'
                },{
                    btnText:'删除',
                    btnType:'danger'
                }
            ],
            pageData:{
                current:1,
                size:10,
                total:null
            },
            serchData:{},
            dialogTitle:'新增',
            detailTitle:'详情',
            detailContent:null,
            dialogFormVisible:false,
            detailVisible:false,
            ruleform:{},
            formLabelWidth:'120px',
            rules:{
                name: [
                    { required: true, message: '请输入文章名称', trigger: 'blur' },
                    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请输入文章内容', trigger: 'blur' }
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
            pickerOptions: {
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                    picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', date);
                    }
                }]
            },
            dialogImageUrl:'',
            dialogVisible: false,
            isClear: false,
            form:{
                name:'',
                content:''
            },
            edirID:null,
            baseUrl:null,
            token:null
        }
    },
    created(){
        this.initData()
        this.baseUrl = process.env.BASE_API
        this.headers = {
            authorization:`Bearer ${localStorage.getItem('accessToken')}`
        }
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
            getArticleList(data).then((res)=>{
                if(res.code == 0){
                    this.tableData = []
                    this.pageData.total = res.total
                    res.data.forEach(ele => {
                        this.tableData.push({
                            id:ele.id,
                            time:this.$moment(parseInt(ele.time)).format("YYYY-MM-DD HH:MM:SS"),
                            name:ele.name,
                            issuer:ele.issuer,
                            modifier:ele.modifier,
                            updatetime:ele.updatetime
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
            this.isClear = false//重新初始化 组件才能监听到
            this.dialogFormVisible = true;
        },
        addData(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.dialogTitle == "新增"){
                        let data=this.form
                        data.issuer = JSON.parse(localStorage.getItem('userInfo'))[0].realname
                        addArticle(data).then(res=>{
                            if(res.code == 0){
                                this.$message({
                                    message: res.msg,
                                    type: 'success'
                                });
                                this.initData()
                                this.handleClose()
                                this.pageData = {
                                    current:1,
                                    size:10,
                                    total:null
                                }
                            }else{
                                this.$message.error(res.msg);
                            }
                        })
                    }else if(this.dialogTitle == "编辑"){
                        let params = this.form
                        params.id = this.edirID
                        params.modifier = JSON.parse(localStorage.getItem('userInfo'))[0].realname
                        editArticle(params).then(res=>{
                            if(res.code == 0){
                                this.$message({
                                    message: res.msg,
                                    type: 'success'
                                });
                                let data = {}
                                data.page = this.pageData.current,
                                data.size = this.pageData.size
                                this.initData(data)
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
        //关闭弹窗
        handleClose(){
            this.form = {
                name:'',
                content:''
            }
            this.isClear = true
            this.$refs['form'].clearValidate();
            this.dialogFormVisible = false;
        },
        //关闭弹窗
        detailClose(){
            this.detailVisible = false;
        },
        //获取列表子组件传值
        getMsgFormSon(data){
            let val = data
            if(val.btnText === "编辑"){
                let params = {
                    id:val.tableData.id
                }
                detailArticle(params).then(res => {
                    if(res.code == 0){
                        this.edirID = res.data.id
                        this.form.name = res.data.name
                        this.form.content = res.data.content
                        this.dialogTitle = val.btnText
                        this.dialogFormVisible = true;
                    }else{
                        this.$message('获取当前信息失败！')
                    }
                })
            }else if(val.btnText === "删除"){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {
                        id:val.tableData.id
                    }
                    delArticle(data).then((res)=>{
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
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            }else if(data.btnText === "详情"){
                this.detailVisible = true
                let params = {
                    id:data.tableData.id
                }
                detailArticle(params).then(res=>{
                    if(res.code == 0){
                        this.detailTitle = res.data.name
                        this.detailContent = res.data.content
                    }
                })
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
        change(val) {
            this.form.content = val
        },
        //导入Excel
        uploadBefore(file){
            let type = file.name.substring(file.name.lastIndexOf('.')+1)
            console.log(type)
            if( type!= 'xlsx' && type != 'xls'){
                this.$message.warning('只能上传xls/xlsx类型的文件！')
                return false
            }
        },
        uploadSuccess(res, file, fileList){
            if(res.code == 0){
                this.initData()
            }
        }
    },
}
</script>

<style scoped lang="scss">
.el-form-item{
    .el-input{
        width:24rem;
    }
}
.detailContent{
    border:1px solid #ccc;
    padding:2rem;
}
</style>