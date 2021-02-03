const charTable=[
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
    'Y', 'Z', '2', '3', '4', '5', '6', '7',
    '='
  ],allowedPeddingCount=[6,4,3,1,0];
  
  function str_split(str,length){
    if(typeof str !== 'string')return [];
    let a=[],i=0;
    length||(length=1);
    do{
        a.push(str.substr(i,length));
        i+=length;
    }while(i<str.length);
    return a;
  }
  
export default {
    encode:function(str,padding){
        if(!str)return '';
        let binaryString='';
        for (let i = 0;i<str.length;i++) {
            let bin=str.charCodeAt(i).toString(2);
            binaryString+=('0'.repeat(8-bin.length)+bin);
        }
        let fiveBitBinaryArray=str_split(binaryString,5),base32='';
        for(let i=0;i<fiveBitBinaryArray.length;i++){
            let bin=fiveBitBinaryArray[i];
            base32+=charTable[parseInt(bin+'0'.repeat(5-bin.length),2)];
        }
        let x=binaryString.length%40;
        if (padding && x != 0) {
            if (x == 8)base32+=charTable[32].repeat(6);
            else if(x===16)base32+=charTable[32].repeat(4);
            else if(x===24)base32+=charTable[32].repeat(3);
            else if(x===32)base32+=charTable[32];
        }
        return base32;
    },
    decode:function(str){
        if(!str)return '';
        let paddingMatch=str.match(/\=+$/),
            paddingCharCount=paddingMatch?paddingMatch[0].length:0;
        if(allowedPeddingCount.indexOf(paddingCharCount)<0)return false;
        for (let i=0;i<4;i++){
            if (paddingCharCount===allowedPeddingCount[i] 
                && str.substr(-(allowedPeddingCount[i]))!=charTable[32].repeat(allowedPeddingCount[i]))
                return false;
        }
        str=str.replace(/\=+$/,'');
        let binaryString = "";
        for (let i=0;i<str.length;i+=8) {
            let x='';
            if (charTable.indexOf(str[i])<0)return false;
            for (let j=0;j<8;j++) {
                let bin=charTable.indexOf(str[i+j]).toString(2);
                x+='0'.repeat(5-bin.length)+bin;
            }
            let eightBits=str_split(x,8);
            for (let z = 0; z < eightBits.length; z++) {
                let y,cd=parseInt(eightBits[z],2,10);
                binaryString+=((y=String.fromCharCode(cd))||cd==48)?y:"";
            }
        }
        return binaryString;
    }
  }