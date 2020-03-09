
exports.rackId = ()=>{
    let count = 1;
    let id;
   while(count < 1000000 ){
    id = `myLibrary_${count}`
    count++
   return id;
}

}