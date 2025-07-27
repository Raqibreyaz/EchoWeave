import requests
import os
import json
from utils import get_hash
from murf import Murf

# a client to connect with the MURF AI
client = Murf(api_key=os.getenv("MURF_API_KEY"))

# generates voice from the provided text with the id,style attributes
def generate_voice(text, voice_id,voice_style,duration):
    
    # create a 32 bytes unique hash string for the text+voice_id+style
    text_hash = get_hash(f"{text}{voice_id}{voice_style}")

    # create path from the hash
    path = f"uploads/{text_hash}.wav"
    
    # check if we have cached the voice already then provide it's path
    if os.path.isfile(path) and os.path.getsize(path):
        print("serving audio from cache")
        return path

    # generate voice from the text
    res = client.text_to_speech.generate(
        text=text,
        voice_id=voice_id,
        format='WAV',
        channel_type="STEREO",
        sample_rate=44100,
        style=voice_style,
        audio_duration=duration
    )

    print("converted text to speech")

    # downloading the audio file
    audio_res = requests.get(res.audio_file)
    with open(path,"wb") as f:
        f.write(audio_res.content)

    print("downloaded audio file...")

    return path

# fetches voices from the murf api
def get_voices():

    path = "static/voices.json"

    # when voices are cached then server the cached response
    if os.path.isfile(path) and os.path.getsize(path) > 0:
        with open(path,"r") as f:
         return json.load(f)

    # otherwise request from murf ai to get all voices
    voices =[voice.dict() for voice in client.text_to_speech.get_voices()]

    # save the fetched voices data in file
    with open(path,"w") as f:
        json.dump(voices,f,indent=2)

    return voices
