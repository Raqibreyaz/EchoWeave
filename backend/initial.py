# this file was intentioned to not use any backend framework, but due to time constraints writing main logic matters more


import pyttsx3
from http.server import BaseHTTPRequestHandler,HTTPServer
import json
import io
import os

engine = pyttsx3.init()
frontend_url = "http://127.0.0.1:3000"

class TextToSpeechHandler(BaseHTTPRequestHandler):

    def _set_headers(self, status_code=200, content_type="application/json", extra_headers=None):
        self.send_response(status_code)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", frontend_url)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        if extra_headers:
            for key, value in extra_headers.items():
                self.send_header(key, value)
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers()

    # def do_GET(self):
    #     self._set_headers(200,"text/plain")
    #     self.wfile.write("Welcome To Server!")


    # handling post request
    def do_POST(self):

        content_type = self.headers.get('Content-Type')
        if 'multipart/form-data' not in content_type:
            self.send_error(400,"Expected multipart/form-data")
            return;

        content_length = int(self.headers['Content-Length'])
        body = self.rfile.read(content_length)
        
        try:
            # get the textual data from request body
            data = json.loads(body)
            text = data.get("text",'')

            # when no text received from client then invalid request
            if not text:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b'Missing "text" in request body')
                return
            
            # creating the audio file
            output_file = "output.wav"
            engine.setProperty('rate',110)
            engine.save_to_file(text,output_file)
            engine.runAndWait()

            # sending status code and content-type
            self._set_headers(200,"audio/wav")
            
            # finally sending raw data
            with open(output_file,'rb') as f:
                self.wfile.write(f.read())

            # remove the file after sending to client
            os.remove(output_file)
    
        # handle server side error
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(f"Error: {str(e)}".encode())


def run(server_class = HTTPServer , handler_class=TextToSpeechHandler,port = 8080):
    server_address = ('',port)
    httpd = server_class(server_address,handler_class)
    print(f"server is running on http://localhost:{port}")
    httpd.serve_forever()

if __name__ == "__main__":
    run()
