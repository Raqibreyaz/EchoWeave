import requests
import pyttsx3
import os
from utils import get_hash

API_KEY = "your_murf_api_key"
MURF_ENDPOINT = "https://api.murf.ai/v1/speech/generate"

engine = pyttsx3.init()

def generate_voice(text, voice_id):
    # response = requests.post(MURF_ENDPOINT, json={
    #     "voice": voice_id,
    #     "text": script
    # }, headers={"Authorization": f"Bearer {API_KEY}"})
    
    # voice_url = response.json()['voice_url']
    # voice_file = "uploads/voice.mp3"
    # with open(voice_file, 'wb') as f:
    #     f.write(requests.get(voice_url).content)

    # create a 32 bytes unique hash string for the text+voice_id
    text_hash = get_hash(text+voice_id)

    # create path from the hash
    path = f"uploads/{text_hash}.wav"
    
    # check if we have cached the voice already then provide it's path
    if os.path.isfile(path):
        return path

    # create the audio and save it in the file
    engine.setProperty('rate',110)
    engine.save_to_file(text,path)
    engine.runAndWait()

    return path
