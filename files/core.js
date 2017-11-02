
var Autotorq = window.Autotorq || {};

Autotorq.Core = (function () {
    'use strict';

    // PUBLIC
    return {
        onReady: function (callback) {
            var doc = document;
            if (doc.addEventListener) {
                doc.addEventListener('DOMContentLoaded', callback);
            }
            else if (doc.attachEvent) {
                window.attachEvent('onload', callback);
            }
        }
    }

})();


















/*******************************************************************************************************************************/
/* HTML5 FORM VALIDATION POLYFILL */
/*******************************************************************************************************************************/

(function ($) {
    /* 
        * ACHTUNG!!!!!!!!
        * in order to get older browsers to recognise the new HTML5 input types, you will need to add a data-type attribute - eg. <input type="email" data-type="email" />
    */

    $.fn.Html5FormPolyfill = function (options) {
        var $form = $(this);

        var settings = $.extend({
            displayErrorSummary: false,
            displayErrorMessages: true
        }, options);

        setAutoFocus($form);
        setPlaceholder($form);
        setTextAreaMaxLength($form);

        if (!supportsHtml5FormValidation()) {
            convertInputTypeToText($form);
            $form.attr('novalidate', 'novalidate');
            $form.on('submit', validateForm);
        };

        function supportsHtml5FormValidation() {

            if (!supportsAttribute('required')) return false;
            if (!supportsAttribute('pattern')) return false;
            if (!supportsInputType('email')) return false;
            if (!supportsInputType('number')) return false;
            if (!supportsInputType('tel')) return false;

            var userAgent = navigator.userAgent;
            var isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1;
            if (isSafari) return false; // do not allow HTML5 validation for Safari because it does not display error messages

            return false;
        }

        function supportsAttribute(attribute) {
            return attribute in document.createElement('input');
        }

        function convertInputTypeToText($form) {

            // NUMBER: number input tags return nothing if invalid, so need to be converted or there would be no way to distinguish between required and format errors
            $form.find('input[type="number"], input[data-type="number"]').each(function () {
                var $field = $(this);
                if (!$field.is('[pattern]')) {
                    var pattern = '\\d*';
                    var title = $field.attr('title') || "You must enter a valid whole number.";
                    $field.attr('type', 'text').attr('pattern', pattern).attr('title', title);
                }
            });

            $form.find('input[type="tel"], input[data-type="tel"]').each(function () {
                var $field = $(this);
                if (!$field.is('[pattern]')) {
                    var pattern = '[\\d ()+-]{7,}';
                    var title = $field.attr('title') || "You must enter a valid telephone number.";
                    $field.attr('type', 'text').attr('pattern', pattern).attr('title', title);
                }
            });
        }

        function supportsInputType(inputType) {
            var i = document.createElement('input');
            i.setAttribute('type', inputType);
            return i.type !== 'text';
        }

        function validateForm() {

            var $form = $(this);

            removeErrorMessages($form);

            var errors = [];
            errors = validateRequiredFields($form, errors);
            errors = validateFormat($form, errors);

            if (errors.length > 0) {

                displayErrorSummary($form, errors);

                return false;
            }
        }

        function removeErrorMessages($form) {
            $form.find('.validation-summary-errors').remove();
            $form.find('span.error').remove();
            $form.find('.validation-error').removeClass('validation-error')
        }

        function displayErrorSummary($form, errors) {
            if (settings.displayErrorSummary === true) {
                var errorList = '';
                for (var i = 0, len = errors.length; i < len; i++) {
                    errorList += '<li>' + errors[i] + '</li>';
                }
                $form.prepend('<div class="validation-summary-errors"><ul>' + errorList + '</ul></div>');
            }
        }

        function setAutoFocus($form) {
            if (!supportsAttribute('autofocus')) {
                var $focus = $form.find('[autofocus]').first();
                if ($focus.length > 0) {
                    $focus.focus();
                }
            }
        }

        function setPlaceholder($form) {
            if (!supportsAttribute('placeholder')) {
                $form.find('[placeholder]').each(function () {
                    var placeholderText = $(this).attr('placeholder');
                    $(this).val(placeholderText);

                    $(this).on('focus', function () {
                        var $field = $(this);
                        var placeholderText = $field.attr('placeholder');
                        if ($field.val() === placeholderText) {
                            $field.val('');
                        }
                    });

                    $(this).on('blur', function () {
                        var $field = $(this);
                        var placeholderText = $field.attr('placeholder');
                        if ($field.val() === '') {
                            $field.val(placeholderText);
                        }
                    });
                });
            }
        }

        function validateRequiredFields($form, errors) {

            $form.find('[required]').each(function () {
                var value = $.trim($(this).val());
                var placeholder = $(this).attr('placeholder');
                if (value === '' || (placeholder && value === placeholder)) {
                    var $field = $(this);
                    var fieldId = $field.attr('id');
                    var errorText = $field.attr('title') || '\'' + $form.find('[for="' + fieldId + '"]').text() + '\' is required.';
                    errors.push(errorText);
                    displayErrorMessage($field, errorText);
                }
            });

            return errors;
        }

        function validateFormat($form, errors) {

            $form.find('input[name="email"], input[data-type="email"]').each(function () {
                var $field = $(this);
                if (!$field.is('[pattern]')) {
                    var pattern = "[a-zA-Z\d!#\$%&'\*\+\-/=\?\^_`\{\|}~]+(\.[a-zA-Z\d!#\$%&'\*\+\-/=\?\^_`\{\|}~]+)*@[a-zA-Z\d]+([\.\-][a-zA-Z\d]+)*(\.[a-zA-Z]{2,})";
                    var title = $field.attr('title') || "You must enter a valid email address.";
                    errors = validateRegEx($field, errors, pattern, title);
                }
            });

            $form.find('[pattern]').each(function () {
                var pattern = $(this).attr('pattern');
                var title = $(this).attr('title');
                errors = validateRegEx($(this), errors, pattern, title);
            });

            return errors;
        }

        function validateRegEx($elem, errors, pattern, title) {
            var value = $.trim($elem.val());
            if (pattern && value.length) {
                var regExp = new RegExp('^' + pattern + '$');
                if (!regExp.test(value)) {
                    if (title) {
                        errors.push(title);
                    }
                    displayErrorMessage($elem, title);
                }
            }

            return errors;
        }

        function displayErrorMessage($field, text) {
            $field.parent().addClass('validation-error');
            if (settings.displayErrorMessages === true && $field.parent().find('span.error').length === 0) {
                $field.after('<span class="error">' + text + '</span>');
            }
        }

        function setTextAreaMaxLength($form) {
            var textarea = document.createElement('textarea');
            if (typeof (textarea.maxLength) === 'undefined') {
                $form.find('textarea[maxlength]').on('keydown', setMaxLength);
            }
        }

        function setMaxLength(e) {
            var maxLength = parseInt($(this).attr('maxlength'));
            if ($(this).val().length >= maxLength) {
                var allowedKeyCodes = [8, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46];
                if ($.inArray(e.keyCode, allowedKeyCodes) === -1) {
                    return false;
                }
            }
        }

        return $form;
    };

}(jQuery));






























/*******************************************************************************************************************************/
/* LEGACY CODE */
/*******************************************************************************************************************************/


/*******************************************************************************************************************************/
/* DWS.js */

function DWS() { }

DWS.showEnquireForm = function (url, title, width, height) {
    if (title == null)
        title = "Enquire Form";

    if (width == null)
        width = 600;

    if (height == null)
        height = 500;

    var windowOptions = "width=" + width + ",height=" + height + ",scrollbars=yes,toolbar=no,resizable=no";

    return window.open(url, title, windowOptions, true);
}

DWS.openPopUp = function (url, title, width, height) {
    if (title == null)
        title = "Form";

    if (width == null)
        width = 600;

    if (height == null)
        height = 500;

    title = title.replace(/\/|\-|\./gi, "");
    var whitespace = new RegExp("\\s", "g");
    title = title.replace(whitespace, "");

    var windowOptions = "width=" + width + ",height=" + height + ",scrollbars=yes,toolbar=no,resizable=no";

    window.open(url, title, windowOptions, true);
}


DWS.openPopUpStatusBar = function (url, title, width, height) {
    if (title == null)
        title = "Form";

    if (width == null)
        width = 600;

    if (height == null)
        height = 500;

    title = title.replace(/\/|\-|\./gi, "");
    var whitespace = new RegExp("\\s", "g");
    title = title.replace(whitespace, "");

    var windowOptions = "width=" + width + ",height=" + height + ",scrollbars=yes,toolbar=no,resizable=yes,status=1";

    window.open(url, title, windowOptions, true);
}

DWS.openPDFPopUp = function (url, title, width, height) {
    if (title == null)
        title = "PDF";

    if (width == null)
        width = 600;

    if (height == null)
        height = 500;

    title = title.replace(/\/|\-|\./gi, "");
    var whitespace = new RegExp("\\s", "g");
    title = title.replace(whitespace, "");

    var windowOptions = "width=" + width + ",height=" + height + ",scrollbars=yes,toolbar=no,resizable=yes";

    window.open(url, title, windowOptions, true);
}

DWS.openCustomPopUp = function (url, title, attributes) {
    if (title == null)
        title = "Form";

    if (attributes == null)
        attributes = 'width=600,height=500,scrollbars=yes,toolbar=no,resizable=no';

    title = title.replace(/\/|\-|\./gi, "");
    var whitespace = new RegExp("\\s", "g");
    title = title.replace(whitespace, "");

    window.open(url, title, attributes, true);
}

DWS.printPage = function () {
    if (window.print) window.print();
}

DWS.closePage = function () {
    window.close();
}


DWS.doHover = function (obj) {
    obj.style.backgroundColor = '#999';
}

DWS.undoHover = function (obj) {
    obj.style.backgroundColor = '';
}

DWS.doRoll = function (obj) {
    obj.style.opacity = '1';
    obj.style.filter = 'alpha(opacity=100)';
}

DWS.doUnRoll = function (obj) {
    obj.style.opacity = '0.80';
    obj.style.filter = 'alpha(opacity=80)';
}

function doNothing() { }













/*******************************************************************************************************************************/
/* UTILS.js */

function Delegate() { }
Delegate.prototype.func = null;
Delegate.create = function (obj, func) {
    var f = function () {
        var target = arguments.callee.target;
        var func = arguments.callee.func;

        return func.apply(target, arguments);
    };

    f.target = obj;
    f.func = func;

    return f;
}

function Utils() { }
Utils.getForm = function () {
    if (document.forms.length > 0) {
        return document.forms[0];
    }
    return null;
}

Utils.createSubmitHidden = function (form, controlName, submitValue) {
    //MZ - Remove any existing hidden fields with the same name to make sure correct event handler is called when the form is submitted
    if (document.getElementById(controlName)) {
        var obj = document.getElementById(controlName);
        obj.parentNode.removeChild(obj);
    }

    var hidden = document.createElement("input");

    hidden.type = "hidden";
    hidden.id = controlName;
    hidden.name = controlName;
    hidden.value = submitValue;

    form.appendChild(hidden);
}

Utils.getNode = function (obj, nodeName) {
    var result = null;

    for (var x = 0; x < obj.attributes.length; x++) {
        if (obj.attributes[x].nodeName == nodeName) {
            result = obj.attributes[x].nodeValue;
            break;
        }
    }

    return result;
}

function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) +
    ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString() + "; path=/");
}

// all we want to know is if the cookie exists - not interested in the value
function readCookie(c_name) {
    // first we'll split this cookie up into name/value pairs
    // note: document.cookie only returns name=value, not the other components
    var a_all_cookies = document.cookie.split(';');
    var a_temp_cookie = '';
    var cookie_name = '';
    var cookie_value = '';
    var b_cookie_found = false; // set boolean t/f default f

    for (i = 0; i < a_all_cookies.length; i++) {
        // now we'll split apart each name=value pair
        a_temp_cookie = a_all_cookies[i].split('=');

        // and trim left/right whitespace while we're at it
        cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');

        // if the extracted name matches passed check_name
        if (cookie_name == c_name) {
            b_cookie_found = true;

            // all we want to know
            break;
        }

        a_temp_cookie = null;
        cookie_name = '';
    }

    return b_cookie_found;
}


function resizeIframe(obj) {
    {
        obj.style.height = 0;
    }
    ;
    {
        obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
    }
}

function setIframeHeight(iframe) {
    if (iframe) {
        var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
        if (iframeWin.document.body) {
            iframe.height = 17 + iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
        }
    }
};
