<template>
  <div class="videoManagement">
        <div class="serchBox">
            <el-input placeholder="请输入视频名称" v-model="serchData.name" clearable></el-input>
            <el-select v-model="serchData.type" placeholder="请选择视频类型" clearable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button class="SerchBtn" type="success" @click="Tosearch">查询</el-button>
            <el-button class="SerchBtn" type="primary" @click="Toadd">新增</el-button>
        </div>
        <div class='plugtable'>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column label="缩略图">
                    <template slot-scope="scope">
                        <img :src="baseImgUrl+scope.row.thumbnail" @click="preview(scope.row)"/>
                    </template>
                </el-table-column>
                <el-table-column  prop="name" label="视频名称"></el-table-column>
                <el-table-column prop="type" label="分类"></el-table-column>
                <el-table-column fixed="right" label="操作" width="250">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" plain @click="ToEidit(scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" plain @click="ToDel(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <plugPage :pageData="pageData" @pagefun="getpageSon" />
        <!-- 新增编辑 -->
        <el-dialog :title="dialogTitle" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" class="diologform" width="50%" :before-close="handleClose">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="视频名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="视频类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择视频类型" @change="typeChange">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="缩略图" prop="thumbnail">
                    <el-upload
                      v-model="form.thumbnail"
                      :headers="headers"
                      :action="baseUrl+'/fileupload/upload'"
                      list-type="picture-card"
                      :file-list="fileList"
                      :on-success="handleSuccess"
                      :on-preview="handlePictureCardPreview"
                      :on-remove="handleRemove">
                      <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible" :modal="false">
                      <img width="100%" :src="baseImgUrl+form.thumbnail" alt="">
                    </el-dialog>
                </el-form-item>
                <el-form-item label="上传视频" prop="src">
                    <el-upload
                      v-model="form.src"
                      :headers="headers"
                      :action="baseUrl+'/fileupload/upload'"
                      :on-remove="handleRemoveVideo"
                      :on-success="handleSuccessVideo"
                      multiple
                      :limit="1"
                      :on-exceed="handleExceed"
                      :file-list="fileListVide">
                      <el-button size="small" type="primary">点击上传</el-button>
                      <div slot="tip" class="el-upload__tip">只能上传mp4文件</div>
                    </el-upload>
                </el-form-item>
                <el-form-item size="large">
                    <el-button @click="handleClose('form')">取 消</el-button>
                    <el-button type="primary" @click="addData('form')">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 视频预览 -->
        <el-dialog title="视频预览" :visible.sync="dialogImgVisible" width="50%">
            <video width="100%" :src="baseVideoUrl+previewVideoUrl" :poster="baseImgUrl+previewUrl" controls="controls"></video>
        </el-dialog>
  </div>
</template>

<script>
import plugTable from '../../../components/table'
import plugPage from '../../../components/pagenation'
import { getVideoList,addVideo,delVideo,editVideo } from '../../../api/video'
export default {
    name:'videoManagement',
    components:{plugTable,plugPage },
    data () {
        return {
            dialogImgVisible:false,
            previewUrl:null,
            previewVideoUrl:null,
            fileList:[],
            fileListVide:[],
            serchData:{},
            tableData: [],
            pageData:{
                current:1,
                size:10,
                total:null
            },
            options: [{
              value: '研究成果',
              label: '研究成果'
            }, {
              value: '学校简介',
              label: '学校简介'
            }],
            value: '',
            dialogTitle:'新增',
            dialogVideoUrl: '',
            dialogVisible: false,
            dialogFormVisible:false,
            ruleform:{},
            rules:{
                name: [
                    { required: true, message: '请输入视频名称', trigger: 'blur' },
                    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
                ],
                type:[{ required: true, message: '请选择视频类型', trigger: 'change'}],
                thumbnail: [{ required: true, message: '请上传缩略图', trigger: 'change' }],
                src: [{ required: true, message: '请上传视频', trigger: 'change' }],
            },
            form:{
              name:'',
              type:'',
              thumbnail:'',
              src:''
            },
            selectVal:'',
            edirID:null,
            baseUrl:null,
            baseImgUrl:null,
            baseVideoUrl:null,
            token:null
        }
    },
    created(){
        this.initData()
        this.baseUrl = process.env.BASE_API
        this.baseImgUrl = process.env.BASE_API+'/public/image/'
        this.baseVideoUrl = process.env.BASE_API+'/public/video/'
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
            getVideoList(data).then((res)=>{
                if(res.code == 0){
                    this.tableData = []
                    this.pageData.total = res.total
                    res.data.forEach(ele => {
                        this.tableData.push({
                            id:ele.id,
                            thumbnail:ele.thumbnail,
                            name:ele.name,
                            type:ele.type,
                            src:ele.src
                        })
                    });
                }
            })
        },
        typeChange(val){
          this.form.type = val
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
                        addVideo(data).then(res=>{
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
                        editVideo(params).then(res=>{
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
            this.fileListVide = []
            this.$refs['form'].resetFields();
            this.$refs['form'].clearValidate();
            this.dialogFormVisible = false;
        },
        ToEidit(val){
            this.fileList = []
            this.fileListVide = []
            this.dialogTitle = "编辑"
            this.fileList.push({
                url:this.baseImgUrl+val.thumbnail
            })
            if(val.src){
              this.fileListVide.push({
                name:val.src,
                url:this.baseImgUrl+val.src
              })
            }
            this.form = val
            this.dialogFormVisible = true
        },
        ToDel(val){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {
                    id:val
                }
                delVideo(data).then((res)=>{
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
        handleRemove(file, fileList) {
          this.form.thumbnail = ''
        },
        handlePictureCardPreview(file) {
          this.dialogVisible = true;
        },
        handleSuccess(res,file,fileList){
            if(res.code == 0){
                this.form.thumbnail = res.data
                this.$refs['form'].clearValidate('thumbnail');
            }
        },
        handleExceed(files, fileList) {
          this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        handleRemoveVideo(){
          this.form.src =''
        },
        handleSuccessVideo(res,file,fileList){
          if(res.code == 0){
            this.form.src = res.data
            this.$refs['form'].clearValidate('src');
          }
        },
        preview(val){
            this.previewUrl = val.thumbnail
            this.previewVideoUrl = val.src
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
</style>