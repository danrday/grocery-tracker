
let text = 'L<br /><br />W<br />210 FRANKLIN RD.<br /><br />1-615-377‘3690<br />Your cashier was SELF CHECKOUT<br /><br />310 CHIA HOT CRL. 9.29.3 ..<br />CTO PAPER TONEES\ . 3.99il’<br />LYSOL HD SPONGE 2.29 T<br />DELLO FARFLLE PSTAPC 1.99 B<br /><br />SC KROGER SAVINGS 1.00<br />PRSL DRESSING <+ 2.49 B<br /><br />SC KROGER SAVINGS 0.46<br />1.23 lb @ 1.59 /Tb<br /><br />WT BROCCOLI 1.96 B<br />FFMKT PESTO 4.49 B<br />PLMV DISH LIQUID <+ 2.69 T<br />SC KROGER SAVINGS 0.10<br />2 Q 1.29<br />AVOCADO HASS 2.58 B<br />2.32 lb @ 0.69 /Tb<br />WT BANANA ORGNC 1.60 B<br /><br />STO CRT BABY ORGNC 1.69 B<br />KROGER PLUS CUSTOMER *******8503<br />TAX 2.38<br /><br />ti¥t BALANCE 31.44<br /><br />HO nrntT n<br /><br />'

console.log("fulltext", text)

let filterLength = (string) => string.length >= 5;

//splits on line break and filters out empty strings
let str = text.split("<br />").filter(Boolean).filter(filterLength)

console.log("split: ", str)

let parsedReceipt = []

for (i=0; i<str.length; i++) {
  let price = str[i].match(/\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})/)
  if (price !== -1 && price !== null) {
    price = $.map(price, function(value, index) {
        return [value];
    });
    let priceIndex = str[i].search(/\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})/)
    productId = str[i].substring(0, priceIndex)
    productId = productId.trim()
    let thisItem = [productId, price[0], str[i]]
    parsedReceipt.push(thisItem)
  }
}

console.log('parsedReceipt', parsedReceipt)


$(document).ready(function() {
  Materialize.updateTextFields();
});
