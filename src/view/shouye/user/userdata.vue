<template>
    <div>
      <!--编辑角色弹窗-->
      <el-dialog title="角色信息" :visible.sync="dialogFormVisible1">
        <el-select v-model="selroleId" placeholder="请选择">
          <el-option
            v-for="item in Roles"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="edit()">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="弹出操作" :visible.sync="dialogFormVisible" >
        <el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="form.userName" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="登录名" :label-width="formLabelWidth">
            <el-input v-model="form.loginName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth">
            <label>男<input type="radio" v-model="form.sex" value="1"></input></label>
            <label>女<input type="radio" v-model="form.sex" value="2"></input></label>
          </el-form-item>
          <el-form-item label="电话" :label-width="formLabelWidth" prop="tel">
            <el-input v-model="form.tel"  autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="密码"  :label-width="formLabelWidth" prop="password">
            <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" :label-width="formLabelWidth" prop="checkPass">
            <el-input type="password" v-model="form.checkPass" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="图片" :label-width="formLabelWidth">
            <el-upload
              class="avatar-uploader"
              action="http://localhost:10000/api/manger/user/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="save()">保存</el-button>
        </div>
      </el-dialog>

      <!--以下为条件查询，以上为弹出框-->
      <el-form :inline="true" :model="mypage" class="demo-form-inline" style="margin-left: 100px;margin-right: 150px">
        <el-form-item label="用户名">
          <el-input v-model="mypage.uname" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-input v-model="mypage.start" placeholder="开始日期" type="date"></el-input>
        </el-form-item>
        <el-form-item label="---">
          <el-input v-model="mypage.end" placeholder="开始日期" type="date"></el-input>
        </el-form-item>
        <el-select v-model="mypage.sex" clearable  placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-form-item>
          <el-button type="primary" v-on:click="sels">查询</el-button>
        </el-form-item>
      </el-form>

      <!--以下为列表展示，以上为条件查询-->
      <el-button type="primary" icon="el-icon-circle-plus" @click="add()" style="margin-left: 0px"></el-button>
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
          prop="userName"
          label="用户名"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <el-image :src="'http://localhost:8090/'+scope.row.url" style="width:50px;height:50px"></el-image>
              <p>用户名: {{ scope.row.userName }}</p>
              <p>登录名: {{ scope.row.loginName }}</p>
              <p v-if="scope.row.sex ==1">性  别: 男</p>
              <p v-if="scope.row.sex ==2">性  别: 女</p>
              <p>电  话: {{ scope.row.tel}}</p>
              <!--<p>角  色: {{ scope.row.role.roleName }}</p>-->
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.userName }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="loginName"
          label="登录名"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="性别"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.sex==1">男</span>
            <span v-if="scope.row.sex==2">女</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="tel"
          label="电话"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="图片路径"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-image :src="'http://localhost:8090/'+scope.row.url"></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="role.roleName"
          label="已绑定角色"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" @click="del(scope.row)"></el-button>
            <el-button type="primary" icon="el-icon-edit" @click="update(scope.row)"></el-button>
            <el-button type="info" icon="el-icon-s-check" @click="roles(scope.row)"></el-button>
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
        name: "userdata",
      data(){

        var checkPhone = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('手机号不能为空'));
          } else {
            const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
            console.log(reg.test(value));
            if (reg.test(value)) {
              callback();
            } else {
              return callback(new Error('请输入正确的手机号'));
            }
          }
        };
        var validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'));
          } else {
            if (this.form.checkPass !== '') {
              this.$refs.form.validateField('checkPass');
            }
            callback();
          }
        };
        var validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.form.password) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
        return{
          tableData:[],
          mypage:{
            cpage:1,
            pageSize:5,
            uname:"",
            start:"",
            end:"",
            sex:""
          },
          total:10,
          pageSizes:[2,3,5,10],
          options:[{id:1,name:"男"},
            {id:2,name:"女"}],
          dialogFormVisible:false,
          formLabelWidth:"120px",
          form:{
            checkPass:""
          },
          imageUrl:"",
          rules: {
            password: [
              { validator: validatePass, trigger: 'blur' }
            ],
            checkPass: [
              { validator: validatePass2, trigger: 'blur' }
            ],
            tel: [
              {validator: checkPhone, trigger: 'blur'}
            ]

          },
          dialogFormVisible1:false,
          Roles:[],
          selroleId:"",
          userId:""

        }

      },
      mounted(){
        this.getlist(this.mypage);
      },
      methods:{
        getlist(mypage){
          let that = this.$router;
          this.$axios.post(this.domain.serverpath+"user/list",mypage).then((response)=>{

            this.tableData = response.data.result.list
            this.total = response.data.result.total

          })
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        changePage(current){
          this.mypage.cpage=current;
          this.getlist(this.mypage)
        },
        changeSize(pageSize){
          this.mypage.pageSize=pageSize
          this.getlist(this.mypage)
        },sels(){
          this.mypage.cpage=1
          this.getlist(this.mypage)
        },
        del(row){
          this.$axios.post(this.domain.serverpath+"user/del",row).then((response)=>{
            if(response.data.code == 200){
              this.$message({
                message: 'ok!  删除成功！',
                type: 'success'
              });
              this.getlist(this.mypage)
            }
          })
        },
        add(){
          this.dialogFormVisible = true
          this.imageUrl=""
          this.form={id:0,checkPass:"",tel:""}
        },
        update(row){
          this.form = row
          this.form.checkPass = row.password
          this.imageUrl = "http://localhost:8090/"+row.url;
          alert(this.imageUrl);
          this.dialogFormVisible=true
        },
        save(){
          var url=this.domain.serverpath+"user/add";

          if(this.form.id > 0){
            url = this.domain.serverpath+"user/update"
          }
          this.$axios.post(url,this.form).then((response)=>{
            if(response.data.code == 200){
              this.$message({
                message: 'ok! '+response.data.success,
                type: 'success'
              });
              this.dialogFormVisible=false
              this.getlist(this.mypage)
            }

            if(response.data.code==500){
              this.$message({
                message: 'Sorry! '+response.data.error,
                type: 'error'
              });
            }
          })

        },
        roles(row){

          this.userId=row.id
          console.log(row)
         /* this.selroleId=row.Role.roleName*/
          this.$axios.post(this.domain.serverpath+"user/selRole").then((response)=>{
            if(response.data.code==200){
              this.Roles=response.data.result;
              console.log(this.Roles)
              this.dialogFormVisible1=true;
            }

          })
        },
        edit(){

          let selrole={
            userId:this.userId,
            roleId:this.selroleId
          }
          console.log(selrole)
          this.$axios.post(this.domain.serverpath+"user/editRole",selrole).then((response)=>{
            if(response.data.code==200){
              this.$message({
                message: 'ok!  编辑成功！',
                type: 'success'
              });
              this.dialogFormVisible1=false
            }
          })
        },
        handleAvatarSuccess(res, file) {
          this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
          const isJPG = file.type === 'image/jpeg';
          const isLt2M = file.size / 1024 / 1024 < 2;

          if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
          }
          return isJPG && isLt2M;
        }

      }
    }
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
