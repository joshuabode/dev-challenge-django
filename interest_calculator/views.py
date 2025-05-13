import json

from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt

@require_POST
@csrf_exempt
def interest_data(request):
    data = json.loads(request.body)
    # Set default values
    initial = 0
    monthly = 0
    interest = 0
    # Read request data
    if data['initial'] != None:
        initial = data['initial']
    if data['monthly'] != None:
        monthly = data['monthly']
    if data['interest'] != None:
        interest = data['interest']
    # Compute interest data
    y_axis = [initial]
    current = initial
    monthly_interest = interest/100/12
    for i in range(12*51):
        if monthly_interest != 0:
            current = (monthly)*((1 + monthly_interest)**i - 1)/monthly_interest + initial*(1+monthly_interest)**i
        else:
            current += monthly
        if i % 12 == 11:
            y_axis.append(current)
    result = {'xAxis': [i for i in range(51)], 'yAxis': y_axis}
    return JsonResponse(result)