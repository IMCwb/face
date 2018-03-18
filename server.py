from flask import Flask
from flask import request
import socket
app = Flask(__name__)


@app.route('/upload', methods=['POST'])
def image_upload():
    if request.method == 'POST':
        iamge = format(request.form['image'])
        face_recognition(iamge)
    return 'Hello World!'

# 格式化图片
def format(raw_image):
    '''TODO'''
    return 'image'

HOST = ''
PORT = 12345
BUFSIZ = 1024
ADDR = (HOST, PORT)

# 进行运算
def face_recognition(image):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.bind(ADDR)
    sock.listen(5)
    while True:
        print('waiting for connection')
        tcpClientSock, addr = sock.accept()
        print('connect from ', addr)
        while True:
            try:
                data = tcpClientSock.recv(BUFSIZ)
            except:
                tcpClientSock.close()
                break
            if not data:
                break
            tcpClientSock.send(image.encode('base64'))
    tcpClientSock.close()
    sock.close()

if __name__ == '__main__':
    app.run()
