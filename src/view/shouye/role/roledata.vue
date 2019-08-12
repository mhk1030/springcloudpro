<template>

    <div>

      <el-dialog title="添加角色" :visible.sync="dialogFormVisible1" >
        <el-form :model="form" >
          <el-form-item label="角色名" :label-width="formLabelWidth1">
            <el-input v-model="form.roleName" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="描述" :label-width="formLabelWidth1">
            <el-input v-model="form.miaoshu" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="save()">保存</el-button>
        </div>

      </el-dialog>



      <el-dialog title="弹出操作" :visible.sync="dialogFormVisible" >
        <el-form :model="form" >
          <el-form-item label="角色名" :label-width="formLabelWidth">
            <el-input v-model="form.roleName" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="描述" :label-width="formLabelWidth">
            <el-input v-model="form.miaoshu" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="权限" :label-width="formLabelWidth">
            <el-tree
              :data="menus"
              show-checkbox
              node-key="id"
              ref="tree"
              :getCheckedKeys="menuId"
              :default-expand-all="true"
              :props="defaults">
            </el-tree>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="save()">保存</el-button>
        </div>
      </el-dialog>

      <!--以下为条件查询，以上为弹出框-->
      <el-form :inline="true" :model="mypage" class="demo-form-inline" style="margin-left: 100px;margin-right: 150px">
        <el-form-item label="角色名称">
          <el-input v-model="mypage.roleName" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="sels">查询</el-button>
        </el-form-item>
      </el-form>

      <!--以下为列表展示，以上为条件查询-->
      <el-button type="primary" icon="el-icon-circle-plus" @click="add()" style="margin-left: 0px"></el-button>
      <el-button type="primary" icon="el-icon-document" @click="downloadExcel()" style="margin-left: 0px"></el-button>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          prop="id"
          type="selection"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>
                <img src="../../../assets/logo.png" height="40px">
              </p>
              <p>角色名: {{ scope.row.roleName }}</p>
              <p>角色描述: {{ scope.row.miaoshu }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.roleName }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="miaoshu"
          label="描述"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" @click="del(scope.row)"></el-button>
            <el-button type="info" icon="el-icon-s-check" @click="power(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next,sizes"
        :total=total
        :current-page="mypage.cpage"
        :page-size="mypage.pageSize"
        :page-sizes=pageSizes
        @current-change="changePage"
        @size-change="changeSize"
        style="margin-left: 600px">
      </el-pagination>

    </div>
</template>

<script>
    export default {
        name: "roledata",
      data(){
        return{
          tableData:[],
          mypage:{
            cpage:1,
            pageSize:5,
            roleName:"",
          },
          total:10,
          pageSizes:[2,3,5,10],
          form:{},
          dialogFormVisible:false,
          dialogFormVisible1:false,
          formLabelWidth:"120px",
          formLabelWidth1:"120px",
          defaults:{
            children:"menuList",
            label:"menuName",
            code:"leval"
          },
          menus:[],
          menuIds:[],
          menuId:{}
        }

      },
      mounted(){
        this.getlist(this.mypage)
      },
      methods:{
        //列表下载
        downloadExcel() {
          this.$confirm('确定下载列表文件?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.excelData = this.tableData //你要导出的数据list。
            this.export2Excel()
          }).catch(() => {

          });
        },
        //数据写入excel
        export2Excel() {
          var that = this;
          require.ensure([], () => {
            const { export_json_to_excel } = require('@/excel/export2Excel'); //这里必须使用绝对路径，使用@/+存放export2Excel的路径
            const tHeader = ['角色名','描述']; // 导出的表头名信息
            const filterVal = ['roleName','miaoshu']; // 导出的表头字段名，需要导出表格字段名
            const list = that.excelData;
            const data = that.formatJson(filterVal, list);

            export_json_to_excel(tHeader, data, '角色表');// 导出的表格名称，根据需要自己命名
          })
        },
        //格式转换，直接复制即可
        formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => v[j]))
        },
          getlist(mypage){
            this.$axios.post(this.domain.serverpath+"role/roleList",mypage).then((response)=>{
              this.tableData=response.data.result.list
              this.total=response.data.result.total


              /*this.menuIds=response.data.result.pageInfo.list.menuIds;
              console.log(this.menuIds)*/
            })
          },
        changePage(current){
          this.mypage.cpage=current;
          this.getlist(this.mypage)
        },
        changeSize(pageSize){
          this.mypage.pageSize=pageSize
          this.getlist(this.mypage)
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        sels(){
            this.getlist(this.mypage)
        },
        add(){
            this.dialogFormVisible1=true
            this.form={id:0}
        },
        del(row){
            this.$axios.post(this.domain.serverpath+"role/roleDel",row).then((response)=>{
              if(response.data.code==200){
                this.$message({
                  message: 'ok!'+response.data.success,
                  type: 'success'
                })
                this.getlist(this.mypage)
              }
              if(response.data.code==500){
                  this.$message({
                    message: 'Sorry!'+response.data.error,
                    type: 'error'
                  })
                  this.getlist(this.mypage)
                }

            })
        },
        power(row){
              this.dialogFormVisible=true;
              this.$axios.post(this.domain.serverpath+"role/power").then((response)=>{
                this.menus=response.data.result;

              })
          this.form=row
          setTimeout(()=>{
            this.menuIds=row.menuIds
            console.log(row);
            this.$refs.tree.setCheckedKeys(this.menuIds),0;
          })
        },
        save(){
            var url = this.domain.serverpath+"role/roleAdd"
            if(this.form.id > 0){
              url=this.domain.serverpath+"role/roleUpdate"
              let menuId= [].concat(
                this.$refs.tree.getHalfCheckedKeys(),
                this.$refs.tree.getCheckedKeys()
              )
              this.form.menuId=menuId
              alert(this.form.menuId)
            }
            this.$axios.post(url,this.form).then((response)=>{
              if(response.data.code==200) {
                this.$message({
                  message: 'ok!  操作成功！',
                  type: 'success'
                })
                this.dialogFormVisible1=false
                this.getlist(this.mypage)
                this.dialogFormVisible=false;
              }
            })
        }
      }/*,
      created(){
        this.$router.push({path:"/system"})
      }*/
    }
</script>

<style scoped>

</style>
