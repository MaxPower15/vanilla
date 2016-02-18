// This file contains javascript that is specific to the dashboard/entry controller.
jQuery(document).ready(function($) {
    $(window).keydown(function(event){
        if(event.keyCode == 13 && gdn.definition('ForceCreateConnectName', false)) {
            event.preventDefault();
            checkConnectName();
            return false;
        }
    });

    // Check to see if the selected email is valid
    $('#Register input[name$=Email], body.register input[name$=Email]').blur(function() {
        var email = $(this).val();
        if (email != '') {
            var checkUrl = gdn.url('/dashboard/user/emailavailable');
            $.ajax({
                type: "GET",
                url: checkUrl,
                data: {email: email},
                dataType: 'text',
                error: function(xhr) {
                    gdn.informError(xhr, true);
                },
                success: function(text) {
                    if (text == 'FALSE')
                        $('#EmailUnavailable').show();
                    else
                        $('#EmailUnavailable').hide();
                }
            });
        }
    });

    // Check to see if the selected username is valid
    $('#Register input[name$=Name], body.register input[name$=Name]').blur(function() {
        var name = $(this).val();
        if (name != '') {
            var checkUrl = gdn.url('/dashboard/user/usernameavailable/' + encodeURIComponent(name));
            $.ajax({
                type: "GET",
                url: checkUrl,
                dataType: 'text',
                error: function(xhr) {
                    gdn.informError(xhr, true);
                },
                success: function(text) {
                    if (text == 'FALSE')
                        $('#NameUnavailable').show();
                    else
                        $('#NameUnavailable').hide();
                }
            });
        }
    });

    var checkConnectName = function() {
        if (gdn.definition('NoConnectName', false)) {
            $('#ConnectPassword').show();
            return;
        }

        var selectedName = $('input[name$=UserSelect]:checked').val();
        if (!selectedName || selectedName == 'other') {
            var name = $('#Form_ConnectName').val();
            if (typeof(name) == 'string' && name != '') {
                var checkUrl = gdn.url('/dashboard/user/usernameavailable/' + encodeURIComponent(name));
                $.ajax({
                    type: "GET",
                    url: checkUrl,
                    dataType: 'text',
                    error: function(xhr) {
                        gdn.informError(xhr, true)
                    },
                    success: function(text) {
                        if (text == 'TRUE') {
                            $('#ConnectPassword').hide();
                        } else {
                            // If the username is not available, and the client does not want users to take over existing accounts, generate an error message and empty the input field.
                            if(gdn.definition('NoConnectName', true) && gdn.definition('ForceCreateConnectName', false)) {
                                // if there is already an error message on the page, overwrite it with this error message, else inject an error message.
                                displayErrorMessage($('#Form_ConnectName').val());
                                $('#Form_ConnectName').val("");
                            } else {
                                $('#ConnectPassword').show();
                            }
                        }
                    }
                });
            } else {
                $('#ConnectPassword').hide();
            }
        } else {
            $('#ConnectPassword').show();
        }
    }

    var displayErrorMessage = function(name) {
        var msg = gdn.getMeta('duplicateUsernameError', 'The name %n is not available please choose another name.');
        msg = msg.replace(/%n/g, name);

        if($(".Messages.Errors").length) {
            $(".Messages.Errors").html("<ul><li>" + msg + "</li></ul>");
        } else {
            $('#Form_ConnectName').closest('form').prepend("<div class='Messages Errors'><ul><li>" + msg + "</li></ul></div>");
        }
    }

    checkConnectName();
    $('#Form_ConnectName').blur(checkConnectName);
    $('input[name$=UserSelect]').click(checkConnectName);

    // Check to see if passwords match
    $('input[name$=PasswordMatch]').blur(function() {
        var $pwmatch = $(this);
        var $pw = $pwmatch.closest('form').find('input[name=Password]');

        if ($pw.val() == $pwmatch.val())
            $('#PasswordsDontMatch').hide();
        else
            $('#PasswordsDontMatch').show();
    });

    $('#Form_ConnectName').focus(function() {
        $('input[value=other]').attr('checked', 'checked');
    });
});
