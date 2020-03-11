function updateTeam(id)
{
    $.ajax({
        url: '/team/' + id,
        type: 'PUT',
        data: $('#update-team').serialize(),
        success: function(result) {
            window.location.replace("./");
        }
    })
};