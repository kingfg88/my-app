<template>
    <div class='home'>
        <div class="serchBox">
            <el-input placeholder="请输入姓名" v-model="serchData.name" clearable></el-input>
            <el-input placeholder="请输入俱乐部" v-model="serchData.club" clearable></el-input>
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
            <el-button class="btn" type="info" @click="Tosearch">查询</el-button>
            <el-button class="btn" type="primary" @click="Toadd">新增</el-button>
            <el-button class="btn" type="success">导入</el-button>
            <el-button class="btn" type="warning">导出</el-button>
        </div>
        <plugTable :headData="headData" :tableData="tableData" :btnData="btnData" @func="getMsgFormSon"/>
        <plugPage :pageData="pageData" @pagefun="getpageSon" />
        <!-- 新增编辑弹窗 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" class="diologform" width="500px" :before-close="handleClose">
            <el-form :model="ruleform" ref="refForm" :rules="rules">
                <el-form-item label="日期" :label-width="formLabelWidth" prop="time">
                    <el-date-picker
                        clearable
                        v-model="ruleform.time"
                        type="datetime"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="ruleform.name" placeholder="选请输入名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="司职" :label-width="formLabelWidth" prop="secretary">
                    <el-select v-model="ruleform.secretary" placeholder="请选择区域" clearable>
                        <el-option label="前锋" value="前锋"></el-option>
                        <el-option label="中锋" value="中锋"></el-option>
                        <el-option label="后卫" value="后卫"></el-option>
                        <el-option label="守门员" value="守门员"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="俱乐部" :label-width="formLabelWidth" prop="club">
                    <el-cascader
                        clearable
                        v-model="ruleform.club"
                        placeholder="可搜索"
                        :options="options"
                        :show-all-levels="false"
                        filterable>
                    </el-cascader>
                </el-form-item>
                <!-- <el-form-item label="俱乐部logo" :label-width="formLabelWidth" prop="img">
                    <el-upload
                        v-model="ruleform.img"
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        list-type="picture-card"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove"
                        :on-success="handleSuccess">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item> -->
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
    import { getplayer,addplayer,editplayer,delplayer } from '../../api/player'
    export default {
        name: 'Home',
        components:{plugTable,plugPage},
        data () {
            return {
                headData:[
                    {
                        prop:'time',
                        label:'加入时间'
                    },{
                        prop:'name',
                        label:'姓名'
                    },{
                        prop:'secretary',
                        label:'司职'
                    },{
                        prop:'club',
                        label:'俱乐部'
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
                dialogFormVisible:false,
                ruleform:{},
                formLabelWidth:'120px',
                rules:{
                    time: [
                        { required: true, message: '请选择时间', trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                    ],
                    secretary: [
                        { required: true, message: '请选择司职', trigger: 'change' }
                    ],
                    club: [
                        { required: true, message: '请选择俱乐部', trigger: 'change' }
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
                options:[
                    {
                        value: '西甲',
                        label: '西甲',
                        children:[
                            {
                                value:'皇家马德里',
                                label:'皇家马德里'
                            },
                            {
                                value:'巴塞罗那',
                                label:'巴塞罗那'
                            },
                            {
                                value:'西班牙人',
                                label:'西班牙人'
                            },
                            {
                                value:'马德里竞技',
                                label:'马德里竞技'
                            },
                        ],
                    },{
                        value: '英超',
                        label: '英超',
                        children:[
                            {
                                value:'曼彻斯特联',
                                label:'曼彻斯特联'
                            },
                            {
                                value:'利物浦',
                                label:'利物浦'
                            },
                            {
                                value:'阿森纳',
                                label:'阿森纳'
                            },{
                                value:'切尔西',
                                label:'切尔西'
                            },{
                                value:'热刺',
                                label:'热刺'
                            },
                        ],
                    },{
                        value: '意甲',
                        label: '意甲',
                        children:[
                            {
                                value:'罗马',
                                label:'罗马'
                            },
                            {
                                value:'尤文图斯',
                                label:'尤文图斯'
                            },
                            {
                                value:'国际米兰',
                                label:'国际米兰'
                            },
                            {
                                value:'AC米兰',
                                label:'AC米兰'
                            },
                            {
                                value:'拉齐奥',
                                label:'拉齐奥'
                            },
                            {
                                value:'佛罗伦萨',
                                label:'佛罗伦萨'
                            },
                        ],
                    },
                ],
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
                getplayer(data).then((res)=>{
                    if(res.code == 0){
                        this.tableData = []
                        this.pageData.total = res.total
                        res.data.forEach(ele => {
                            this.tableData.push({
                                tid:ele.tid,
                                time:this.renderTime(ele.time),
                                name:ele.name,
                                secretary:ele.secretary,
                                club:ele.club
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
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.dialogTitle === '新增'){
                            addplayer(data).then((res)=>{
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
                        }else if(this.dialogTitle === '编辑'){
                            editplayer(data).then((res)=>{
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
                            tid:val.tableData.tid
                        }
                        delplayer(data).then((res)=>{
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
            //时间格式转化
            renderTime(date) {
                var dateee = new Date(date).toJSON();
                return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') 
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
                document.getElementsByClassName('.el-upload--picture-card').style.visibility='hidden'
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleSuccess(res, file, fileList){
                console.log(res)
                console.log(file)
                console.log(fileList)
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
            .el-date-editor.el-input{
                width:100%;
            }
            .el-cascader{
                width:100%;
            }
        }
    } 
</style>