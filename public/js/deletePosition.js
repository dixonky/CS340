function deletePosition(id){
    $.ajax({
        url: '/position/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};