<template>
    <div class='plugtable'>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column v-for="ele in headData" :key="ele.index" :prop="ele.prop" :label="ele.label" show-overflow-tooltip>
            </el-table-column>
            <!-- 操作按钮 -->
            <el-table-column fixed="right" label="操作" width="250">
                <template slot-scope="scope">
                    <el-button v-for="ele in btnData" 
                    :key="ele.index" size="mini" 
                    :type="ele.btnType" 
                    plain
                    @click="handleBtn(scope.$index, scope.row,ele.btnText)">
                        {{ele.btnText}}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    export default {
        name: 'plugtable',
        props:['headData','tableData','btnData'],
        data () {
            return {
            }
        },
        computed:{
            // filterbtnData(){
            //     return this.tableData.filter((item)=>{
            //         return item.id>2
            //     })
            // }
        },
        created(){
            // console.log(this.filterbtnData)
        },
        methods:{
            handleBtn(index,tableData,btnText){
                let data = {
                    btnText:btnText,
                    tableData:tableData
                }
                this.$emit('func',data)
            },
        }
    }
</script>
<style scoped lang='scss'>
    .plugtable{
        padding:0 1rem 1rem 1rem;
    }
</style>