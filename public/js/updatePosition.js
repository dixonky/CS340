function updatePosition(id)
{
    $.ajax({
        url: '/position/' + id,
        type: 'PUT',
        data: $('#update-position').serialize(),
        success: function(result) {
            window.location.replace("./");
        }
    })
};