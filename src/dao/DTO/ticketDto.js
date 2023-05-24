import bcrypt from 'bcrypt';
function generateUniqueCode() {
    const salt = bcrypt.genSaltSync(10); 
    const hash = bcrypt.hashSync('value', salt); 
    return hash;
}

class TicketDTO {
    constructor(purchase_datetime, amount, purchaser) {
      this.code = generateUniqueCode();
      this.purchase_datetime = purchase_datetime;
      this.amount = amount;
      this.purchaser = purchaser;
    }

}