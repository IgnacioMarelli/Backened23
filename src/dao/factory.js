import config from '../../data.js'

const {PORT, MONGO_URL} = config;


class daoFactory {
    static async getDao(){
        switch (config.DAO) {
            case value:'MONGO'
            mongoose.connect(MONGO_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
              });
                break;
        
            default:
                break;
        }
    }
}