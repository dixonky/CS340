function updateCoach(id)
{
    $.ajax({
        url: '/coach/' + id,
        type: 'PUT',
        data: $('#update-coach').serialize(),
        success: function(result) {
            window.location.replace("./");
        }
    })
};