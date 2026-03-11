from flask import jsonify, make_response

def response_handler(data=None, error=None, status_code=200, message=None):
    """
    Standard response handler for Flask
    """
    response = {
        'status': status_code
    }
    
    if error:
        response['error'] = error
        response['data'] = {}
        status_code = 400 if status_code == 200 else status_code
    else:
        response['data'] = data if data is not None else {}
    
    if message:
        response['message'] = message
    
    # Return jsonify response
    return jsonify(response), status_code