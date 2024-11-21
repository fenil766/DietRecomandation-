from django.shortcuts import render
# from rest_framework.views import api_view
from .models import *
# from rest_framework.response import Resopnse 
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.core import serializers
import os
import google.generativeai as genai

API_KEY='AIzaSyC72WxoQfypYne1efKopdEcRWh0W-GUm0c'

@csrf_exempt
def login(request):
    if request.method=='POST':
        data = json.loads(request.body)
        email1 = data.get('email')
        passward1 = data.get('password')
        e1= serializers.serialize('json', user.objects.filter(email=email1,password=passward1))
        if e1 is not None:
            return JsonResponse(e1,safe=False)
        else:
            return JsonResponse(e1,safe=False)
    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)


@csrf_exempt
def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        name = data.get('name')
        number = data.get('number')
        passward = data.get('password')
        user.objects.create(name=name,number=number,email=email,password=passward)
        return JsonResponse(data)
    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)

def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})




@csrf_exempt
def chat(request):
    if request.method == "POST":
        try:
            # Log the incoming request body
            print("Request body:", request.body)
            
            try:
                data = json.loads(request.body)
                print("Parsed data:", data)
            except json.JSONDecodeError as json_err:
                print("JSON parsing error:", json_err)
                return JsonResponse({'error': 'Invalid JSON in request body'}, status=400)

            # Ensure all required fields are present
            required_fields = ['height', 'weight', 'age', 'gender', 'goal_weight', 'time','veg_nonveg']
            for field in required_fields:
                if field not in data or not data[field]:
                    return JsonResponse({'error': f'{field} cannot be empty'}, status=400)

            # Prepare user message for AI model
            user_message = json.dumps(data)  # Convert the form data to a JSON string

            # Configure the AI model
            try:
                genai.configure(api_key=API_KEY)
            except Exception as e:
                print("Error in configuring genai:", e)
                return JsonResponse({'error': 'Failed to configure AI model'}, status=500)

            # Define AI model's generation configuration
            generation_config = {
                "temperature": 0,
                "top_p": 0.95,
                "top_k": 64,
                "max_output_tokens": 8192,
                "response_mime_type": "application/json",
            }

            try:
                model = genai.GenerativeModel(
                    model_name="gemini-1.5-flash",
                    generation_config=generation_config,
                    system_instruction=(
                        "You are a doctor, and I will provide data about height, weight, age, gender, goal_weight, time in json format like this."
                        "{'height':'','weight':'','age':'','gender':'','goal_weight':'','time':'','veg_nonveg':''} "
                        "You should suggest a diet plan for a week in json format like this: "
                        "{'monday':[{'breakfast':'','lunch':'','dinner':''}], 'tuesday':[{'breakfast':'','lunch':'','dinner':''}],"
                        "'wednesday':[{'breakfast':'','lunch':'','dinner':''}], 'thursday':[{'breakfast':'','lunch':'','dinner':''}],"
                        "'friday':[{'breakfast':'','lunch':'','dinner':''}], 'saturday':[{'breakfast':'','lunch':'','dinner':''}]}"
                    ),
                )
            except Exception as e:
                print("Error creating AI model:", e)
                return JsonResponse({'error': 'Failed to initialize AI model'}, status=500)

            # Start a chat session with the AI model
            try:
                chat_session = model.start_chat(history=[])
            except Exception as e:
                print("Error starting chat session:", e)
                return JsonResponse({'error': 'Failed to start chat session'}, status=500)

            # Send the message to the AI and get a response
            try:
                print("Sending message to AI:", user_message)
                ai_response = chat_session.send_message(user_message)
                print("AI response (raw):", ai_response.text)
            except Exception as e:
                print("Error sending message to AI model:", e)
                return JsonResponse({'error': 'Failed to communicate with AI model'}, status=500)

            # Parse the AI response
            try:
                response_json = json.loads(ai_response.text)
                print("Parsed AI response:", response_json)
            except json.JSONDecodeError as e:
                print("Error parsing AI response:", e)
                return JsonResponse({'error': 'Invalid JSON from AI model'}, status=500)

            return JsonResponse(response_json, safe=False)
        
        except Exception as e:
            print(f"Unhandled Server Error: {str(e)}")
            return JsonResponse({'error': 'Internal server error', 'details': str(e)}, status=500)

    return JsonResponse({'error': 'Only POST method allowed'}, status=405)


@csrf_exempt  # Disable CSRF for simplicity in development (make sure you handle security properly later)
def buy_product(request):
    if request.method == "POST":
        data = json.loads(request.body)

        # Create a new `buy` instance and save it in the database
        new_purchase = buy(
            buy_name=data.get('name'),
            number=data.get('phone'),
            address=data.get('address'),
            pincode=data.get('pincode'),
            card_no=data.get('card'),
            paid=data.get('total_price')  # Store the total price
        )
        new_purchase.save()

        return JsonResponse({'status': 'success', 'message': 'Purchase successful!'}, status=201)

    return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def chatbox(request):
    if request.method == 'POST':
        try:
            # Parse the incoming data from the request
            data = json.loads(request.body)
            user_message = data.get('msg')

            # Initialize the Gemini AI with the API key
            genai.configure(api_key=API_KEY)

            # Create a chat model
            generation_config = {
                "temperature": 0,
                "top_p": 0.95,
                "top_k": 64,
                "max_output_tokens": 100,
                "response_mime_type": "text/plain",
            }

            model = genai.GenerativeModel(
                model_name="gemini-1.5-pro",
                generation_config=generation_config,
                system_instruction="You are a diet recommendation specialist. Answer based on food, health, and calorie requirements."
            )

            # Start a chat session
            chat_session = model.start_chat(history=[])

            # Send the user's message to the Gemini AI model
            response = chat_session.send_message(user_message)

            # Get AI's response
            ai_message = response.text

            # Return the response to the frontend
            return JsonResponse({'message': ai_message})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)