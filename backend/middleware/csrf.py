from django.middleware.csrf import CsrfViewMiddleware, get_token


# see django.views.decorator.csrf._EnsureCsrfCookie
class EnsureCsrfViewMiddleware(CsrfViewMiddleware):
    '''
    Ensures that every view will be injected with a CSRF token.
    '''
    def _reject(self, request, reason):
        return None

    def process_view(self, request, callback, callback_args, callback_kwargs):
        retval = super().process_view(request, callback, callback_args, callback_kwargs)
        get_token(request)
        return retval
