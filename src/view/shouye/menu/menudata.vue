<template>
    <div>
      <!--点击弹框-->
    <el-dialog title="编辑权限" :visible.sync="dialogFormVisible">
      <el-form :model="forms">
       <el-form-item label="当前菜单名称-------">
          {{forms.menuName}}
       </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-circle-plus-outline" circle @click="add(forms)" :disabled="open"></el-button>
          <el-button type="primary" icon="el-icon-edit" circle @click="update(forms)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="del(forms)"></el-button>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="当前菜单等级：--">
          {{forms.leval}}
        </el-form-item>
        <el-form-item label="当前菜单名称：--">
          {{forms.menuName}}
        </el-form-item>
        <el-form-item label="当前菜单ID：--">
          {{forms.id}}
        </el-form-item>
      </el-form>
        <el-form :model="form"  :hidden="dialogFormVisible1">
          <el-form-item label="菜单名称" :label-width="formLabelWidth" >
            <el-input v-model="form.menuName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="菜单访问URL" :label-width="formLabelWidth">
            <el-input v-model="form.url" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>


        <div slot="footer" class="dialog-footer">
          <el-button @click="close()">取 消</el-button>
          <el-button type="primary" @click="save()">确 定</el-button>
        </div>
      </el-dialog>


      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>

      <el-tree
        :data="menus"
        show-checkbox
        node-key="id"
        ref="tree"
        :getCheckedKeys="menuId"
        :default-expand-all="true"
        :filter-node-method="filterNode"
        :props="defaults"
        @node-click="clickNode"
        >

      </el-tree>
    </div>
</template>

<script>
    export default {
        name: "menudata",
      watch: {
        filterText(val) {

          this.$refs.tree.filter(val);
        }
      },
        data(){
          return{
            filterText:'',
            menus:[],
            menuId:[],
            defaults:{
              children:"menuList",
              label:"menuName",
              code:"leval"
            },
            dialogFormVisible:false,
            formLabelWidth:"120px",
            form:{},
            forms:{},
            fontSize:"70px",
            url:"",
            open:false,
            dialogFormVisible1:false
          }
        },
        mounted(){

          this.getList();
        },
        methods:{
          getList(){
            this.$axios.post(this.domain.serverpath+"menu/menuList").then((response)=>{
              this.open=false
              this.menus=response.data.result

            })
          },
          filterNode(value, data,node) {
            console.log(value)
            if (!value) {
              return true;
            }
            return data.menuName.indexOf(value) !== -1;
          },
          clickNode(data,node,e){
           //this.form=data
            this.forms=data

            if(data.leval==4){
              this.open=true
              alert( this.open)
            }
            this.dialogFormVisible=true

          },
          add(data){
           this.form={id:data.id,leval:data.leval}
           this.url=this.domain.serverpath+"menu/menuAdd"
            this.dialogFormVisible1=false

          },
          update(data){
            this.form=data
            this.url=this.domain.serverpath+"menu/menuUpdate"

            this.dialogFormVisible1=false
          },
          del(data){
            alert("此菜单id为"+data.id);
            this.dialogFormVisible1=true
            this.url=this.domain.serverpath+"menu/menuDel"
            this.form=data
            this.save()
          },
          save(){
              this.$axios.post(this.url,this.form).then((response)=>{
                if(response.data.code == 200){
                  this.$message({
                    message: 'ok!  操作成功！',
                    type: 'success'
                  })
                  this.dialogFormVisible=false;
                  this.url=""
                  this.getList();
                }
              })
          },
          close(){
            this.dialogFormVisible=false
            this.form=""
            this.open=false
          }


        }

    }
</script>

<style scoped>

</style>
