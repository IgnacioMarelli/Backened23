import bcrypt from 'bcrypt';
function generateUniqueCode() {
    const salt = bcrypt.genSaltSync(10); 
    const hash = bcrypt.hashSync('value', salt); 
    return hash;
}

export default class TicketDTO {
    constructor(amount, purchaser, date) {
      this.code = generateUniqueCode();
      this.purchase_datetime = date;
      this.amount = amount;
      this.purchaser = purchaser;
    }

}