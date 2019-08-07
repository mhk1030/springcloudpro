<template>

<div :style="{'background-color':'#ffebcd'}">

   <el-form :inline="true" :model="mypage" class="demo-form-inline" style="margin-left: 200px;margin-right: 200px">
     <el-form-item label="用户名">
       <el-input v-model="mypage.uname" placeholder="用户名"></el-input>
     </el-form-item>
     <el-form-item label="开始日期">
       <el-input v-model="mypage.start" placeholder="开始日期" type="date"></el-input>
     </el-form-item>
     <el-form-item label="---">
       <el-input v-model="mypage.end" placeholder="开始日期" type="date"></el-input>
     </el-form-item>
     <el-select v-model="mypage.sex" placeholder="请选择">
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
          prop="url"
          label="图片路径"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="role.roleName"
          label="已绑定角色"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="操作"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" @click="del(scope.row)"></el-button>
            <el-button type="primary" icon="el-icon-edit" @click="update(scope.row)"></el-button>
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
        name: "datamain",
        data(){
          return{
            wheight:window.innerHeight-60,
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
              {id:2,name:"女"}]
          }

      },
      mounted(){
        this.getlist(this.mypage);
      },
      methods:{
          getlist(mypage){
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
          this.getlist(this.mypage)
        }
      },
      created(){
          this.$router.push({path:"/system"})
      }
    }
</script>

<style scoped>

</style>
