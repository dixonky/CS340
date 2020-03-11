function deletePlayer(id){
    $.ajax({
        url: '/player/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};