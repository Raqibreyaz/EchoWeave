import os
from moviepy import VideoFileClip,AudioFileClip

def merge_audio_video(video_path:str, audio_path:str):
    video = VideoFileClip(video_path)
    audio = AudioFileClip(audio_path)

    final = video.with_audio(audio)
    output_path = "static/final_videos/final_output.mp4"
    final.write_videofile(output_path, codec="libx264", audio_codec="aac")

    return output_path
