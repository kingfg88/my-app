<template>
  <div class="audioManagement">
        <div class="serchBox">
            <el-input placeholder="请输入音频名称" v-model="serchData.name" clearable></el-input>
            <el-select v-model="serchData.type" placeholder="请选择音频类型" clearable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button class="SerchBtn" type="success" @click="Tosearch">查询</el-button>
            <el-button class="SerchBtn" type="primary" @click="Toadd">新增</el-button>
            <audio ref="audioPlayer" :src="audioSrc" controls></audio>
        </div>
        <plugTable :headData="headData" :tableData="tableData" :btnData="btnData" @func="getMsgFormSon"/>
        <plugPage :pageData="pageData" @pagefun="getpageSon" />
        <!-- 新增编辑 -->
        <el-dialog :title="dialogTitle" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" class="diologform" width="50%" :before-close="handleClose">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="音频名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="音频类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择音频类型" @change="typeChange">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="作者" prop="author">
                    <el-input v-model="form.author"></el-input>
                </el-form-item>
                <el-form-item label="上传音频" prop="src">
                    <el-upload
                      v-model="form.src"
                      :headers="headers"
                      :action="baseUrl+'/fileupload/upload'"
                      :on-remove="handleRemoveAudio"
                      :before-upload="beforUpload"
                      :on-success="handleSuccessAudio"
                      multiple
                      :limit="1"
                      :on-exceed="handleExceed"
                      :file-list="fileList">
                      <el-button size="small" type="primary">点击上传</el-button>
                      <div slot="tip" class="el-upload__tip">只能上传ogg/mp3/wav格式文件</div>
                    </el-upload>
                </el-form-item>
                <el-form-item size="large">
                    <el-button @click="handleClose('form')">取 消</el-button>
                    <el-button type="primary" @click="addData('form')">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
  </div>
</template>

<script>
import plugTable from '../../../components/table'
import plugPage from '../../../components/pagenation'
import { getAudioList,addAudio,delAudio,editAudio } from '../../../api/audio'

export default {
    name:'audioManagement',
    components:{plugTable,plugPage },
    data () {
        return {
            headData:[
                {
                    prop:'name',
                    label:'音频名称'
                },{
                    prop:'type',
                    label:'音频类型'
                },{
                    prop:'author',
                    label:'作者'
                }
            ],
            tableData: [],
            btnData:[
                {
                    btnText:'试听',
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
            dialogImgVisible:false,
            previewUrl:null,
            previewAudioUrl:null,
            fileList:[],
            serchData:{},
            pageData:{
                current:1,
                size:10,
                total:null
            },
            options: [{
              value: '黑金属',
              label: '黑金属'
            }, {
              value: '哥特金属',
              label: '哥特金属'
            }, {
              value: '轻音乐',
              label: '轻音乐'
            }, {
              value: '后摇',
              label: '后摇'
            }, {
              value: '厄运金属',
              label: '厄运金属'
            }, {
              value: '流行音乐',
              label: '流行音乐'
            }],
            value: '',
            dialogTitle:'新增',
            dialogFormVisible:false,
            rules:{
                name: [
                    { required: true, message: '请输入音频名称', trigger: 'blur' },
                    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
                ],
                type:[{ required: true, message: '请选择音频类型', trigger: 'change'}],
                author: [
                    { required: true, message: '请输入作者', trigger: 'blur' }
                ],
                src: [{ required: true, message: '请上传音频', trigger: 'change' }]
            },
            form:{
              name:'',
              type:'',
              thumbnail:'',
              src:''
            },
            audioSrc:null,
            baseUrl:null,
            baseAudioUrl:null,
            token:null,
        }
    },
    created(){
        this.initData()
        this.baseUrl = process.env.BASE_API
        this.baseAudioUrl = process.env.BASE_API+'/audio/'
        this.headers = {
            'authorization':`Bearer ${localStorage.getItem('accessToken')}`
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
            getAudioList(data).then((res)=>{
                if(res.code == 0){
                    this.tableData = []
                    this.pageData.total = res.total
                    res.data.forEach(ele => {
                        this.tableData.push({
                            id:ele.id,
                            name:ele.name,
                            type:ele.type,
                            author:ele.author,
                            src:ele.src
                        })
                    });
                }
            })
        },
        typeChange(val){
          this.form.type = val
        },
        onBeforePlay(next) {
            console.log('这里可以做一些事情...')
            next() // 开始播放
        },
        Tosearch(){
            let data = this.serchData
            data.page = this.pageData.current,
            data.size = this.pageData.size
            this.getData(data)
        },
        Toadd(){
            this.form = {}
            this.dialogTitle = '新增'
            this.fileList = []
            this.isClear = false//重新初始化 组件才能监听到
            this.dialogFormVisible = true;
        },
        addData(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.dialogTitle == "新增"){
                        let data=this.form
                        addAudio(data).then(res=>{
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
                        editAudio(params).then(res=>{
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
            this.fileList = []
            this.$refs['form'].resetFields();
            this.$refs['form'].clearValidate();
            this.dialogFormVisible = false;
        },
        //获取列表子组件传值
        getMsgFormSon(data){
            let val = data
            if(val.btnText === "编辑"){
                this.form = val.tableData
                this.dialogTitle = "编辑"
                this.fileList = []
                if(val.tableData.src){
                  this.fileList.push({
                    name:val.tableData.src,
                    url:val.tableData.src
                  })
                }
                this.dialogFormVisible = true
                
            }else if(val.btnText === "删除"){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {
                        id:val.tableData.id
                    }
                    delAudio(data).then((res)=>{
                        if(res.code == 0){
                            this.$message({
                                type: 'success',
                                message: res.msg
                            });
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
            }else if(data.btnText === "试听"){
                this.$refs.audioPlayer.load()
                this.audioSrc = this.baseAudioUrl+val.tableData.src
                this.$nextTick(function(){
                  this.$refs.audioPlayer.play()
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
        beforUpload(file){
          if(file.type != 'audio/mpeg'){
            this.$message.warning(`当前文件格式为${file.type},请按照要求格式上传！`)
            return false
          }
        },
        handleExceed(files, fileList) {
          this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        handleRemoveAudio(){
          this.form.src =''
        },
        handleSuccessAudio(res,file,fileList){
          if(res.code == 0){
            this.form.src = res.data
            this.$refs['form'].clearValidate('src');
          }
        },
        preview(val){
            this.previewUrl = val.thumbnail
            this.previewAudioUrl = val.src
            this.dialogImgVisible = true
        }
    },
}
</script>

<style scoped lang="scss">
.el-form-item{
    .el-input,.el-select{
        width:24rem;
    }
}
.detailContent{
    border:1px solid #ccc;
    padding:2rem;
}
.el-table .cell img:hover{
    cursor:pointer;
}
.serchBox{
  position:relative;
  audio{
    height:56%;
    position:absolute;
    right:2rem;
  }
}
</style>