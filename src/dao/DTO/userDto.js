export default class UserDTO{
    constructor(user){
        this.first_name = user.first_name,
        this.last_name = user.last_name,
        this.status = true;
        this.phone=user.phone?user.phone.split('-').join(''):'';
        this.email= user.email;
        this.age=user.age;
        this.role=user.role;
        this.cart=user.cart?user.cart.products:'';
    }
}