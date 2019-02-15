function slugify(string) {
    const a = 'àáäâãåèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;'
    const b = 'aaaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------'
    const p = new RegExp(a.split('').join('|'), 'g')

    return string.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
}

var slugifyCallback = function (slugInput) {    
    $("#slug").val(slugify(slugInput));
};

$(document).ready(function(){
    $('input#title, input#name').keyup(function(){
        var slugInput = $(this).val();
        slugifyCallback(slugInput);
    })

    $('input#first_name, input#family_name').keyup(function(){
        var slugInput = $('input#first_name').val() + ' ' + $('input#family_name').val();
        slugifyCallback(slugInput);
    })
})