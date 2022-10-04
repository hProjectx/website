function renderColor(s, c){
    var result;
    if (c === '0'){
        result = '<font color="gray">'+s+'</font>';
    }
    else if (c === '1'){
        result = '<font color="yellow">'+s+'</font>';
    }
    else if (c === '2'){
        result = '<font color="green">'+s+'</font>';
    }
    return result;
}

function renderWord(w, c){
    var result = '';
    for (let i in w){
        result += renderColor(w[i], c[i]);
    }
    return result;
}