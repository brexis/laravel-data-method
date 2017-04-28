$(function() {
    var modalTemplate = [
        '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="dataMethodModalLabel">',
        '<div class="modal-dialog modal-sm" role="document">',
        '<div class="modal-content">',
        '<div class="modal-header">',
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
        '<h4 class="modal-title" id="dataMethodModalLabel"></h4>',
        '</div>',
        '<div class="modal-body"></div>',
        '<div class="modal-footer">',
        '<button type="button" class="btn btn-default btn-cancel" data-dismiss="modal">Cancel</button>',
        '<button type="button" class="btn btn-primary btn-confirm">Confirm</button>',
        '</div>',
        '</div>',
        '</div>',
        '</div>'
    ].join('');

    function handleMethod(e) {
        e.preventDefault();

        var link = $(this);
        var httpMethod = link.data('method').toUpperCase();
        var form;

        // If the data-method attribute is not PUT or DELETE,
        // then we don't know what to do. Just ignore.
        if (!['POST', 'PUT', 'DELETE'].includes(httpMethod)) {
            return;
        }

        // Allow user to optionally provide data-confirm="Are you sure?"
        var message = link.data('confirm');
        if (message) {
            confirm(link, function() {
                form = createForm(link);
                form.submit();
            });
        } else {
            form = createForm(link);
            form.submit();
        }
    }

    function createForm(link) {
        var form, params, fields, token;

        form = $('<form>', {
            'method': 'POST',
            'action': link.attr('href')
        });

        token = $('meta[name=csrf-token]').attr('content');

        params = link.data('params') || {};
        params._token = token;
        params._method = link.data('method');

        fields = createFields(params);

        return form.append(fields)
            .appendTo('body');
    }

    function createFields(params) {
        var fields = [];

        for (var name in params) {
            var input =
                $('<input>', {
                    'name': name,
                    'type': 'hidden',
                    'value': params[name]
                });

            fields.push(input);
        }

        return fields;
    }

    function confirm(link, success) {
        var title = link.data('title');
        var message = link.data('confirm');
        var theme = link.data('theme') || 'default';

        switch (theme) {
            case 'default':
                window.confirm(message) && success();
                break;
            case 'bootstrap':
                var $modal = $(modalTemplate);
                $modal.find('.modal-title').html(title);
                $modal.find('.modal-body').html(message);
                $modal.appendTo('body');
                $modal.modal('show');

                $modal.find('.btn-confirm').on('click', function() {
                    $modal.modal('hide');
                    success();
                });

                $modal.on('hidden.bs.modal', function() {
                    $modal.remove();
                });
                break;
            case 'sweetalert':
                swal({
                        title: title,
                        text: message,
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Confirm",
                        closeOnConfirm: false
                    },
                    function() {
                        success();
                    });
                break;
        }
    }

    $(document).on('click', 'a[data-method]', handleMethod);
});
