<template>
    <div class="password">
        <el-dialog
            title="修改密码"
            :visible="changeVisible"
            width="400px"
            @close="handleClose"
            
            >
            <el-form  label-width="100px" ref="changeForm" :model="passwords" :rules="rules" >
                <el-form-item label="旧密码" prop="oldPassword">
                    <el-input v-model="passwords.oldPassword" type="password"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input v-model="passwords.newPassword" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码"  prop="checkPassword">
                    <el-input v-model="passwords.checkPassword" type="password"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="$emit('update:changeVisible', false)">取 消</el-button>
                <el-button type="primary" @click="sureChange()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {changePassword} from "../network/login"
export default {
    name: 'Password',
    props:{
        changeVisible:{
            type: Boolean, 
        }
    },
    data () {
        var validatePass2 = (rule, value, callback) => {
            if (value !== this.passwords.newPassword) {
            callback(new Error('两次输入密码不一致!'));
            } else {
            callback();
            }
        };
        return {
            
            passwords:{
                oldPassword:'',
                newPassword:'',
                checkPassword:'',
            },
            rules: {
                oldPassword: [
                    { required: true, message: '请输入旧密码', trigger: 'blur' },
                    { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
                ],
                newPassword: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
                ],
                checkPassword: [
                    { required: true, message: '请确认新密码', trigger: 'blur' },
                    { validator: validatePass2, trigger: 'blur' }
                ],
            }       
        }
    },
    methods:{
        handleClose(){
            this.$refs.changeForm.resetFields();
            this.$emit('update:changeVisible', false)
        },
        sureChange(){
            var userName=this.$cookies.get('userName')
            this.$refs['changeForm'].validate(async (valid) => {
                if (valid) {
                    const res=await changePassword(userName,this.passwords.oldPassword,this.passwords.newPassword)
                    
                    if(res.code==200){
                        sessionStorage.clear()
                        this.$router.push('/')
                        this.$emit('update:changeVisible', false)
                    }
                } else {
                    
                    return false;
                }
            });
            
            
        }
    },
    
}
</script>


<style scoped>
</style>
