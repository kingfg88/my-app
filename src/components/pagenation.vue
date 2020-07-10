<template>
    <div class='pagenation'>
        <el-pagination
            v-if="pageData.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageData.current"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageData.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageData.total">
        </el-pagination>
    </div>
</template>
<script>
    export default {
        name: 'pagenation',
        props:['pageData'],
        methods:{
            handleSizeChange(val) {
                let data = {
                    sizeChange:val
                }
                this.$emit('pagefun',data)
            },
            handleCurrentChange(val) {
                let data = {
                    currentChange:val
                }
                this.$emit('pagefun',data)
            }
        }
    }
</script>
<style scoped lang='scss'>
.pagenation{
    padding:0 1rem 1rem 1rem;
    display: flex;
    justify-content: flex-end;
}
</style>