function deleteCoach(id){
    $.ajax({
        url: '/coach/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};