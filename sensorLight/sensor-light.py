import socket
import chat_pb2 as ChatProto
import random
import time


# Protocol buffers methods
def createMessage(type, object, value):
    messageData = ChatProto.IOTRequest()
    messageData.type = type
    messageData.object = object
    messageData.value = value
    buffer = messageData.SerializeToString()

    return buffer


def getObjectFromData(data):
    message = ChatProto.IOTRequest()
    message.ParseFromString(data)

    return message


port = 60000
broadcastAddr = ("255.255.255.255", port)
bufferSize = 1024

# SOCKET UDP - Broadcast
broadcastSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
broadcastSocket.setsockopt(
    socket.SOL_SOCKET, socket.SO_BROADCAST, 1
)

# Enable broadcasting mode
broadcastSocket.bind(("127.0.0.1", 60200))
addressSensor = f"127.0.0.1:60200"

# Send to server using created UDP socket
message = createMessage(type="connection", object="LIGHT", value=addressSensor)
broadcastSocket.sendto(message, broadcastAddr)

print("broadcast")

# Get ip and port of gateway
data, message = broadcastSocket.recvfrom(bufferSize)
identifier = getObjectFromData(data)

address = identifier.value.split(":")
ipCommunication = address[0]
portCommunication = int(address[1])
print(f"{ipCommunication} {portCommunication}")

lamp_status = "OFF"
while True:
    # Recebe mensagens do Gateway
    data, _ = broadcastSocket.recvfrom(bufferSize)
    received_message = getObjectFromData(data)
    # Verifica se a mensagem é um comando para ligar a lâmpada
    message = ""
    if received_message.type == "command":
        if (received_message.value == "ON"):
            lamp_status = "ON"
        if (received_message.value == "OFF"):
            lamp_status = "OFF"
        message = createMessage(
            type="update_value", object="LIGHT", value=lamp_status
        )
    elif received_message.type == "request":
        message = createMessage(
            type="update_value", object="LIGHT", value=lamp_status
        )
    # Envia o estado atual da lâmpada para o Gateway
    
    broadcastSocket.sendto(message, (ipCommunication, portCommunication))