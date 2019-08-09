<template>
    <div>

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
        @node-click="clickNode">
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
            }
          }
        },
        mounted(){
          this.getList();
        },
        methods:{
          getList(){
            this.$axios.post(this.domain.serverpath+"menu/menuList").then((response)=>{
              this.menus=response.data.result;

            })
          },
          filterNode(value, data,node) {

            if (!value) {
              return true;
            }

            return data.menuName.indexOf(value) !== -1;
          },
          clickNode(data,node,e){

          }
        }
    }
</script>

<style scoped>

</style>
