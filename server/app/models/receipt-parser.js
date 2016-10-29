'use strict'

exports.receiptParser = function (text) {

let filterLength = (string) => string.length >= 5;

console.log("STRING:", text)

//splits on line break and filters out empty strings
let str = text.split("\n").filter(Boolean).filter(filterLength)

console.log("split: ", str)

let parsedReceipt = []

for (let i=0; i<str.length; i++) {
  let price = str[i].match(/\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})/)

  if (price !== -1 && price !== null) {

    // price = $.map(price, function(value, index) {
    //     return [value];
    // });

    let priceIndex = str[i].search(/\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})/)
    let productId = str[i].substring(0, priceIndex)
    productId = productId.trim()
    let thisItem = [productId, price[0], str[i]]
    parsedReceipt.push(thisItem)

  } else {

    let thisItem = [str[i]]
    parsedReceipt.push(thisItem)

  }



}

console.log('type ofparsedReceipt', typeof(parsedReceipt))

return parsedReceipt;
}
