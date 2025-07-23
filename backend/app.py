from flask import Flask, request, send_file, after_this_request
from murf_api import generate_voice
from video_merge import merge_audio_video
import os
# from flask_cors import CORS


# creating a flask applicaton
app = Flask(__name__)

# handling cors
# CORS(app)

UPLOAD_FOLDER = "uploads/"
OUTPUT_FOLDER = "static/final_videos/"

# create the dirs when not exist
os.makedirs(UPLOAD_FOLDER,exist_ok=True)
os.makedirs(OUTPUT_FOLDER,exist_ok=True)

@app.route('/')
def home():
    return "Welcome to Server!"

@app.route('/upload', methods=['POST'])
def upload():

    try:
        # taking video, text for audio, and voice_id from request
        video = request.files['video']
        text = request.form['text']
        voice_id = request.form.get('voice_id','default_id')

        # save the video to the upload folder
        video_path = os.path.join(UPLOAD_FOLDER, video.filename)
        video.save(video_path)

        # generate audio from the 
        audio_path = generate_voice(text, voice_id)

        # merge the generated audio with the received video
        output_path = merge_audio_video(video_path, audio_path)

        # this will delete the created files after sending the response 
        @after_this_request
        def remove_file(response):
            try:
                # os.remove(output_path)
                os.remove(video_path)
            except Exception as e:
                app.log_exception(f"Error deleting file: {e}")
            return response

        # sending the final file to client
        return send_file(output_path, as_attachment=True)
    except Exception as e:
        error = f"Error: {str(e)}".encode()
        print(error)
        return error

if __name__ == "__main__":
    app.run(host='0.0.0.0',debug=True)
