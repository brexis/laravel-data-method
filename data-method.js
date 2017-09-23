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

    function getCSRFToken(options) {
        return options.token || $('meta[name=csrf-token]').attr('content');
    }

    function handleMethod(e) {
        e.preventDefault();
        var link = $(this);

        dataMethod(link.attr('href'), link.data());
    }

    function dataMethod(url, options, cb) {
        var method = options.method || 'POST';
        method = method.toUpperCase();
        cb = cb || function() {};

        // If the data-method attribute is not PUT or DELETE,
        // then we don't know what to do. Just ignore.
        if (!['POST', 'PUT', 'DELETE'].includes(method)) {
            return;
        }

        // Allow user to optionally provide data-confirm="Are you sure?"
        if (options.confirm) {
            confirm(options, function() {
                cb(sendRequest(url, method, options));
            });
        } else {
            cb(sendRequest(url, method, options));
        }
    }

    function sendRequest(url, method, options) {
        if (options.ajax) {
            return sendAjax(url, method, options);
        } else {
            return createForm(url, method, options).submit();
        }
    }

    function createForm(url, method, options) {
        var form, params, fields, token;

        form = $('<form>', {
            'method': 'POST',
            'action': url
        });


        params = options.params || {};
        params._token = getCSRFToken(options);
        params._method = method;

        fields = createFields(params);

        return form.append(fields)
            .appendTo('body');
    }

    function sendAjax(url, method, options) {
        var ajaxOptions = typeof options.ajax === 'object' ? options.ajax : {};
        params = options.params || {};
        params._token = getCSRFToken(options);

        ajaxOptions.url = url;
        ajaxOptions.method = method;
        ajaxOptions.data = params
        return $.ajax(ajaxOptions);
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

    function confirm(options, success) {
        var title = options.title;
        var message = options.confirm;
        var theme = options.theme || 'default';

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
    window.dataMethod = dataMethod;
});
