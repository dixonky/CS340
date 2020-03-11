function deleteTeam(id){
    $.ajax({
        url: '/team/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};