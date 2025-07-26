import os

from flask_cors import CORS
from flask import Flask, request, send_file, after_this_request

import constants
from video_merge import merge_audio_video
from murf_api import generate_voice,get_voices

# creating a flask applicaton
app = Flask(__name__)

# handling cors
CORS(app,origins=os.getenv("FRONTEND_URL"))


# create the dirs when not exist
os.makedirs(constants.UPLOAD_FOLDER,exist_ok=True)
os.makedirs(constants.OUTPUT_FOLDER,exist_ok=True)

@app.route('/')
def home():
    return "Welcome to Server!"

# returns the voices list to client 
@app.route('/voices')
def voices():
    voices = get_voices()

    # extracts required fields from voices
    new_voices = [
        {
            "voice_id": voice["voiceId"],
            "display_name": voice["displayName"],
            "gender": voice["gender"],
            "accent": voice["accent"],
            "available_styles": voice["availableStyles"]
        }
        for voice in voices
    ]
    return new_voices

# returns the video file to client
@app.route('/upload', methods=['POST'])
def upload_():

    try:
        # taking video, text for audio, and voice_id from request
        video = request.files['video']
        text = request.form['text']
        voice_id = request.form.get['voice_id']
        voice_style = request.form['voice_style']

        # save the video to the upload folder
        video_path = os.path.join(UPLOAD_FOLDER, video.filename)
        video.save(video_path)

        # generate audio from the text using the chosen voice and style
        audio_path = generate_voice(text, voice_id,voice_style)

        # merge the generated audio with the received video
        output_path = merge_audio_video(video_path, audio_path)

        # this will delete the created files after sending the response
        # except generated audio
        @after_this_request
        def remove_file(response):
            try:
                os.remove(output_path)
                os.remove(video_path)
            except Exception as e:
                app.log_exception(f"Error deleting file: {e}")
            return response

        # sending the final file to client
        return send_file(output_path, as_attachment=True,mimetype='video/mp4')
    except Exception as e:
        error = f"Error: {str(e)}".encode()
        print(error)
        return error


if __name__ == "__main__":
    app.run(host='0.0.0.0',debug=True)
