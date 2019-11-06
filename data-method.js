/* global $, Swal */
$(function() {
    var modalTemplate = [
        '<div class="modal fade laravel-data-method" tabindex="-1" role="dialog" aria-labelledby="dataMethodModalLabel">',
        '<div class="modal-dialog modal-sm" role="document">',
        '<div class="modal-content">',
        '<div class="modal-header">',
        '<h6 class="modal-title" id="dataMethodModalLabel"></h6>',
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
        '</div>',
        '<div class="modal-body"></div>',
        '<div class="modal-footer">',
        '<button type="button" class="btn btn-default btn-cancel" data-dismiss="modal">{{cancel}}</button>',
        '<button type="button" class="btn btn-primary btn-confirm">{{ok}}</button>',
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
        var params = options.params || {};
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

    function confirm(options, success, cancel) {
        var title = options.title;
        var message = options.confirm;
        var theme = options.theme || 'default';
        var okText = options.ok || 'Ok';
        var cancelText = options.cancel || 'Cancel';

        if (!cancel) {
            cancel = function() {}
        }

        switch (theme) {
            case 'default':
                window.confirm(message) ? success() : cancel();
                break;
            case 'bootstrap':
                var template = modalTemplate.replace('{{ok}}', okText)
                                            .replace('{{cancel}}', cancelText)
                var $modal = $(template);
                $modal.find('.modal-title').html(title);
                $modal.find('.modal-body').html(message);
                $modal.appendTo('body');
                $modal.modal('show');

                $modal.find('.btn-confirm').on('click', function() {
                    $modal.modal('hide');
                    success();
                });

                $modal.find('[data-dismiss="modal"]').on('click', function() {
                    cancel();
                });

                $modal.on('hidden.bs.modal', function() {
                    $modal.remove();
                });

                break;
            case 'sweetalert':
                Swal.fire({
                    title: title,
                    text: message,
                    showCancelButton: true,
                    cancelButtonText: cancelText,
                    confirmButtonText: okText,
                    customClass: 'laravel-data-method'
                }).then(function(result) {
                  if (result.value) {
                    success();
                  }  else if (result.dismiss === Swal.DismissReason.cancel) {
                    cancel();
                  }
                });
                break;
        }
    }

    // Disable button on submission form
    function disabledButton($btn) {
        $btn.prop('disabled', 'disabled');
    }

    $('form').submit(function(e) {
        var form = this;
        e.preventDefault();

        var $submitbutton = $(this).find('[data-disabled-submit]');
        var confirmMessage = $submitbutton.data('confirm');

        if (confirmMessage) {
            confirm($submitbutton.data(), function() {
                disabledButton($submitbutton);
                form.submit();
            });

            return false;
        } else {
            disabledButton($submitbutton);
        }

        form.submit();
    });

    $(document).on('click', 'a[data-method]', handleMethod);
    window.dataMethod = dataMethod;
});
