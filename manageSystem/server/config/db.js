import '../../env'
import Sequelize from 'sequelize'

const Todolist = new Sequelize(
	'pfwang', // 数据库名
    'root',   // 用户名
    '',   // 用户密码
    {
        'dialect': 'mysql',  // 数据库使用mysql
        'host': '', // 数据库服务器ip
        'port': 3306        // 数据库服务器端口
    }
)

export default {
  Todolist // 将Todolist暴露出接口方便Model调用
}
