class DisableClientCacheMiddleware:
    """
    Empêche la mise en cache intempestive des endpoints API (/api/) par les navigateurs
    afin de garantir que les données restent toujours fraîches et synchronisées.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.path.startswith('/api/'):
            response['Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0'
            response['Pragma'] = 'no-cache'
            response['Expires'] = '0'
        return response
